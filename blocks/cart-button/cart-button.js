import { loadScript } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  [...block.firstElementChild.children][0].textContent = 'Cart';
  [...block.firstElementChild.children][0].setAttribute('onclick', 'showCart()');
}
loadScript('/blocks/cart-button/delayed.js', { type: 'text/javascript', charset: 'UTF-8' });
