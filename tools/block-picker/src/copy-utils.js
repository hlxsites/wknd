// Adapted from https://github.com/adobecom/milo/blob/0fbb05df593e6d6c5ef389f1a5e1bcbc84229f18/libs/blocks/library-config/lists/blocks.js
export function getTable(block, name, path) {
  const url = new URL(`${window.origin}/${path}`);
  block.querySelectorAll('img').forEach((img) => {
    const srcSplit = img.src.split('/');
    const mediaPath = srcSplit.pop();
    img.src = `${url.origin}/${mediaPath}`;
    const { width, height } = img;
    const ratio = width > 200 ? 200 / width : 1;
    img.width = width * ratio;
    img.height = height * ratio;
  });
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  const th = document.createElement('th' );
  th.setAttribute('colspan', maxCols);
  th.insertAdjacentHTML('beforeend', name);
  headerRow.append(th);
  table.append(headerRow);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((col) => {
      const td = document.createElement('td');
      if (row.children.length < maxCols) {
        td.setAttribute('colspan', maxCols);
      }
      td.innerHTML = col.innerHTML;
      tr.append(td);
    });
    table.append(tr);
  });
  return table.outerHTML;
}

function getBlockName(block) {
  const classes = block.className.split(' ');
  const name = classes.shift();
  return classes.length > 0 ? `${name} (${classes.join(', ')})` : name;
}

async function fetchPlainBlock(path) {
  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export async function enrichWithVariants(block) {
  const { path } = block;
  block.variants = [];

  const doc = await fetchPlainBlock(path);
  if (!doc) return;

  doc.body.querySelectorAll('div[class]').forEach((blockVariant) => {
    const name = getBlockName(blockVariant)
    const table = getTable(blockVariant, name, path);
    block.variants.push({ name, table });
  });
}

export async function copyTable(blockVariant) {
  const { table } = blockVariant

  await navigator.clipboard.write([new ClipboardItem({
    'text/plain': new Blob([table], { type: 'text/plain' }),
    'text/html': new Blob([table], { type: 'text/html' }),
  })])
}
