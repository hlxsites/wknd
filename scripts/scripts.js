import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  createOptimizedPicture,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = ['parallax']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
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
    const isApp = toClassName(getMetadata('template')) === 'app';
    if (isApp) {
      // setup badges
      const badges = main.querySelectorAll('a[href$="#menu-item"]');
      badges.forEach((b) => {
        const container = b.closest('.button-container') || b.parentElement;
        container.classList.remove('button-container');
        container.classList.add('badge-container');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.innerHTML = b.innerHTML;
        b.replaceWith(badge);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
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

  const isApp = toClassName(getMetadata('template')) === 'app';
  if (isApp) {
    const header = document.querySelector('header');
    header.classList.add('app-header');
  }
  const sections = [...main.querySelectorAll('.section')];
  const menuItems = [];
  sections.forEach((section) => {
    const { menuItem, background, video } = section.dataset;
    if (menuItem) {
      section.id = toClassName(menuItem);
      menuItems.push(menuItem);
    }
    if (background) {
      const picture = createOptimizedPicture(background);
      picture.classList.add('section-background');
      section.prepend(picture);
    }
    if (video) {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-video';
      wrapper.innerHTML = `<video autoplay loop muted playsInline>
        <source data-src="${video}" type="video/mp4" />
      </video>`;
      section.prepend(wrapper);

      const videoObserver = new IntersectionObserver(async (entries) => {
        const observed = entries.find((entry) => entry.isIntersecting);
        if (observed) {
          const source = wrapper.querySelector('source');
          source.src = source.dataset.src;
          wrapper.querySelector('video').load();
          videoObserver.disconnect();
        }
      }, { threshold: 0 });
      videoObserver.observe(wrapper);
    }
  });
  const menuWrapper = document.createElement('div');
  const menu = buildBlock('menu', [menuItems]);
  menuWrapper.append(menu);
  sections[0].prepend(menuWrapper);

  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
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
  link.type = 'image/svg+xml';
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

  const isApp = toClassName(getMetadata('template')) === 'app';
  if (!isApp) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  } else {
    loadHeader(doc.querySelector('header'), '/drafts/fkakatie/app-nav');
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
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
