/**
 * Loads and configures the cookie consent library:
 *
 * https://github.com/sandstreamdev/cookieconsent
 */
import { getPlaceholderOrDefault } from '../lib-franklin.js';
import { analyticsSetConsent } from '../analytics/lib-analytics.js';

const REVOKE_CONSENT_ELEMENT_ID = 'cc-revoke-choice';
const configureCookieConsent = () => {
  if (!window.CookieConsent) {
    // eslint-disable-next-line no-console
    console.warn('Cookie Consent not loaded');
    return;
  }

  const CC = window.CookieConsent;

  const cc = new CC({
    // options: https://github.com/sandstreamdev/cookieconsent/blob/dev/src/options/popup.js#L25
    type: 'opt-in',
    container: document.querySelector('footer'),
    consentSettingsElementId: REVOKE_CONSENT_ELEMENT_ID,
    layout: 'categories',
    cookie: {
      domain: window.location.hostname,
    },
    showCategories: {
      [CC.UNCATEGORIZED]: false,
      [CC.ESSENTIAL]: true,
      [CC.PERSONALIZATION]: false,
      [CC.ANALYTICS]: true,
      [CC.MARKETING]: false,
    },
    content: {
      header: getPlaceholderOrDefault('cookieConsentContentHeader', 'Cookies used on the website!'),
      message: getPlaceholderOrDefault('cookieConsentContentMessage', 'We would like to measure how you browse our website to constantly improve it, based on your usage patterns. To accomplish this, we must store cookies on your device. If you\'re cool with that, hit "Accept all cookies". For more information and to customize your settings, hit "Customize settings".'),
      dismiss: getPlaceholderOrDefault('cookieConsentContentDismiss', 'Got it!'),
      allow: getPlaceholderOrDefault('cookieConsentContentAllow', 'Accept all cookies'),
      deny: getPlaceholderOrDefault('cookieConsentContentDeny', 'Decline'),
      link: getPlaceholderOrDefault('cookieConsentContentLink', 'Learn more'),
      href: getPlaceholderOrDefault('cookieConsentContentHref', 'https://www.cookiesandyou.com'),
      close: getPlaceholderOrDefault('cookieConsentContentClose', '&#x274c'),
      target: getPlaceholderOrDefault('cookieConsentContentTarget', '_blank'),
      policy: getPlaceholderOrDefault('cookieConsentContentPolicy', 'Cookie Policy'),
      customize: getPlaceholderOrDefault('cookieConsentContentCustomize', 'Customize settings'),
      customizeHeader: getPlaceholderOrDefault('cookieConsentContentCustomizeHeader', 'Review and manage your consent'),
      customizeMessage: getPlaceholderOrDefault('cookieConsentContentCustomizeMessage', 'Here is an overview of the cookies we use on this site. Please select categories that you are OK with. You can always change your choices at any time, by hitting the "Manage your consent options" link on the site\'s footer.'),
      acceptSelected: getPlaceholderOrDefault('cookieConsentContentAcceptSelected', 'Accept selected'),
      categoryAnalytics: getPlaceholderOrDefault('cookieConsentContentCategoryAnalytics', 'These cookies collect information to help us understand how our website is being used. They allow us to count unique visits and see from where visitors came from. With this information, we can measure and improve the content of our site. We can also see how users navigate between pages and what actions they take.'),
      categoryEssential: getPlaceholderOrDefault('cookieConsentContentCategoryEssential', 'These cookies are necessary to make this site run properly and securely. For example, with this kind of cookies, we register your cookie preferences so that you won\'t be seeing this pop-up next time you visit our page and we can keep track which categories you have opted-in. To keep this site secure, we use <a class="cc-link" href="https://www.cloudflare.com/privacypolicy/" rel="noopener noreferrer" target="_blank">Cloudflare</a> content delivery network and security solutions. The service may place a unique cookie to identify your browser and device to make sure no automated programs can impose security threats on our site.'),
      categoryPersonalization: getPlaceholderOrDefault('cookieConsentContentCategoryPersonalization', '[Personalization category read more message]'),
      categoryMarketing: getPlaceholderOrDefault('cookieConsentContentCategoryMarketing', '[Marketing category read more message]'),
      categoryUncategorized: getPlaceholderOrDefault('cookieConsentContentCategoryUncategorized', '[Uncategorized category read more message]'),
      cookiePolicyLink: getPlaceholderOrDefault('cookieConsentContentCookiePolicyLink', ''),
      privacyPolicyLink: getPlaceholderOrDefault('cookieConsentContentPrivacyPolicyLink', ''),
      policiesLinkRel: getPlaceholderOrDefault('cookieConsentContentPoliciesLinkRel', 'noopener noreferrer nofollow'),
      categoryUncategorizedDisplayName: getPlaceholderOrDefault('cookieConsentContentCategoryUncategorizedDisplayName', 'Uncategorized'),
      categoryEssentialDisplayName: getPlaceholderOrDefault('cookieConsentContentCategoryEssentialDisplayName', 'Necessary (always active)'),
      categoryPersonalizationDisplayName: getPlaceholderOrDefault('cookieConsentContentCategoryPersonalizationDisplayName', 'Personalization'),
      categoryAnalyticsDisplayName: getPlaceholderOrDefault('cookieConsentContentCategoryAnalyticsDisplayName', 'Analytics'),
      categoryMarketingDisplayName: getPlaceholderOrDefault('cookieConsentContentCategoryMarketingDisplayName', 'Marketing'),
    },
    elements: {
      policiesLinks: getPlaceholderOrDefault('cookieConsentPoliciesLinks', `<div class="cc-policies-links">For more information, please see our 
      <a class="cc-link" href="{{cookiePolicyLink}}" rel="{{policiesLinkRel}}" target="_blank">Cookie Policy</a> and 
      <a class="cc-link" href="{{privacyPolicyLink}}" rel="{{policiesLinkRel}}" target="_blank">Privacy Policy</a>.</div>`),
    },
  });

  function getConsentForCategory(category) {
    const { consents } = cc;

    return consents[category];
  }

  function applyConsent() {
    if (window.alloy) {
      analyticsSetConsent(getConsentForCategory(CC.ANALYTICS));
    }
  }

  cc.on('initialized', () => {
    if (cc.isCookieSet(`${cc.popup.options.cookie.name}_${CC.ANALYTICS}`)) {
      // apply consent only if cookie is set, as cc starts with consents set to DENY as default and
      // keeps them to DENY if no cookie is set, whereas alloy should remain pending meanwhile
      applyConsent();
    }
  });

  cc.on('popupClosed', () => {
    applyConsent();
  });
};

export default function loadCookieConsent() {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', '/styles/cookie-consent/cookieconsent.min.css');

  const script = document.createElement('script');
  script.setAttribute('async', 'true');
  script.src = '/scripts/cookie-consent/cookieconsent.min.js';
  script.onload = configureCookieConsent;

  document.head.appendChild(link);
  document.head.appendChild(script);
}
