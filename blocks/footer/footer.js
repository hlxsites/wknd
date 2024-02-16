import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const navPath = window.wknd.demoConfig.demoBase || '';

  const resp = await fetch(`${navPath}/footer.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  if (resp.ok) {
    block.textContent = '';

    const html = await resp.text();
    const footer = document.createElement('div');
    footer.innerHTML = html;
    await decorateIcons(footer);
    block.append(footer);
  }
}
