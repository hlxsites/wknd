export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  
  // Add error-triggering functionality to buttons within columns (including recent-articles)
  const buttons = block.querySelectorAll('a.button.primary, a.button.secondary');
  buttons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      // Prevent default navigation for testing purposes
      e.preventDefault();
      
      // Generate different types of errors for testing JS Error Agent
      const errorTypes = [
        () => { throw new Error(`Columns button ${index} error: Something went wrong!`); },
        () => { throw new TypeError(`Columns button ${index} error: Invalid operation attempted`); },
        () => { throw new ReferenceError(`Columns button ${index} error: Undefined variable accessed`); },
        () => { throw new RangeError(`Columns button ${index} error: Value out of range`); },
        () => { throw new SyntaxError(`Columns button ${index} error: Invalid syntax detected`); }
      ];
      
      // Randomly select an error type
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      
      // Log the error to console and then throw it
      console.error(`JS Error Agent Test: Columns button "${button.textContent}" clicked, triggering error...`);
      randomError();
    });
  });
}
