// eslint-disable-next-line import/no-cycle
import { fetchPlaceholders, sampleRUM } from './lib-franklin.js';
import loadCookieConsent from './cookie-consent/lib-cookie-consent.js';
import { analyticsSetConsent } from './analytics/lib-analytics.js';

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
if (analyticsConsent) {
  await analyticsSetConsent(analyticsConsent === 'ALLOW');
}
