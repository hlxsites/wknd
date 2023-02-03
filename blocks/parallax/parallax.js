import { toClassName } from '../../scripts/lib-franklin.js';

function formatKey(el) {
  const strong = el.querySelector('strong');
  let isFocal = false;
  if (strong) {
    isFocal = true;
    strong.remove();
  }
  const text = el.textContent.trim().toLowerCase();
  // basic element
  if (text === 'background' || text === 'text') return { type: text };
  // styled text
  if (text.startsWith('text')) {
    const paren = text.match(/\(([^)]+)\)/g)[0].replace(/\W/g, '');
    return { type: 'text', style: paren };
  }
  // layer element with direction
  const split = text.split(',').map((t) => t.trim());
  if (split && split.length > 1) {
    return {
      type: 'layer',
      from: split[0],
      to: split[1],
      focal: isFocal,
    };
  }
  return {
    type: 'layer',
    from: split[0],
    to: split[0],
    focal: isFocal,
  };
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  const layers = [];
  [...block.children].forEach((row) => {
    const [key, content] = [...row.children];
    const config = formatKey(key);
    if (config.type === 'background') {
      // create background image
      content.className = 'parallax-background';
      content.querySelector('img').setAttribute('loading', 'eager');
      wrapper.prepend(content);
    } else if (config.type === 'text') {
      // create text layer
      content.className = 'parallax-text';
      if (config.style) content.classList.add(`parallax-text-${config.style}`);
      wrapper.append(content);
    } else if (config.type === 'layer') {
      // create parallax layer
      content.classList.add('parallax-layer', `from-${toClassName(config.from)}`);
      content.setAttribute('data-from', toClassName(config.from));
      content.setAttribute('data-to', toClassName(config.to));
      if (config.focal) content.classList.add('parallax-focal');
      layers.push(content);
      wrapper.append(content);
    }
  });
  block.innerHTML = '';

  const observer = new IntersectionObserver(async (entries) => {
    const observed = entries.find((entry) => entry.isIntersecting);
    layers.forEach((layer) => {
      const to = layer.getAttribute('data-to');
      if (observed && observed.isIntersecting) {
        layer.classList.add(`to-${to}`);
      } else {
        layer.classList.remove(`to-${to}`);
      }
    });
    const text = block.querySelector('.parallax-text');
    if (observed && observed.isIntersecting) {
      text.classList.add('active');
    } else {
      text.classList.remove('active');
    }
  }, { threshold: 0.1 });
  observer.observe(block);

  block.append(wrapper);
}
