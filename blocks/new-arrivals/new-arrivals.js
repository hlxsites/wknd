/**
 * @param {HTMLElement} $block
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`new-arrivals`);
}

