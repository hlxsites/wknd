import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    var key='';
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'kiosk-cards-card-image';
      else div.className = 'kiosk-cards-card-body';
      key=div.textContent;
    });
    const addTocart = document.createElement('div');
    addTocart.classList="kiosk-add-to-cart-button";
    addTocart.textContent="Add to Cart";
    addTocart.setAttribute("onclick","addToCart()");
    const moreDetail = document.createElement('div');
    moreDetail.classList="kiosk-more-detail-button";
    moreDetail.textContent="More Details";
    moreDetail.setAttribute("onclick",`showMoreDetails('${key}')`);
    li.appendChild(addTocart);
    li.appendChild(moreDetail);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
  

}
