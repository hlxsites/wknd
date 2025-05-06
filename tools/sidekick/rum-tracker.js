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
          timestamp: new Date().toISOString()
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
      if (trackingInfo.fallbackSelectors && trackingInfo.fallbackSelectors.length) {
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
        const textSelectors = trackingInfo.fallbackSelectors.filter(s => s.startsWith('__text__:'));
        
        for (const textSel of textSelectors) {
          const text = textSel.substring(8); // Remove __text__: prefix
          log('Trying to find by text content:', text);
          
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          for (const heading of headings) {
            if (heading.textContent && heading.textContent.trim() === text) {
              log('Found element by text content match');
              return heading;
            }
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
        window.hlx.experiments.forEach(exp => {
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
          experimentIds.forEach(experimentId => {
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
        case 'track-element': {
          try {
            const { experimentId, elementInfo } = event.data;
            
            if (experimentId && elementInfo && elementInfo.selector) {
              log(`Processing tracking for experiment: ${experimentId}`);
              log(`Primary selector: ${elementInfo.selector}`);
              log(`Fallback selectors:`, elementInfo.fallbackSelectors || []);
              
              // Store tracking info with selectors
              storeTrackingData(experimentId, elementInfo);
              
              // Apply the attribute
              applyRumAttribute(elementInfo, experimentId);
            } else {
              log('Missing required data in track-element message');
            }
          } catch (error) {
            log('Error handling track-element message:', error);
          }
          break;
        }
        
        case 'apply-rum-attribute': {
            // Direct attribute application
            const { selector, value } = event.data;
            
            if (selector && value && value.startsWith('experiment-')) {
                const experimentId = value.replace('experiment-', '');
                
                // First check if we already have tracking info with fallback selectors
                let existingInfo = null;
                try {
                    const storedData = localStorage.getItem(STORAGE_KEY);
                    if (storedData) {
                        const trackingData = JSON.parse(storedData);
                        if (trackingData[experimentId] && 
                            trackingData[experimentId].fallbackSelectors && 
                            trackingData[experimentId].fallbackSelectors.length > 0) {
                            // Use existing data if it has fallback selectors
                            existingInfo = trackingData[experimentId];
                        }
                    }
                } catch (e) {
                    log('Error checking existing data', e);
                }
                
                // If we have existing info with fallbacks, use it but update the selector
                if (existingInfo) {
                    log('Found existing tracking info with fallbacks, updating selector');
                    existingInfo.selector = selector; // Update to new selector
                    storeTrackingData(experimentId, existingInfo);
                    applyRumAttribute(existingInfo, experimentId);
                } else {
                    // Otherwise create new tracking info
                    // Generate some basic fallbacks for this selector
                    const fallbackSelectors = generateFallbackSelectors(selector);
                    
                    const trackingInfo = {
                        selector,
                        fallbackSelectors,
                        displayName: 'Selected Element'
                    };
                    
                    storeTrackingData(experimentId, trackingInfo);
                    applyRumAttribute(trackingInfo, experimentId);
                }
            } 
            // Rest of code for removing attribute...
            break;
        }
        
        // Add this helper function
        function generateFallbackSelectors(selector) {
            if (!selector || typeof selector !== 'string') return [];
            
            const fallbacks = [];
            
            // For ID selectors, don't need fallbacks
            if (selector.startsWith('#') && !selector.includes(' ')) {
                return fallbacks;
            }
            
            // For complex selectors with path
            if (selector.includes('>')) {
                const parts = selector.split('>');
                
                // Extract ID if present
                for (const part of parts) {
                    if (part.includes('#')) {
                        const idMatch = part.match(/#([^.:\s]+)/);
                        if (idMatch && idMatch[0]) {
                            fallbacks.push(idMatch[0]);
                            break;
                        }
                    }
                }
                
                // Create simplified paths by removing last part
                for (let i = parts.length - 1; i > 0; i--) {
                    const simplified = parts.slice(0, i).join('>');
                    if (simplified && simplified !== selector) {
                        fallbacks.push(simplified);
                        if (fallbacks.length >= 3) break;
                    }
                }
            }
            
            return fallbacks;
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
          }
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