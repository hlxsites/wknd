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
const orders = [];

export default (main, {
  buildAutoBlocks,
  decorateBlocks,
  decorateButtons,
  decorateSections,
  loadBlocks,
}) => {
  // Add a global click listener
  document.addEventListener('click', async (ev) => {
    const card = ev.target.closest('.cards-card-body');
    if (!card && !ev.target.classList.contains('button')) {
      return;
    }

    // handle clicks on the cards to mark them selected
    if (card) {
      card.closest('.block').querySelectorAll('.selected').forEach((c) => c.classList.remove('selected'));
      card.classList.toggle('selected');
      return;
    }

    // handle clicks on the navigation buttons
    ev.preventDefault();

    const button = ev.target;
    if (window.location.pathname === '/screens/kiosk-choice' && button.classList.contains('primary')) {
      const products = [...main.querySelectorAll('.selected')].map((c) => ({
        icon: c.querySelector('.icon').classList[1].split('icon-')[1],
        label: c.textContent,
      }));
      if (!products.length) {
        return;
      }
      orders.push(products);
      localStorage.setItem('we-cafe.kiosk.orders', JSON.stringify(orders));
    } else if (window.location.pathname === '/screens/kiosk-order' && button.classList.contains('primary')) {
      orders.length = 0;
      localStorage.setItem('we-cafe.kiosk.orders', JSON.stringify(orders));
      window.alert('Order was successful!');
    }

    const url = new URL(button.href);
    const response = await fetch(`${url.pathname}.plain.html`);
    if (!response.ok) {
      console.error(response);
    }
    const html = await response.text();
    const div = document.createElement('div');
    div.innerHTML = html;
    buildAutoBlocks(div);
    decorateButtons(div);
    decorateSections(div);
    decorateBlocks(div);
    await loadBlocks(div);
    main.innerHTML = div.innerHTML;
    window.history.pushState(null, null, url.pathname);
  });
};
