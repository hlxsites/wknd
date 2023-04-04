export default async function decorate(block, plugins) {
  // Direct link embed
  if (block.childElementCount == 1 && block.firstElementChild.childElementCount === 1) {
    block.innerHTML = block.firstElementChild.firstElementChild.innerHTML;
  } else { // Map config
    if (plugins.screens) { // Apply screens sequence item config
      plugins.screens.decorateSequenceItem(block);
    }
  }
}
