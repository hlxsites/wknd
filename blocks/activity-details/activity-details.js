/**
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  /* change to definition list */
  const dl = document.createElement('dl');
  [...block.children].forEach((row) => {
    // const term = row.firstElementChild.textContent;
    // const def = row.lastElementChild.textContent;
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.append(...row.firstElementChild.childNodes);
    dd.append(...row.lastElementChild.childNodes);
    dl.append(dt, dd);
  });
  block.replaceChildren(dl);
}
