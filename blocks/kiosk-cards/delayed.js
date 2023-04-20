var itemInCard = 0;
let itemsInCart = [];
function showMoreDetails(key){
    let myMap = new Map([
        ['Bagpack', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['Skiing Helmet', 'https://main--wknd--ravverma.hlx.page/media_137760a6e81a9e96e53eadad7d262d7af421b06bc.mp4'],
        ['Skiing Shoes', 'https://main--wknd--ravverma.hlx.page/media_137760a6e81a9e96e53eadad7d262d7af421b06bc.mp4'],
        ['Surfboard', 'https://main--wknd--ravverma.hlx.page/media_1974df0c459b917c90e933519026cae2a4d05c5c9.mp4'],
        ['Gloves', 'https://main--wknd--ravverma.hlx.page/media_137760a6e81a9e96e53eadad7d262d7af421b06bc.mp4'],
        ['Alpine Skis', 'https://main--wknd--ravverma.hlx.page/media_137760a6e81a9e96e53eadad7d262d7af421b06bc.mp4']
      ]);
    var src = myMap.get(key); 
    document.getElementById("moreDetailOverlay").innerHTML='<div class="overlay-content-more-detail"><video src='+src+' autoplay loop "></video> <span class="overlay-close" onclick="hideMoreDetailOverlay()">&#10006;</span></div>';
    document.getElementById("moreDetailOverlay").style.display = "flex";
    hideCartOverlay();    
}

function addToCart(data){
    itemsInCart.push(data);
    itemInCard++;
    document.querySelector(".cart-button").children[0].children[0].textContent = 'cart ('+itemInCard+')';
    //alert("Item added to cart, now total items are "+itemInCard);
}
function createMoreDetailOverLay(){
    var QrDiv = document.createElement('div');
    QrDiv.innerHTML='<div class=\"overlay-more-detail\" id=\"moreDetailOverlay\"></div>';
    document.querySelector('main').append(QrDiv);
    hideMoreDetailOverlay();
}
function hideMoreDetailOverlay() {
    // Hide overlay
   document.getElementById("moreDetailOverlay").style.display = "none";
  }
function hideCards(){
    document.querySelector(".kiosk-cards-container").style.display="none";
}
function resetCart(){
     itemInCard = 0;
    itemsInCart = [];
    document.querySelector(".cart-button").children[0].children[0].textContent = 'cart ('+itemInCard+')';
}
hideCards();
createMoreDetailOverLay();