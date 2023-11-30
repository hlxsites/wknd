import {
  sampleRUM,
  buildBlock,
  getMetadata,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  loadScript,
  toCamelCase,
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
const CUSTOM_SCHEMA_NAMESPACE = '_sitesinternal';
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

// add only those urls you need in LCP
const PRECONNECTION_DOMAINS = ['https://edge.adobedc.net'];

const PHOTOSHOP_SEGMENT_ID = '609b90e4-5306-4c37-b64b-e3026ad1f768';
const FUNNEL_STATE_ELAPSED_SEGMENT_ID = 'a44525f4-e115-41d3-a650-eaad3fa2a458';

const MAPPING_PREFIX = '_sitesinternal';
const COOKIE_MAPPING_TO_SCHEMA = {
  funnelstate: 'Funnelstate',
};

const EVENT_TYPE_PROPOSITION_INTERACTION = 'propositionInteraction';

const KEY_ECID = 'ecid';

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

async function getSegmentsFromAlloy() {
  if (!window.alloy) {
    return [];
  }
  if (window.rtcdpSegments) {
    return window.rtcdpSegments;
  }
  await window.alloyLoader;
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

// Define the custom audiences mapping for experience decisioning
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  'new-visitor': () => !localStorage.getItem('franklin-visitor-returning'),
  'returning-visitor': () => !!localStorage.getItem('franklin-visitor-returning'),
  'funnel-state-lapsed': async () => {
    const segments = await getSegmentsFromAlloy();
    return segments.includes(FUNNEL_STATE_ELAPSED_SEGMENT_ID)
      && segments.includes(PHOTOSHOP_SEGMENT_ID);
  },
  photoshop: async () => {
    const segments = await getSegmentsFromAlloy();
    return segments.includes(PHOTOSHOP_SEGMENT_ID)
      && !segments.includes(FUNNEL_STATE_ELAPSED_SEGMENT_ID);
  },
};

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
export function getAllMetadata(scope) {
  return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
    .reduce((res, meta) => {
      const id = toClassName(meta.name
        ? meta.name.substring(scope.length + 1)
        : meta.getAttribute('property').split(':')[1]);
      res[id] = meta.getAttribute('content');
      return res;
    }, {});
}

// Define an execution context
const pluginContext = {
  getAllMetadata,
  getMetadata,
  loadCSS,
  loadScript,
  sampleRUM,
  toCamelCase,
  toClassName,
};

/**
 * Determine if we are serving content for the block-library, if so don't load the header or footer
 * @returns {boolean} True if we are loading block library content
 */
export function isBlockLibrary() {
  return window.location.pathname.includes('block-library');
}

/**
 * Convience method for creating tags in one line of code
 * @param {string} tag Tag to create
 * @param {object} attributes Key/value object of attributes
 * @param {HTMLElement | HTMLElement[] | string} children Child element
 * @returns {HTMLElement} The created tag
 */
export function createTag(tag, attributes, children) {
  const element = document.createElement(tag);
  if (children) {
    if (children instanceof HTMLElement
      || children instanceof SVGElement
      || children instanceof DocumentFragment) {
      element.append(children);
    } else if (Array.isArray(children)) {
      element.append(...children);
    } else {
      element.insertAdjacentHTML('beforeend', children);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      element.setAttribute(key, val);
    });
  }
  return element;
}

