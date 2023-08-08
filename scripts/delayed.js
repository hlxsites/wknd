// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { analyticsSetConsent } from './analytics/lib-analytics.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// check consent stored for now in localstorage
const analyticsConsent = localStorage.getItem('consent_status_ANALYTICS');
await analyticsSetConsent(analyticsConsent === 'ALLOW');
