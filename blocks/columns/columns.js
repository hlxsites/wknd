export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  if (cols[0].textContent.includes('.mp4')) {
    const videoElement = document.createElement('video');
    videoElement.setAttribute('src', cols[0].textContent);
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('loop', '');
    videoElement.style.width = '640px'; // Set the width of the video element to "640px"
    videoElement.style.height = '360px'; // Set the height of the video element to "360px"
    cols[0].appendChild(videoElement);
    cols[0].querySelector('a').style.display = 'none';
  }
  block.classList.add(`columns-${cols.length}-cols`);
}
