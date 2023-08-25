/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { sampleRUM } = window.hlx.rum;

/**
* Registers the 'convert' function to `sampleRUM` which sends
* variant and convert events upon conversion.
* The function will register a listener for an element if listenTo parameter is provided.
* listenTo supports 'submit' and 'click'.
* If listenTo is not provided, the information is used to track a conversion event.
*/
sampleRUM.drain('convert', (cevent, cvalueThunk, element, listenTo = []) => {
  async function trackConversion(celement) {
    const MAX_SESSION_LENGTH = 1000 * 60 * 60 * 24 * 30; // 30 days
    try {
      // get all stored experiments from local storage (unified-decisioning-experiments)
      const experiments = JSON.parse(localStorage.getItem('unified-decisioning-experiments'));
      if (experiments) {
        Object.entries(experiments)
          .map(([experiment, { treatment, date }]) => ({ experiment, treatment, date }))
          .filter(({ date }) => Date.now() - new Date(date) < MAX_SESSION_LENGTH)
          .forEach(({ experiment, treatment }) => {
            // send conversion event for each experiment that has been seen by this visitor
            sampleRUM('variant', { source: experiment, target: treatment });
          });
      }
      // send conversion event
      const cvalue = typeof cvalueThunk === 'function' ? await cvalueThunk(element) : cvalueThunk;

      const data = { source: cevent, target: cvalue, element: celement };
      sampleRUM('convert', data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error reading experiments', e);
    }
  }

  function registerConversionListener(elements) {
    // if elements is an array or nodelist, register a conversion event for each element
    if (Array.isArray(elements) || elements instanceof NodeList) {
      elements.forEach((e) => registerConversionListener(e, listenTo, cevent, cvalueThunk));
    } else {
      // add data attribute to elements tracked in preview
      if (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.hlx.page')) {
        element.dataset.conversionTracking = true;
      }
      listenTo.forEach((eventName) => element.addEventListener(
        eventName,
        (e) => trackConversion(e.target),
      ));
    }
  }

  if (element && listenTo.length) {
    registerConversionListener(element, listenTo, cevent, cvalueThunk);
  } else {
    trackConversion(element, cevent, cvalueThunk);
  }
});

/**
 * Returns the label used for tracking link clicks
 * @param {Element} element link element
 * @returns link label used for tracking converstion
 */
function getLinkLabel(element) {
  return element.title ? this.toClassName(element.title) : this.toClassName(element.textContent);
}

function getConversionNameMetadata(element) {
  const text = element.title || element.textContent;
  return this.getMetadata(`conversion-name--${text.toLowerCase().replace(/[^0-9a-z]/gi, '-')}-`);
}

function findConversionValue(parent, fieldName) {
  // Try to find the element by Id or Name
  const valueElement = document.getElementById(fieldName) || parent.querySelector(`[name='${fieldName}']`);
  if (valueElement) {
    return valueElement.value;
  }
  // Find the element by the inner text of the label
  return Array.from(parent.getElementsByTagName('label'))
    .filter((l) => l.innerText.trim().toLowerCase() === fieldName.toLowerCase())
    .map((label) => document.getElementById(label.htmlFor))
    .filter((field) => !!field)
    .map((field) => field.value)
    .pop();
}

/**
 * Registers conversion listeners according to the metadata configured in the document.
 * @param {Element} parent element where to find potential event conversion sources
 * @param {string} defaultFormConversionName In case of form conversions, default
 * name for the conversion in case there is no conversion name defined
 * in the document or section metadata. If the form is defined in a fragment
 * this is typically the path to the fragment.
 * The parameter is optional, if no value is passed, and conversion
 * name is not defined in the document or section metadata,
 * the id of the HTML form element will be used as conversion name
 */
// eslint-disable-next-line import/prefer-default-export
export async function initConversionTracking(parent = document, defaultFormConversionName = '') {
  const conversionElements = {
    form: () => {
      // Track all forms
      parent.querySelectorAll('form').forEach((element) => {
        const section = element.closest('div.section');
        if (section.dataset.conversionValueField) {
          const cvField = section.dataset.conversionValueField.trim();
          // this will track the value of the element with the id specified in
          // the "Conversion Element" field.
          // ideally, this should not be an ID, but the case-insensitive name label of the element.
          sampleRUM.convert(undefined, (cvParent) => findConversionValue(cvParent, cvField), element, ['submit']);
        }
        let formConversionName = section.dataset.conversionName || this.getMetadata('conversion-name');
        if (!formConversionName) {
          // if no conversion name is defined in the metadata,
          // use the conversion name passed as parameter or the form or id
          formConversionName = defaultFormConversionName
            ? this.toClassName(defaultFormConversionName) : element.id;
        }
        sampleRUM.convert(formConversionName, undefined, element, ['submit']);
      });
    },
    link: () => {
      // track all links
      Array.from(parent.querySelectorAll('a[href]'))
        .map((element) => ({
          element,
          cevent: getConversionNameMetadata.call(this, element) || this.getMetadata('conversion-name') || getLinkLabel.call(this, element),
        }))
        .forEach(({ element, cevent }) => {
          sampleRUM.convert(cevent, undefined, element, ['click']);
        });
    },
    'labeled-link': () => {
      // track only the links configured in the metadata
      const linkLabels = this.getMetadata('conversion-link-labels') || '';
      const trackedLabels = linkLabels.split(',')
        .map((p) => p.trim())
        .map(this.toClassName);

      Array.from(parent.querySelectorAll('a[href]'))
        .filter((element) => trackedLabels.includes(getLinkLabel.call(this, element)))
        .map((element) => ({
          element,
          cevent: getConversionNameMetadata.call(this, element) || this.getMetadata('conversion-name') || getLinkLabel.call(this, element),
        }))
        .forEach(({ element, cevent }) => {
          sampleRUM.convert(cevent, undefined, element, ['click']);
        });
    },
  };

  const declaredConversionElements = this.getMetadata('conversion-element') ? this.getMetadata('conversion-element').split(',').map((ce) => this.toClassName(ce.trim())) : [];

  Object.keys(conversionElements)
    .filter((ce) => declaredConversionElements.includes(ce))
    .forEach((cefn) => conversionElements[cefn]());
}
