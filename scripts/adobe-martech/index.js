/**
 * Initializes a queue for each alloy instance, in order to be ready to receive events before the
 * alloy library is fully loaded.
 * Documentation:
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/installing-the-sdk.html?lang=en#adding-the-code
 */
let alloyName;
function initAlloyQueue(globalObjectName = 'alloy') {
  alloyName = globalObjectName;
  // eslint-disable-next-line
  !function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,[globalObjectName]);;
}

/**
 * Documentation:
 * https://github.com/adobe/adobe-client-data-layer/wiki
 */
let dataLayerName;
function initDatalayer(globalObjectName = 'adobeDataLayer') {
  dataLayerName = globalObjectName;
  window[globalObjectName] ||= [];
}

export function getPageContext() {
  if (!window.hlx || !window.hlx.experiment) {
    return {};
  }
  const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
  return { experimentId, experimentVariant };
}

/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
function getDefaultAlloyConfiguration() {
  const { hostname } = window.location;

  return {
    // enable while debugging
    debugEnabled: hostname === 'localhost' || hostname.endsWith('.hlx.page') || hostname.endsWith('.aem.page'),
    // disable when clicks are also tracked via sendEvent with additional details
    // clickCollectionEnabled: true,
    // adjust default based on customer use case
    // ...getDatastreamConfiguration(),
    // onBeforeEventSend: (options) => enhanceAnalyticsEvent(options),
  };
}

function configureAlloy(config) {
  return new Promise((resolve) => {
    import('./alloy.min.js')
      .then(() => {
        window[alloyName]('configure', config);
        resolve();
      });
  });
}

function onDecoratedElement(fn) {
  // Apply propositions to all already decorated blocks/sections
  if (document.querySelector('[data-block-status="loaded"],[data-section-status="loaded"]')) {
    fn();
  }

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.target.tagName === 'BODY'
      || m.target.dataset.sectionStatus === 'loaded'
      || m.target.dataset.blockStatus === 'loaded')) {
      fn();
    }
  });
  // Watch sections and blocks being decorated async
  observer.observe(document.querySelector('main'), {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-block-status', 'data-section-status'],
  });
  // Watch anything else added to the body
  document.querySelectorAll('body').forEach((el) => {
    observer.observe(el, { childList: true });
  });
}

let renderDecisionResponse;
async function getAndApplyRenderDecisions() {
  // Get the decisions, but don't render them automatically
  // so we can hook up into the AEM EDS page load sequence
  renderDecisionResponse = await window[alloyName]('sendEvent', { renderDecisions: false });

  onDecoratedElement(() => window[alloyName]('applyPropositions', { propositions: renderDecisionResponse.propositions }));
  return renderDecisionResponse;
}

async function reportShownRenderDecisions() {
  window[alloyName]('sendEvent', {
    xdm: {
      eventType: 'decisioning.propositionDisplay',
      _experience: {
        decisioning: {
          propositions: renderDecisionResponse.propositions,
        },
      },
    },
  });
}

async function loadDataLayer() {
  return import('./acdl.min.js');
}

export function pushToDataLayer(data) {
  window[dataLayerName].push(data);
}

/**
 * Sends an analytics event to alloy
 * @param xdmData - the xdm data object
 * @returns {Promise<*>}
 */
export async function sendAnalyticsEvent(xdmData) {
  if (!window[alloyName]) {
    // eslint-disable-next-line no-console
    console.warn('Adobe WebSDK is not properly initialized. Cannot send analytics event');
    return Promise.resolve();
  }
  // eslint-disable-next-line no-undef
  return window[alloyName]('sendEvent', {
    documentUnloading: true,
    xdm: xdmData,
  });
}

/**
 * Sets Adobe standard v2.0 consent for alloy based on the input
 * Documentation: https://experienceleague.adobe.com/docs/experience-platform/edge/consent/supporting-consent.html?lang=en#using-the-adobe-standard-version-1.0
 * @param approved
 * @returns {Promise<*>}
 */
export async function updateUserConsent(isConsented) {
  return window[alloyName]('setConsent', {
    consent: [{
      standard: 'Adobe',
      version: '2.0',
      value: {
        collect: { val: isConsented ? 'y' : 'n' },
        metadata: { time: new Date().toISOString() },
      },
    }],
  });
}

export async function initMartech(config = {}) {
  console.assert(config.datastreamId || config.edgeConfigId, 'Please set your "datastreamId" for the WebSDK config.');
  console.assert(config.orgId, 'Please set your "orgId" for the WebSDK config.');
  initAlloyQueue();
  initDatalayer();
  const loadedPromise = configureAlloy({
    ...getDefaultAlloyConfiguration(),
    ...config,
  });
  loadedPromise
    .then(getAndApplyRenderDecisions);
  return loadedPromise;
}

export async function activateDataLayer() {
  await reportShownRenderDecisions();
  return loadDataLayer();
}
