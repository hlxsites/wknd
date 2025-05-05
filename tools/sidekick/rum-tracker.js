/**
 * AEM Experimentation RUM Track Message Handler
 *
 * This script listens for postMessage events from the AEM Experimentation MFE
 * and handles the tracking of elements with data-rum-source attributes.
 *
 * - Place this script on your client pages to enable RUM tracking
 * - It will automatically listen for messages from the MFE
 * - It will store tracking info in localStorage
 * - It will apply data-rum-source attributes to elements on the page
 */
(function () {
  // Configuration
  const STORAGE_KEY = 'aem-rum-tracking';
  const DEBUG = true; // Set to false in production

  /**
   * Log debug messages
   */
  function log(...args) {
    if (DEBUG) {
      console.log('[AEM RUM Client]', ...args);
    }
  }

  /**
   * Get all active experiment IDs from the page
   * This now returns an array of all active experiments
   */
  function getActiveExperiments() {
    const experiments = [];

    // Check body classes (page-level experiments)
    document.body.classList.forEach((cls) => {
      if (cls.startsWith('experiment-')) {
        experiments.push(cls.replace('experiment-', ''));
      }
    });

    // Check for any element with data-experiment attribute
    document.querySelectorAll('[data-experiment]').forEach((el) => {
      experiments.push(el.dataset.experiment);
    });

    // Check for section-level experiments
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.forEach((cls) => {
        if (cls.startsWith('experiment-')) {
          experiments.push(cls.replace('experiment-', ''));
        }
      });
    });

    // Add special case for section-exp
    if (
      document.querySelector('.section-exp') ||
      document.querySelector('[data-section-exp]') ||
      document.querySelector('[data-section-experiment]')
    ) {
      experiments.push('section-exp');
    }

    // Check localStorage as fallback
    try {
      const experimentsData = localStorage.getItem(
        'unified-decisioning-experiments'
      );
      if (experimentsData) {
        const storedExperiments = JSON.parse(experimentsData);
        Object.keys(storedExperiments).forEach((id) => {
          if (!experiments.includes(id)) {
            experiments.push(id);
          }
        });
      }
    } catch (e) {
      log('Error reading experiments data:', e);
    }

    // Add any experiments from the tracking storage itself
    try {
      const trackingData = localStorage.getItem(STORAGE_KEY);
      if (trackingData) {
        const parsed = JSON.parse(trackingData);
        Object.keys(parsed).forEach((id) => {
          if (!experiments.includes(id)) {
            experiments.push(id);
          }
        });
      }
    } catch (e) {
      log('Error reading tracking data:', e);
    }

    return experiments;
  }

  /**
   * Store tracking data in localStorage
   */
  function storeTrackingData(experimentId, selector) {
    if (!experimentId || !selector) {
      log('Invalid data for storage - missing experimentId or selector');
      return false;
    }

    try {
      // Get existing tracking data
      let trackingData = {};
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          trackingData = JSON.parse(storedData);
        }
      } catch (e) {
        log('Error parsing stored tracking data:', e);
      }

      // Add or update tracking for this experiment
      trackingData[experimentId] = {
        selector,
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));

      log(
        '✅ Stored tracking data for experiment:',
        experimentId,
        'selector:',
        selector
      );
      return true;
    } catch (e) {
      log('❌ Error storing tracking data:', e);
      return false;
    }
  }

  /**
   * Apply the data-rum-source attribute to an element
   * Improved with better fallback strategies
   */
  function applyRumAttribute(selector, experimentId) {
    if (!selector || !experimentId) {
      log(
        'Invalid data for attribute application - missing selector or experimentId'
      );
      return false;
    }

    try {
      log('Looking for element with selector:', selector);
      let element = document.querySelector(selector);

      // Special handling for section-exp
      if (!element && experimentId === 'section-exp') {
        log('Using special handling for section-exp');

        // Try to find the button in a form inside a section
        const sectionForms = document.querySelectorAll('.section form');
        if (sectionForms.length > 0) {
          // Try to find buttons in the last form
          const buttons =
            sectionForms[sectionForms.length - 1].querySelectorAll('button');
          if (buttons.length > 0) {
            // Take the last button which is likely the submit button
            element = buttons[buttons.length - 1];
            log(
              'Found button for section-exp using special handling:',
              element
            );
          }
        }
      }

      // If that fails, try alternate selector strategies
      if (!element) {
        log('Element not found with original selector, trying alternatives');

        // 1. Try last part of the selector (most specific)
        try {
          const parts = selector.split('>');
          const lastPart = parts[parts.length - 1].trim();
          element = document.querySelector(lastPart);

          if (element) {
            log('Found element with simplified selector:', lastPart);
          }
        } catch (e) {
          log('Error with simplified selector:', e);
        }

        // 2. If still not found, try tag name with position
        if (!element && selector.includes('nth-of-type')) {
          try {
            const match = selector.match(/(\w+):nth-of-type\(\d+\)$/);
            if (match && match[1]) {
              const tagName = match[1].toLowerCase();
              const elements = document.getElementsByTagName(tagName);
              if (elements.length > 0) {
                // Just take the first one as a fallback
                element = elements[0];
                log('Found element using tag name fallback:', tagName);
              }
            }
          } catch (e) {
            log('Error with tag fallback:', e);
          }
        }

        // 3. For buttons, try to find by text content
        if (!element && selector.includes('button')) {
          try {
            document.querySelectorAll('button').forEach((button) => {
              if (!element && button.textContent.trim() !== '') {
                element = button;
                log('Found button using text content fallback:', button);
              }
            });
          } catch (e) {
            log('Error with button text fallback:', e);
          }
        }
      }

      if (element) {
        const attributeValue = `experiment-${experimentId}`;
        element.setAttribute('data-rum-source', attributeValue);
        log(`✅ Applied data-rum-source="${attributeValue}" to:`, element);

        // Add visual indicator in debug mode
        if (DEBUG) {
          element.style.outline = '2px solid #0d66d0';
          element.style.outlineOffset = '2px';
        }

        return true;
      } else {
        log('❌ Element not found with any selector strategy:', selector);
      }
    } catch (error) {
      log('❌ Error applying attribute:', error);
    }

    return false;
  }

  /**
   * Apply tracking for all active experiments on page load
   * Now handles multiple experiments
   */
  function applyTrackingOnLoad() {
    const experimentIds = getActiveExperiments();
    if (experimentIds.length === 0) {
      log('No active experiments found on this page');
      return;
    }

    log(`Found ${experimentIds.length} active experiments:`, experimentIds);

    // Process all stored tracking data
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const trackingData = JSON.parse(storedData);
        log('Stored tracking data:', trackingData);

        // First apply tracking for active experiments
        experimentIds.forEach((experimentId) => {
          const experimentData = trackingData[experimentId];
          if (experimentData && experimentData.selector) {
            log('Applying tracking for active experiment:', experimentId);
            applyRumAttribute(experimentData.selector, experimentId);
          }
        });

        // Special case: always try to apply section-exp if it exists in storage
        if (
          trackingData['section-exp'] &&
          !experimentIds.includes('section-exp')
        ) {
          log(
            'Found section-exp in storage but not active on page, applying anyway'
          );
          applyRumAttribute(
            trackingData['section-exp'].selector,
            'section-exp'
          );
        }
      } else {
        log('No stored tracking data found');
      }
    } catch (e) {
      log('Error applying tracking on load:', e);
    }
  }

  /**
   * Handle postMessage events from the MFE
   */
  function handleMessage(event) {
    // Skip messages that don't have the AEMExperimentation source
    if (!event.data || event.data.source !== 'AEMExperimentation') {
      return;
    }

    log('📨 Received message from MFE:', event.data);

    // Handle different message types
    switch (event.data.action) {
      case 'apply-rum-attribute':
        // Direct request to apply an attribute
        const { selector, value } = event.data;

        if (selector && value && value.startsWith('experiment-')) {
          const experimentId = value.replace('experiment-', '');
          log(
            'Storing and applying RUM attribute for experiment:',
            experimentId
          );

          // Store for future use
          storeTrackingData(experimentId, selector);

          // Apply the attribute immediately
          applyRumAttribute(selector, experimentId);
        } else if (selector && !value) {
          // This is a request to remove the attribute
          log('Removing RUM attribute from element with selector:', selector);
          try {
            const element = document.querySelector(selector);
            if (element) {
              element.removeAttribute('data-rum-source');
              log('✅ Removed data-rum-source attribute');
            }
          } catch (e) {
            log('❌ Error removing attribute:', e);
          }
        }
        break;

      case 'track-element':
        // Track element message with detailed info
        const { experimentId, elementInfo } = event.data;

        if (experimentId && elementInfo && elementInfo.selector) {
          log('Tracking element for experiment:', experimentId);

          // Store the tracking data
          storeTrackingData(experimentId, elementInfo.selector);

          // Always apply the attribute
          applyRumAttribute(elementInfo.selector, experimentId);
        }
        break;

      default:
        // Ignore other messages
        break;
    }
  }

  /**
   * Add a debug button to the page with enhanced info
   */
  function addDebugButton() {
    if (!DEBUG) return;

    const button = document.createElement('button');
    button.textContent = '🔄 RUM Debug';
    button.style.cssText =
      'position:fixed; bottom:10px; right:10px; background:#0d66d0; color:white; border:none; border-radius:4px; padding:5px 10px; font-size:12px; z-index:9999; cursor:pointer;';

    button.addEventListener('click', function () {
      log('-- RUM Debug Information --');

      // Show experiments
      const experiments = getActiveExperiments();
      log(`Active experiments (${experiments.length}):`, experiments);

      // Show tracking data
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const trackingData = JSON.parse(storedData);
          log('Stored tracking data:', trackingData);

          // Check each tracking entry
          Object.entries(trackingData).forEach(([expId, data]) => {
            const element = document.querySelector(data.selector);
            log(
              `[${expId}]`,
              element ? '✅ Element found' : '❌ Element not found',
              'Selector:',
              data.selector
            );

            if (element) {
              const hasAttr = element.hasAttribute('data-rum-source');
              const attrValue = element.getAttribute('data-rum-source');
              log(
                `  Attribute: ${hasAttr ? `✅ Yes (${attrValue})` : '❌ No'}`
              );

              // Try to reapply
              if (!hasAttr || attrValue !== `experiment-${expId}`) {
                log('  Reapplying attribute...');
                applyRumAttribute(data.selector, expId);
              }
            } else {
              log('  Trying fallback strategies...');
              applyRumAttribute(data.selector, expId);
            }
          });
        } else {
          log('No stored tracking data found');
        }
      } catch (e) {
        log('Error during debug:', e);
      }

      // Reapply tracking
      applyTrackingOnLoad();
    });

    document.body.appendChild(button);
  }

  /**
   * Apply all stored tracking data, not just active experiments
   */
  function applyAllStoredTracking() {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return;

      const trackingData = JSON.parse(storedData);
      log('Applying all stored tracking data:', trackingData);

      Object.entries(trackingData).forEach(([experimentId, data]) => {
        log(`Applying stored tracking for ${experimentId}`);
        applyRumAttribute(data.selector, experimentId);
      });
    } catch (e) {
      log('Error applying all stored tracking:', e);
    }
  }

  /**
   * Initialize the script
   */
  function init() {
    log('Initializing RUM message handler');

    // Add message listener
    window.addEventListener('message', handleMessage);

    // First apply tracking for active experiments
    applyTrackingOnLoad();

    // Then also apply all stored tracking (to catch section-exp and others)
    applyAllStoredTracking();

    // Add debug button
    addDebugButton();

    // Also apply when visibility changes
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        log('Page visibility changed to visible');
        applyTrackingOnLoad();
        applyAllStoredTracking();
      }
    });

    // Listen for DOM changes with MutationObserver
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function (mutations) {
        let shouldReapply = false;

        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldReapply = true;
            break;
          }
        }

        if (shouldReapply) {
          log('DOM changed, reapplying tracking');
          setTimeout(() => {
            applyTrackingOnLoad();
            applyAllStoredTracking();
          }, 300);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Delayed application for elements that might load later
    setTimeout(applyAllStoredTracking, 1000);
    setTimeout(applyAllStoredTracking, 3000);

    // Export testing functions to window
    window.aemRumDebug = {
      applyTracking: applyTrackingOnLoad,
      applyAllTracking: applyAllStoredTracking,
      getExperiments: getActiveExperiments,
      applyAttribute: applyRumAttribute,
      storeData: storeTrackingData,
    };

    log('Initialization complete - ready to receive messages from MFE');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
