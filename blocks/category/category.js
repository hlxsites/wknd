import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { onNavigate } from '../../scripts/scripts.js';

const onCategoryClick = (event) => {
  console.log('clicked');
  console.log(event);
  console.log(event.currentTarget);
  console.log(event.currentTarget.getAttribute('category-id'));
  const categoryId = event.currentTarget.getAttribute('category-id');
  const categoryName = event.currentTarget.getAttribute('category-name');
  // navigate and fetch data and update the blocks
  const productListing = document.getElementsByClassName('product-listing')[0];
  productListing.textContent = '';
  productListing.setAttribute('category-name', categoryName);
  productListing.setAttribute('category-id', categoryId);
  onNavigate('product-listing-container');
};

export default function decorate(block) {
  const { heading } = block.closest('.section').dataset;
  const header = document.createElement('h1');
  const text = document.createTextNode(heading);
  header.appendChild(text);
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const category = row.children[0].textContent;
    const categoryTile = document.createElement('h2');
    const tileText = document.createTextNode(category);
    categoryTile.appendChild(tileText);
    const li = document.createElement('li');
    const imgdiv = document.createElement('div');
    imgdiv.className = 'category-image';
    imgdiv.innerHTML = row.children[1].innerHTML;
    const categoryId = row.children[2].textContent;
    imgdiv.setAttribute('category-id', categoryId);
    imgdiv.setAttribute('category-name', category);
    imgdiv.addEventListener('click', onCategoryClick);
    li.appendChild(imgdiv);
    li.appendChild(categoryTile);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(header);
  block.append(ul);
}
