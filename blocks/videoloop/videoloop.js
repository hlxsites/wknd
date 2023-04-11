export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    if(cols[0].textContent.includes(".mp4")){
        var url = cols[0].textContent;
        cols[0].textContent = "";
        var videoElement = document.createElement("video");
        videoElement.setAttribute("src",url);
        videoElement.setAttribute("autoplay","");
        videoElement.setAttribute("loop","");
        cols[0].appendChild(videoElement);
        cols[0].setAttribute("class","videoloop");
      }
  }