/**
 * AEM Experimentation RUM Track Message Handler
 * Simplified but resilient version
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
     * Get active experiments from window.hlx or localStorage
     */
    function getActiveExperiments() {
      const experiments = [];
  
      // Check window.hlx.experiments (preferred)
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
      
      // Check localStorage as fallback
      if (experiments.length === 0) {
        try {
          const storedExps = localStorage.getItem('unified-decisioning-experiments');
          if (storedExps) {
            Object.keys(JSON.parse(storedExps)).forEach(id => experiments.push(id));
          }
        } catch (e) {
          log('Error reading experiments from localStorage', e);
        }
      }
  
      return experiments;
    }
  
    /**
     * Store tracking data in localStorage with support for multiple selectors
     */
    function storeTrackingData(experimentId, elementInfo) {
      if (!experimentId || !elementInfo) {
        log('Missing data for storage');
        return false;
      }
  
      try {
        // Get existing tracking data
        let trackingData = {};
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          try {
            trackingData = JSON.parse(storedData);
          } catch (e) {
            log('Error parsing stored data, creating new tracking data', e);
          }
        }
  
        // Update tracking for this experiment
        trackingData[experimentId] = {
          // Primary selector
          selector: elementInfo.selector,
          
          // Alternative selectors for resilience
          alternativeSelectors: elementInfo.alternativeSelectors || [],
          
          // Display name for debugging
          displayName: elementInfo.displayName || 'Selected Element',
          
          // Element semantic type
          semanticType: elementInfo.semanticType || 'unknown',
          
          // Text content for content-based matching
          textContent: elementInfo.textContent || null,
          
          // Timestamp for debugging
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
     * Find element using resilient selectors
     * Tries multiple selector strategies to find element even if DOM changes
     */
    function findElementResilience(trackingInfo) {
      if (!trackingInfo) return null;
      
      // 1. Try primary selector
      if (trackingInfo.selector) {
        try {
          const element = document.querySelector(trackingInfo.selector);
          if (element) {
            log('Found element with primary selector:', trackingInfo.selector);
            return element;
          }
        } catch (e) {
          log('Error with primary selector:', e);
        }
      }
      
      // 2. Try alternative selectors
      if (trackingInfo.alternativeSelectors && trackingInfo.alternativeSelectors.length) {
        for (const selector of trackingInfo.alternativeSelectors) {
          // Skip text-based selectors which use our custom format
          if (selector.startsWith('__text__:')) continue;
          
          try {
            const element = document.querySelector(selector);
            if (element) {
              log('Found element with alternative selector:', selector);
              return element;
            }
          } catch (e) {
            log('Error with alternative selector:', selector, e);
          }
        }
      }
      
      // 3. Try text-based matching for buttons/links
      if (trackingInfo.textContent && ['button', 'button-link', 'link'].includes(trackingInfo.semanticType)) {
        log('Trying text-based matching:', trackingInfo.textContent);
        
        const tagSelectors = {
          'button': 'button',
          'button-link': 'a',
          'link': 'a'
        };
        
        const tagSelector = tagSelectors[trackingInfo.semanticType] || 'button, a';
        
        // Find elements with matching text
        const elements = Array.from(document.querySelectorAll(tagSelector));
        const match = elements.find(el => 
          el.textContent && 
          el.textContent.trim() === trackingInfo.textContent
        );
        
        if (match) {
          log('Found element with matching text content');
          return match;
        }
      }
      
      // 4. For form elements, try to find within form
      if (trackingInfo.context && trackingInfo.context.inForm) {
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
          // Try to find buttons in forms
          if (['button', 'submit'].includes(trackingInfo.semanticType)) {
            log('Looking for button in forms');
            for (const form of forms) {
              const buttons = form.querySelectorAll('button, input[type="submit"]');
              if (buttons.length > 0) {
                log('Found button in form as fallback');
                return buttons[buttons.length - 1]; // Use last button (likely submit)
              }
            }
          }
        }
      }
      
      // 5. If it's a section experiment, try section fallback
      if (trackingInfo.context && trackingInfo.context.section) {
        const sectionSelector = `.${trackingInfo.context.section}`;
        try {
          const section = document.querySelector(sectionSelector);
          if (section) {
            log('Found section for section experiment');
            
            // Try to find interactive elements in section
            const interactive = section.querySelectorAll('button, a[href], input[type="submit"]');
            if (interactive.length > 0) {
              log('Found interactive element in section');
              return interactive[interactive.length - 1]; // Use last one (likely CTA)
            }
            
            // Fallback to section itself
            return section;
          }
        } catch (e) {
          log('Error with section fallback', e);
        }
      }
      
      return null;
    }
  
    /**
     * Apply RUM attribute to element with fallback strategies
     */
    function applyRumAttribute(trackingInfo, experimentId) {
      if (!experimentId || !trackingInfo) {
        log('Invalid data for RUM attribute application');
        return false;
      }
  
      try {
        // Find the element using resilient selector strategy
        const element = findElementResilience(trackingInfo);
        
        if (element) {
          // Apply the attribute
          const attributeValue = `experiment-${experimentId}`;
          element.setAttribute('data-rum-source', attributeValue);
          log(`✅ Applied data-rum-source="${attributeValue}" to:`, element);
  
          // Add visual indicator in debug mode
          if (DEBUG) {
            element.style.outline = '2px solid #0d66d0';
            element.style.outlineOffset = '2px';
            
            // Add tooltip to show tracking info on hover
            element.setAttribute('title', `Tracking: ${trackingInfo.displayName || experimentId}`);
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
     * Apply tracking for all active experiments on page load
     */
    function applyTrackingOnLoad() {
      const experimentIds = getActiveExperiments();
      if (experimentIds.length === 0) {
        log('No active experiments found on this page');
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
  
      log('📨 Received message from MFE:', event.data);
  
      switch (event.data.action) {
        case 'track-element': {
          try {
            const { experimentId, elementInfo } = event.data;
            
            if (experimentId && elementInfo) {
              log(`Processing tracking for experiment: ${experimentId}`);
              
              // Store the tracking info with all resilient selectors
              storeTrackingData(experimentId, elementInfo);
              
              // Apply the data-rum-source attribute
              applyRumAttribute(elementInfo, experimentId);
              
              // Send confirmation back to MFE
              try {
                window.parent.postMessage({
                  source: 'AEMRumClient',
                  action: 'element-tracked',
                  experimentId,
                  success: true
                }, '*');
              } catch (e) {
                log('Error sending confirmation message', e);
              }
            }
          } catch (error) {
            log('Error handling track-element message:', error);
          }
          break;
        }
        
        case 'apply-rum-attribute': {
          const { selector, value } = event.data;
          
          if (selector && value && value.startsWith('experiment-')) {
            const experimentId = value.replace('experiment-', '');
            log('Storing and applying RUM attribute directly');
            
            // Create minimal tracking info
            const trackingInfo = {
              selector,
              alternativeSelectors: [],
              displayName: 'Direct selection'
            };
            
            // Store and apply
            storeTrackingData(experimentId, trackingInfo);
            applyRumAttribute(trackingInfo, experimentId);
          } else if (selector && !value) {
            // This is a request to remove the attribute
            try {
              const element = document.querySelector(selector);
              if (element) {
                element.removeAttribute('data-rum-source');
                log('✅ Removed data-rum-source attribute');
                
                // Remove debug styling
                if (DEBUG) {
                  element.style.outline = '';
                  element.style.outlineOffset = '';
                }
              }
            } catch (e) {
              log('Error removing attribute:', e);
            }
          }
          break;
        }
      }
    }
  
    /**
     * Add debugging utilities
     */
    function setupDebugTools() {
      if (!DEBUG) return;
      
      window.aemRumDebug = {
        // Inspect stored tracking data
        showStoredData: () => {
          try {
            const data = localStorage.getItem(STORAGE_KEY);
            console.log('Stored tracking data:', data ? JSON.parse(data) : 'None');
            return data ? JSON.parse(data) : null;
          } catch (e) {
            console.error('Error parsing tracking data', e);
            return null;
          }
        },
        
        // Test element finding with a given experiment ID
        testElementFinding: (experimentId) => {
          try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return 'No tracking data stored';
            
            const trackingData = JSON.parse(data);
            const info = trackingData[experimentId];
            
            if (!info) return `No tracking info for experiment ${experimentId}`;
            
            console.log('Testing element finding for', experimentId);
            console.log('Tracking info:', info);
            
            const element = findElementResilience(info);
            return element ? 
              { found: true, element, info } : 
              { found: false, info };
          } catch (e) {
            console.error('Error testing element finding', e);
            return { error: e.message };
          }
        },
        
        // Apply tracking to all experiments
        applyAllTracking: () => {
          applyTrackingOnLoad();
          return 'Applied tracking to all active experiments';
        }
      };
    }
  
    /**
     * Initialize the script
     */
    function init() {
      log('Initializing AEM RUM handler');
      
      // Set up message listener
      window.addEventListener('message', handleMessage);
      
      // Apply tracking on init
      applyTrackingOnLoad();
      
      // Watch for DOM changes
      if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(mutations => {
          if (mutations.some(m => m.type === 'childList' && m.addedNodes.length > 0)) {
            log('DOM changed, reapplying tracking');
            setTimeout(applyTrackingOnLoad, 300);
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      }
      
      // Set up debug tools
      setupDebugTools();
      
      log('Initialization complete');
    }
  
    // Run when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  