let i = 0;

export default async function decorate(block, plugins) {
  const key = 'screens-zone-cell' + ++i;

  // Add the `cq-Screens-subsequence` class as this is required by the default Screens instrumentation
  block.closest('.section').classList.add('cq-Screens-subsequence');

  // Direct link embed
  if (block.childElementCount == 1 && block.firstElementChild.childElementCount === 1) {
    const src = block.firstElementChild.firstElementChild.textContent;
    block.innerHTML = `<iframe id="${key}" src="${src}"><iframe>`;
  } else { // Map config
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', key);
    if (plugins.screens) { // Apply screens sequence item config
      plugins.screens.decorateSequenceItem(block, iframe);
    }
  }
  
}
