/*
 * Copyright 2024 Adobe. All rights reserved.
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
* The function will register a listener for an element if listenTo parameter is provided.
* listenTo supports 'submit' and 'click'.
* If listenTo is not provided, it tracks a conversion checkpoint in RUM with the data
* passed as parameters
*/
const internalConvert = (cevent, cvalueThunk, element, listenTo = []) => {
  async function trackConversion(celement) {
    try {
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
};

/**
 * The function convert acts as a proxy
 * to support both RUM 1.x and RUM 2.x implementations.
 * Depending on the RUM version present in the website
 * the function convert will behave in a different way
 */
let convert;
if (sampleRUM.drain) {
  sampleRUM.drain('convert', internalConvert);
  convert = sampleRUM.convert;
} else {
  convert = internalConvert;
}

/**
 * Returns the label used for tracking link clicks
 * @param {Element} element link element
 * @returns link label used for tracking converstion
 */
function getLinkLabel({ toClassName }, element) {
  return element.title ? toClassName(element.title) : toClassName(element.textContent);
}

function getConversionNameMetadata({ getMetadata }, element) {
  const text = element.title || element.textContent;
  return getMetadata(`conversion-name--${text.toLowerCase().replace(/[^0-9a-z]/gi, '-')}-`);
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
async function initCTInternal(context, parent = document, defaultFormConversionName = '') {
  const { toClassName, getMetadata } = context;
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
          convert(undefined, (cvParent) => findConversionValue(cvParent, cvField), element, ['submit']);
        }
        let formConversionName = section.dataset.conversionName || getMetadata('conversion-name');
        if (!formConversionName) {
          // if no conversion name is defined in the metadata,
          // use the conversion name passed as parameter or the form or id
          formConversionName = defaultFormConversionName
            ? toClassName(defaultFormConversionName) : element.id;
        }
        convert(formConversionName, undefined, element, ['submit']);
      });
    },
    link: () => {
      // track all links
      Array.from(parent.querySelectorAll('a[href]'))
        .map((element) => ({
          element,
          cevent: getConversionNameMetadata(context, element) || getMetadata('conversion-name') || getLinkLabel(context, element),
        }))
        .forEach(({ element, cevent }) => {
          convert(cevent, undefined, element, ['click']);
        });
    },
    'labeled-link': () => {
      // track only the links configured in the metadata
      const linkLabels = getMetadata('conversion-link-labels') || '';
      const trackedLabels = linkLabels.split(',')
        .map((p) => p.trim())
        .map(toClassName);

      Array.from(parent.querySelectorAll('a[href]'))
        .filter((element) => trackedLabels.includes(getLinkLabel(context, element)))
        .map((element) => ({
          element,
          cevent: getConversionNameMetadata(context, element) || getMetadata('conversion-name') || getLinkLabel(context, element),
        }))
        .forEach(({ element, cevent }) => {
          convert(cevent, undefined, element, ['click']);
        });
    },
  };
  const declaredConversionElements = getMetadata('conversion-element') ? getMetadata('conversion-element').split(',').map((ce) => toClassName(ce.trim())) : [];

  Object.keys(conversionElements)
    .filter((ce) => declaredConversionElements.includes(ce))
    .forEach((cefn) => conversionElements[cefn]());
}

// for backwards compatibility. Keep support for initConversionTracking.call(...) invocation
// where the context is passed as first parameter and made available in the "this" object.
export async function initConversionTracking(parent = document, defaultFormConversionName = '') {
  initCTInternal(this, parent, defaultFormConversionName);
}

// Add support for Plugin system
/**
 * Load the martech configured as non-delayed
 * @param {*} context should contain at lease sampleRUM object and toCamelCase function
 */
export async function loadLazy(document, pluginOptions, context) {
  initCTInternal(context, document);
}
