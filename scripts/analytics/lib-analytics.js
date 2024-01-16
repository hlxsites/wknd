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

const EVENT_TYPE_PROPOSITION_INTERACTION = 'propositionInteraction';
const EXPERIENCE_STEP_EXPERIMENTATION = 'experimentation';
/**
 * Customer's XDM schema namespace
 * @type {string}
 */
const CUSTOM_SCHEMA_NAMESPACE = '_sitesinternal';

/**
 * Pre connection domains to which pre-connect will be established
 * NOTE: Add only those urls you need in LCP
 */
const PRECONNECTION_DOMAINS = ['https://edge.adobedc.net', 'https://adobedc.demdex.net'];

/**
 * Configure the cookie keys that should be mapped to the XDM schema and send with each event
 * Ex: { 'funnelState': 'userState' }
 * funnelState in the cookie will be sent as userState in the schema
 */
const COOKIE_MAPPING_TO_SCHEMA = {
};

/**
 * Establishes pre-connections to domains that are configured in PRECONNECTION_DOMAINS
 */
export function establishPreConnections() {
  PRECONNECTION_DOMAINS.forEach((domain) => {
    if (!document.querySelector(`head > link[rel="preconnect"][href="${domain}"]`)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('href', domain);
      document.head.appendChild(link);
    }
  });
}

/**
 * Returns experiment id and variant running
 * @returns {{experimentVariant: *, experimentId}}
 */
export function getExperimentDetails() {
  if (!window.hlx || !window.hlx.experiment) {
    return null;
  }
  const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
  return { experimentId, experimentVariant };
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
    edgeConfigId: '2324184b-260b-4d66-a8ca-897ab9374fb3', // TODO: change this to earlier after testing
    orgId: '908936ED5D35CC220A495CD4@AdobeOrg',
  };
}

/**
 * If the configured key in COOKIE_MAPPING_TO_SCHEMA exists in the cookie
 * it'll be added to the XDM schema
 * @param {*} xdmData
 */
function updateAlloyEventWithCookieData(xdmData) {
  const cookieData = document.cookie.split(';').reduce((res, item) => {
    const [key, val] = item.split('=');
    res[key.trim()] = val;
    return res;
  }, {});
  Object.keys(cookieData).forEach((key) => {
    const mappedKey = COOKIE_MAPPING_TO_SCHEMA[key];
    if (mappedKey && xdmData.xdm[CUSTOM_SCHEMA_NAMESPACE]) {
      xdmData.xdm[CUSTOM_SCHEMA_NAMESPACE][mappedKey] = cookieData[key];
    }
  });
}

/**
 * Enhance all events with additional details, like experiment running, mapped cookie data, etc.
 * before sending them to the edge
 * @param options event in the XDM schema format
 */
function enhanceAnalyticsEvent(options) {
  const experiment = getExperimentDetails();
  const experienceDecisioningXDM = experiment ? {
    decisioning: {
      propositionEventType: EVENT_TYPE_PROPOSITION_INTERACTION,
      propositions: [
        {
          scopeDetails: {
            strategies: [
              {
                strategyID: experiment.experimentId,
                step: EXPERIENCE_STEP_EXPERIMENTATION,
                treatmentID: experiment.experimentVariant,
              },
            ],
          },
        },
      ],
    },
  } : {};
  options.xdm[CUSTOM_SCHEMA_NAMESPACE] = {
    ...options.xdm[CUSTOM_SCHEMA_NAMESPACE],
    ...(experiment && { experiment }), // add experiment details, if existing, to all events
  };
  // eslint-disable-next-line no-underscore-dangle
  options.xdm._experience = experienceDecisioningXDM;
  updateAlloyEventWithCookieData(options);
  console.debug(`enhanceAnalyticsEvent complete: ${JSON.stringify(options)}`);
}

/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
function getAlloyConfiguration(document) {
  const { hostname } = document.location;

  return {
    // enable while debugging
    debugEnabled: hostname.startsWith('localhost') || hostname.includes('--'),
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
  script.type = type;
  script.innerHTML = innerHTML;
  element.appendChild(script);
  return script;
}

/**
 * Sends an analytics event to alloy
 * @param xdmData - the xdm data object
 * @returns {Promise<*>}
 */
async function sendAnalyticsEvent(xdmData) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot send analytics event');
    return Promise.resolve();
  }
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: xdmData,
  });
}

