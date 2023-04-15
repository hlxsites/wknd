function showItemCard()
{
    var sequence = document.querySelector(".screens-sequence-carousel-wrapper");
    sequence.style.display="none";
    document.querySelector(".place-order-button").style.display="none";
    document.querySelector(".home-button").style.display="block";
    document.querySelector(".cards-wrapper").style.display="block";
    //sequence.innerHTML = "<div id=\"itemCard\" class=\"item-card\"> <h2>Item Name</h2> <p>Item description goes here.</p> </div>"
}

function loadHome()
{
    var sequence = document.querySelector(".screens-sequence-carousel-wrapper");
    sequence.style.display="block";
    document.querySelector(".place-order-button").style.display="block";
    document.querySelector(".cards-wrapper").style.display="none";
    document.querySelector(".home-button").style.display="none";
    //sequence.innerHTML = "<div id=\"itemCard\" class=\"item-card\"> <h2>Item Name</h2> <p>Item description goes here.</p> </div>"
}

function hideCards(){
    document.querySelector(".cards-wrapper").style.display="none";
}
