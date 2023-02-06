import { toClassName } from '../../scripts/lib-franklin.js';

function buildPointer(position, content) {
  const pointer = document.createElement('div');
  pointer.className = `pointers-pointer pointer-${position}`;
  const contentTypes = ['text', 'button'];
  content.forEach((c, i) => {
    if (contentTypes[i]) c.classList.add(`pointer-${contentTypes[i]}`);
    pointer.append(c);
  });
  return pointer;
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  [...block.children].forEach((row) => {
    const [key, content] = [...row.children];
    row.remove();
    const type = toClassName(key.textContent);
    if (type === 'image') {
      const picture = content.querySelector('picture');
      wrapper.prepend(picture);
    } else {
      const pointer = buildPointer(type, [...content.children]);
      wrapper.append(pointer);
    }
  });
  block.innerHTML = wrapper.innerHTML;

  const observer = new IntersectionObserver(async (entries) => {
    const observed = entries.find((entry) => entry.isIntersecting);
    if (observed && observed.isIntersecting) {
      block.classList.add('active');
    } else {
      block.classList.remove('active');
    }
  }, { threshold: 0 });

  observer.observe(block);
}
