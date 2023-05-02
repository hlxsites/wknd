/* eslint-disable no-unused-vars, no-undef */
let itemInCard = 0;
let itemsInCart = [];
function showMoreDetails(moreDetailUrl) {
  document.getElementById('moreDetailOverlay').innerHTML = `<div class="overlay-content-more-detail"><video src=${moreDetailUrl} autoplay loop "></video> <span class="overlay-close" onclick="hideMoreDetailOverlay()">&#10006;</span></div>`;
  document.getElementById('moreDetailOverlay').style.display = 'flex';
  hideCartOverlay();
}
function addToCart(data) {
  itemsInCart.push(data);
  itemInCard += 1;
  document.querySelector('.cart-button').children[0].children[0].textContent = `cart (${itemInCard})`;
  // alert("Item added to cart, now total items are "+itemInCard);
}
function hideMoreDetailOverlay() {
  // Hide overlay
  document.getElementById('moreDetailOverlay').style.display = 'none';
}
function createMoreDetailOverLay() {
  const QrDiv = document.createElement('div');
  QrDiv.innerHTML = '<div class="overlay-more-detail" id="moreDetailOverlay"></div>';
  document.querySelector('main').append(QrDiv);
  hideMoreDetailOverlay();
}
function hideCards() {
  document.querySelector('.kiosk-cards-container').style.display = 'none';
}
function resetCart() {
  itemInCard = 0;
  itemsInCart = [];
  document.querySelector('.cart-button').children[0].children[0].textContent = `cart (${itemInCard})`;
}
hideCards();
createMoreDetailOverLay();
