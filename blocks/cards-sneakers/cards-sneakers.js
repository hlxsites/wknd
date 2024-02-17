import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { collectionName } from '../../scripts/collection-name.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const liWrapper = document.createElement('div');
    liWrapper.className = 'cards-sneakers-card-root';
    liWrapper.innerHTML = row.innerHTML;
    [...liWrapper.children].forEach((div) => {
      div.innerHTML = div.innerHTML.replace(/COLLECTION_NAME_PLACEHOLDER/g, collectionName);

      if (div.querySelector('picture')) {
        const newDiv = document.createElement('div');
        newDiv.className = 'cards-sneakers-card-image';
        const picture = div.querySelector('picture');
        const anchor = div.querySelector('a');
        anchor.className = 'cards-sneakers-card-image-anchor';
        anchor.innerHTML = '';
        anchor.append(picture);
        newDiv.append(anchor);
        liWrapper.removeChild(div);
        liWrapper.prepend(newDiv);
      }
      else {
        // Remove colors from the card
        const colors = div.children[0];
        div.removeChild(div.children[0]);
        // Compute colors and prepend
        colors.className = 'cards-sneakers-card-colors';
        [...colors.children].forEach((li) => {
          li.className = 'cards-sneakers-card-color-container';
          li.style.backgroundColor = li.innerHTML;
          li.innerHTML = '';
        });
        div.prepend(colors);

        // Add classes to children
        div.children[1].className = 'cards-sneakers-card-collection-name';
        div.children[2].className = 'cards-sneakers-card-title';
        div.children[3].className = 'cards-sneakers-card-price';
        div.children[4].className = 'cards-sneakers-card-stars-container';
        div.children[5].className = 'cards-sneakers-card-stars-buttons-container';
        [...div.children[5].children].forEach((button) => {
          button.className = 'cards-sneakers-card-stars-button';
        });
      }
    });
    // Add new tag
    const newTagEl = document.createElement('div');
    newTagEl.className = 'cards-sneakers-card-collection-new-tag';
    newTagEl.innerHTML = 'New!';
    liWrapper.prepend(newTagEl);
    li.appendChild(liWrapper);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '250' }])));
  block.textContent = '';
  block.append(ul);
}
