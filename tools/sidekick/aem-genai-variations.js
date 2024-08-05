(function () {
    let isAEMGenAIVariationsAppLoaded = false;
    function loadAEMGenAIVariationsApp() {
      const script = document.createElement('script');
      script.src = 'https://experience.adobe.com/solutions/aem-sites-genai-aem-genai-variations-mfe/static-assets/resources/sidekick/client.js';
      script.onload = function () {
        isAEMGenAIVariationsAppLoaded = true;
      };
      script.onerror = function () {
        console.error('Error loading AEMGenAIVariationsApp.');
      };
      document.head.appendChild(script);
    }
  
    function handlePluginButtonClick() {
      if (!isAEMGenAIVariationsAppLoaded) {
        loadAEMGenAIVariationsApp();
      }
    }
  
    const sidekick = document.querySelector('helix-sidekick');
    if (sidekick) {
      // sidekick already loaded
      sidekick.addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
    } else {
      // wait for sidekick to be loaded
      document.addEventListener('sidekick-ready', () => {
        document.querySelector('helix-sidekick')
          .addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
      }, { once: true });
    }
  }());
  