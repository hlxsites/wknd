const videoVisibilityObserver = new IntersectionObserver((entries) => {
  const record = entries.pop();
  const video = record.target.querySelector('video');
  if (!record.isIntersecting) {
    video.pause();
    video.currentTime = 0;
    video.load();
  }
  else {
    const promise = video.play();
    // If browser prevents playback, try playing the muted version instead
    if (promise) {
      promise.catch(() => {
        video.muted = true;
        video.play();
      });
    }
  }
}, { threshold: .8 });

// Delay instrumentation of the visibility observer after the blocks have been decorated
// and the channel is ready
window.addEventListener('message', (ev) => {
  if (!ev.data || ev.source !== window) {
    return;
  }
  try {
    const data = JSON.parse(ev.data);
    if (data.namespace !== 'screens-player' || data.type !== 'channel-status-ready') {
      return;
    }
    document.querySelectorAll('.cq-Sequence-item.video-container').forEach((block) => {
      videoVisibilityObserver.observe(block);
    });
  } catch (err) {
    // Ignore invalid messages
  }
});
window.addEventListener('beforeunload', () => videoVisibilityObserver.disconnect());

// Get the full video URL from the link in the document
function getUrl(link) {
  // Support links to public videos on google drive
  if (link.startsWith('https://drive.google.com')) {
    const videoId = link.match(/(\w+)\/view/)[1];
    return `https://drive.google.com/uc?export=download&id=${videoId}`;
  }
}

export default async function decorate(block, plugins) {
  // Direct link embed
  if (block.childElementCount == 1 && block.firstElementChild.childElementCount === 1) {
    const url = getUrl(block.firstElementChild.firstElementChild.textContent);
    block.innerHTML = `<video src="${url}" muted><video>`;
  } else { // Map config
    const video = document.createElement('video');
    if (plugins.screens) { // Apply screens sequence item config
      plugins.screens.decorateSequenceItem(block, video, {
        src: getUrl
      });
    }
  }
}
