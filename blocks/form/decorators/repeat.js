const getId = (function getId() {
  const ids = {};
  return (name) => {
    ids[name] = ids[name] || 0;
    const idSuffix = ids[name] ? `-${ids[name]}` : '';
    ids[name] += 1;
    return `${name}${idSuffix}`;
  };
}());

function update(fieldset, index, labelTemplate) {
  const legend = fieldset.querySelector(':scope>.field-label').firstChild;
  const text = labelTemplate.replace('#', index + 1);
  legend.textContent = text;
  fieldset.id = getId(fieldset.name);
  fieldset.setAttribute('data-index', index);
  if (index > 0) {
    fieldset.querySelectorAll('.field-wrapper').forEach((f) => {
      const [label, input, description] = ['label', 'input,select,button,textarea', 'description']
        .map((x) => f.querySelector(x));
      input.id = getId(input.name);
      if (label) {
        label.htmlFor = input.id;
      }
      if (description) {
        input.setAttribute('aria-describedby', `${input.Id}-description`);
        description.id = `${input.id}-description`;
      }
    });
  }
}

function createButton(label, icon) {
  const button = document.createElement('button');
  button.className = `item-${icon}`;
  button.type = 'button';
  const text = document.createElement('span');
  text.textContent = label;
  button.append(document.createElement('i'), text);
  return button;
}

function insertRemoveButton(fieldset, wrapper, form) {
  const removeButton = createButton('Remove', 'remove');
  removeButton.addEventListener('click', () => {
    fieldset.remove();
    wrapper.querySelector('.item-add').setAttribute('data-hidden', 'false');
    wrapper.querySelectorAll('[data-repeatable="true"]').forEach((el, index) => {
      update(el, index, wrapper['#repeat-template-label']);
    });
    const event = new CustomEvent('item:remove', {
      detail: { item: { name: fieldset.name, id: fieldset.id } },
      bubbles: false,
    });
    form.dispatchEvent(event);
  });
  const legend = fieldset.querySelector(':scope>.field-label');
  legend.append(removeButton);
}

const add = (wrapper, form) => (e) => {
  const { currentTarget } = e;
  const { parentElement } = currentTarget;
  const fieldset = parentElement['#repeat-template'];
  const max = parentElement.getAttribute('data-max');
  const min = parentElement.getAttribute('data-min');
  const childCount = parentElement.children.length - 1;
  const newFieldset = fieldset.cloneNode(true);
  newFieldset.setAttribute('data-index', childCount);
  update(newFieldset, childCount, parentElement['#repeat-template-label']);
  if (childCount >= +min) {
    insertRemoveButton(newFieldset, wrapper, form);
  }
  if (+max <= childCount + 1) {
    e.currentTarget.setAttribute('data-hidden', 'true');
  }
  currentTarget.insertAdjacentElement('beforebegin', newFieldset);
  const event = new CustomEvent('item:add', {
    detail: { item: { name: newFieldset.name, id: newFieldset.id } },
    bubbles: false,
  });
  form.dispatchEvent(event);
};

export default function transferRepeatableDOM(formDef, form) {
  form.querySelectorAll('[data-repeatable="true"]').forEach((el) => {
    const div = document.createElement('div');
    div.setAttribute('data-min', el.dataset.min);
    div.setAttribute('data-max', el.dataset.max);
    el.insertAdjacentElement('beforebegin', div);
    div.append(el);
    const addLabel = 'Add';
    const addButton = createButton(addLabel, 'add');
    addButton.addEventListener('click', add(div, form));
    div['#repeat-template'] = el.cloneNode(true);
    div['#repeat-template-label'] = el.querySelector(':scope>.field-label').textContent;
    if (+el.min === 0) {
      el.remove();
    } else {
      update(el, 0, div['#repeat-template-label']);
      el.setAttribute('data-index', 0);
    }
    div.append(addButton);
    div.className = 'form-repeat-wrapper';
  });
}
