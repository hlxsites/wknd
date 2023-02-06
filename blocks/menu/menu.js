import { toClassName } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // build menu item button (mobile)
  const button = document.createElement('button');
  button.setAttribute('aria-controls', 'menu');
  button.setAttribute('aria-expanded', false);
  button.id = 'menu-button';

  // decorate menu item list
  const menuItems = [];
  const menu = document.createElement('menu');
  menu.setAttribute('aria-labelledby', 'menu-button');
  menu.id = 'menu';
  const ul = document.createElement('ul');
  menu.append(ul);
  [...block.firstElementChild.children].forEach((item, i) => {
    const text = item.textContent;
    const li = document.createElement('li');
    menuItems.push(li);
    if (!i) {
      button.textContent = text;
      li.classList.add('active');
    }
    li.setAttribute('data-menu-id', toClassName(text));
    li.innerHTML = `<a href="#${toClassName(text)}">${text}</a>`;
    li.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(toClassName(text)).scrollIntoView({
        behavior: 'smooth',
      });
      button.setAttribute('aria-expanded', false);
    });
    ul.append(li);
  });
  block.innerHTML = '';
  block.append(button, menu);

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
  });

  // setup scroll behavior
  const sections = document.querySelectorAll('main .section');
  sections.forEach((section, i) => {
    const observer = new IntersectionObserver(async (entries) => {
      const observed = entries.find((entry) => entry.isIntersecting);
      if (observed) {
        let observedSection = section;
        if (!section.id) observedSection = sections[i - 1];
        if ([...observedSection.classList].includes('dark')) {
          menu.classList.add('dark');
        } else {
          menu.classList.remove('dark');
        }
        button.textContent = observedSection.dataset.menuItem;
        menuItems.forEach((item) => {
          if (item.getAttribute('data-menu-id') === observedSection.id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }, { threshold: 0.5 });

    observer.observe(section);
  });
}
