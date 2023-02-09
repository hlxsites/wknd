export default function decorate(block) {
  const quoteDiv = block.querySelector('div:last-of-type');
  const blockquote = document.createElement('blockquote');
  blockquote.innerHTML = `<strong>${quoteDiv.innerHTML}</strong>`;
  quoteDiv.replaceWith(blockquote);

  const authorDiv = block.querySelector('div:nth-child(2)');
  if (authorDiv) {
    const author = document.createElement('p');
    author.innerHTML = `<b><i>${authorDiv.innerHTML}</i></b>`;
    authorDiv.replaceWith(author);
  }
}
