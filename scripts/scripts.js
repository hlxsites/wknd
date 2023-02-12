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
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

// Define the custom audiences mapping for experimentation
const EXPERIMENTATION_CONFIG = {
  audiences: {
    device: {
      mobile: () => window.innerWidth < 600,
      desktop: () => window.innerWidth >= 600,
    },
    visitor: {
      new: () => !localStorage.getItem('franklin-visitor-returning'),
      returning: () => !!localStorage.getItem('franklin-visitor-returning'),
    },
  },
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

async function loadDemoConfig() {
  const demoConfig = {};
  const pathSegments = window.location.pathname.split('/');
  if (window.location.pathname.startsWith('/drafts/') && pathSegments.length > 4) {
    const demoBase = pathSegments.slice(0, 4).join('/');
    const resp = await fetch(`${demoBase}/theme.json`);
    if (resp.status === 200) {
      const json = await resp.json();
      const tokens = json.data;
      const root = document.querySelector(':root');
      tokens.forEach((e) => {
        root.style.setProperty(`--${e.token}`, `${e.value}`);
        demoConfig[e.token] = e.value;
      });
      demoConfig.tokens = tokens;
      demoConfig.demoBase = demoBase;
    }
  }
  window.wknd = window.wknd || {};
  window.wknd.demoConfig = demoConfig;
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

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  // load experiments
  const experiment = toClassName(getMetadata('experiment'));
  const instantExperiment = getMetadata('instant-experiment');
  if (instantExperiment || experiment) {
    const { runExperiment } = await import('./experimentation/index.js');
    await runExperiment(experiment, instantExperiment, EXPERIMENTATION_CONFIG);
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

  // Load experimentation preview overlay
  if (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.hlx.page')) {
    const preview = await import(`${window.hlx.codeBasePath}/tools/preview/preview.js`);
    await preview.default();
    if (window.hlx.experiment) {
      const experimentation = await import(`${window.hlx.codeBasePath}/tools/preview/experimentation.js`);
      experimentation.default();
    }
  }

  // Mark customer as having viewed the page once
  localStorage.setItem('franklin-visitor-returning', true);
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
  loadDelayed();
}

loadPage();
