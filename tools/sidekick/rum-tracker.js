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
   * Prioritizes window.hlx.experiments over DOM elements and localStorage
   */
  function getActiveExperiments() {
    const experiments = [];

    // 1. First check window.hlx.experiments (most reliable source)
    if (
      window.hlx &&
      window.hlx.experiments &&
      Array.isArray(window.hlx.experiments)
    ) {
      log(
        'Found window.hlx.experiments with',
        window.hlx.experiments.length,
        'experiments'
      );
      window.hlx.experiments.forEach((exp) => {
        if (exp.config && exp.config.id) {
          experiments.push(exp.config.id);
          log(
            'Added experiment from window.hlx.experiments:',
            exp.config.id,
            'type:',
            exp.type,
            'variant:',
            exp.config.selectedVariant
          );
        }
      });
    }
    // 2. Also check the legacy window.hlx.experiment (single experiment)
    else if (
      window.hlx &&
      window.hlx.experiment &&
      window.hlx.experiment.config
    ) {
      const expId = window.hlx.experiment.config.id;
      if (expId && !experiments.includes(expId)) {
        experiments.push(expId);
        log(
          'Added experiment from window.hlx.experiment:',
          expId,
          'variant:',
          window.hlx.experiment.config.selectedVariant
        );
      }
    }

    // If we found experiments from window.hlx, return them
    if (experiments.length > 0) {
      return experiments;
    }

    // 7. Check localStorage as fallback
    try {
      const experimentsData = localStorage.getItem(
        'unified-decisioning-experiments'
      );
      if (experimentsData) {
        const storedExperiments = JSON.parse(experimentsData);
        Object.keys(storedExperiments).forEach((id) => {
          if (!experiments.includes(id)) {
            experiments.push(id);
            log('Added experiment from unified-decisioning-experiments:', id);
          }
        });
      }
    } catch (e) {
      log('Error reading experiments data:', e);
    }

    return experiments;
  }

  /**
   * Get experiment details for a specific experiment ID
   */
  function getExperimentDetails(experimentId) {
    if (!experimentId) return null;

    // 1. Check window.hlx.experiments array
    if (
      window.hlx &&
      window.hlx.experiments &&
      Array.isArray(window.hlx.experiments)
    ) {
      const experiment = window.hlx.experiments.find(
        (exp) => exp.config && exp.config.id === experimentId
      );
      if (experiment) {
        return {
          id: experimentId,
          type: experiment.type,
          selectedVariant: experiment.config.selectedVariant,
          variantNames: experiment.config.variantNames,
          sectionIndex: experiment.sectionIndex,
        };
      }
    }

    // 2. Check window.hlx.experiment (legacy)
    if (
      window.hlx &&
      window.hlx.experiment &&
      window.hlx.experiment.config &&
      window.hlx.experiment.config.id === experimentId
    ) {
      return {
        id: experimentId,
        type: window.hlx.experiment.type || 'page',
        selectedVariant: window.hlx.experiment.config.selectedVariant,
        variantNames: window.hlx.experiment.config.variantNames,
      };
    }

    // 3. Return basic info if not found in hlx
    return {
      id: experimentId,
      type: experimentId === 'section-exp' ? 'section' : 'unknown',
    };
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

      // Get experiment details if available
      const expDetails = getExperimentDetails(experimentId);

      // Add or update tracking for this experiment
      trackingData[experimentId] = {
        selector,
        timestamp: new Date().toISOString(),
        type: expDetails?.type || 'unknown',
        variant: expDetails?.selectedVariant || 'unknown',
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));

      log(
        '✅ Stored tracking data for experiment:',
        experimentId,
        'selector:',
        selector,
        'type:',
        expDetails?.type || 'unknown'
      );
      return true;
    } catch (e) {
      log('❌ Error storing tracking data:', e);
      return false;
    }
  }

  /**
   * Find a suitable element for a section experiment
   */
  function findSectionElement(experimentId, sectionIndex) {
    log(
      'Looking for section element for experiment:',
      experimentId,
      'sectionIndex:',
      sectionIndex
    );

    // If we have a section index, try to find the corresponding section
    if (typeof sectionIndex === 'number') {
      const sections = document.querySelectorAll(
        '.section, section, [data-section-status]'
      );
      if (sections.length > sectionIndex) {
        const section = sections[sectionIndex];
        log('Found section element using sectionIndex:', sectionIndex);

        // Try to find interactive elements in the section
        const interactiveElements = section.querySelectorAll(
          'button, a[href], input[type="submit"]'
        );
        if (interactiveElements.length > 0) {
          // Prefer the last button as it's often a submit/CTA
          log(
            'Found interactive element in section:',
            interactiveElements[interactiveElements.length - 1]
          );
          return interactiveElements[interactiveElements.length - 1];
        }

        // If no interactive elements, return the section itself
        return section;
      }
    }

    // Try to find form buttons as a fallback
    const sectionForms = document.querySelectorAll('.section form');
    if (sectionForms.length > 0) {
      // Try to find buttons in the last form
      const buttons =
        sectionForms[sectionForms.length - 1].querySelectorAll('button');
      if (buttons.length > 0) {
        // Take the last button which is likely the submit button
        log(
          'Found button for section using form fallback:',
          buttons[buttons.length - 1]
        );
        return buttons[buttons.length - 1];
      }
    }

    return null;
  }

  /**
   * Apply the data-rum-source attribute to an element
   * Improved with better fallback strategies and section handling
   */
  function applyRumAttribute(selector, experimentId) {
    if (!experimentId) {
      log('Invalid experiment ID for attribute application');
      return false;
    }

    try {
      // Get experiment details
      const expDetails = getExperimentDetails(experimentId);
      log('Experiment details for', experimentId, ':', expDetails);

      let element = null;

      // For section experiments, try finding the section first
      if (expDetails.type === 'section') {
        element = findSectionElement(experimentId, expDetails.sectionIndex);
      }

      // If we still don't have an element, try the selector
      if (!element && selector) {
        log('Looking for element with selector:', selector);
        element = document.querySelector(selector);
      }

      // If that fails, try alternate selector strategies
      if (!element) {
        log('Element not found with original approach, trying alternatives');

        // 1. Try last part of the selector (most specific)
        if (selector) {
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
        }

        // 2. If still not found, try tag name with position
        if (!element && selector && selector.includes('nth-of-type')) {
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
        if (!element && selector && selector.includes('button')) {
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
        log(
          '❌ Element not found with any strategy for experiment:',
          experimentId
        );
      }
    } catch (error) {
      log('❌ Error applying attribute:', error);
    }

    return false;
  }

  /**
   * Apply tracking for all active experiments on page load
   * Now handles multiple experiments and uses window.hlx when available
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
          } else {
            // If no stored selector but experiment is active, try to set it up
            const expDetails = getExperimentDetails(experimentId);
            log(
              'No stored tracking data for active experiment:',
              experimentId,
              'type:',
              expDetails.type
            );

            if (expDetails.type === 'section') {
              // For section experiments, try to find a suitable element and store it
              const sectionElement = findSectionElement(
                experimentId,
                expDetails.sectionIndex
              );
              if (sectionElement) {
                log(
                  'Found section element for experiment without stored selector:',
                  experimentId
                );
                // Generate a selector
                const selector = generateSelector(sectionElement);
                // Store it for future use
                storeTrackingData(experimentId, selector);
                // Apply the attribute
                applyRumAttribute(selector, experimentId);
              }
            }
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

        // Try to set up tracking for section experiments without stored data
        experimentIds.forEach((expId) => {
          const expDetails = getExperimentDetails(expId);
          if (expDetails.type === 'section') {
            log('Setting up new tracking for section experiment:', expId);
            const sectionElement = findSectionElement(
              expId,
              expDetails.sectionIndex
            );
            if (sectionElement) {
              const selector = generateSelector(sectionElement);
              storeTrackingData(expId, selector);
              applyRumAttribute(selector, expId);
            }
          }
        });
      }
    } catch (e) {
      log('Error applying tracking on load:', e);
    }
  }

  /**
   * Generate a unique CSS selector for an element
   */
  function generateSelector(element) {
    if (!element) return null;

    // Try ID selector if available (most specific)
    if (element.id) {
      return `#${element.id}`;
    }

    // Try using unique class combinations
    if (element.classList.length > 0) {
      const classSelector = Array.from(element.classList)
        .map((c) => `.${c}`)
        .join('');
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector;
      }
    }

    // Build path from element to document root
    let path = [];
    let currentElement = element;

    while (
      currentElement &&
      currentElement !== document.body &&
      path.length < 8
    ) {
      let selector = currentElement.tagName.toLowerCase();

      if (currentElement.id) {
        selector = `#${currentElement.id}`;
        path.unshift(selector);
        break; // ID is specific enough to stop here
      }

      // Add classes if they exist
      if (currentElement.classList.length > 0) {
        selector += Array.from(currentElement.classList)
          .map((c) => `.${c}`)
          .join('');
      }

      // Add nth-of-type if needed for specificity
      const siblings = Array.from(
        currentElement.parentNode?.children || []
      ).filter((node) => node.tagName === currentElement.tagName);

      if (siblings.length > 1) {
        const index = siblings.indexOf(currentElement) + 1;
        selector += `:nth-of-type(${index})`;
      }

      path.unshift(selector);
      currentElement = currentElement.parentNode;
    }

    return path.join(' > ');
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

           case 'track-element': {
                        console.log('xinyiyiyiyiyiyiyiyiyiyiyi ----Received track-element message:', event.data);
                        try {
                            const { experimentId, elementInfo } = event.data;
                            
                            if (experimentId && elementInfo && elementInfo.selector) {
                                console.log(`Processing tracking for experiment: ${experimentId}`);
                                
                                // Store tracking data in localStorage
                                const storageKey = `aem-rum-tracking`;
                                let trackingData = {};
                                
                                try {
                                    const storedData = localStorage.getItem(storageKey);
                                    if (storedData) {
                                        trackingData = JSON.parse(storedData);
                                    }
                                } catch (e) {
                                    console.error('Error parsing stored tracking data:', e);
                                }
                                
                                // Add or update tracking for this experiment
                                trackingData[experimentId] = {
                                    selector: elementInfo.selector,
                                    timestamp: new Date().toISOString(),
                                };
                                
                                // Save to localStorage
                                localStorage.setItem(storageKey, JSON.stringify(trackingData));
                                console.log('✅ Stored tracking data for experiment:', experimentId);
                                
                                // Apply the data-rum-source attribute to the element
                                try {
                                    const element = document.querySelector(elementInfo.selector);
                                    if (element) {
                                        const attributeValue = `experiment-${experimentId}`;
                                        element.setAttribute('data-rum-source', attributeValue);
                                        console.log(`✅ Applied data-rum-source="${attributeValue}" to element:`, element);
                                        
                                        // Visual indicator for debugging
                                        element.style.outline = '2px solid #0d66d0';
                                        element.style.outlineOffset = '2px';
                                    } else {
                                        console.warn(`❌ No element found for selector: ${elementInfo.selector}`);
                                    }
                                } catch (e) {
                                    console.error('Error applying data-rum-source attribute:', e);
                                }
                            } else {
                                console.warn('Missing data in track-element message');
                            }
                        } catch (error) {
                            console.error('Error handling track-element message:', error);
                        }
                        break;
                    }

      default:
        // Ignore other messages
        break;
    }
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

    log('Initialization complete - ready to receive messages from MFE');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
