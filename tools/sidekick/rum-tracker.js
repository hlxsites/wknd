/**
 * AEM RUM Attribute Auto-Injector
 * Automatically adds data-rum-source attribute on every page load
 */
(function() {
    // Run immediately when script loads
    function injectRumAttributes() {
        // Check if there's an active experiment on this page
        const experimentId = getActiveExperimentId();
        if (!experimentId) {
            console.log('No active experiment on this page');
            return;
        }
        
        // Look for stored element selector for this experiment
        const selector = getStoredSelector(experimentId);
        if (!selector) {
            console.log('No selector stored for experiment:', experimentId);
            return;
        }
        
        // Apply the attribute
        applyAttribute(selector, experimentId);
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
            // Silent fail
        }
        
        return null;
    }
    
    /**
     * Get the stored selector for an experiment
     */
    function getStoredSelector(experimentId) {
        try {
            const storageKey = `aem-experimentation-tracking-element-${experimentId}`;
            return localStorage.getItem(storageKey);
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Apply the data-rum-source attribute to the element
     */
    function applyAttribute(selector, experimentId) {
        if (!selector || !experimentId) return false;
        
        try {
            // Try original selector
            let element = null;
            try {
                element = document.querySelector(selector);
            } catch (e) {
                // Ignore selector errors
            }
            
            // If not found, try simplified selector
            if (!element) {
                const parts = selector.split('>');
                const lastPart = parts[parts.length - 1].trim();
                try {
                    element = document.querySelector(lastPart);
                } catch (e) {
                    // Ignore
                }
            }
            
            // If not found by ID if present
            if (!element) {
                const idMatch = selector.match(/#([a-zA-Z0-9_-]+)/);
                if (idMatch && idMatch[1]) {
                    element = document.getElementById(idMatch[1]);
                }
            }
            
            // Apply attribute if element found
            if (element) {
                const attributeValue = `experiment-${experimentId}`;
                element.setAttribute('data-rum-source', attributeValue);
                console.log(`Applied data-rum-source="${attributeValue}" to element`);
                return true;
            }
        } catch (error) {
            console.error('Error applying attribute:', error);
        }
        
        return false;
    }
    
    // Run on DOM load
    function onDOMReady() {
        injectRumAttributes();
    }
    
    // Run on visibility change (page shown again)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            injectRumAttributes();
        }
    });
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        onDOMReady();
    }
})();