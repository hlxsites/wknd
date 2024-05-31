document.addEventListener('DOMContentLoaded', () => {
  // Check query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const useGeneratedStyles = urlParams.has('generatedStyles');

  // Create stylesheets and buttons
  const stylesheets = [];
  const buttons = [];

  if (useGeneratedStyles) {
    // Create and add the generatedStyles.css stylesheet
    const stylesheet = document.createElement('link');
    stylesheet.id = 'generatedStyles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/generatedStyles.css';
    stylesheet.disabled = false;
    document.head.appendChild(stylesheet);
  } else {
    // Add stylesheets and buttons for files in the /generated folder
    for (let i = 0; i <= 5; i++) { // Assuming there are 5 stylesheets for this example
      (function (i) {
        const stylesheet = document.createElement('link');
        stylesheet.id = `style${i}`;
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `/generated/styles${i}.css`;
        stylesheet.disabled = true;
        document.head.appendChild(stylesheet);
        stylesheets.push(stylesheet);

        const button = document.createElement('button');
        button.className = 'toggle-button';
        button.innerHTML = `Enable Variation ${i}`;
        button.style.bottom = `${20 + (i + 1) * 50}px`; // Adjust vertical position
        button.onclick = function () {
          toggleStyle(i);
        };
        document.body.appendChild(button);
        buttons.push(button);
      }(i));
    }

    // Add the disable all styles button
    const disableAllButton = document.createElement('button');
    disableAllButton.className = 'toggle-button';
    disableAllButton.innerHTML = 'Original Styles';
    disableAllButton.style.bottom = '20px'; // Position at the bottom
    disableAllButton.onclick = disableAllStyles;
    document.body.appendChild(disableAllButton);
  }

  // Define the toggle function for each stylesheet
  function toggleStyle(index) {
    stylesheets.forEach((stylesheet, i) => {
      stylesheet.disabled = true;
      buttons[i].innerHTML = `Enable Variation ${i}`;
      buttons[i].style.backgroundColor = '#007BFF';
    });

    const stylesheet = document.getElementById(`style${index}`);
    stylesheet.disabled = false;
    updateButtonState(index);
  }

  // Define the function to disable all stylesheets
  function disableAllStyles() {
    stylesheets.forEach((stylesheet, i) => {
      stylesheet.disabled = true;
      buttons[i].innerHTML = `Enable Variation ${i}`;
      buttons[i].style.backgroundColor = '#007BFF';
    });
  }

  // Define the function to update the button state
  function updateButtonState(index) {
    const button = buttons[index];
    button.innerHTML = `Disable Variation ${index}`;
    button.style.backgroundColor = '#FF0000';
  }

  // Hide buttons if using generatedStyles.css
  if (useGeneratedStyles) {
    console.log('Hiding buttons');
    buttons.forEach((button) => {
      button.style.display = 'none';
    });
  }

  // Add styles for the buttons
  const style = document.createElement('style');
  style.innerHTML = `
        .toggle-button {
            position: fixed;
            right: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }

        .toggle-button:hover {
            opacity: 0.8;
        }
    `;
  document.head.appendChild(style);
});
