import { createOptimizedPicture,loadScript } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    var key='';
    var moreDetailUrl='';
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'kiosk-cards-card-image';
      else div.className = 'kiosk-cards-card-body';
      if(div.querySelector('.button-container')){
        var moreDetailElement=div.querySelector('.button-container').children[0];
        moreDetailUrl=moreDetailElement.getAttribute('href');
        div.querySelector('.button-container').remove();
      }
      key=div.textContent;
    });
    const addTocart = document.createElement('div');
    addTocart.classList="kiosk-cart-button";
    addTocart.textContent="Add to Cart";
    addTocart.setAttribute("onclick",`addToCart()`);
    const moreDetail = document.createElement('div');
    moreDetail.classList="kiosk-cart-button";
    moreDetail.textContent="More Details";
    moreDetail.setAttribute("onclick",`showMoreDetails('${moreDetailUrl}')`);
    li.appendChild(addTocart);
    li.appendChild(moreDetail);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
loadScript('/blocks/kiosk-cards/delayed.js',{ type: 'text/javascript', charset: 'UTF-8' });