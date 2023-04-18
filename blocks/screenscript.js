var itemInCard = 0;

function showItemCard()
{
    var sequence = document.querySelector(".screens-sequence-carousel-wrapper");
    sequence.style.display="none";
    document.querySelector(".place-order-button").style.display="none";
    document.querySelector(".home-button").style.display="block";
    document.querySelector(".kiosk-cards-wrapper").style.display="block";
    document.querySelector(".cart-button").style.display="block";
}

function loadHome()
{
    var sequence = document.querySelector(".screens-sequence-carousel-wrapper");
    sequence.style.display="block";
    document.querySelector(".place-order-button").style.display="block";
    document.querySelector(".kiosk-cards-wrapper").style.display="none";
    document.querySelector(".home-button").style.display="none";
    document.querySelector(".cart-button").style.display="none";
    itemInCard = 0;
    document.querySelector(".cart-button").children[0].children[0].textContent = 'cart ('+itemInCard+')';
    document.getElementById("qrOverlay").style.display = "none";
}

function hideCards(){
    document.querySelector(".kiosk-cards-wrapper").style.display="none";
}

function playCarousel(currentIndex,wipeAll){
    var sequence = document.querySelector(".screens-sequence-carousel");
    if(wipeAll){
        [...sequence.children].forEach((row) => {
            row.style.display="none";
        });
    }
    if(currentIndex===sequence.children.length-1){
        currentIndex=0;
    }
    else
        currentIndex+=1;
    sequence.children[currentIndex].style.display = "block";
    setTimeout(() => {
        playCarousel(currentIndex,wipeAll);
    }, 5000);
}
function showMoreDetails(key){
    let myMap = new Map([
        ['bagpack', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['helmet', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['skiingshoes', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['surfboard', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['gloves', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4'],
        ['alpineskis', 'https://main--wknd--ravverma.hlx.page/media_1179bfe02cad5dfe335de888f7ea4f233e4d9dfce.mp4']
      ]);
    var src = myMap.get('bagpack'); 
    document.getElementById("moreDetailOverlay").innerHTML='<div class="overlay-content-more-detail"><video src='+src+' autoplay loop "></video> <span class="overlay-close" onclick="hideMoreDetailOverlay()">&#10006;</span></div>';
    document.getElementById("moreDetailOverlay").style.display = "flex";
    hideQROverlay();    
}

function addToCart(){
    itemInCard++;
    document.querySelector(".cart-button").children[0].children[0].textContent = 'cart ('+itemInCard+')';
    //alert("Item added to cart, now total items are "+itemInCard);
}

function showQR(data){
    var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(data) + "&size=200x200";
    // Set QR code image URL
    document.getElementById("qrCode").src = qrCodeUrl;
    // Show overlay
    document.getElementById("qrOverlay").style.display = "flex";
    hideMoreDetailOverlay();
}
  // Function to hide QR overlay
function hideQROverlay() {
    // Hide overlay
    document.getElementById("qrOverlay").style.display = "none";
  }

function hideMoreDetailOverlay() {
    // Hide overlay
    document.getElementById("moreDetailOverlay").style.display = "none";
  }

function createQROverLay(){
    var QrDiv = document.createElement('div');
    QrDiv.innerHTML='<div class=\"overlay\" id=\"qrOverlay\"> <div class=\"overlay-content\"> <span class=\"overlay-close\" onclick=\"hideQROverlay()\">&#10006;</span> <h2>Order Here</h2> <img src=\"\" alt=\"QR Code\" id=\"qrCode\" class=\"qr-code\"></div></div>';
    document.querySelector('main').append(QrDiv);
    hideQROverlay();   
  }

function createMoreDetailOverLay(){
    var QrDiv = document.createElement('div');
    QrDiv.innerHTML='<div class=\"overlay\" id=\"moreDetailOverlay\"></div>';
    document.querySelector('main').append(QrDiv);
    hideMoreDetailOverlay();
}