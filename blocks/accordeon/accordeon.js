import {
  h, render,
} from '../../scripts/preact.js';
import htm from '../../scripts/htm.js';
import MyList from './MyList.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const config = readBlockConfig(block);

  block.textContent = '';

  return new Promise((resolve) => {
    const app = html`<${MyList} list=${config} resolve=${resolve} />`;
    render(app, block);
  });
}
