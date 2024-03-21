import { sampleRUM } from './lib-franklin.js';
import { sendAnalyticsEvent } from './adobe-martech/index.js';

const { hostname } = window.location;
const debug = (...args) => {
  if (hostname === 'localhost' || hostname.endsWith('.hlx.page') || hostname.endsWith('.aem.page')) {
    // eslint-disable-next-line no-console
    console.debug.call(null, '[rum]', ...args);
  }
};

sampleRUM.always.on('lazy', (data) => {
  debug('lazy', data);
  sendAnalyticsEvent({
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        pageViews: {
          value: 1,
        },
        name: document.title,
      },
    },
    _sitesinternal: {},
  });
});
sampleRUM.always.on('cwv', (data) => {
  debug('cwv', data);
  if (!data.cwv) {
    return;
  }
  sendAnalyticsEvent({
    eventType: 'web.performance.measurements',
    _sitesinternal: { cwv: data.cwv },
  });
});
sampleRUM.always.on('404', (data) => {
  debug('404', data);
  sendAnalyticsEvent({
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        pageViews: { value: 0 },
      },
    },
    _sitesinternal: { isPageNotFound: true },
  });
});
sampleRUM.always.on('error', (data) => {
  debug('error', data);
  sendAnalyticsEvent({
    eventType: 'web.webpagedetails.pageViews',
    web: {
      webPageDetails: {
        pageViews: { value: 0 },
        isErrorPage: true,
      },
    },
    _sitesinternal: {},
  });
});
sampleRUM.always.on('formsubmit', (data) => {
  debug('formsubmit', data);
  const element = { data };
  const formId = element?.id || element?.dataset?.action;
  return sendAnalyticsEvent({
    eventType: 'web.formFilledOut',
    _sitesinternal: {
      form: {
        ...(formId && { formId }),
        formComplete: 1,
      },
    },
  });
});
sampleRUM.always.on('click', (data) => {
  debug('click', data);
  const element = { data };
  sendAnalyticsEvent({
    eventType: 'web.webinteraction.linkClicks',
    web: {
      webInteraction: {
        URL: element.href,
        // eslint-disable-next-line no-nested-ternary
        name: element.text ? element.text.trim() : (element.innerHTML ? element.innerHTML.trim() : ''),
        linkClicks: { value: 1 },
        type: 'other',
      },
    },
    _sitesinternal: {},
  });
});

// Declare conversionEvent, bufferTimeoutId and tempConversionEvent,
// outside the convert function to persist them for buffering between
// subsequent convert calls
const CONVERSION_EVENT_TIMEOUT_MS = 100;
let bufferTimeoutId;
let conversionEvent;
let tempConversionEvent;
sampleRUM.always.on('convert', (data) => {
  debug('convert', data);
  const { source: conversionName, target: conversionValue, element } = data;
  // eslint-disable-next-line no-undef
  if (!element) {
    return;
  }

  function analyticsTrackConversion() {
    const xdmData = {
      eventType: 'web.webinteraction.conversion',
      _sitesinternal: {
        conversion: {
          conversionComplete: 1,
          conversionName,
          conversionValue,
        },
      },
    };

    if (element.tagName === 'FORM') {
      xdmData.eventType = 'web.formFilledOut';
      const formId = element?.id || element?.dataset?.action;
      // eslint-disable-next-line no-underscore-dangle
      xdmData._sitesinternal.form = {
        ...(formId && { formId }),
        // don't count as form complete, as this event should be tracked separately,
        // track only the details of the form together with the conversion
        formComplete: 0,
      };
    } else if (element.tagName === 'A') {
      xdmData.eventType = 'web.webinteraction.linkClicks';
      xdmData.web = {
        webInteraction: {
          URL: element.href,
          // eslint-disable-next-line no-nested-ternary
          name: element.text ? element.text.trim() : (element.innerHTML ? element.innerHTML.trim() : ''),
          linkClicks: {
            // don't count as link click, as this event should be tracked separately,
            // track only the details of the link with the conversion
            value: 0,
          },
          type: 'other',
        },
      };
    }
    sendAnalyticsEvent(xdmData);
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
