/**
 * @param {HTMLElement} $block
 */
export default function decorate(block) {
  const dividerDiv = document.createElement('div');
  dividerDiv.className = 'sneaker-tabs-divider';
  block.append(dividerDiv);
}
