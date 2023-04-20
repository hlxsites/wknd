function loadHome()
{
    var sequence = document.querySelector(".screens-sequence-carousel-container").style.display="block";
    document.querySelector(".kiosk-cards-container").style.display="none";
    resetCart();
    hideMoreDetailOverlay();
    hideCartOverlay();
}