/**
 * Sets Adobe standard v1.0 consent for alloy based on the input
 * Documentation: https://experienceleague.adobe.com/docs/experience-platform/edge/consent/supporting-consent.html?lang=en#using-the-adobe-standard-version-1.0
 * @param approved
 * @returns {Promise<*>}
 */
export async function analyticsSetConsent(approved) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot set consent');
    return Promise.resolve();
  }
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
  const xdmData = {
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
  };

  return sendAnalyticsEvent(xdmData);
}

/**
 * Initializes event queue for analytics tracking using alloy
 * @returns {Promise<void>}
 */
export async function initAnalyticsTrackingQueue() {
  createInlineScript(document, document.body, getAlloyInitScript(), 'text/javascript');
}

export async function setupAlloy(document) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot configure');
    return;
  }
  // create a promise on window that resolves when alloy loading is complete
  window.alloyLoader = new Promise((resolve) => {
    window.alloyLoaderResolve = resolve;
  });
  // eslint-disable-next-line no-undef
  const configurePromise = alloy('configure', getAlloyConfiguration(document));

  await import('./alloy.min.js');
  await configurePromise;
  window.alloyLoaderResolve();
}

/**
 * Sets up analytics tracking with alloy (initializes and configures alloy)
 * @param document
 * @returns {Promise<void>}
 */