function buildHeroBlock(main) {
  const h1 = main.querySelector('main > div > h1');
  const picture = main.querySelector('main > div > p > picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function patchDemoBlocks(config) {
  if (window.wknd.demoConfig.blocks && window.wknd.demoConfig.blocks[config.blockName]) {
    const url = window.wknd.demoConfig.blocks[config.blockName];
    const splits = new URL(url).pathname.split('/');
    const [, owner, repo, , branch] = splits;
    const path = splits.slice(5).join('/');

    const franklinPath = `https://little-forest-58aa.david8603.workers.dev/?url=https://${branch}--${repo}--${owner}.hlx.live/${path}`;
    return {
      ...config,
      jsPath: `${franklinPath}/${config.blockName}.js`,
      cssPath: `${franklinPath}/${config.blockName}.css`,
    };
  }
  return (config);
}

async function loadDemoConfig() {
  const demoConfig = {};
  const pathSegments = window.location.pathname.split('/');
  if (window.location.pathname.startsWith('/drafts/') && pathSegments.length > 4) {
    const demoBase = pathSegments.slice(0, 4).join('/');
    const resp = await fetch(`${demoBase}/theme.json?sheet=default&sheet=blocks&`);
    if (resp.status === 200) {
      const json = await resp.json();
      const tokens = json.data || json.default.data;
      const root = document.querySelector(':root');
      tokens.forEach((e) => {
        root.style.setProperty(`--${e.token}`, `${e.value}`);
        demoConfig[e.token] = e.value;
      });
      demoConfig.tokens = tokens;
      demoConfig.demoBase = demoBase;
      const blocks = json.blocks ? json.blocks.data : [];
      demoConfig.blocks = {};
      blocks.forEach((block) => {
        demoConfig.blocks[block.name] = block.url;
      });

      window.hlx.patchBlockConfig.push(patchDemoBlocks);
    }

    if (!demoConfig.demoBase) {
      const navCheck = await fetch(`${demoBase}/nav.plain.html`);
      if (navCheck.status === 200) {
        demoConfig.demoBase = demoBase;
      }
    }
  }
  window.wknd = window.wknd || {};
  window.wknd.demoConfig = demoConfig;
}

function updateAlloyEventWithCookieData(schema, mapping) {
  const cookieData = document.cookie.split(';').reduce((res, item) => {
    const [key, val] = item.split('=');
    res[key.trim()] = val;
    return res;
  }, {});
  Object.keys(cookieData).forEach((key) => {
    const mappedKey = mapping[key];
    if (mappedKey && schema.xdm[MAPPING_PREFIX]) {
      schema.xdm[MAPPING_PREFIX][mappedKey] = cookieData[key];
    }
  });
}

export async function sendAlloyEvents(eventType, ecid, experimentId, treatmentId) {
  if (!window.alloy) {
    return;
  }
  await window.alloyLoader;
  console.log('logEventAlloy {}', eventType);
  const context = ecid ? {
    identityMap: {
      ECID: [
        {
          id: ecid,
          primary: true,
        },
      ],
    },
  } : { identityMap: {} };

  const schema = {
    xdm: {
      eventType,
      identityMap: context.identityMap,
      _sitesinternal: {
        Interests: 'sports',
        Entitlements: 'photoshop',
      },
      person: {
        country: 'us',
      },
    },
  };
  if (experimentId && treatmentId) {
    schema.xdm.eventType = EVENT_TYPE_PROPOSITION_INTERACTION;
    // eslint-disable-next-line no-underscore-dangle
    schema.xdm._experience = {
      decisioning: {
        propositionEventType: eventType,
        propositions: [
          {
            scopeDetails: {
              strategies: [
                {
                  strategyID: experimentId,
                  step: 'experimentation',
                  treatmentID: treatmentId,
                },
              ],
            },
          },
        ],
      },
    };
  }
  updateAlloyEventWithCookieData(schema, COOKIE_MAPPING_TO_SCHEMA);
  console.log(schema);
  // eslint-disable-next-line no-undef
  alloy('sendEvent', schema);
}

export async function getEcid() {
  if (!window.alloy) {
    return '';
  }
  await window.alloyLoader;
  let ecid = localStorage.getItem(KEY_ECID);
  if (ecid) {
    return ecid;
  }
  // eslint-disable-next-line no-undef
  const alloyResult = await alloy('getIdentity');
  ecid = alloyResult.identity.ECID;
  localStorage.setItem(KEY_ECID, ecid);
  return ecid;
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);

  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

function establishPreConnections() {
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
    edgeConfigId: '2324184b-260b-4d66-a8ca-897ab9374fb3',
    orgId: '908936ED5D35CC220A495CD4@AdobeOrg',
  };
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
 * Enhance all events with additional details, like experiment running,
 * before sending them to the edge
 * @param options event in the XDM schema format
 */
function enhanceAnalyticsEvent(options) {
  const experiment = getExperimentDetails();
  options.xdm[CUSTOM_SCHEMA_NAMESPACE] = {
    ...options.xdm[CUSTOM_SCHEMA_NAMESPACE],
    ...(experiment && { experiment }), // add experiment details, if existing, to all events
  };
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
    defaultConsent: 'in',
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
 * Initializes event queue for analytics tracking using alloy
 * @returns {Promise<void>}
 */
export async function initAnalyticsTrackingQueue() {
  createInlineScript(document, document.body, getAlloyInitScript(), 'text/javascript');
}

/**
 * Loads alloy library
 */
export async function loadAlloy(document) {
  await import('./alloy.min.js');
  // eslint-disable-next-line no-undef
  await alloy('configure', getAlloyConfiguration(document));
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  establishPreConnections();
  decorateTemplateAndTheme();
  await initAnalyticsTrackingQueue();
  window.alloyLoader = loadAlloy(doc);

  // Run experience decisioning plugin
  if (getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length) {
    // eslint-disable-next-line import/no-relative-packages, import/no-cycle
    const { loadEager: runEager } = await import('../plugins/experience-decisioning/src/index.js');
    await runEager.call(pluginContext, { audiences: AUDIENCES });
  }

  // load demo config
  await loadDemoConfig();

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  if (!isBlockLibrary()) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  if (window.wknd.demoConfig.fonts) {
    const fonts = window.wknd.demoConfig.fonts.split('\n');
    fonts.forEach(async (font) => {
      const [family, url] = font.split(': ');
      const ff = new FontFace(family, `url('${url}')`);
      await ff.load();
      document.fonts.add(ff);
    });
  } else {
    loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  }
  addFavIcon(`${window.wknd.demoConfig.demoBase || window.hlx.codeBasePath}/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  // Mark customer as having viewed the page once
  localStorage.setItem('franklin-visitor-returning', true);

  const context = {
    getMetadata,
    toClassName,
  };
  // eslint-disable-next-line import/no-relative-packages
  const { initConversionTracking } = await import('../plugins/rum-conversion/src/index.js');
  await initConversionTracking.call(context, document);

  // Load experience decisioning overlay logic
  if ((getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length)
    && (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.hlx.page'))) {
    // eslint-disable-next-line import/no-relative-packages, import/no-cycle
    const { loadLazy: runLazy } = await import('../plugins/experience-decisioning/src/index.js');
    await runLazy.call(pluginContext, { audiences: AUDIENCES });
  }
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  if (document.location.href.includes('products')) {
    const ecid = await getEcid();
    await sendAlloyEvents('display', ecid);
  }
  const { setupAnalyticsTrackingWithAlloy, initializeAnalyticsTracking } = await import('./analytics/lib-analytics.js');
  const setupAnalytics = setupAnalyticsTrackingWithAlloy(document);
  loadDelayed();
  await setupAnalytics;
  await initializeAnalyticsTracking();
}

loadPage();
