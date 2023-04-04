import { toClassName } from '/scripts/lib-franklin.js';

export default async function decorate(block) {
  // Direct link embed
  if (block.childElementCount == 1 && block.firstElementChild.childElementCount === 1) {
    block.innerHTML = block.firstElementChild.firstElementChild.innerHTML;
  } else { // Map config
    const config = [...block.children].reduce((config, div) => {
      const key = toClassName(div.children[0].textContent);
      const value = div.children[1];
      return {
        ...config,
        [key]: value
      }
    }, {});
    let content;
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'content' && value) {
        content = value;
      } else if (key === 'style' || key === 'class') {
        value.textContent.split(',').forEach((style) => block.classList.add(toClassName(style)));
      } else {
        block.setAttribute(`data-${key}`, value.textContent.toLowerCase());
      }
    });
    block.innerHTML = content.innerHTML;
  }
}
