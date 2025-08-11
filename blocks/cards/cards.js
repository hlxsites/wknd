import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
  
  // Add error-triggering functionality to buttons within cards
  const buttons = block.querySelectorAll('a.button.primary, a.button.secondary');
  buttons.forEach((button) => {
    button.addEventListener('click', function(e) {
      // Prevent default navigation for testing purposes
      e.preventDefault();
      // Generate different types of errors for testing JS Error Agent
      const errorTypes = [
        () => { throw new Error('Cards button error: Something went wrong!'); },
        () => { throw new TypeError('Cards button error: Invalid operation attempted'); },
        () => { throw new ReferenceError('Cards button error: Undefined variable accessed'); },
        () => { throw new RangeError('Cards button error: Value out of range'); },
        () => { throw new SyntaxError('Cards button error: Invalid syntax detected'); }
      ];
      
      // Randomly select an error type
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      
      // Log the error to console and then throw it
      console.error('JS Error Agent Test: Cards button clicked, triggering error...');
      randomError();
    });
  });
}
