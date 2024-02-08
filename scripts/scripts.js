import {
  sampleRUM,
  buildBlock,
  getAllMetadata,
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
} from './lib-franklin.js';
import {
  initAnalyticsTrackingQueue,
  setupAnalyticsTrackingWithAlloy,
} from './analytics/lib-analytics.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

// add only those urls you need in LCP
const PRECONNECTION_DOMAINS = [/* 'https://edge.adobedc.net' */];

const MAPPING_PREFIX = '_sitesinternal';
const COOKIE_MAPPING_TO_SCHEMA = {
  funnelstate: 'Funnelstate',
};

const EVENT_TYPE_PROPOSITION_INTERACTION = 'propositionInteraction';

const KEY_ECID = 'ecid';

let alloyLoader;
// Define the custom audiences mapping for experience decisioning
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  'new-visitor': () => !localStorage.getItem('franklin-visitor-returning'),
  'returning-visitor': () => !!localStorage.getItem('franklin-visitor-returning'),
};

const aepConfig = {
  edgeConfigId: '2324184b-260b-4d66-a8ca-897ab9374fb3',
  orgId: '908936ED5D35CC220A495CD4@AdobeOrg',
  isConsentGiven: () => true,
  alloyLoadPromise: alloyLoader,
  segmentsNameMap: '/cache/aep-segments.json',
};

window.hlx.plugins.add('rum-conversion', {
  url: '/plugins/rum-conversion/src/index.js',
  load: 'lazy',
});

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length,
  options: { audiences: AUDIENCES, aepConfig },
  load: 'eager',
  url: '/plugins/experimentation/src/index.js',
});

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
  await alloyLoader;
  console.log('logEventAlloy {}', eventType);
  const context = {
    identityMap: {
      ECID: [
        {
          id: ecid,
          primary: true,
        },
      ],
    },
  };

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
  await alloyLoader;
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
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  establishPreConnections();
  decorateTemplateAndTheme();

  await window.hlx.plugins.run('loadEager');

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

  window.hlx.plugins.run('loadLazy');
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    return import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  initAnalyticsTrackingQueue();
  alloyLoader = setupAnalyticsTrackingWithAlloy(document, getDatastreamConfiguration());
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  if (document.location.href.includes('products')) {
    const ecid = await getEcid();
    await sendAlloyEvents('display', ecid);
  }
  loadDelayed();
}

loadPage();
