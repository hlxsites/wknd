import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { collectionName } from '../../scripts/collection-name.js';

const createElement = (value, doc = document) => {
  const element = doc.createElement("div");
  element.innerHTML = value;

  return element.firstElementChild;
};

const wrap = (element, target) => {
  // element and target must be given to continue
  if (!element || !target) return;

  let wrapper;

  // we give the possibility to wrap arround a given HTMLElement
  // otherwise we create it with `createElement` function
  if (typeof target === "object" && target.nodeType === 1) {
    wrapper = target;
  } else {
    wrapper = createElement(target);
  }

  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);

  return wrapper;
};

const urlColorMap = {
  "/products/airstrike-elite": 'orange',
  "/products/airstrike-elite1": 'green',
  "/products/airstrike-elite2": 'red',
  "/products/airstrike-elite3": 'blue'
}
export default function decorate(block) {
  /* change to ul, li */

  const currentPageURL = new URL(window.location.href);
  const currentProductUrl = currentPageURL.href.replace(currentPageURL.origin, '');

  const leftWrapper = document.createElement('div');
  const rightWrapper = document.createElement('div');
  rightWrapper.className='cards-details';
  leftWrapper.className='cards-info';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'cards-image';

  imageWrapper.append(block.children[0].children[0].querySelector('picture'));

  const thumbnailsWrapper = document.createElement('div');
  thumbnailsWrapper.className = 'cards-thumbnails';

  const thumnailsList = document.createElement('ul');

  block.children[0].children[0].querySelectorAll('li').forEach((child) => {
    const picture = child.querySelector('picture');
    const anchor = document.createElement('a');

    const urlObj = new URL(child.innerText);
    const pageProductURL = urlObj.href.replace(urlObj.origin, '');

    anchor.href = pageProductURL;
    anchor.className = 'cards-thumbnail-button';

    if(currentProductUrl === pageProductURL) {
      anchor.className='cards-thumbnail-button cards-thumbnail-button--active';
    }

    wrap(picture, anchor);
    thumnailsList.append(anchor);
  });

  thumbnailsWrapper.append(thumnailsList);

  block.children[0].children[1].children[0].className = 'cards-card-collection-name';
  block.children[0].children[1].children[1].className = 'cards-card-title';
  block.children[0].children[1].children[2].className = 'cards-card-price';
  block.children[0].children[1].children[3].className = 'cards-card-color';
  block.children[0].children[1].children[4].className = 'cards-card-stars-container';

  [...block.children[0].children[1].children[4].children].forEach((li) => {
    li.className = 'cards-card-stars-button';
  });

  rightWrapper.append(block.children[0].children[1]);

  block.textContent = '';
  block.innerHTML = '';
  leftWrapper.append(imageWrapper);
  leftWrapper.append(thumbnailsWrapper);


  block.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.append(leftWrapper);
  block.append(rightWrapper);


  block.querySelector('.cards-thumbnail-button').addEventListener('click', (e)=> {
    console.log('eeeee', e);
  });

  block.innerHTML = block.innerHTML.replace(/COLLECTION_NAME_PLACEHOLDER/g, collectionName);
  block.innerHTML = block.innerHTML.replace(/COLOR_NAME_PLACEHOLDER/g, `color: ${urlColorMap[currentProductUrl]}`);
}
