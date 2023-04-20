function playCarousel(currentIndex){
    var sequence = document.querySelector(".screens-sequence-carousel");
   [...sequence.children].forEach((row) => {
            row.style.display="none";
    });
    
    if(currentIndex===sequence.children.length-1){
        currentIndex=0;
    }
    else
        currentIndex+=1;
    sequence.children[currentIndex].style.display = "block";
    setTimeout(() => {
        playCarousel(currentIndex);
    }, 5000);
}
playCarousel(0);