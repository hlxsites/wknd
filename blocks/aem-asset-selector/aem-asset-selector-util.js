const IMS_API_KEY = 'franklin';
const AS_MFE_STAGE = 'https://experience-stage.adobe.com/solutions/CQ-assets-selectors/assets/resources/asset-selectors.js';
const AS_MFE_PROD = 'https://experience.adobe.com/solutions/CQ-assets-selectors/assets/resources/asset-selectors.js';
const IMS_ENV_STAGE = 'stg1';
const IMS_ENV_PROD = 'prod';

let imsInstance = null;
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
    imsScope: 'additional_info.projectedProductContext,openid,read_organizations,AdobeID,ab.manage',
    redirectUrl: window.location.href,
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
    asMFE = AS_MFE_STAGE;
  } else if (cfg.environment.toUpperCase() === 'PROD') {
    imsEnvironment = IMS_ENV_PROD;
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
  const selectorDialog = document.getElementById('asset-selector-dialog');
  selectorDialog.close();
}

async function setToClipboard(rennditionURL) {
  const response = await fetch(rennditionURL);
  if (response.ok) {
    const blob = await response.blob();
    // eslint-disable-next-line no-undef
    const data = [new ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(data);
  } else {
    // eslint-disable-next-line no-alert
    alert('Selected asset is not available for usage!!');
  }
}

function handleSelection(selection) {
  if (selection[0].reviewStatus !== 'approved') {
    // eslint-disable-next-line no-alert
    alert('Please select an approved asset only!!');
  } else {
    const deliveryUrl = `https://${selection[0]['repo:repositoryId'].replace('author', 'delivery')}`
    + `/adobe/dynamicmedia/deliver/${selection[0]['repo:assetId']}/asset.png`;
    setToClipboard(deliveryUrl);
  }
  // onClose();
}

// eslint-disable-next-line no-unused-vars
function handleNavigateToAsset(asset) {
  // onClose();
}

export async function renderAssetSelectorWithImsFlow(cfg) {
  const assetSelectorProps = {
    apiKey: 'aem-assets-backend-nr-1',
    imsOrg: cfg['ims-org-id'],
    onClose,
    handleSelection,
    handleNavigateToAsset,
    env: cfg.environment.toUpperCase(),
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
