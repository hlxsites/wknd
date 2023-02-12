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

import { loadCSS } from '../../scripts/lib-franklin.js';

function createPreviewOverlay(cls) {
  const overlay = document.createElement('div');
  overlay.className = cls;
  return overlay;
}

export function createButton(label) {
  const button = document.createElement('button');
  button.className = 'hlx-badge';
  const text = document.createElement('span');
  text.innerHTML = label;
  button.append(text);
  return button;
}

function createPopupItem(item) {
  const actions = typeof item === 'object'
    ? item.actions.map((action) => `<div class="hlx-button"><a href="${action.href}">${action.label}</a></div>`)
    : [];
  const div = document.createElement('div');
  div.className = `hlx-popup-item${item.isSelected ? ' is-selected' : ''}`;
  div.innerHTML = `
    <h5 class="hlx-popup-item-label">${typeof item === 'object' ? item.label : item}</h5>
    ${item.description ? `<div class="hlx-popup-item-description">${item.description}</div>` : ''}
    ${actions.length ? `<div class="hlx-popup-item-actions">${actions}</div>` : ''}`;
  return div;
}

export function createPopupDialog(header, items = []) {
  const actions = typeof header === 'object'
    ? header.actions.map((action) => `<div class="hlx-button"><a href="${action.href}">${action.label}</a></div>`)
    : [];
  const popup = document.createElement('div');
  popup.className = 'hlx-popup hlx-hidden';
  popup.innerHTML = `
    <div class="hlx-popup-header">
      <h5 class="hlx-popup-header-label">${typeof header === 'object' ? header.label : header}</h5>
      ${header.description ? `<div class="hlx-popup-header-description">${header.description}</div>` : ''}
      ${actions.length ? `<div class="hlx-popup-header-actions">${actions}</div>` : ''}
    </div>
    <div class="hlx-popup-items"></div>`;
  const list = popup.querySelector('.hlx-popup-items');
  items.forEach((item) => {
    list.append(createPopupItem(item));
  });
  return popup;
}

export function createPopupButton(label, header, items) {
  const button = createButton(label);
  const popup = createPopupDialog(header, items);
  button.innerHTML += '<span class="hlx-open"></span>';
  button.append(popup);
  button.addEventListener('click', () => {
    popup.classList.toggle('hlx-hidden');
  });
  return button;
}

export function createToggleButton(label) {
  const button = document.createElement('div');
  button.className = 'hlx-badge';
  button.role = 'button';
  button.setAttribute('aria-pressed', false);
  button.setAttribute('tabindex', 0);
  const text = document.createElement('span');
  text.innerHTML = label;
  button.append(text);
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'false');
  });
  return button;
}

export function getOverlay() {
  let overlay = document.querySelector('.hlx-preview-overlay');
  if (!overlay) {
    overlay = createPreviewOverlay('hlx-preview-overlay');
    document.body.append(overlay);
  }
  return overlay;
}

/**
 * Decorates Preview mode badges and overlays
 * @return {Object} returns the overlay container
 */
export default function decoratePreviewOverlay() {
  loadCSS(`${window.hlx.codeBasePath}/tools/preview/preview.css`);

  getOverlay();
}
