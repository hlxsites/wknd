import { toClassName } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const name = toClassName(cols[0].textContent);
        config[name] = cols[1].innerHTML;
      }
    }
  });
  const { quote, author } = config;
  block.innerHTML = '';

  const blockquoteTag = document.createElement('blockquote');
  blockquoteTag.innerHTML = `<strong>${quote}</strong>`;
  const authorTag = document.createElement('p');
  authorTag.innerHTML = `<b><i>${author}</i></b>`;
  block.append(blockquoteTag, authorTag);
}
