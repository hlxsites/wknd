// eslint-disable-next-line import/no-cycle
import { fetchPlaceholders, sampleRUM } from './lib-franklin.js';
import loadCookieConsent from './cookie-consent/lib-cookie-consent.js';
import { updateUserConsent } from './adobe-martech/index.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// CMP consent
try {
  await fetchPlaceholders();
} catch (e) { /* ignore */ }
loadCookieConsent();

// also check consent stored in localstorage used while developing
const analyticsConsent = localStorage.getItem('consent_status_ANALYTICS');
const targetingConsent = localStorage.getItem('consent_status_PERSONALIZATION');
const marketingConsent = localStorage.getItem('consent_status_MARKETING');
if (analyticsConsent || targetingConsent) {
  await updateUserConsent(analyticsConsent === 'ALLOW');
  updateUserConsent({
    collect: analyticsConsent === 'ALLOW',
    marketing: marketingConsent === 'ALLOW',
    personalize: targetingConsent === 'ALLOW',
    share: marketingConsent === 'ALLOW',
  });
}
