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
export default async function decorate(block) {
  const response = await fetch('/products.json');
  if (!response.ok) {
    return;
  }
  const products = await response.json();
  [...block.children].forEach((row) => {
    const key = row.firstElementChild.textContent;
    const product = products.data.find((p) => p.Id === key);
    if (!product) {
      console.warn('Cannot find product', key);
      row.style.display = 'none';
      return;
    }
    row.innerHTML = `
      <div class="product-list-title">${product.Title}</div>
      <div class="product-list-description">${product.Description}</div>
      <div class="product-list-price">${parseFloat(product.Price).toFixed(2)}</div>
    `;
  });
}
