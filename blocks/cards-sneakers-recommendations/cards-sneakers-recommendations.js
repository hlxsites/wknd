import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { collectionName } from '../../scripts/collection-name.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const liWrapper = document.createElement('div');
    liWrapper.className = 'cards-sneakers-recommendations-card-root';
    liWrapper.innerHTML = row.innerHTML;
    [...liWrapper.children].forEach((div) => {
      div.innerHTML = div.innerHTML.replace(/COLLECTION_NAME_PLACEHOLDER/g, collectionName);

      if (div.querySelector('picture')) {
        const newDiv = document.createElement('div');
        newDiv.className = 'cards-sneakers-recommendations-card-image';
        const picture = div.querySelector('picture');
        const anchor = div.querySelector('a');
        anchor.className = 'cards-sneakers-recommendations-card-image-anchor';
        anchor.innerHTML = '';
        anchor.append(picture);
        newDiv.append(anchor);
        liWrapper.removeChild(div);
        liWrapper.prepend(newDiv);
      }
      else {
        // Add classes to children
        div.children[0].className = 'cards-sneakers-recommendations-card-collection-name';
        div.children[1].className = 'cards-sneakers-recommendations-card-title';
        div.children[2].className = 'cards-sneakers-recommendations-card-stars-price-container';
      }
    });
    li.appendChild(liWrapper);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '250' }])));
  block.textContent = '';
  block.append(ul);
}
