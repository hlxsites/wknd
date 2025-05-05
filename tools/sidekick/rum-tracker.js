/**
 * AEM Experimentation RUM Tracking Script
 * Applies data-rum-source attribute to tracked elements
 */
(function() {
    // Constants
    const TRACKING_STORAGE_PREFIX = 'aem-experimentation-tracking-element-';
    const RUM_DATA_ATTR = 'data-rum-source';
    
    /**
     * Check if the page has an active experiment
     * @returns {string|null} Experiment ID or null
     */
    function getActiveExperimentId() {
        // Check for experiment class on body
        const bodyClasses = document.body.classList;
        for (let i = 0; i < bodyClasses.length; i++) {
            const cls = bodyClasses[i];
            if (cls.startsWith('experiment-')) {
                return cls.replace('experiment-', '');
            }
        }

        // Check RUM experiments data if available
        if (window.hlx && window.hlx.rum) {
            try {
                const experimentsData = localStorage.getItem('unified-decisioning-experiments');
                if (experimentsData) {
                    const experiments = JSON.parse(experimentsData);
                    return Object.keys(experiments)[0] || null;
                }
            } catch (e) {
                console.error('[AEM Experimentation] Error reading experiment data:', e);
            }
        }
        
        return null;
    }
    
    /**
     * Apply the RUM source attribute to an element
     */
    function applyRumAttribute(elementSelector, experimentId) {
        if (!elementSelector || !experimentId) return false;
        
        try {
            const element = document.querySelector(elementSelector);
            if (element) {
                const attributeValue = `experiment-${experimentId}`;
                if (element.getAttribute(RUM_DATA_ATTR) !== attributeValue) {
                    element.setAttribute(RUM_DATA_ATTR, attributeValue);
                    console.log(`[AEM Experimentation] Applied ${RUM_DATA_ATTR}="${attributeValue}" to:`, elementSelector);
                }
                return true;
            } else {
                console.log(`[AEM Experimentation] Element not found for selector: ${elementSelector}`);
            }
        } catch (error) {
            console.error('[AEM Experimentation] Error applying attribute:', error);
        }
        
        return false;
    }
    
    /**
     * Handle PostMessage from the MFE
     */
    function handleTrackingMessage(event) {
        // Validate message
        if (!event.data || 
            event.data.source !== 'AEMExperimentation' || 
            event.data.action !== 'track-element') {
            return;
        }
        
        const { experimentId, elementInfo } = event.data;
        
        if (!experimentId || !elementInfo) {
            console.warn('[AEM Experimentation] Incomplete tracking data received');
            return;
        }
        
        // Store in localStorage as backup
        try {
            const storageKey = `${TRACKING_STORAGE_PREFIX}${experimentId}`;
            localStorage.setItem(storageKey, elementInfo.selector || '');
        } catch (e) {
            // Storage might fail in private browsing
        }
        
        // Apply if this is for the current experiment
        const activeExperimentId = getActiveExperimentId();
        if (activeExperimentId === experimentId) {
            applyRumAttribute(elementInfo.selector, experimentId);
        }
    }
    
    /**
     * Apply RUM attribute from localStorage data
     */
    function applyFromStorage() {
        const experimentId = getActiveExperimentId();
        if (!experimentId) return;
        
        try {
            // Try to get element selector from localStorage
            const storageKey = `${TRACKING_STORAGE_PREFIX}${experimentId}`;
            const elementSelector = localStorage.getItem(storageKey);
            
            if (elementSelector) {
                applyRumAttribute(elementSelector, experimentId);
            }
        } catch (e) {
            console.error('[AEM Experimentation] Error applying from storage:', e);
        }
    }
    
    /**
     * Initialize the tracking script
     */
    function init() {
        // Set up message listener
        window.addEventListener('message', handleTrackingMessage);
        
        // Apply from storage on page load and visibility changes
        applyFromStorage();
        
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                applyFromStorage();
            }
        });
        
        // Listen for DOM changes to reapply if needed
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === RUM_DATA_ATTR &&
                    !mutation.target.getAttribute(RUM_DATA_ATTR)) {
                    // Attribute was removed, try to reapply
                    applyFromStorage();
                }
            });
        });
        
        observer.observe(document.body, { 
            subtree: true, 
            attributes: true,
            attributeFilter: [RUM_DATA_ATTR]
        });
        
        // Also integrate with native RUM if available
        if (window.hlx && window.hlx.rum) {
            console.log('[AEM Experimentation] RUM detected, integration active');
            
            // Add a custom listener for RUM events
            document.addEventListener('rum', function(event) {
                if (event.detail && event.detail.checkpoint === 'experiment') {
                    console.log('[AEM Experimentation] RUM experiment event detected, reapplying attributes');
                    // Wait a bit for DOM changes
                    setTimeout(applyFromStorage, 100);
                }
            });
        }
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();