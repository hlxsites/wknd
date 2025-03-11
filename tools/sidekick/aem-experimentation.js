(function () {
  let isAEMExperimentationAppLoaded = false;
  let scriptLoadPromise = null;
  let isHandlingSimulation = false;

  function toggleExperimentPanel(forceShow = false) {
    const container = document.getElementById('aemExperimentation');
    if (container) {
      if (forceShow) {
        container.classList.remove('aemExperimentationHidden');
      } else {
        container.classList.toggle('aemExperimentationHidden');
      }
    }
  }

  function loadAEMExperimentationApp() {
    if (scriptLoadPromise) {
      return scriptLoadPromise;
    }

    scriptLoadPromise = new Promise((resolve, reject) => {
      if (isAEMExperimentationAppLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://experience-qa.adobe.com/solutions/ExpSuccess-aem-experimentation-mfe/static-assets/resources/sidekick/client.js?source=bookmarklet&ExpSuccess-aem-experimentation-mfe_version=PR-125-8863119dc69b0d3a9887c515198ff4ef624a487c';

      script.onload = function () {
        isAEMExperimentationAppLoaded = true;
        const waitForContainer = (retries = 0, maxRetries = 20) => {
          const container = document.getElementById('aemExperimentation');
          if (container) {
            toggleExperimentPanel(true);
            resolve();
          } else if (retries < maxRetries) {
            setTimeout(() => waitForContainer(retries + 1, maxRetries), 200);
          } else {
            resolve();
          }
        };

        waitForContainer();
      };

      script.onerror = reject;
      document.head.appendChild(script);
    });

    return scriptLoadPromise;
  }

  // Listen for experiment update messages
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'EXPERIMENT_UPDATED') {
      if (event.data.action === 'RELOAD_PAGE') {

        sessionStorage.setItem('aem_experimentation_open_panel', 'true');
        window.location.reload();
      }
    }
  });

  if (sessionStorage.getItem('aem_experimentation_open_panel') === 'true') {
    sessionStorage.removeItem('aem_experimentation_open_panel');

    setTimeout(() => {
      loadAEMExperimentationApp()
        .then(() => {
          toggleExperimentPanel(true);
        })
        .catch((error) => {
          console.error('[AEM Exp] Failed to load after reload:', error);
        });
    }, 1000);
  }

  function checkExperimentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const experimentParam = urlParams.get('experiment');

    if (experimentParam && !isHandlingSimulation) {
      const decodedParam = decodeURIComponent(experimentParam);

      const [experimentId, variantId] = decodedParam.split('/');
      if (experimentId && variantId) {
        isHandlingSimulation = true;
        // Load app and force show
        loadAEMExperimentationApp()
          .then(() => {
            const panel = document.getElementById('aemExperimentation');
            if (panel) {
              panel.classList.remove('aemExperimentationHidden');
            }
          })
          .catch((error) => {
            console.error('[AEM Exp] Error loading app:', error);
          });
      }
    }
  }

  function handleSidekickPluginButtonClick() {
    const panel = document.getElementById('aemExperimentation');

    if (!isAEMExperimentationAppLoaded) {
      loadAEMExperimentationApp()
        .then(() => {
          if (panel) {
            console.log('[AEM Exp] First load - showing panel');
            toggleExperimentPanel(true);
          }
        })
        .catch((error) => {
          console.error('[AEM Exp] Failed to load:', error);
        });
    } else {
      toggleExperimentPanel(false);
    }
  }

  // Initialize Sidekick
  const sidekick = document.querySelector('helix-sidekick, aem-sidekick');
  if (sidekick) {
    sidekick.addEventListener(
      'custom:aem-experimentation-sidekick',
      handleSidekickPluginButtonClick
    );
  } else {
    document.addEventListener(
      'sidekick-ready',
      () => {
        const sidekickElement = document.querySelector(
          'helix-sidekick, aem-sidekick'
        );
        if (sidekickElement) {
          sidekickElement.addEventListener(
            'custom:aem-experimentation-sidekick',
            handleSidekickPluginButtonClick
          );
        }
      },
      { once: true }
    );
  }

  // Check for experiment parameters on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkExperimentParams);
  } else {
    checkExperimentParams();
  }
})();
