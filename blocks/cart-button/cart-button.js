import { loadScript } from '../../scripts/lib-franklin.js';
export default function decorate(block) {
    loadScript('/blocks/screenscript.js',{ type: 'text/javascript', charset: 'UTF-8' });
    [...block.firstElementChild.children][0].textContent="Cart";
    [...block.firstElementChild.children][0].setAttribute("onclick","showQR(\"Welcome to WKND store\")");
    block.style.display="none";
  }
