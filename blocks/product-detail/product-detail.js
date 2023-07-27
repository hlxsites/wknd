import { onNavigate } from '../../scripts/scripts.js';

let isLoading = false;
// const renderSkeleton = () => document.createElement('div');
const backButtonClick = () => {
  const productListing = document.getElementsByClassName('product-listing')[0];
  productListing.setAttribute('update', true);
  onNavigate('product-listing-container');
};

const homeButtonClick = () => {
  onNavigate('category-container');
};

const navigationButton = (className, url, callback, alt) => {
  const navigationBtn = document.createElement('div');
  navigationBtn.className = className;
  const btnSVG = new Image();
  btnSVG.src = url;
  btnSVG.alt = alt || 'btn';
  navigationBtn.append(btnSVG);
  const btnText = document.createElement('div');
  btnText.textContent = alt;
  navigationBtn.append(btnText);
  navigationBtn.addEventListener('click', callback);
  return navigationBtn;
};

const renderProduct = (target, product) => {
  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';
  const productTitle = document.createElement('div');
  productTitle.textContent = product.name;
  const productImgDiv = document.createElement('div');
  productImgDiv.className = 'product-info-img';
  const productImg = new Image();
  productImg.src = product.image.url;
  productImg.alt = 'product-info-img';
  productImgDiv.append(productImg);
  productInfo.append(productTitle);
  productInfo.append(productImgDiv);
  target.textContent = '';
  const backButtonDiv = navigationButton('back-btn', 'https://main--wknd--hlxscreens.hlx.live/screens-demo/left-arrow-svgrepo-com.svg', backButtonClick, 'BACK');
  const homeButtonDiv = navigationButton('home-btn', 'https://main--wknd--hlxscreens.hlx.live/screens-demo/home-icon-silhouette-svgrepo-com.svg', homeButtonClick, 'HOME');
  target.append(backButtonDiv);
  target.append(homeButtonDiv);
  target.append(productInfo);
};

const observer = new MutationObserver((mutations) => {
  Promise.all(mutations.map(async (mutation) => {
    if (mutation.type === 'attributes') {
      console.log('Mutation target', mutation.target);
      const productSKU = mutation.target.getAttribute('sku');
      const product = mutation.target.dataset?.object && JSON.parse(mutation.target.dataset.object);
      if (!productSKU || !product) return;
      if (isLoading) {
        console.log('returning subsequent calls');
        return;
      }
      // renderSkeleton(product);
      // fetch data
      isLoading = true;
      // fetch from graphql apis
      const response = product;
      console.log(response);
      renderProduct(mutation.target, response);
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
