// import { request as graphqlRequest } from 'graphql-request';
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

import decoratePolarisAssets from './lib-polaris.js';
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
  return window.location.pathname.includes('block-library') || window.location.pathname.includes('screens-demo');
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
  decoratePolarisAssets(main);
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
  document.querySelector('header').remove();
  loadDelayed();
}

loadPage();

/* async function getMenuItems(menuName) {
    try {
      const response = await fetch('http://localhost:3000/screens-demo/product-list.json');
      const data = await response.json();
      const menuData = data[menuName].data;
      return menuData;
    } catch (error) {
      console.log('Error:', error);
    }
  } */

// Orchestrator

export function onNavigate(pathName) {
  // window.history.pushState(
  //   {},
  //   pathName,
  //   window.location.origin + pathName
  // )
  const allSections = document.getElementsByClassName('section');
  console.log(allSections);
  // eslint-disable-next-line no-restricted-syntax
  for (const item of allSections) {
    item.classList.remove('displaySection');
  }
  const section = document.getElementsByClassName(`section ${pathName}`);
  console.log(section, pathName);
  // eslint-disable-next-line no-unused-expressions
  section && section.length > 0 && section[0].classList.add('displaySection');
}

// export function sendAnalyticsEvent() {
//   const data = {
//     'event.type': 'play',
//     'event.coll_dts': '2023-07-26T08:04:21.759Z',
//     'event.dts_start': '2023-07-26T08:04:21.759Z',
//     'content.type': 'IMAGE',
//     'content.action': '/content/dam/6thfloor-do-not-delete/Recognitions-3.png',
//     'trn.product': '/content/dam/6thfloor-do-not-delete/Recognitions-3.png',
//     'trn.amount': 0,
//     'event.dts_end': '2023-07-26T08:08:47.495Z',
//     'event.count': 265736,
// eslint-disable-next-line max-len
//     'event.value': 'Started Wed Jul 26 2023 13:34:21 GMT+0530 (India Standard Time) ended Wed Jul 26 2023 13:38:47 GMT+0530 (India Standard Time) Duration 265 seconds',
//     'trn.quantity': 265736,
//     'event.subtype': 'end',
//   };
//   window.parent.postMessage(JSON.stringify({
//     namespace: 'screens-player',
//     type: 'analytics-tracking-event',
//     data,
//   }));
// }

/*
  // Access and process each JSON object
      for (const key in data) {
        console.log(key);
        if (typeof data[key] === 'object' && Array.isArray(data[key].data)) {
          data[key].data.forEach(obj => {
            console.log('Product Name:', obj.product_name);
            console.log('Price:', obj.price);
            console.log('------------------');
          });
        }
      } */

// export function getItems(categoryId) {
//   const url = 'https://venia.magento.com/graphql'; // Replace with your GraphQL endpoint
//   const headers = {
//     // Add any custom headers you need, like authorization headers, etc.
//     Authority: 'venia.magento.com',
//     Store: 'wknd',
//     'Content-type': 'application/json',
//   };
//   const dataRaw = `
//   query{
//     products(filter: { category_uid: { eq: ${categoryId}} }) {
//       items {
//         name
//         sku
//         url_key
//         is_returnable
//         image {
//           label
//           url
//         }
//         small_image{
//           label
//           url
//         }
//         swatch_image
//         price_range{
//         maximum_price{
//           final_price{
//             currency
//             value
//           }
//         }
//         minimum_price{
//           final_price{
//             currency
//             value
//           }
//         }
//         }
//       }
//         page_info {
//           current_page
//           page_size
//           total_pages
//         }
//         total_count
//       }
//     }
//   `;
//   return graphqlRequest(url, dataRaw, null, headers)
//     .then((response) => {
//       if (!response) {
//         throw new Error('Network response was not ok');
//       }
//       return response;
//     })
//     .catch((error) => {
//       console.error('Error making the GraphQL request:', error.message);
//     });
// }
