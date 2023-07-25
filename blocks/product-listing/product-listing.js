import { onNavigate } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
let isLoading = false;

const getHeaderAndSearch = (heading) => {
  const headerDiv = document.createElement('div');
  const header = document.createElement("H1");
  const text = document.createTextNode(heading);
  header.appendChild(text);
  headerDiv.append(header);
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  const form = document.createElement('form');
  form.className = 'form';
  const inputField = document.createElement('input');
  inputField.setAttribute('id', 'search');
  inputField.className = 'input';
  const searchButton = document.createElement('button');
  searchButton.className = 'search-results';
  searchButton.textContent = 'search';
  form.append(inputField);
  form.append(searchButton);
  formContainer.append(form);
  headerDiv.append(formContainer);
  return headerDiv;
}

const getSkeleton = () => {
  const skeletonGrid = document.createElement('div');
  skeletonGrid.className = 'skeleton-grid';
  const times = 8;
  for(let id = 0; id < times; id++){
    const skeletonDiv = document.createElement('div');
    skeletonDiv.className = 'skeleton';
    skeletonDiv.setAttribute('id', id);
    skeletonGrid.append(skeletonDiv);
  }
  return skeletonGrid;
}

const renderSkeleton = (target) => {
  const heading = target.getAttribute('category-name');
  target.textContent = '';
  target.append(getHeaderAndSearch(heading));
  target.append(getSkeleton());
}

const getItem = (product) => {
  const imgDiv = document.createElement('div');
  const img = new Image();
  img.src = product.image.url;
  img.alt = product.image.label;
  imgDiv.append(img);
  return imgDiv;
}

const renderItems = (target, products) => {
  const heading = target.getAttribute('category-name');
  target.textContent = '';
  target.append(getHeaderAndSearch(heading));
  const productGrid = document.createElement('div');
  productGrid.className = 'skeleton-grid';
  console.log(products);
  products.forEach((product) => {
    productGrid.append(getItem(product))
  })
  target.append(productGrid);
  return;
}

const observer = new MutationObserver(function(mutations) {
  Promise.all(mutations.map(async (mutation) => {
    if (mutation.type === "attributes") {
      mutation.target;
      console.log('Mutation target', mutation.target);
      renderSkeleton(mutation.target);
      // fetch data
      const categoryId = mutation.target.getAttribute('category-id');
      if(!categoryId) return;
      if(isLoading) {
        console.log('returning subsequent calls');
        return;
      }
      isLoading = true;
      const rawResponse = await fetch(`https://main--wknd--hlxscreens.hlx.page/defaultData/${categoryId}.json`);
      isLoading = false;
      if(!rawResponse.ok) {
        return;
      }
      const response = await rawResponse.json();
      console.log(response);
      renderItems(mutation.target, response.data.products.items);
      // execute dom change
    }
  }));
});
export default function decorate(block) {
  observer.observe(block, {
    attributes: true //configure it to listen to attribute changes
  });
  block.textContent = '';
}
