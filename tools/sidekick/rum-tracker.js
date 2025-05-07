/**
 * AEM Experimentation RUM Track Message Handler (Simplified)
 * Focuses on cascading fallback selectors for resilience
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
   * Store tracking data in localStorage
   */
  function storeTrackingData(experimentId, elementInfo) {
    if (!experimentId || !elementInfo || !elementInfo.selector) {
      log('Invalid data for storage');
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
        log('Error parsing stored data', e);
      }

      // Store or update info for this experiment
      trackingData[experimentId] = {
        selector: elementInfo.selector,
        fallbackSelectors: elementInfo.fallbackSelectors || [],
        displayName: elementInfo.displayName || 'Element',
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
      log('✅ Stored tracking data for experiment:', experimentId);
      return true;
    } catch (e) {
      log('❌ Error storing tracking data:', e);
      return false;
    }
  }

  /**
   * Find element using cascading selector strategy
   */
  function findElementByCascadingSelectors(trackingInfo) {
    if (!trackingInfo) return null;

    // 1. Try primary selector first
    if (trackingInfo.selector) {
      try {
        const element = document.querySelector(trackingInfo.selector);
        if (element) {
          log('Found element with primary selector');
          return element;
        }
      } catch (e) {
        log('Error with primary selector:', e);
      }
    }

    // 2. Try fallback selectors in order
    if (
      trackingInfo.fallbackSelectors &&
      trackingInfo.fallbackSelectors.length
    ) {
      for (const selector of trackingInfo.fallbackSelectors) {
        // Skip text-based selectors
        if (selector.startsWith('__text__:')) continue;

        try {
          const element = document.querySelector(selector);
          if (element) {
            log('Found element with fallback selector:', selector);
            return element;
          }
        } catch (e) {
          log('Error with fallback selector:', selector, e);
        }
      }
    }

    // 3. Text-based matching as last resort
    if (trackingInfo.fallbackSelectors) {
      const textSelectors = trackingInfo.fallbackSelectors.filter((s) =>
        s.startsWith('__text__:')
      );

      for (const textSel of textSelectors) {
        const text = textSel.substring(8); // Remove __text__: prefix
        log('Trying to find by text content:', text);

        // Try headings first
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
          if (heading.textContent && heading.textContent.trim() === text) {
            log('Found heading by text content match');
            return heading;
          }
        }

        // Try buttons next - particularly important for "Select files" button
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
          if (button.textContent && button.textContent.trim() === text) {
            log('Found button by text content match:', text);
            return button;
          }
        }

        // If it's "Select files" text, try harder - use partial matching
        if (text === 'Select files') {
          for (const button of buttons) {
            const buttonText = button.textContent?.trim().toLowerCase() || '';
            if (buttonText.includes('select') && buttonText.includes('file')) {
              log(
                'Found button with partial "select files" match:',
                buttonText
              );
              return button;
            }
          }
        }
      }
    }

    // 4. Special case for section-exp: find any file-related buttons
    if (
      trackingInfo.selector &&
      trackingInfo.selector.includes('section-exp')
    ) {
      log('Special handling for section-exp experiment');
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        const buttonText = button.textContent?.trim().toLowerCase() || '';
        if (
          buttonText.includes('file') ||
          buttonText.includes('upload') ||
          buttonText.includes('select')
        ) {
          log('Found file-related button:', buttonText);
          return button;
        }
      }
    }

    return null;
  }

  /**
   * Apply data-rum-source attribute to element
   */
  function applyRumAttribute(trackingInfo, experimentId) {
    if (!experimentId || !trackingInfo) {
      log('Invalid data for RUM attribute application');
      return false;
    }

    try {
      // Find element using cascading selectors
      const element = findElementByCascadingSelectors(trackingInfo);

      if (element) {
        // Apply the attribute
        const attributeValue = `experiment-${experimentId}`;
        element.setAttribute('data-rum-source', attributeValue);
        log(`✅ Applied data-rum-source="${attributeValue}" to:`, element);

        // Visual indicator in debug mode
        if (DEBUG) {
          element.style.outline = '2px solid #0d66d0';
          element.style.outlineOffset = '2px';
        }

        return true;
      } else {
        log('❌ Element not found for experiment:', experimentId);
      }
    } catch (error) {
      log('❌ Error applying attribute:', error);
    }

    return false;
  }

  /**
   * Get all active experiment IDs
   */
  function getActiveExperiments() {
    const experiments = [];

    // Check window.hlx.experiments
    if (window.hlx?.experiments && Array.isArray(window.hlx.experiments)) {
      window.hlx.experiments.forEach((exp) => {
        if (exp.config?.id) {
          experiments.push(exp.config.id);
        }
      });
    }
    // Legacy window.hlx.experiment
    else if (window.hlx?.experiment?.config?.id) {
      experiments.push(window.hlx.experiment.config.id);
    }

    return experiments;
  }

  /**
   * Apply tracking for active experiments
   */
  function applyTrackingOnLoad() {
    const experimentIds = getActiveExperiments();
    if (experimentIds.length === 0) {
      log('No active experiments found');
      return;
    }

    log(`Found ${experimentIds.length} active experiments:`, experimentIds);

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const trackingData = JSON.parse(storedData);

        // Apply tracking for active experiments
        experimentIds.forEach((experimentId) => {
          const trackingInfo = trackingData[experimentId];
          if (trackingInfo) {
            log('Applying tracking for experiment:', experimentId);
            applyRumAttribute(trackingInfo, experimentId);
          }
        });
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

    // Handle message based on action
    switch (event.data.action) {
      case 'apply-rum-attribute': {
        // Direct attribute application
        console.log('apply-rum-attribute', event.data);
        const { selector, value } = event.data;

        if (selector && value && value.startsWith('experiment-')) {
          const experimentId = value.replace('experiment-', '');
          console.log(
            'Processing experiment:',
            experimentId,
            'with selector:',
            selector
          );

          // Check if we have existing data
          let existingInfo = null;
          let selectorChanged = false;

          try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
              const trackingData = JSON.parse(storedData);
              if (trackingData[experimentId]) {
                existingInfo = trackingData[experimentId];
                // Check if selector changed
                if (existingInfo.selector !== selector) {
                  console.log(
                    'Selector changed from:',
                    existingInfo.selector,
                    'to:',
                    selector
                  );
                  selectorChanged = true;
                }
              }
            }
          } catch (e) {
            console.log('Error checking existing data:', e);
          }

          // Create tracking info object
          const trackingInfo = {
            selector: selector,
            fallbackSelectors:
              existingInfo && !selectorChanged
                ? existingInfo.fallbackSelectors || []
                : [],
            timestamp: new Date().toISOString(),
          };

          // Generate new fallback selectors if:
          // 1) We have no existing info
          // 2) The selector has changed
          if (!existingInfo || selectorChanged) {
            console.log('Generating new fallback selectors');

            // For ID selectors, we add text content as fallback too
            if (selector.startsWith('#') || selector.includes('#')) {
              const idMatch = selector.match(/#([^.:\s]+)/);
              if (idMatch && idMatch[0]) {
                trackingInfo.fallbackSelectors.push(idMatch[0]);
                try {
                  const element = document.querySelector(selector);
                  if (element && element.textContent) {
                    const textContent = element.textContent.trim();
                    if (textContent) {
                      trackingInfo.fallbackSelectors.push(
                        `__text__:${textContent}`
                      );
                    }
                  }
                } catch (e) {
                  console.log('Error getting text content from ID element:', e);
                }
              }

              // Extract heading tag if present (for h1#id, h2#id, etc.)
              const headingMatch = selector.match(/^h([1-6])#/i);
              if (headingMatch) {
                trackingInfo.fallbackSelectors.push(`h${headingMatch[1]}`);
              }
            } else {
              // For complex selectors with path (>)
              if (selector.includes('>')) {
                const parts = selector.split('>');

                for (const part of parts) {
                  if (part.includes('#')) {
                    const idMatch = part.match(/#([^.:\s]+)/);
                    if (idMatch && idMatch[0]) {
                      trackingInfo.fallbackSelectors.push(idMatch[0]);
                      break;
                    }
                  }
                }

                // Extract classes from the last part (most specific)
                const lastPart = parts[parts.length - 1].trim();
                const classMatches = lastPart.match(/\.([^\s.:#]+)/g);
                if (classMatches && classMatches.length > 0) {
                  const tagMatch = lastPart.match(/^([a-z0-9]+)/i);
                  const tag = tagMatch ? tagMatch[0] : '';

                  classMatches.forEach((cls) => {
                    // Class by itself
                    trackingInfo.fallbackSelectors.push(cls);
                    console.log('Added class fallback:', cls);

                    // Tag + class if we have a tag
                    if (tag) {
                      trackingInfo.fallbackSelectors.push(`${tag}${cls}`);
                      console.log('Added tag+class fallback:', `${tag}${cls}`);
                    }
                  });
                }

                // Create simplified paths by removing parts from the end
                for (let i = parts.length - 1; i > 0; i--) {
                  const simplified = parts.slice(0, i).join(' > ').trim();
                  if (simplified && simplified !== selector) {
                    trackingInfo.fallbackSelectors.push(simplified);
                    console.log('Added simplified path fallback:', simplified);
                    if (trackingInfo.fallbackSelectors.length >= 3) break;
                  }
                }
              } else {
                // For simple selectors, extract classes
                const classMatches = selector.match(/\.([^\s.:#]+)/g);
                if (classMatches && classMatches.length > 0) {
                  const tagMatch = selector.match(/^([a-z0-9]+)/i);
                  const tag = tagMatch ? tagMatch[0] : '';

                  classMatches.forEach((cls) => {
                    trackingInfo.fallbackSelectors.push(cls);
                    console.log('Added class fallback:', cls);
                  });
                }

                // For heading selectors, try to get text content too
                const headingMatch = selector.match(/^h([1-6])/i);
                if (headingMatch) {
                  try {
                    const element = document.querySelector(selector);
                    if (element && element.textContent) {
                      const textContent = element.textContent.trim();
                      if (textContent) {
                        trackingInfo.fallbackSelectors.push(
                          `__text__:${textContent}`
                        );
                        console.log(
                          'Added text content fallback from heading:',
                          textContent
                        );
                      }
                    }
                  } catch (e) {
                    console.log('Error getting text content from heading:', e);
                  }
                }
              }
            }

            console.log(
              'Generated fallback selectors:',
              trackingInfo.fallbackSelectors
            );
          } else {
            console.log(
              'Using existing fallback selectors:',
              trackingInfo.fallbackSelectors
            );
          }

          // Store the tracking info
          storeTrackingData(experimentId, trackingInfo);

          // Apply the RUM attribute
          applyRumAttribute(trackingInfo, experimentId);
        } else if (selector && !value) {
          // Handle attribute removal
          console.log(
            'Removing RUM attribute from element with selector:',
            selector
          );
          try {
            const element = document.querySelector(selector);
            if (element) {
              element.removeAttribute('data-rum-source');
              console.log('✅ Removed data-rum-source attribute');
            }
          } catch (e) {
            console.log('❌ Error removing attribute:', e);
          }
        }
        break;
      }
    }
  }

  /**
   * Initialize the script
   */
  function init() {
    log('Initializing AEM RUM handler');

    // Set up message listener
    window.addEventListener('message', handleMessage);

    // Apply tracking for active experiments
    applyTrackingOnLoad();

    // Debug utility
    if (DEBUG) {
      window.aemRumDebug = {
        showStoredData: () => {
          try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
          } catch (e) {
            console.error('Error parsing data', e);
            return null;
          }
        },
        testSelector: (selector) => {
          try {
            return document.querySelector(selector);
          } catch (e) {
            return null;
          }
        },
      };
    }

    log('Initialization complete');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
