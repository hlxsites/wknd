const IMS_API_KEY = 'sdm-eureka-api-key';
const POLARIS_API_KEY_STAGE = 'polaris-asset-search-api-key';
const POLARIS_API_KEY_PROD = 'asset_search_service';
const AUTHOR_API_KEY = 'aem-assets-backend-nr-1';
const AS_MFE_STAGE = 'https://experience-stage.adobe.com/solutions/CQ-assets-selectors/assets/resources/asset-selectors.js';
const AS_MFE_PROD = 'https://experience.adobe.com/solutions/CQ-assets-selectors/assets/resources/asset-selectors.js';
const DISCOVERY_URL_STAGE = 'https://aem-discovery-stage.adobe.io';
const DISCOVERY_URL_PROD = 'https://aem-discovery.adobe.io';
const CM_SUFFIX_STAGE = '-cmstg.adobeaemcloud.com';
const CM_SUFFIX_PROD = '.adobeaemcloud.com';
const IMS_ENV_STAGE = 'stg1';
const IMS_ENV_PROD = 'prod';

let imsInstance = null;
let polarisApikey;
let discoveryURL;
let cmSuffix;
let asMFE;
let imsEnvironment;

function loadScript(url, callback, type) {
  const $head = document.querySelector('head');
  const $script = document.createElement('script');
  $script.src = url;
  if (type) {
    $script.setAttribute('type', type);
  }
  $head.append($script);
  $script.onload = callback;
  return $script;
}

function load() {
  const imsProps = {
    imsClientId: IMS_API_KEY,
    imsScope: 'additional_info.projectedProductContext,openid,read_organizations',
    redirectUrl: 'https://bit.ly/aemassetswknd', // Temp workaround for https://jira.corp.adobe.com/browse/IMSS-2708
    modalMode: true,
    imsEnvironment,
  };
  // eslint-disable-next-line no-undef
  const registeredTokenService = PureJSSelectors.registerAssetSelectorsIms(imsProps);
  imsInstance = registeredTokenService;
}

export function init(cfg, callback) {
  if (cfg.environment.toUpperCase() === 'STAGE') {
    imsEnvironment = IMS_ENV_STAGE;
    polarisApikey = POLARIS_API_KEY_STAGE;
    discoveryURL = DISCOVERY_URL_STAGE;
    cmSuffix = CM_SUFFIX_STAGE;
    asMFE = AS_MFE_STAGE;
  } else if (cfg.environment.toUpperCase() === 'PROD') {
    imsEnvironment = IMS_ENV_PROD;
    polarisApikey = POLARIS_API_KEY_PROD;
    discoveryURL = DISCOVERY_URL_PROD;
    cmSuffix = CM_SUFFIX_PROD;
    asMFE = AS_MFE_PROD;
  } else {
    throw new Error('Invalid environment setting!');
  }

  loadScript(asMFE, () => {
    load();
    if (callback) {
      callback();
    }
  });
}

function onClose() {
  const selectorDialog = document.getElementById('asset-selector-dialog') || document.getElementById('destination-selector-dialog');
  selectorDialog.close();
}

async function setToClipboard(rennditionURL) {
  const response = await fetch(rennditionURL);
  const blob = await response.blob();
  // eslint-disable-next-line no-undef
  const data = [new ClipboardItem({ [blob.type]: blob })];
  await navigator.clipboard.write(data);
}

function removeQueryParams(url) {
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    return urlParts[0];
  }
  return url;
}

function changeFileExtension(filename, newExtension) {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) {
    return `${filename}.${newExtension}`;
  }
  return filename.substring(0, lastIndex + 1) + newExtension;
}

function handleSelection(selection) {
  let maxHeightIdx = 0;
  // eslint-disable-next-line no-underscore-dangle
  selection[0]._links['http://ns.adobe.com/adobecloud/rel/rendition'].forEach((rendition, index) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rendition.height > selection[0]._links['http://ns.adobe.com/adobecloud/rel/rendition'][maxHeightIdx].height) {
      maxHeightIdx = index;
    }
  });

  // eslint-disable-next-line no-underscore-dangle
  let rennditionURL = removeQueryParams(selection[0]._links['http://ns.adobe.com/adobecloud/rel/rendition'][maxHeightIdx].href);
  rennditionURL = changeFileExtension(rennditionURL, 'png');
  setToClipboard(rennditionURL);

  // onClose();
}

// eslint-disable-next-line no-unused-vars
function handleNavigateToAsset(asset) {
  // onClose();
}

export async function renderAssetSelectorWithImsFlow(cfg) {
  let apiKey;
  if (cfg.mode.toLowerCase() === 'delivery') {
    apiKey = polarisApikey;
  } else if (cfg.mode.toLowerCase() === 'author') {
    apiKey = AUTHOR_API_KEY;
  } else {
    throw new Error('Invalid asset selector mode!');
  }

  const repoId = `${cfg.mode}-${cfg['repository-id']}${cmSuffix}`;
  const assetSelectorProps = {
    discoveryURL,
    repositoryId: repoId,
    hideTreeNav: true,
    imsOrg: cfg['ims-org-id'],
    apiKey,
    onClose,
    handleSelection,
    handleNavigateToAsset,
    env: cfg.environment.toUpperCase(),
    acvConfig: {
      selectionType: 'multiple',
    },
  };
  const container = document.getElementById('asset-selector');
  // eslint-disable-next-line no-undef
  PureJSSelectors.renderAssetSelectorWithIms(container, assetSelectorProps, () => {
    const assetSelectorDialog = document.getElementById('asset-selector-dialog');
    assetSelectorDialog.showModal();
  });
}

export async function logoutImsFlow() {
  // eslint-disable-next-line no-console
  console.log('Signing out...', imsInstance);
  await imsInstance.signOut();
}
