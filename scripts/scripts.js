/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import {
  getMetadata,
  init,
  loadBlocks,
  setPluginOptions,
  withPlugin,
} from './lib-franklin.js';

window.isPlayerWioReady = true;
const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

const screensOptions = {
  condition: () => window.location.pathname.startsWith('/screens'),
  itemDuration: getMetadata('item-duration') || undefined,
  itemFit: getMetadata('item-fit') || undefined,
  proofOfPlay: false, // window.location.hostname.endsWith('.hlx.live'),
  type: (getMetadata('template') || 'multizone').toLowerCase(),
};

// Load the plugins for the project
setPluginOptions('decorator', { loadCssThemes: true });
await withPlugin('/plugins/perflogger/index.js');
await withPlugin('/plugins/screens/index.js', screensOptions);

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  [...main.querySelectorAll('p>picture:only-child')].forEach((picture) => {
    const p = picture.parentElement;
    const div = p.parentElement;
    const index = [...div.children].indexOf(p);
    if (index > div.children) {
      div.appendChild(picture);
    } else {
      div.insertBefore(picture, div.children[index]);
    }
    p.remove();
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
async function decorateMain(main) {
  buildAutoBlocks(main);
  this.plugins.decorator.decorateButtons(main);

  if (document.body.classList.contains('kiosk')) {
    const kiosk = await import('./kiosk.js');
    kiosk.default(main, {
      ...this.plugins.decorator,
      buildAutoBlocks,
      loadBlocks,
    });
  }
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  const main = doc.querySelector('main');
  if (main) {
    decorateMain.call(this, main);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  // Remove any empty div from the markup to reduce the DOM size
  [...main.querySelectorAll('div:empty')].forEach((div) => div.remove());
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
async function loadDelayed() {
  // load anything that can be postponed to the latest here
}

init({
  loadEager,
  loadLazy,
  loadDelayed,
  lcpblocks: LCP_BLOCKS,
});
