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
(function() {
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
     * Get the current experiment ID from body classes
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
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
            
            log('✅ Stored tracking data for experiment:', experimentId, 'selector:', selector);
            return true;
        } catch (e) {
            log('❌ Error storing tracking data:', e);
            return false;
        }
    }
    
    /**
     * Apply the data-rum-source attribute to an element
     */
    function applyRumAttribute(selector, experimentId) {
        if (!selector || !experimentId) {
            log('Invalid data for attribute application - missing selector or experimentId');
            return false;
        }
        
        try {
            log('Looking for element with selector:', selector);
            let element = document.querySelector(selector);
            
            // If that fails, try alternate selector strategies
            if (!element) {
                log('Element not found with original selector, trying alternatives');
                
                // Try last part of the selector (most specific)
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
                    log('Storing and applying RUM attribute for experiment:', experimentId);
                    
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
                    
                    // Apply if this is the active experiment
                    const activeExperimentId = getActiveExperimentId();
                    if (activeExperimentId === experimentId) {
                        applyRumAttribute(elementInfo.selector, experimentId);
                    }
                }
                break;
                
            default:
                // Ignore other messages
                break;
        }
    }
    
    /**
     * Apply tracking for the active experiment on page load
     */
    function applyTrackingOnLoad() {
        const experimentId = getActiveExperimentId();
        if (!experimentId) {
            log('No active experiment found on this page');
            return;
        }
        
        log('Active experiment found:', experimentId);
        
        // Check if we have stored tracking data for this experiment
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const trackingData = JSON.parse(storedData);
                const experimentData = trackingData[experimentId];
                
                if (experimentData && experimentData.selector) {
                    log('Found stored tracking data for experiment:', experimentId);
                    applyRumAttribute(experimentData.selector, experimentId);
                } else {
                    log('No stored tracking data for experiment:', experimentId);
                }
            }
        } catch (e) {
            log('Error applying tracking on load:', e);
        }
    }
    
    /**
     * Add a debug button to the page
     */
    function addDebugButton() {
        if (!DEBUG) return;
        
        const button = document.createElement('button');
        button.textContent = '🔄 RUM Debug';
        button.style.cssText = 'position:fixed; bottom:10px; right:10px; background:#0d66d0; color:white; border:none; border-radius:4px; padding:5px 10px; font-size:12px; z-index:9999; cursor:pointer;';
        
        button.addEventListener('click', function() {
            log('Manual debug refresh triggered');
            applyTrackingOnLoad();
        });
        
        document.body.appendChild(button);
    }
    
    /**
     * Initialize the script
     */
    function init() {
        log('Initializing RUM message handler');
        
        // Add message listener
        window.addEventListener('message', handleMessage);
        
        // Apply tracking on load
        applyTrackingOnLoad();
        
        // Add debug button
        addDebugButton();
        
        // Also apply when visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                log('Page visibility changed to visible');
                applyTrackingOnLoad();
            }
        });
        
        // Listen for DOM changes with MutationObserver
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function(mutations) {
                let shouldReapply = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldReapply = true;
                        break;
                    }
                }
                
                if (shouldReapply) {
                    log('DOM changed, reapplying tracking');
                    setTimeout(applyTrackingOnLoad, 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Export testing functions to window
        window.aemRumDebug = {
            applyTracking: applyTrackingOnLoad,
            getExperimentId: getActiveExperimentId,
            applyAttribute: applyRumAttribute,
            storeData: storeTrackingData
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