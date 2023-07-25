import { onNavigate } from '../../scripts/scripts.js';

let isLoading = false;

const homeButtonClick = () => {
  onNavigate('category-container');
};

const onProductClick = (event) => {
  console.log(event.currentTarget);
  const selectedProductSKU = event.currentTarget.getAttribute('sku');
  if (!selectedProductSKU) {
    return;
  }
  const selectedProduct = event.currentTarget.dataset?.object
    && JSON.parse(event.currentTarget.dataset.object);
  console.log(selectedProductSKU, selectedProduct);
  if (!selectedProduct) return;
  const productDetail = document.getElementsByClassName('product-detail')[0];
  productDetail.textContent = '';
  productDetail.setAttribute('sku', selectedProductSKU);
  productDetail.setAttribute('data-object', JSON.stringify(selectedProduct));
  onNavigate('product-detail-container');
};

const getHeaderAndSearch = (heading) => {
  const headerDiv = document.createElement('div');
  headerDiv.className = 'header-search';
  const header = document.createElement('H1');
  const text = document.createTextNode(heading);
  header.appendChild(text);
  headerDiv.append(header);
  // search bar
  // const formContainer = document.createElement('div');
  // formContainer.className = 'form-container';
  // const form = document.createElement('form');
  // form.className = 'form';
  // const inputField = document.createElement('input');
  // inputField.setAttribute('id', 'search');
  // inputField.className = 'input';
  // const searchButton = document.createElement('button');
  // searchButton.className = 'search-results';
  // searchButton.textContent = 'search';
  // form.append(inputField);
  // form.append(searchButton);
  // formContainer.append(form);
  // headerDiv.append(formContainer);
  // Home button
  const imgDiv = document.createElement('div');
  imgDiv.className = 'home';
  const backSvg = new Image();
  backSvg.src = 'https://main--wknd--hlxscreens.hlx.live/screens-demo/left-arrow-svgrepo-com.svg';
  backSvg.alt = 'Go Back';
  imgDiv.append(backSvg);
  imgDiv.addEventListener('click', homeButtonClick);
  headerDiv.append(imgDiv);
  return headerDiv;
};

const getSkeleton = () => {
  const skeletonGrid = document.createElement('div');
  skeletonGrid.className = 'skeleton-grid';
  const times = 8;
  for (let id = 0; id < times; id += 1) {
    const skeletonDiv = document.createElement('div');
    skeletonDiv.className = 'skeleton';
    skeletonDiv.setAttribute('id', id);
    skeletonGrid.append(skeletonDiv);
  }
  return skeletonGrid;
};

const renderSkeleton = (target) => {
  const heading = target.getAttribute('category-name');
  target.textContent = '';
  target.append(getHeaderAndSearch(heading));
  target.append(getSkeleton());
};

const getDetails = (product) => {
  const details = document.createElement('div');
  details.className = 'product-details';
  const title = document.createElement('span');
  title.textContent = product.name;
  const price = document.createElement('span');
  price.textContent = `Starts at $${product.price_range.minimum_price.final_price.value}`;
  details.append(title);
  details.append(price);
  return details;
};

const getItem = (product) => {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.setAttribute('sku', product.sku);
  productDiv.setAttribute('data-object', JSON.stringify(product));
  productDiv.addEventListener('click', onProductClick);
  const imgDiv = document.createElement('div');
  imgDiv.className = 'product-img';
  imgDiv.setAttribute('id', product.sku);
  const img = new Image();
  img.src = product.image.url;
  img.alt = product.image.label;
  imgDiv.append(img);
  productDiv.append(getDetails(product));
  productDiv.append(imgDiv);
  return productDiv;
};

const renderItems = (target, products) => {
  const heading = target.getAttribute('category-name');
  target.textContent = '';
  target.append(getHeaderAndSearch(heading));
  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';
  console.log(products);
  products.forEach((product) => {
    productGrid.append(getItem(product));
  });
  target.append(productGrid);
};

const observer = new MutationObserver((mutations) => {
  Promise.all(mutations.map(async (mutation) => {
    if (mutation.type === 'attributes') {
      console.log('Mutation target', mutation.target);
      const categoryId = mutation.target.getAttribute('category-id');
      if (!categoryId) return;
      if (isLoading) {
        console.log('returning subsequent calls');
        return;
      }
      renderSkeleton(mutation.target);
      // fetch data
      isLoading = true;
      try {
        const rawResponse = await fetch(`https://main--wknd--hlxscreens.hlx.page/defaultData/${categoryId}.json`);
        if (!rawResponse.ok) {
          return;
        }
        console.log('ok response');
        // execute dom change
        const response = await rawResponse.json();
        console.log(response);
        renderItems(mutation.target, response.data.products.items);
      } catch (err) {
        console.log('loading failed');
      }
      isLoading = false;
    }
  }));
});
export default function decorate(block) {
  observer.observe(block, {
    attributes: true, // configure it to listen to attribute changes
  });
  block.textContent = '';
}
