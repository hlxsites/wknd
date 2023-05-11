/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

const loadScript = async (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;

const embedDash = (url) => {
  loadScript('https://cdn.dashjs.org/latest/dash.all.min.js');
  return `
    <div style="width:600px">
      <video id="dashPlayer" controls preload="auto" style="width:100%;">
      <source src="${url}" type="application/dash+xml">
      </video>
    </div>
    `;
};

async function initHLS(manifestUri) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.8.8/hls.min.js');
  const video = document.getElementById('video');
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // native browser support
    video.src = manifestUri;
    // eslint-disable-next-line no-console
    console.log('Playing via native HLS');
  } else {
    // console.log("typeofhls = " + typeof Hls);
    // check if Hls library has been loaded
    while (typeof Hls !== 'function') {
      // eslint-disable-next-line no-console
      console.log('waiting');
      // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
      await new Promise((r) => setTimeout(r, 1000));
    }
    // eslint-disable-next-line no-undef
    const hls = new Hls();
    // console.log("typeofhls = " + typeof Hls);
    hls.loadSource(manifestUri.href);
    hls.attachMedia(video);
  }
}
const embedHLS = (url) => {
  initHLS(url);
  return `
    <div id='videoview' class="player" style="width:800">
        <video id="video" controls style="width:1200; position: relative"></video>
    </div>`;
};

const embedPolarisVideoDelivery = (url) => {
  if (url.href.endsWith('mpd')) return embedDash(url);
  return embedHLS(url);
};

const embedYoutube = (url) => {
  const usp = new URLSearchParams(url.search);
  let vid = encodeURIComponent(usp.get('v'));
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&amp;v=${vid}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedVimeo = (url) => {
  const [, video] = url.pathname.split('/');
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://player.vimeo.com/video/${video}"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        title="Content from Vimeo" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
    {
      match: ['delivery'],
      embed: embedPolarisVideoDelivery,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const link = block.querySelector('a').href;
  block.textContent = '';
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, link);
    }
  });
  observer.observe(block);
}
