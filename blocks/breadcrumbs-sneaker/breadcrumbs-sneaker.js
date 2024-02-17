import { collectionName } from '../../scripts/collection-name.js';

/**
 * @param {HTMLElement} $block
 */
export default function decorate(block) {
  block.innerHTML = block.innerHTML.replace(/COLLECTION_NAME_PLACEHOLDER/g, collectionName);
}
