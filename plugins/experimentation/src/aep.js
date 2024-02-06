/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
function getAlloyConfiguration(document, { edgeConfigId, orgId, enhanceAnalyticsEvent }) {
  const { hostname } = document.location;

  return {
    // enable while debugging
    debugEnabled: hostname.startsWith('localhost') || hostname.includes('--'),
    // disable when clicks are also tracked via sendEvent with additional details
    clickCollectionEnabled: true,
    // adjust default based on customer use case
    defaultConsent: 'in',
    edgeConfigId,
    orgId,
    onBeforeEventSend: enhanceAnalyticsEvent,
  };
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
  return segments;
}

let segments;
let renderDecisions;

export async function init(options) {

  // await setupAlloy(document, options);
  // initialized = true;
}

// eslint-disable-next-line import/prefer-default-export
export async function resolveAepSegment(segmentId, options, context) {
  console.assert(options.edgeConfigId, 'aep.edgeConfigId is required');
  console.assert(options.orgId, 'aep.orgId is required');
  console.assert(options.isConsentGiven, 'aep.isConsentGiven is required');

  // make sure that the cookie consent is available before making the call to alloy,
  // otherwise the call will be queued and never executed
  if (!options.isConsentGiven()) {
    return [];
  }

  if (segments) {
    return segments;
  }
  // avoid multiple calls to alloy for render decisions from different audiences
  if (renderDecisions) {
    return getSegmentsFromAlloyResponse(renderDecisions);
  }

  try {
    renderDecisions = await window.alloy('sendEvent', {
      renderDecisions: true,
    });
    segments = getSegmentsFromAlloyResponse(renderDecisions);
    return segments.find((segment) => segment === segmentId)
      || options?.segmentsMap?.find((segment) => segment.name === segmentId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error sending event to alloy:', err);
    return [];
  }
}
