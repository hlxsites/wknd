import { loadScript } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  [...block.children].forEach((row) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      row.children[j].classList.add(`screens-sequence-carousel-${e}`);
    });
  });
}
loadScript('/blocks/screens-sequence-carousel/delayed.js', { type: 'text/javascript', charset: 'UTF-8' });
