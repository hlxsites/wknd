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
export async function resolveAepSegment(segmentId, options) {
  console.assert(options.edgeConfigId, 'aep.edgeConfigId is required');
  console.assert(options.orgId, 'aep.orgId is required');
  console.assert(options.isConsentGiven, 'aep.isConsentGiven is required');

  // make sure that the cookie consent is available before making the call to alloy,
  // otherwise the call will be queued and never executed
  if (!options.isConsentGiven()) {
    return null;
  }

  // avoid multiple calls to alloy for render decisions from different audiences
  if (!renderDecisions) {
    renderDecisions = await window.alloy('sendEvent', {
      renderDecisions: true,
    });
  }

  try {
    segments = getSegmentsFromAlloyResponse(renderDecisions);
    return segments.find((segment) => segment === segmentId)
      || options?.segmentsMap?.find((segment) => segment.name === segmentId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error sending event to alloy:', err);
    return null;
  }
}
