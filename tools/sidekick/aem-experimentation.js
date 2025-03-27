/* eslint-disable */
(function () {
  let isAEMExperimentationAppLoaded = false;
  let scriptLoadPromise = null;
  let isHandlingSimulation = false;

  function toggleExperimentPanel(forceShow = false) {
    const container = document.getElementById("aemExperimentation");
    if (container) {
      if (forceShow) {
        container.classList.remove("aemExperimentationHidden");
      } else {
        container.classList.toggle("aemExperimentationHidden");
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

      const script = document.createElement("script");
      script.src =
        "https://experience.adobe.com/solutions/ExpSuccess-aem-experimentation-mfe/static-assets/resources/sidekick/client.js?source=plugin";

      script.onload = function () {
        isAEMExperimentationAppLoaded = true;
        const waitForContainer = (retries = 0, maxRetries = 20) => {
          const container = document.getElementById("aemExperimentation");
          if (container) {
            toggleExperimentPanel(true); // Force show on initial load
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

  function checkExperimentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const experimentParam = urlParams.get("experiment");

    if (experimentParam && !isHandlingSimulation) {
      const decodedParam = decodeURIComponent(experimentParam);

      const [experimentId, variantId] = decodedParam.split("/");
      if (experimentId && variantId) {
        isHandlingSimulation = true;
        loadAEMExperimentationApp()
          .then(() => {
            toggleExperimentPanel(true);
          })
          .catch((error) => {
            console.error("[AEM Exp] Error loading app:", error);
          });
      }
    }
  }

  function handleSidekickPluginButtonClick() {
    if (!isAEMExperimentationAppLoaded) {
      loadAEMExperimentationApp()
        .then(() => {
          console.log("[AEM Exp] First load - showing panel");
          toggleExperimentPanel(true);
        })
        .catch((error) => {
          console.error("[AEM Exp] Failed to load:", error);
        });
    } else {
      toggleExperimentPanel(false);
    }
  }

  // Initialize Sidekick
  const sidekick = document.querySelector("helix-sidekick, aem-sidekick");
  if (sidekick) {
    sidekick.addEventListener(
      "custom:aem-experimentation-sidekick",
      handleSidekickPluginButtonClick
    );
  } else {
    document.addEventListener(
      "sidekick-ready",
      () => {
        const sidekickElement = document.querySelector(
          "helix-sidekick, aem-sidekick"
        );
        if (sidekickElement) {
          sidekickElement.addEventListener(
            "custom:aem-experimentation-sidekick",
            handleSidekickPluginButtonClick
          );
        }
      },
      { once: true }
    );
  }

  // Check for experiment parameters on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkExperimentParams);
  } else {
    checkExperimentParams();
  }
})();
