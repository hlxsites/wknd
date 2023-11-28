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
import {
  sampleRUM,
} from '../lib-franklin.js';

const CUSTOM_SCHEMA_NAMESPACE = '_sitesinternal';

/**
 * Sends an analytics event to alloy
 * @param xdmData - the xdm data object
 * @returns {Promise<*>}
 */
async function sendAnalyticsEvent(xdmData) {
  // eslint-disable-next-line no-undef
  if (!window.alloy) {
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
 * Sets up analytics tracking with alloy (initializes and configures alloy)
 * @param document
 * @returns {Promise<void>}
 */
export async function setupAnalyticsTrackingWithAlloy(document) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot configure');
    return;
  }

  // Custom logic can be inserted here in order to support early tracking before alloy library
  // loads, for e.g. for page views
  const pageViewPromise = analyticsTrackPageViews(document); // track page view early
  await Promise.all([pageViewPromise]);
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

export function initializeAnalyticsTracking() {
  const cwv = {};

  // Forward the RUM CWV cached measurements to edge using WebSDK before the page unloads
  window.addEventListener('beforeunload', () => {
    if (!Object.keys(cwv).length) return;
    analyticsTrackCWV(cwv);
  });

  // Callback to RUM CWV checkpoint in order to cache the measurements
  sampleRUM.always.on('cwv', async (data) => {
    if (!data.cwv) return;
    Object.assign(cwv, data.cwv);
  });

  sampleRUM.always.on('404', analyticsTrack404);
  sampleRUM.always.on('error', analyticsTrackError);

  // Declare conversionEvent, bufferTimeoutId and tempConversionEvent,
  // outside the convert function to persist them for buffering between
  // subsequent convert calls
  const CONVERSION_EVENT_TIMEOUT_MS = 100;
  let bufferTimeoutId;
  let conversionEvent;
  let tempConversionEvent;
  sampleRUM.always.on('convert', (data) => {
    const { element } = data;
    // eslint-disable-next-line no-undef
    if (!element || !alloy) {
      return;
    }

    if (element.tagName === 'FORM') {
      conversionEvent = {
        ...data,
        event: 'Form Complete',
      };

      if (conversionEvent.event === 'Form Complete'
        // Check for undefined, since target can contain value 0 as well, which is falsy
        && (data.target === undefined || data.source === undefined)
      ) {
        // If a buffer has already been set and tempConversionEvent exists,
        // merge the two conversionEvent objects to send to alloy
        if (bufferTimeoutId && tempConversionEvent) {
          conversionEvent = { ...tempConversionEvent, ...conversionEvent };
        } else {
          // Temporarily hold the conversionEvent object until the timeout is complete
          tempConversionEvent = { ...conversionEvent };

          // If there is partial form conversion data,
          // set the timeout buffer to wait for additional data
          bufferTimeoutId = setTimeout(async () => {
            analyticsTrackConversion({ ...conversionEvent });
            tempConversionEvent = undefined;
            conversionEvent = undefined;
          }, CONVERSION_EVENT_TIMEOUT_MS);
        }
      }
      return;
    }

    analyticsTrackConversion({ ...data });
    tempConversionEvent = undefined;
    conversionEvent = undefined;
  });
}
