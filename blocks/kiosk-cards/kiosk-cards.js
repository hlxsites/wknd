import { createOptimizedPicture, loadScript } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    let moreDetailUrl = '';
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'kiosk-cards-card-image';
      else div.className = 'kiosk-cards-card-body';
      if (div.querySelector('.button-container')) {
        const moreDetailElement = div.querySelector('.button-container').children[0];
        moreDetailUrl = moreDetailElement.getAttribute('href');
        moreDetailUrl = moreDetailUrl.replace('./', '/');
        div.querySelector('.button-container').remove();
      }
    });
    const addTocart = document.createElement('div');
    addTocart.classList = 'add-to-cart';
    addTocart.textContent = 'Add to Cart';
    addTocart.setAttribute('onclick', 'addToCart()');
    const moreDetail = document.createElement('div');
    moreDetail.classList = 'more-details';
    moreDetail.textContent = 'More Details';
    moreDetail.setAttribute('onclick', `showMoreDetails('${moreDetailUrl}')`);
    li.appendChild(addTocart);
    li.appendChild(moreDetail);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
loadScript('/blocks/kiosk-cards/delayed.js', { type: 'text/javascript', charset: 'UTF-8' });
