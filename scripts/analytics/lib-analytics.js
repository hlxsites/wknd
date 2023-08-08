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

/**
 * Customer's XDM schema namespace
 * @type {string}
 */
const CUSTOM_SCHEMA_NAMESPACE = '_sitesinternal';

/**
 * Returns experiment id and variant running
 * @returns {{experimentVariant: *, experimentId}}
 */
export function getExperimentDetails() {
  let experiment;
  if (window.hlx.experiment) {
    experiment = {
      experimentId: window.hlx.experiment.id,
      experimentVariant: window.hlx.experiment.selectedVariant,
    };
  }
  return experiment;
}

/**
 * Returns script that initializes a queue for each alloy instance,
 * in order to be ready to receive events before the alloy library is loaded
 * Documentation
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/installing-the-sdk.html?lang=en#adding-the-code
 * @type {string}
 */
function getAlloyInitScript() {
  return `!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=
  function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,["alloy"]);`;
}

/**
 * Returns datastream id to use as edge configuration id
 * Custom logic can be inserted here in order to support
 * different datastream ids for different environments (non-prod/prod)
 * @returns {{edgeConfigId: string, orgId: string}}
 */
function getDatastreamConfiguration() {
  // Sites Internal
  return {
    edgeConfigId: 'caad777c-c410-4ceb-8b36-167f1cecc3de',
    orgId: '908936ED5D35CC220A495CD4@AdobeOrg',
  };
}

/**
 * Enhance all events with additional details, like experiment running,
 * before sending them to the edge
 * @param options event in the XDM schema format
 */
function enhanceAnalyticsEvent(options) {
  const experiment = getExperimentDetails();
  options.xdm[CUSTOM_SCHEMA_NAMESPACE] = {
    ...options.xdm[CUSTOM_SCHEMA_NAMESPACE],
    ...(experiment ? { experiment } : {}), // add experiment details, if existing, to all events
  };
  console.debug(`enhanceAnalyticsEvent complete: ${JSON.stringify(options)}`);
}

/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
function getAlloyConfiguration(document) {
  return {
    // enable while debugging
    debugEnabled: document.location.hostname.startsWith('localhost') || document.location.hostname.includes('--'),
    // disable when clicks are also tracked via sendEvent with additional details
    clickCollectionEnabled: true,
    // adjust default based on customer use case
    defaultConsent: 'pending',
    ...getDatastreamConfiguration(),
    onBeforeEventSend: (options) => enhanceAnalyticsEvent(options),
  };
}

/**
 * Create inline script
 * @param document
 * @param element where to create the script element
 * @param innerHTML the script
 * @param type the type of the script element
 * @returns {HTMLScriptElement}
 */
function createInlineScript(document, element, innerHTML, type) {
  const script = document.createElement('script');
  if (type) {
    script.type = type;
  }
  script.innerHTML = innerHTML;
  element.appendChild(script);
  return script;
}

/**
 * Sets Adobe standard v1.0 consent for alloy based on the input
 * Documentation: https://experienceleague.adobe.com/docs/experience-platform/edge/consent/supporting-consent.html?lang=en#using-the-adobe-standard-version-1.0
 * @param approved
 * @returns {Promise<*>}
 */
export async function analyticsSetConsent(approved) {
  // eslint-disable-next-line no-undef
  return alloy('setConsent', {
    consent: [{
      standard: 'Adobe',
      version: '1.0',
      value: {
        general: approved ? 'in' : 'out',
      },
    }],
  });
}

/**
 * Basic tracking for page views with alloy
 * @param document
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackPageViews(document, additionalXdmFields = {}) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webpagedetails.pageViews',
      web: {
        webPageDetails: {
          pageViews: {
            value: 1,
          },
          name: `${document.title}`,
        },
      },
      [CUSTOM_SCHEMA_NAMESPACE]: {
        ...additionalXdmFields,
      },
    },
  });
}

/**
 * Initializes event queue for analytics tracking using alloy
 * @returns {Promise<void>}
 */
export async function initAnalyticsTrackingQueue() {
  createInlineScript(document, document.body, getAlloyInitScript(), 'text/javascript');
}

/**
 * Sets up analytics tracking with alloy (initializes and configures alloy)
 * @param document
 * @returns {Promise<void>}
 */
