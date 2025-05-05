/**
 * AEM Experimentation RUM Debug Script
 * Adds this to your page project to track and verify messages
 */
(function() {
    console.log('🔍 AEM EXPERIMENTATION RUM DEBUG SCRIPT ACTIVE');
    console.log('📊 Current RUM data:', window.hlx?.rum);
    
    // Constants
    const TRACKING_STORAGE_PREFIX = 'aem-experimentation-tracking-element-';
    const RUM_DATA_ATTR = 'data-rum-source';
    
    // Track message receipts
    let messageCount = 0;
    
    /**
     * Check if the page has an active experiment
     */
    function getActiveExperimentId() {
        // Check for experiment class on body
        const bodyClasses = document.body.classList;
        let experimentId = null;
        
        for (let i = 0; i < bodyClasses.length; i++) {
            const cls = bodyClasses[i];
            if (cls.startsWith('experiment-')) {
                experimentId = cls.replace('experiment-', '');
                break;
            }
        }
        
        console.log('🧪 Active experiment from body class:', experimentId);
        
        // Also check localStorage
        try {
            const experimentsData = localStorage.getItem('unified-decisioning-experiments');
            if (experimentsData) {
                console.log('💾 Experiments data in localStorage:', experimentsData);
                const experiments = JSON.parse(experimentsData);
                const storageExperimentId = Object.keys(experiments)[0] || null;
                console.log('🧪 Experiment from localStorage:', storageExperimentId);
                
                // Prefer body class if available
                return experimentId || storageExperimentId;
            }
        } catch (e) {
            console.error('Error checking localStorage:', e);
        }
        
        return experimentId;
    }
    
    /**
     * Apply RUM attribute to an element
     */
    function applyRumAttribute(elementSelector, experimentId) {
        if (!elementSelector || !experimentId) {
            console.log('❌ Missing selector or experiment ID');
            return false;
        }
        
        try {
            console.log('🔍 Looking for element:', elementSelector);
            const element = document.querySelector(elementSelector);
            
            if (element) {
                const attributeValue = `experiment-${experimentId}`;
                element.setAttribute(RUM_DATA_ATTR, attributeValue);
                console.log('✅ APPLIED ATTRIBUTE:');
                console.log(`   ${RUM_DATA_ATTR}="${attributeValue}"`);
                console.log('   To element:', element);
                
                // Highlight the element visually
                const originalStyle = element.getAttribute('style') || '';
                element.setAttribute('style', originalStyle + '; outline: 3px solid red !important; position: relative;');
                
                // Add a floating label
                const label = document.createElement('div');
                label.textContent = 'RUM Tracked: ' + experimentId;
                label.style.cssText = 'position: absolute; top: -20px; left: 0; background: red; color: white; padding: 2px 5px; font-size: 10px; z-index: 9999;';
                element.appendChild(label);
                
                return true;
            } else {
                console.log('❌ ELEMENT NOT FOUND:', elementSelector);
                // Try a simpler selector
                const simplifiedSelector = elementSelector.split(' ').pop();
                if (simplifiedSelector && simplifiedSelector !== elementSelector) {
                    console.log('🔄 Trying simplified selector:', simplifiedSelector);
                    const alternateElement = document.querySelector(simplifiedSelector);
                    if (alternateElement) {
                        const attributeValue = `experiment-${experimentId}`;
                        alternateElement.setAttribute(RUM_DATA_ATTR, attributeValue);
                        console.log('✅ APPLIED ATTRIBUTE with simplified selector:');
                        console.log('   Element:', alternateElement);
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Error applying attribute:', error);
        }
        
        return false;
    }
    
    /**
     * Handle tracking messages from MFE
     */
    function handleTrackingMessage(event) {
        messageCount++;
        
        console.log(`📩 MESSAGE #${messageCount} RECEIVED FROM: ${event.origin}`);
        console.log('📄 DATA:', JSON.stringify(event.data, null, 2));
        
        // Process AEM Experimentation messages
        if (event.data && 
            event.data.source === 'AEMExperimentation') {
            
            console.log('🎯 AEM EXPERIMENTATION MESSAGE DETECTED!');
            console.log('Action:', event.data.action);
            
            if (event.data.action === 'track-element') {
                const { experimentId, elementInfo } = event.data;
                
                if (!experimentId || !elementInfo) {
                    console.warn('⚠️ Incomplete tracking data');
                    return;
                }
                
                // Store in localStorage
                try {
                    const storageKey = `${TRACKING_STORAGE_PREFIX}${experimentId}`;
                    localStorage.setItem(storageKey, elementInfo.selector || '');
                    console.log('💾 STORED IN LOCALSTORAGE:');
                    console.log(`   Key: ${storageKey}`);
                    console.log(`   Value: ${elementInfo.selector}`);
                } catch (e) {
                    console.error('Error storing in localStorage:', e);
                }
                
                // Apply attribute if this is the active experiment
                const activeExperimentId = getActiveExperimentId();
                console.log('Current active experiment:', activeExperimentId);
                console.log('Message is for experiment:', experimentId);
                
                // Always apply for debugging
                applyRumAttribute(elementInfo.selector, experimentId);
            }
            else if (event.data.action === 'apply-rum-attribute') {
                console.log('🏷️ APPLY ATTRIBUTE MESSAGE:');
                console.log('   Selector:', event.data.selector);
                console.log('   Attribute:', event.data.attribute);
                console.log('   Value:', event.data.value);
                
                if (event.data.value && event.data.value.startsWith('experiment-')) {
                    const experimentId = event.data.value.replace('experiment-', '');
                    applyRumAttribute(event.data.selector, experimentId);
                }
            }
        }
        
        console.log('============================');
    }
    
    /**
     * Check localStorage and apply attributes
     */
    function applyFromStorage() {
        console.log('🔄 CHECKING LOCALSTORAGE FOR TRACKING DATA');
        const experimentId = getActiveExperimentId();
        if (!experimentId) {
            console.log('❌ NO ACTIVE EXPERIMENT FOUND');
            return;
        }
        
        console.log('🧪 ACTIVE EXPERIMENT:', experimentId);
        
        try {
            const storageKey = `${TRACKING_STORAGE_PREFIX}${experimentId}`;
            const elementSelector = localStorage.getItem(storageKey);
            
            console.log('🔍 LOCALSTORAGE CHECK:');
            console.log(`   Key: ${storageKey}`);
            console.log(`   Value: ${elementSelector || 'not found'}`);
            
            if (elementSelector) {
                applyRumAttribute(elementSelector, experimentId);
            } else {
                console.log('⚠️ No selector found in localStorage');
            }
        } catch (e) {
            console.error('Error applying from storage:', e);
        }
    }
    
    // Set up event listeners
    window.addEventListener('message', handleTrackingMessage);
    
    // Initial check
    console.log('🚀 AEM EXPERIMENTATION TRACKING DEBUG ACTIVE');
    console.log('🔍 CHECKING FOR ACTIVE EXPERIMENT...');
    applyFromStorage();
    
    // Make functions globally available for testing
    window.aemExpDebug = {
        checkStorage: applyFromStorage,
        checkExperiment: getActiveExperimentId,
        applyAttribute: applyRumAttribute,
        messageCount: () => messageCount
    };
    
    console.log('🔧 DEBUG FUNCTIONS AVAILABLE AT window.aemExpDebug');
    
    // Create visual indicator
    const debugIndicator = document.createElement('div');
    debugIndicator.innerHTML = '🧪 AEM Exp Debug';
    debugIndicator.style.cssText = 'position: fixed; bottom: 10px; right: 10px; background: red; color: white; padding: 5px 10px; z-index: 9999; font-size: 12px; cursor: pointer;';
    debugIndicator.onclick = function() {
        console.log('🔄 Manual check triggered');
        applyFromStorage();
        alert('RUM Debug: ' + messageCount + ' messages received\nActive experiment: ' + getActiveExperimentId() + '\nCheck console for details');
    };
    document.body.appendChild(debugIndicator);
})();