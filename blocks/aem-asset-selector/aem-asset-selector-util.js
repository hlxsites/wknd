const AS_MFE = 'https://experience.adobe.com/solutions/CQ-assets-selectors/assets/resources/asset-selectors.js';
const IMS_ENV_STAGE = 'stg1';
const IMS_ENV_PROD = 'prod';

let imsInstance = null;
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

function load(cfg) {
  const imsProps = {
    imsClientId: cfg['ims-client-id'],
    imsScope: 'additional_info.projectedProductContext,openid,read_organizations,AdobeID,ab.manage',
    redirectUrl: window.location.href,
    modalMode: true,
    imsEnvironment,
    env: imsEnvironment,
  };
  // eslint-disable-next-line no-undef
  const registeredTokenService = PureJSSelectors.registerAssetSelectorsIms(imsProps);
  imsInstance = registeredTokenService;
}

export function init(cfg, callback) {
  if (cfg.environment.toUpperCase() === 'STAGE') {
    imsEnvironment = IMS_ENV_STAGE;
  } else if (cfg.environment.toUpperCase() === 'PROD') {
    imsEnvironment = IMS_ENV_PROD;
  } else {
    throw new Error('Invalid environment setting!');
  }

  loadScript(AS_MFE, () => {
    load(cfg);
    if (callback) {
      callback();
    }
  });
}

function onClose() {
  const selectorDialog = document.getElementById('asset-selector-dialog');
  selectorDialog.close();
}

async function setToClipboard(rennditionURL, mimetype) {
  const response = await fetch(rennditionURL);
  if (response.ok) {
    let data;
    if (mimetype.startsWith('image')) {
      const blob = await response.blob();

      // eslint-disable-next-line no-undef
      data = [new ClipboardItem({ [blob.type]: blob })];
    } else if (mimetype.startsWith('video')) {
      const block = `
      <table border='1'>
        <tr>
          <td>embed</td>
        </tr>
        <tr>
          <td><a href=${rennditionURL}>${rennditionURL}</a></td>
        </tr>
      </table>
      `;

      data = [
        // eslint-disable-next-line no-undef
        new ClipboardItem({ 'text/html': new Blob([block], { type: 'text/html' }) }),
      ];
    } else {
      throw new Error('Unsupported mimetype!');
    }
    await navigator.clipboard.write(data);
  } else {
    // eslint-disable-next-line no-alert
    alert('Selected asset is not available for usage!!');
  }
}

function handleSelection(selection) {
  const selectedAsset = selection[0];
  if (selectedAsset.reviewStatus !== 'approved') {
    // eslint-disable-next-line no-alert
    alert('Please select an approved asset only!!');
  } else {
    const { mimetype } = selectedAsset;
    let deliveryUrl;
    if (mimetype && mimetype.startsWith('image')) {
      deliveryUrl = `https://${selection[0]['repo:repositoryId'].replace('author', 'delivery')}`
        + `/adobe/dynamicmedia/deliver/${selection[0]['repo:assetId']}/asset.png`;
      setToClipboard(deliveryUrl, mimetype);
    } else if (mimetype && mimetype.startsWith('video')) {
      // TODO: Determine DASH or HLS
      deliveryUrl = `https://${selection[0]['repo:repositoryId'].replace('author', 'delivery')}`
        + `/adobe/dynamicmedia/deliver/${selection[0]['repo:assetId']}/video.mpd`;
      setToClipboard(deliveryUrl, mimetype);
    } else {
      // eslint-disable-next-line no-alert
      alert('Please select an image or video asset only!!');
    }
  }
  // onClose();
}

// eslint-disable-next-line no-unused-vars
function handleNavigateToAsset(asset) {
  // onClose();
}

export async function renderAssetSelectorWithImsFlow(cfg) {
  const assetSelectorProps = {
    repositoryId: cfg['repository-id'],
    imsOrg: cfg['ims-org-id'],
    onClose,
    handleSelection,
    handleNavigateToAsset,
    env: cfg.environment.toUpperCase(),
    apiKey: 'franklin',
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