export async function setupAnalyticsTrackingWithAlloy(document) {
  // eslint-disable-next-line no-undef
  const configure = alloy('configure', getAlloyConfiguration(document));

  // Custom logic can be inserted here in order to support early tracking before alloy library
  // loads, for e.g. for page views
  const pageView = analyticsTrackPageViews(document); // track page view early

  await import('./alloy.min.js');
  await configure;
  await pageView;
}

/**
 * Basic tracking for link clicks with alloy
 * Documentation: https://experienceleague.adobe.com/docs/experience-platform/edge/data-collection/track-links.html
 * @param element
 * @param linkType
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackLinkClicks(element, linkType = 'other', additionalXdmFields = {}) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkURL: `${element.href}`,
          // eslint-disable-next-line no-nested-ternary
          name: `${element.text ? element.text.trim() : (element.innerHTML ? element.innerHTML.trim() : '')}`,
          linkClicks: {
            value: 1,
          },
          type: linkType,
        },
      },
      [CUSTOM_SCHEMA_NAMESPACE]: {
        ...additionalXdmFields,
      },
    },
  });
}

/**
 * Basic tracking for CWV events with alloy
 * @param cwv
 * @returns {Promise<*>}
 */
export async function analyticsTrackCWV(cwv) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.performance.measurements',
      [CUSTOM_SCHEMA_NAMESPACE]: {
        cwv,
      },
    },
  });
}

/**
 * Basic tracking for 404 errors with alloy
 * @param data
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrack404(data, additionalXdmFields = {}) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webpagedetails.pageViews',
      web: {
        webPageDetails: {
          pageViews: {
            value: 0,
          },
        },
      },
      [CUSTOM_SCHEMA_NAMESPACE]: {
        ...additionalXdmFields,
        isPageNotFound: true,
      },
    },
  });
}

export async function analyticsTrackError(data, additionalXdmFields = {}) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webpagedetails.pageViews',
      web: {
        webPageDetails: {
          pageViews: {
            value: 0,
          },
          isErrorPage: true,
        },
      },
      [CUSTOM_SCHEMA_NAMESPACE]: {
        ...additionalXdmFields,
      },
    },
  });
}

/**
 * Basic tracking for form submissions with alloy
 * @param element
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackFormSubmission(element, additionalXdmFields = {}) {
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.formFilledOut',
      [CUSTOM_SCHEMA_NAMESPACE]: {
        form: {
          formId: `${element.id}`,
          formComplete: 1,
        },
        ...additionalXdmFields,
      },
    },
  });
}

/**
 * Basic tracking for video play with alloy
 * @param element
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackVideo(
  {
    id, name, type, hasStarted, hasCompleted, progressMarker,
  },
  additionalXdmFields,
) {
  const primaryAssetReference = {
    id: `${id}`,
    dc: {
      title: `${name}`,
    },
    showType: `${type}`,
  };
  if (hasStarted) {
    // eslint-disable-next-line no-undef
    return alloy('sendEvent', {
      documentUnloading: true,
      xdm: {
        [CUSTOM_SCHEMA_NAMESPACE]: {
          media: {
            mediaTimed: {
              impressions: {
                value: 1,
              },
              primaryAssetReference,
            },
          },
          ...additionalXdmFields,
        },
      },
    });
  }
  if (hasCompleted) {
    // eslint-disable-next-line no-undef
    return alloy('sendEvent', {
      documentUnloading: true,
      xdm: {
        [CUSTOM_SCHEMA_NAMESPACE]: {
          media: {
            mediaTimed: {
              completes: {
                value: 1,
              },
              primaryAssetReference,
            },
          },
          ...additionalXdmFields,
        },
      },
    });
  }
  if (progressMarker) {
    // eslint-disable-next-line no-undef
    return alloy('sendEvent', {
      documentUnloading: true,
      xdm: {
        [CUSTOM_SCHEMA_NAMESPACE]: {
          media: {
            mediaTimed: {
              [progressMarker]: {
                value: 1,
              },
              primaryAssetReference,
            },
          },
          ...additionalXdmFields,
        },
      },
    });
  }
  return Promise.resolve();
}
