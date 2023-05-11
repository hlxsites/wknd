function readPolarisInfo(img) {
  const alt = img.getAttribute('alt');
  if (alt) {
    try {
      return JSON.parse(alt);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to parse info for img');
    }
  }
  return null;
}

function relativeToAbsolute(relativeUrl) {
  const a = document.createElement('a');
  a.href = relativeUrl;
  return a.href;
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

export default function decoratePolarisAssets(element) {
  element.querySelectorAll('img').forEach((img) => {
    const polarisInfo = readPolarisInfo(img);
    if (polarisInfo && isValidHttpUrl(polarisInfo.deliveryURL)) {
      const deliveryURL = new URL(polarisInfo.deliveryURL);
      const ck = Math.random(); // Burst cache for demo purposes
      const mediaBusURL = new URL(relativeToAbsolute(img.getAttribute('src')));
      if (mediaBusURL.search) {
        img.setAttribute('src', `${deliveryURL.origin + deliveryURL.pathname + mediaBusURL.search}&ck=${ck}`);
      } else {
        img.setAttribute('src', `${deliveryURL.origin + deliveryURL.pathname}?ck=${ck}`);
      }

      if (img.parentNode.nodeName === 'PICTURE') {
        const picture = img.parentNode;
        picture.querySelectorAll('source').forEach((source) => {
          const srcSet = relativeToAbsolute(source.getAttribute('srcset'));
          const loc = new URL(srcSet);
          if (loc.search) {
            source.setAttribute('srcset', `${deliveryURL.origin + deliveryURL.pathname + loc.search}&ck=${ck}`);
          } else {
            source.setAttribute('srcset', `${deliveryURL.origin + deliveryURL.pathname}?ck=${ck}`);
          }
        });
      }
    }
  });
}
