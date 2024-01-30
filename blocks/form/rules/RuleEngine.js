/* eslint-disable max-classes-per-file */
import Formula from './parser/Formula.js';
import transformRule from './RuleCompiler.js';
import formatFns from '../formatting.js';

function stripTags(input, allowd) {
  const allowed = ((`${allowd || ''}`)
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const comments = /<!--[\s\S]*?-->/gi;
  return input.replace(comments, '')
    .replace(tags, ($0, $1) => (allowed.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : ''));
}

export function sanitizeHTML(input) {
  return stripTags(input, '<a>');
}

function coerceValue(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}

const isFieldset = (e) => e.tagName === 'FIELDSET';

const isRepeatableFieldset = (e) => isFieldset(e) && e.getAttribute('data-repeatable') === 'true';

const isDataElement = (element) => element.tagName !== 'BUTTON' && !isFieldset(element) && element.name;

function getValue(fe) {
  if (fe.type === 'checkbox' || fe.type === 'radio') {
    if (fe.checked) return coerceValue(fe.value);
  } else if (fe.tagName === 'OUTPUT') {
    return fe.dataset.value;
  } else if (fe.name) {
    return coerceValue(fe.value);
  }
  return undefined;
}

function constructData(elements) {
  const payload = {};
  elements.filter(isDataElement)
    .forEach((fe) => {
      payload[fe.name] = getValue(fe);
    });
  return payload;
}

function getFieldsetPayload(form, fieldsetName) {
  let fieldsets = form.elements[fieldsetName];
  if (!(fieldsets instanceof RadioNodeList)) {
    fieldsets = [fieldsets];
  }
  const payload = {};
  fieldsets.forEach((fe, i) => {
    [...fe.elements].filter(isDataElement).forEach((e) => {
      payload[e.name] = payload[e.name] || [];
      payload[e.name][i] = getValue(e);
    });
  });
  return payload;
}

function constructPayload(form) {
  const elements = [...form.elements];
  const payload = constructData(elements);
  const fieldsetNames = [...elements.filter(isRepeatableFieldset)
    .reduce((names, x) => {
      names.add(x.name);
      return names;
    }, new Set())];
  return fieldsetNames.reduce((currPayload, x) => {
    const fieldsetPayload = getFieldsetPayload(form, x);
    return {
      ...currPayload,
      ...fieldsetPayload,
    };
  }, payload);
}

export default class RuleEngine {
  rulesOrder = {};

  constructor(formRules, fieldIdMap, formTag) {
    this.formTag = formTag;
    this.data = constructPayload(formTag);
    this.formula = new Formula();
    const newRules = formRules.map(([fieldId, fieldRules]) => [
      fieldId,
      fieldRules.map((rule) => transformRule(rule, fieldIdMap, this.formula)),
    ]);

    this.formRules = Object.fromEntries(newRules);
    this.dependencyTree = newRules.reduce((fields, [fieldId, rules]) => {
      fields[fieldId] = fields[fieldId] || { deps: {} };
      rules.forEach(({ prop, deps }) => {
        deps.forEach((dep) => {
          fields[dep] = fields[dep] || { deps: {} };
          fields[dep].deps[prop] = fields[dep].deps[prop] || [];
          fields[dep].deps[prop].push(fieldId);
        });
      });
      return fields;
    }, {});
  }

  listRules(fieldId) {
    const arr = {};
    let index = 0;
    const stack = [fieldId];
    do {
      const el = stack.pop();
      arr[el] = index;
      index += 1;
      if (this.dependencyTree[el]?.deps.Value) {
        stack.push(...this.dependencyTree[el].deps.Value);
      }
      // eslint-disable-next-line no-loop-func
      this.dependencyTree[el]?.deps.Hidden?.forEach((field) => {
        arr[field] = index;
        index += 1;
      });
      // eslint-disable-next-line no-loop-func
      this.dependencyTree[el]?.deps.Label?.forEach((field) => {
        arr[field] = index;
        index += 1;
      });
      // @todo add label deps as well.
    } while (stack.length > 0);
    return Object.entries(arr).sort((a, b) => a[1] - b[1]).map((_) => _[0]).slice(1);
  }

  updateValue(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (!(element instanceof NodeList)) {
      this.data[element.name] = coerceValue(value);
      const { displayFormat } = element.dataset;
      if (element.tagName === 'OUTPUT') {
        const formatFn = formatFns[displayFormat] || ((x) => x);
        element.value = formatFn(value);
        element.dataset.value = value;
      } else {
        element.value = value;
      }
      if (element.type === 'range') {
        element.dispatchEvent(new CustomEvent('input', { bubbles: false }));
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  updateHidden(fieldId, value) {
    const element = document.getElementById(fieldId);
    let wrapper = element;
    if (!isFieldset(element)) {
      wrapper = element.closest('.field-wrapper');
    }
    wrapper.dataset.hidden = value;
  }

  // eslint-disable-next-line class-methods-use-this
  updateLabel(fieldId, value) {
    const element = document.getElementById(fieldId);
    const label = element.closest('.field-wrapper').querySelector('.field-label');
    label.innerHTML = sanitizeHTML(value);
  }

  setData(field) {
    const fieldName = field.name;
    if (field.type === 'checkbox') {
      this.data[fieldName] = field.checked ? coerceValue(field.value) : undefined;
    } else {
      this.data[fieldName] = coerceValue(field.value);
    }
  }

  applyRules(rules) {
    rules.forEach((fId) => {
      this.formRules[fId]?.forEach((rule) => {
        const newValue = this.formula.evaluate(rule.ast, this.data);
        const handler = this[`update${rule.prop}`];
        if (handler instanceof Function) {
          handler.apply(this, [fId, newValue]);
        }
      });
    });
  }

  getRules(id) {
    if (!this.rulesOrder[id]) {
      this.rulesOrder[id] = this.listRules(id);
    }
    return this.rulesOrder[id];
  }

  enable() {
    this.formTag.addEventListener('input', (e) => {
      const field = e.target;
      const valid = e.target.checkValidity();
      if (valid) {
        let fieldId = field.id;
        let rules = [];
        const fieldset = field.closest('fieldset');
        if (fieldset && fieldset.getAttribute('data-repeatable') === 'true') {
          this.data = {
            ...this.data,
            ...getFieldsetPayload(this.formTag, fieldset.name),
          };
          fieldId = field.name;
        } else {
          this.setData(field);
        }
        if (field.type === 'radio') {
          const radios = this.formTag.elements[field.name];
          if (radios instanceof RadioNodeList) {
            rules = [...radios].flatMap((f) => this.getRules(f.id));
          }
        } else {
          rules = this.getRules(fieldId);
        }
        this.applyRules(rules);
      }
    });

    this.formTag.addEventListener('item:add', (e) => {
      const fieldsetName = e.detail.item.name;
      let fieldset = this.formTag.elements[fieldsetName];
      if (fieldset instanceof RadioNodeList) {
        fieldset = fieldset.item(0);
      }
      this.data = {
        ...this.data,
        ...getFieldsetPayload(this.formTag, fieldsetName),
      };
      const rules = [...fieldset.elements].map((fd) => this.getRules(fd.name)).flat();
      this.applyRules(rules);
    });

    this.formTag.addEventListener('item:remove', (e) => {
      const fieldsetName = e.detail.item.name;
      let fieldset = this.formTag.elements[fieldsetName];
      if (fieldset instanceof RadioNodeList) {
        fieldset = fieldset.item(0);
      }
      this.data = {
        ...this.data,
        ...getFieldsetPayload(this.formTag, fieldsetName),
      };
      const rules = [...fieldset.elements].map((fd) => this.getRules(fd.name)).flat();
      this.applyRules(rules);
    });
  }
}
