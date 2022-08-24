/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createTabs } from '../tabs/tabs.js';

/**
 * @param {HTMLElement} $block
 */
export default function decorate($block) {
  let tabs = createTabs($block);
  if (!tabs) {
    // use block content as tabs
    const $ul = document.createElement('ul');
    const $tabsContainer = $block.parentElement.parentElement;

    tabs = [...$block.children].map(($tabContent, idx) => {
      const name = `tab${idx}`;
      const $li = document.createElement('li');
      $ul.appendChild($li);
      $li.textContent = name;

      const $el = document.createElement('div');
      $el.classList.add('tab-item');
      $el.append(...$tabContent.children);
      $el.classList.add('hidden');
      $tabsContainer.append($el);
      $tabContent.remove();

      return {
        name,
        $content: $el,
        $tab: $li,
      };
    });
    // move $ul below section div
    $block.replaceChildren($ul);
  }

  tabs.forEach((tab, index) => {
    const { $tab, name } = tab;
    $tab.addEventListener('click', () => {
      const $activeButton = $block.querySelector('li.active');
      if ($activeButton !== $tab) {
        $activeButton.classList.remove('active');
        $tab.classList.add('active');

        tabs.forEach((t) => {
          if (name === t.name) {
            t.$content.classList.remove('hidden');
          } else {
            t.$content.classList.add('hidden');
          }
        });
      }
    });

    if (index === 0) {
      $tab.classList.add('active');
      tab.$content.classList.remove('hidden');
    }
  });

  // move switchers at the end of the carousel-container
  const $wrapper = $block.parentElement;
  const $container = $wrapper.parentElement;
  $container.appendChild($wrapper);
}