export async function setupAnalyticsTrackingWithAlloy(document) {
  if (window.alloyLoader) {
    await window.alloyLoader;
  } else {
    await setupAlloy(document);
  }
  // Custom logic can be inserted here in order to support early tracking before alloy library
  // loads, for e.g. for page views
  await analyticsTrackPageViews(document); // track page view early
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
  const xdmData = {
    eventType: 'web.webinteraction.linkClicks',
    web: {
      webInteraction: {
        URL: `${element.href}`,
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
  };

  return sendAnalyticsEvent(xdmData);
}

/**
 * Basic tracking for CWV events with alloy
 * @param cwv
 * @returns {Promise<*>}
 */
export async function analyticsTrackCWV(cwv) {
  const xdmData = {
    eventType: 'web.performance.measurements',
    [CUSTOM_SCHEMA_NAMESPACE]: {
      cwv,
    },
  };

  return sendAnalyticsEvent(xdmData);
}

/**
 * Basic tracking for 404 errors with alloy
 * @param data
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrack404(data, additionalXdmFields = {}) {
  const xdmData = {
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        pageViews: {
          value: 0,
        },
      },
    },
    [CUSTOM_SCHEMA_NAMESPACE]: {
      isPageNotFound: true,
      ...additionalXdmFields,
    },
  };

  return sendAnalyticsEvent(xdmData);
}

export async function analyticsTrackError(data, additionalXdmFields = {}) {
  const xdmData = {
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
  };

  return sendAnalyticsEvent(xdmData);
}

export async function analyticsTrackConversion(data, additionalXdmFields = {}) {
  const { source: conversionName, target: conversionValue, element } = data;

  const xdmData = {
    eventType: 'web.webinteraction.conversion',
    [CUSTOM_SCHEMA_NAMESPACE]: {
      conversion: {
        conversionComplete: 1,
        conversionName,
        conversionValue,
      },
      ...additionalXdmFields,
    },
  };

  if (element.tagName === 'FORM') {
    xdmData.eventType = 'web.formFilledOut';
    const formId = element?.id || element?.dataset?.action;
    xdmData[CUSTOM_SCHEMA_NAMESPACE].form = {
      ...(formId && { formId }),
      // don't count as form complete, as this event should be tracked separately,
      // track only the details of the form together with the conversion
      formComplete: 0,
    };
  } else if (element.tagName === 'A') {
    xdmData.eventType = 'web.webinteraction.linkClicks';
    xdmData.web = {
      webInteraction: {
        URL: `${element.href}`,
        // eslint-disable-next-line no-nested-ternary
        name: `${element.text ? element.text.trim() : (element.innerHTML ? element.innerHTML.trim() : '')}`,
        linkClicks: {
          // don't count as link click, as this event should be tracked separately,
          // track only the details of the link with the conversion
          value: 0,
        },
        type: 'other',
      },
    };
  }

  return sendAnalyticsEvent(xdmData);
}

/**
 * Basic tracking for form submissions with alloy
 * @param element
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackFormSubmission(element, additionalXdmFields = {}) {
  const formId = element?.id || element?.dataset?.action;
  const xdmData = {
    eventType: 'web.formFilledOut',
    [CUSTOM_SCHEMA_NAMESPACE]: {
      form: {
        ...(formId && { formId }),
        formComplete: 1,
      },
      ...additionalXdmFields,
    },
  };

  return sendAnalyticsEvent(xdmData);
}

/**
 * Basic tracking for video play with alloy
 * @param element
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsTrackVideo({
  id, name, type, hasStarted, hasCompleted, progressMarker,
}, additionalXdmFields) {
  const primaryAssetReference = {
    id: `${id}`,
    dc: {
      title: `${name}`,
    },
    showType: `${type}`,
  };
  const baseXdm = {
    [CUSTOM_SCHEMA_NAMESPACE]: {
      media: {
        mediaTimed: {
          primaryAssetReference,
        },
      },
      ...additionalXdmFields,
    },
  };

  if (hasStarted) {
    baseXdm[CUSTOM_SCHEMA_NAMESPACE].media.mediaTimed.impressions = { value: 1 };
  } else if (hasCompleted) {
    baseXdm[CUSTOM_SCHEMA_NAMESPACE].media.mediaTimed.completes = { value: 1 };
  } else if (progressMarker) {
    baseXdm[CUSTOM_SCHEMA_NAMESPACE].media.mediaTimed[progressMarker] = { value: 1 };
  } else {
    return Promise.resolve();
  }

  return sendAnalyticsEvent(baseXdm);
}

/**
 * Sends custom data to analytics as additional fields in the custom name space
 * @param element
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
export async function analyticsCustomData(additionalXdmFields = {}) {
  const xdmData = {
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
    },
  };

  return sendAnalyticsEvent(xdmData);
}

/**
 * Checks if the analytics cookie consent is set to ALLOW
 * @returns {boolean}
 */
function isCookieConsentAllowed() {
  // check if cookie cookieconsent_status_ANALYTICS is set to ALLOW
  const cookies = document.cookie.split(';');
  // eslint-disable-next-line no-restricted-syntax
  for (const cookie of cookies) {
    if (cookie.trim().startsWith('cookieconsent_status_ANALYTICS=ALLOW')) {
      return true;
    }
  }
  return false;
}

function getSegmentsFromAlloyResponse(response) {
  const segments = [];
  if (response && response.destinations) {
    Object.values(response.destinations).forEach((destination) => {
      if (destination.segments) {
        Object.values(destination.segments).forEach((segment) => {
          segments.push(segment.id);
        });
      }
    });
  }
  console.log('segments', segments);
  return segments;
}

export async function getSegmentsFromAlloy() {
  if (!window.alloy) {
    return [];
  }
  // make sure that the cookie consent is available before making the call to alloy,
  // otherwise the call will be queued and never executed
  if (!isCookieConsentAllowed()) {
    return [];
  }
  if (window.rtcdpSegments) {
    return window.rtcdpSegments;
  }
  if (window.alloyLoader) {
    await window.alloyLoader;
  } else {
    await setupAlloy(document);
  }
  let result;
  // avoid multiple calls to alloy for render decisions from different audiences
  if (window.renderDecisionsResult) {
    result = await window.renderDecisionsResult;
  } else {
    // eslint-disable-next-line no-undef
    window.renderDecisionsResult = alloy('sendEvent', {
      renderDecisions: true,
    }).catch((error) => {
      console.error('Error sending event to alloy:', error);
      return [];
    });
    result = await window.renderDecisionsResult;
  }
  window.rtcdpSegments = getSegmentsFromAlloyResponse(result);
  return window.rtcdpSegments;
}
