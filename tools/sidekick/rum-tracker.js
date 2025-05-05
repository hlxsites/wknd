/**
 * AEM Experimentation RUM Tracker
 * - Listens for messages from the experimentation MFE
 * - Stores tracking data in localStorage
 * - Auto-applies data-rum-source attributes on page load
 */
(function() {
    // Configuration
    const STORAGE_KEY = 'aem-rum-tracking';
    const RUM_ATTRIBUTE = 'data-rum-source';
    const DEBUG = true; // Set to false in production
    
    /**
     * Log message if in debug mode
     */
    function log(...args) {
        if (DEBUG) {
            console.log('[RUM Tracker]', ...args);
        }
    }
    
    /**
     * Get the active experiment ID from body classes
     */
    function getActiveExperimentId() {
        // Check body classes
        const bodyClasses = document.body.classList;
        for (let i = 0; i < bodyClasses.length; i++) {
            const cls = bodyClasses[i];
            if (cls.startsWith('experiment-')) {
                return cls.replace('experiment-', '');
            }
        }
        
        // Check localStorage as fallback
        try {
            const experimentsData = localStorage.getItem('unified-decisioning-experiments');
            if (experimentsData) {
                const experiments = JSON.parse(experimentsData);
                return Object.keys(experiments)[0] || null;
            }
        } catch (e) {
            log('Error reading experiments data:', e);
        }
        
        return null;
    }
    
    /**
     * Store tracking data in localStorage
     */
    function storeTrackingData(experimentId, selector) {
        if (!experimentId || !selector) return false;
        
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
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
            
            log('Stored tracking data for experiment:', experimentId, 'selector:', selector);
            return true;
        } catch (e) {
            log('Error storing tracking data:', e);
            return false;
        }
    }
    
    /**
     * Get tracking data from localStorage
     */
    function getTrackingData(experimentId) {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const trackingData = JSON.parse(storedData);
                return experimentId ? trackingData[experimentId] : trackingData;
            }
        } catch (e) {
            log('Error getting tracking data:', e);
        }
        
        return experimentId ? null : {};
    }
    
    /**
     * Apply the data-rum-source attribute to an element
     */
    function applyRumAttribute(selector, experimentId) {
        if (!selector || !experimentId) return false;
        
        try {
            log('Looking for element with selector:', selector);
            
            // Try different selector strategies
            let element = findElement(selector);
            
            if (element) {
                const attributeValue = `experiment-${experimentId}`;
                element.setAttribute(RUM_ATTRIBUTE, attributeValue);
                log(`Applied ${RUM_ATTRIBUTE}="${attributeValue}" to:`, element);
                
                // Add visual indicator in debug mode
                if (DEBUG) {
                    const originalStyle = element.getAttribute('style') || '';
                    element.setAttribute('style', originalStyle + '; outline: 2px solid #0d66d0 !important;');
                }
                
                return true;
            } else {
                log('Element not found with selector:', selector);
            }
        } catch (error) {
            log('Error applying attribute:', error);
        }
        
        return false;
    }
    
    /**
     * Find an element using multiple selector strategies
     */
    function findElement(selector) {
        let element = null;
        
        // Strategy 1: Try original selector
        try {
            element = document.querySelector(selector);
            if (element) {
                log('Found with original selector');
                return element;
            }
        } catch (e) {
            log('Original selector failed:', e.message);
        }
        
        // Strategy 2: Look for ID in the selector
        const idMatch = selector.match(/#([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            element = document.getElementById(idMatch[1]);
            if (element) {
                log('Found with ID selector');
                return element;
            }
        }
        
        // Strategy 3: Try last part of the selector (most specific)
        try {
            const parts = selector.split('>');
            const lastPart = parts[parts.length - 1].trim();
            
            const candidates = document.querySelectorAll(lastPart);
            if (candidates.length === 1) {
                log('Found with simplified selector');
                return candidates[0];
            } else if (candidates.length > 0) {
                log('Found multiple matches with simplified selector, using first');
                return candidates[0];
            }
        } catch (e) {
            log('Simplified selector failed:', e.message);
        }
        
        return null;
    }
    
    /**
     * Apply tracking attributes for all stored experiments
     */
    function applyAllStoredAttributes() {
        log('Applying stored RUM attributes');
        
        // Get currently active experiment
        const activeExperimentId = getActiveExperimentId();
        log('Active experiment:', activeExperimentId);
        
        // Always apply for active experiment if found
        if (activeExperimentId) {
            const data = getTrackingData(activeExperimentId);
            if (data && data.selector) {
                log('Found tracking data for active experiment', activeExperimentId);
                applyRumAttribute(data.selector, activeExperimentId);
            }
        }
        
        // In debug mode, apply for all stored experiments
        if (DEBUG) {
            const allData = getTrackingData();
            for (const expId in allData) {
                if (expId !== activeExperimentId && allData[expId].selector) {
                    log('Applying for non-active experiment (debug):', expId);
                    applyRumAttribute(allData[expId].selector, expId);
                }
            }
        }
    }
    
    /**
     * Handle messages from the experimentation MFE
     */
    function handleMessage(event) {
        // Only process messages from known origins
        // You can restrict this to specific origins if needed
        
        // Check if this is a message from the experimentation MFE
        if (!event.data || event.data.source !== 'AEMExperimentation') {
            return;
        }
        
        log('Received message from experimentation MFE:', event.data);
        
        // Handle different message types
        if (event.data.action === 'track-element') {
            // Handle element tracking message
            const { experimentId, elementInfo } = event.data;
            
            if (experimentId && elementInfo && elementInfo.selector) {
                log('Storing tracking data for experiment:', experimentId);
                
                // Store in localStorage
                storeTrackingData(experimentId, elementInfo.selector);
                
                // Apply immediately if this is the active experiment
                const activeExperimentId = getActiveExperimentId();
                if (activeExperimentId === experimentId) {
                    applyRumAttribute(elementInfo.selector, experimentId);
                }
            }
        } else if (event.data.action === 'apply-rum-attribute') {
            // Handle direct attribute application
            const { selector, value } = event.data;
            
            if (selector && value && value.startsWith('experiment-')) {
                const experimentId = value.replace('experiment-', '');
                
                // Store for future use
                storeTrackingData(experimentId, selector);
                
                // Apply immediately
                applyRumAttribute(selector, experimentId);
            }
        }
    }
    
    /**
     * Initialize the script
     */
    function init() {
        log('Initializing RUM Tracker');
        
        // Listen for messages from the experimentation MFE
        window.addEventListener('message', handleMessage);
        
        // Apply attributes from stored data
        applyAllStoredAttributes();
        
        // Apply when visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                log('Page visibility changed to visible');
                applyAllStoredAttributes();
            }
        });
        
        // Listen for experiment events
        document.addEventListener('rum', function(event) {
            if (event.detail && (event.detail.checkpoint === 'experiment' || event.detail.checkpoint === 'convert')) {
                log('RUM event detected:', event.detail);
                applyAllStoredAttributes();
            }
        });
        
        // Setup MutationObserver to reapply when DOM changes
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(function(mutations) {
                let shouldReapply = false;
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldReapply = true;
                    }
                });
                
                if (shouldReapply) {
                    log('DOM changed, reapplying attributes');
                    setTimeout(applyAllStoredAttributes, 100);
                }
            });
            
            observer.observe(document.body, { 
                childList: true,
                subtree: true
            });
            log('MutationObserver set up');
        }
        
        // Export utility functions for manual testing
        window.aemRumTracker = {
            applyAll: applyAllStoredAttributes,
            getActiveExperiment: getActiveExperimentId,
            getTracking: getTrackingData,
            applyAttribute: applyRumAttribute
        };
        
        // Add debug button if in debug mode
        if (DEBUG) {
            const button = document.createElement('button');
            button.textContent = '🏷️ RUM Tracker';
            button.style.cssText = 'position:fixed; bottom:10px; right:10px; background:#0d66d0; color:white; border:none; border-radius:4px; padding:5px 10px; font-size:12px; z-index:9999; cursor:pointer;';
            button.addEventListener('click', function() {
                applyAllStoredAttributes();
                alert('RUM attributes reapplied. Check console for details.');
            });
            document.body.appendChild(button);
        }
        
        log('Initialization complete');
    }
    
    // Run initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();