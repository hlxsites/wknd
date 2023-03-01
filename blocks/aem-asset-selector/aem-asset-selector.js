import { readBlockConfig } from '../../scripts/lib-franklin.js';

let imsInstance = null;

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
  let imsEnvironment;
  if (cfg.environment.toUpperCase() === 'STAGE') {
    imsEnvironment = 'stg1';
  } else if (cfg.environment.toUpperCase() === 'PROD') {
    imsEnvironment = 'prod';
  } else {
    throw new Error('Invalid environment setting!');
  }
  const imsProps = {
    imsClientId: cfg['api-key'],
    imsScope: 'additional_info.projectedProductContext,openid,read_organizations',
    redirectUrl: window.location.href,
    modalMode: true,
    imsEnvironment,
  };
  // eslint-disable-next-line no-undef
  const registeredTokenService = PureJSSelectors.registerAssetSelectorsIms(imsProps);
  imsInstance = registeredTokenService;
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

async function renderAssetSelectorWithImsFlow(cfg) {
  let apikey;
  let discoveryURL;
  let cm;

  if (cfg.environment.toUpperCase() === 'STAGE') {
    discoveryURL = 'https://aem-discovery-stage.adobe.io';
    cm = '-cmstg.adobeaemcloud.com';
  } else if (cfg.environment.toUpperCase() === 'PROD') {
    discoveryURL = 'https://aem-discovery.adobe.io';
    cm = '.adobeaemcloud.com';
  } else {
    throw new Error('Invalid environment setting!');
  }

  if (cfg.mode.toLowerCase() === 'delivery') {
    if (cfg.environment.toUpperCase() === 'STAGE') {
      apikey = 'polaris-asset-search-api-key';
    } else if (cfg.environment.toUpperCase() === 'PROD') {
      apikey = 'asset_search_service';
    } else {
      throw new Error('Invalid environment setting!');
    }
  } else if (cfg.mode.toLowerCase() === 'author') {
    apikey = 'aem-assets-backend-nr-1';
  } else {
    throw new Error('Invalid asset selector mode!');
  }

  const repoId = `${cfg.mode}-${cfg['repository-id']}${cm}`;
  const assetSelectorProps = {
    discoveryURL,
    repositoryId: repoId,
    hideTreeNav: true,
    imsOrg: cfg['ims-org-id'],
    apiKey: apikey,
    onClose,
    handleSelection,
    handleNavigateToAsset,
    env: cfg.environment.toUpperCase(),
    selectionType: 'multiple',
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

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  block.innerHTML = `
    <div class="action-container">
        <button id="as-cancel">Sign Out</button>
        <button id="as-submit">Submit</button>
    </div>
    <dialog id="asset-selector-dialog">
        <div id="asset-selector" style="height: calc(100vh - 80px); width: calc(100vw - 60px); margin: -20px;">
        </div>
    </dialog>
    `;
  loadScript(cfg['selector-mfe'], () => {
    load(cfg);
    block.querySelector('#as-submit').addEventListener('click', () => {
      renderAssetSelectorWithImsFlow(cfg);
    });

    block.querySelector('#as-cancel').addEventListener('click', () => {
      logoutImsFlow();
    });
  });
}
