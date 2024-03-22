let config;

/**
 * Error handler for rejected promises.
 * @param {Error} error The base error
 * @throws a decorated error that can be intercepted by RUM handlers.
 */
function handleRejectedPromise(error) {
  const [, file, line] = error.stack.split('\n')[1].trim().split(' ')[1].match(/(.*):(\d+):(\d+)/);
  error.sourceURL = file;
  error.line = line;
  throw error;
}

/**
 * Initializes a queue for the alloy instance in order to be ready to receive events before the
 * alloy library is fully loaded.
 * Documentation:
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/installing-the-sdk.html?lang=en#adding-the-code
 * @param {String} instanceName The name of the instance in the blobal scope
 */
function initAlloyQueue(instanceName) {
  // eslint-disable-next-line
  !function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,[instanceName]);;
}

/**
 * Initializes a queue for the datalayer in order to be ready to receive events before the
 * ACDL library is fully loaded.
 * Documentation:
 * https://github.com/adobe/adobe-client-data-layer/wiki#setup
 * @param {String} instanceName The name of the instance in the blobal scope
 */
function initDatalayer(instanceName) {
  window[instanceName] ||= [];
}

/**
 * Returns the default alloy configuration
 * Documentation:
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
function getDefaultAlloyConfiguration() {
  const { hostname } = window.location;

  return {
    // enable while debugging
    debugEnabled: hostname === 'localhost' || hostname.endsWith('.hlx.page') || hostname.endsWith('.aem.page'),
  };
}

/**
 * Loads the alloy library and configures it.
 * Documentation:
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 * @param {String} instanceName The name of the instance in the blobal scope
 * @param {Object} webSDKConfig The configuration to use
 * @returns a promise that the library was loaded and configured
 */
function loadAndConfigureAlloy(instanceName, webSDKConfig) {
  return import('./alloy.min.js')
    .then(() => window[instanceName]('configure', webSDKConfig))
    .catch((err) => handleRejectedPromise(new Error(err)));
}

/**
 * Runs the specified function on every decorated block/section
 * @param {Function} fn The function to call
 */
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

/**
 * Loads the ACDL library.
 * @returns the ACDL instance
 */
async function loadAndConfigureDataLayer() {
  return import('./acdl.min.js')
    .catch((err) => handleRejectedPromise(new Error(err)));
}

/**
 * Pushes data to the data layer
 * @param {Object} data the data to push
 */
export function pushToDataLayer(data) {
  // eslint-disable-next-line no-console
  console.assert(config.dataLayerInstanceName, 'Martech needs to be initialized before the `pushToDataLayer` method is called');
  window[config.dataLayerInstanceName].push(data);
}

/**
 * Sends an analytics event to alloy
 * @param xdmData - the xdm data object
 * @returns {Promise<*>}
 */
export async function sendAnalyticsEvent(xdmData) {
  // eslint-disable-next-line no-console
  console.assert(config.alloyInstanceName, 'Martech needs to be initialized before the `sendAnalyticsEvent` method is called');
  // eslint-disable-next-line no-undef
  return window[config.alloyInstanceName]('sendEvent', {
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
  // eslint-disable-next-line no-console
  console.assert(config.alloyInstanceName, 'Martech needs to be initialized before the `updateUserConsent` method is called');
  return window[config.alloyInstanceName]('setConsent', {
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

/**
 * Fetching propositions from the backend and applying the propositions as the AEM EDS page loads
 * its content async.
 * Documentation:
 * https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/personalization/rendering-personalization-content#manual
 * @param {String} instanceName The name of the instance in the blobal scope
 * @returns a promise that the propositions were retrieved and will be applied as the page renders
 */
async function applyPropositions(instanceName) {
  // Get the decisions, but don't render them automatically
  // so we can hook up into the AEM EDS page load sequence
  const renderDecisionResponse = await window[instanceName]('sendEvent', { renderDecisions: false });

  onDecoratedElement(() => window[instanceName]('applyPropositions', { propositions: renderDecisionResponse.propositions }));
  return renderDecisionResponse;
}

/**
 * Initializes the martech library.
 * Documentation:
 * https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview
 * @param {Object} webSDKConfig the WebSDK config
 * @param {Object} [martechConfig] the martech config
 * @param {String} [martechConfig.alloyInstanceName="alloy"] the WebSDK instance name in the global
 *                 scope (defaults to `alloy`)
 * @param {String} [martechConfig.dataLayerInstanceName="adobeDataLayer"] the ACDL instance name in
 *                  the global scope (defaults to `adobeDataLayer`)
 * @param {String[]} [martechConfig.launchUrls] a list of Launch configurations to load
 * @returns a promise that the library was loaded and configured
 */
let response;
export async function initMartech(webSDKConfig, martechConfig = {}) {
  // eslint-disable-next-line no-console
  console.assert(webSDKConfig?.datastreamId || webSDKConfig?.edgeConfigId, 'Please set your "datastreamId" for the WebSDK config.');
  // eslint-disable-next-line no-console
  console.assert(webSDKConfig?.orgId, 'Please set your "orgId" for the WebSDK config.');

  config = {
    alloyInstanceName: 'alloy',
    dataLayerInstanceName: 'adobeDataLayer',
    launchUrls: [],
    ...martechConfig,
  };

  initAlloyQueue(config.alloyInstanceName);
  initDatalayer(config.dataLayerInstanceName);

  return loadAndConfigureAlloy(config.alloyInstanceName, {
    ...getDefaultAlloyConfiguration(),
    ...webSDKConfig,
  })
    .then((resp) => {
      response = resp;
    });
}

/**
 * Reports the displayed propositions so they can be tracked in Analytics
 * @param {String} instanceName The name of the instance in the blobal scope
 * @param {Object[]} propositions The list of propositions that were shown
 * @returns a promise the the displayed propositions have been reported
 */
async function reportDisplayedPropositions(instanceName, propositions) {
  return window[instanceName]('sendEvent', {
    xdm: {
      eventType: 'decisioning.propositionDisplay',
      _experience: {
        decisioning: { propositions },
      },
    },
  });
}

/**
 * Martech logic to be executed in the eager phase.
 * @returns a promise that the eager logic was executed
 */
export async function martechEager() {
  // eslint-disable-next-line no-console
  console.assert(response, 'Martech needs to be initialized before the `martechEager` method is called');
  return applyPropositions('alloy');
}

/**
 * Martech logic to be executed in the lazy phase.
 * @returns a promise that the lazy logic was executed
 */
export async function martechLazy() {
  // eslint-disable-next-line no-console
  console.assert(response, 'Martech needs to be initialized before the `martechLazy` method is called');
  await reportDisplayedPropositions('alloy', response.propositions);
  return loadAndConfigureDataLayer({});
}

/**
 * Martech logic to be executed in the delayed phase.
 * @returns a promise that the delayed logic was executed
 */
export async function martechDelayed() {
  // eslint-disable-next-line no-console
  console.assert(response, 'Martech needs to be initialized before the `martechDelayed` method is called');

  const { launchUrls } = config;
  return Promise.all(launchUrls.map((url) => import(url)))
    .catch((err) => handleRejectedPromise(new Error(err)));
}
