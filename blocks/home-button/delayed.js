/* eslint-disable no-unused-vars, no-undef */
function loadHome() {
  document.querySelector('.screens-sequence-carousel-container').style.display = 'block';
  document.querySelector('.kiosk-cards-container').style.display = 'none';
  resetCart();
  hideMoreDetailOverlay();
  hideCartOverlay();
}
