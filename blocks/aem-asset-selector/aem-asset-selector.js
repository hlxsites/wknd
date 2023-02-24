import { readBlockConfig } from "../../scripts/lib-franklin.js"

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


/**
 * NOTE: This is a required step when you use `renderAssetSelectorWithIms` and want the sign-in flow to work with a pop-up.
 * AssetSelectors will try to use this registered instance to get the required tokens. If you don't register the instance,
 * and your redirectUrl does not match the one you registered with the imsClientId, the sign-in flow will fail and a page reload might be required..
 * If you use a different redirectUrl where the IMS provider will redirect to after user signs in, you must also load this function on that redirect page
 * for the pop-up to work correctly.
 * It is recommended that you call registerAssetSelectorsIms on page load.
 */
function load(cfg) {
    const imsProps = {
        imsClientId: cfg['api-key'],
        imsScope: "additional_info.projectedProductContext,openid,read_organizations",
        redirectUrl: window.location.href,
        modalMode: true,
        /**
         * - Optional parameters
            modalMode: true, // false to open in a full page reload flow
            adobeImsOptions: {
                modalSettings: {
                    allowOrigin: window.location.origin,
                },
                useLocalStorage: true,
            },
            onImsServiceInitialized: (service) => {
                console.log("onImsServiceInitialized", service);
            },
            onAccessTokenReceived: (token) => {
                console.log("onAccessTokenReceived", token);
            },
            onAccessTokenExpired: () => {
                console.log("onAccessTokenError");
                // re-trigger sign-in flow
            },
            onErrorReceived: (type, msg) => {
                console.log("onErrorReceived", type, msg);
            },
        */
    }
    const registeredTokenService = PureJSSelectors.registerAssetSelectorsIms(imsProps);
    // optional tokenService instance in cases where you'd like to use the token service outside of the selectors
    // Some helpful functions:
    // - registeredTokenService.getAccessToken() - to get the current access token
    // - registeredTokenService.triggerAuthFlow() or registeredTokenService.signIn() - to trigger the sign-in flow based on the imsProps modalMode setting (true/false);
    // - registeredTokenService.signOut() - to sign out the user and remove the token
    // - registeredTokenService.refreshToken() - to refresh the existing token
    imsInstance = registeredTokenService;
}

function onClose() {
    const selectorDialog = document.getElementById('asset-selector-dialog') || document.getElementById('destination-selector-dialog');
    selectorDialog.close();
}

// @params blob - The ClipboardItem takes an object with the MIME type as key, and the actual blob as the value.
// @return Promise<void>
async function setToClipboard(rennditionURL) {
    const response = await fetch(rennditionURL);
    const blob = await response.blob();
    const data = [new ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(data);
}

function removeQueryParams(url) {
    let urlParts = url.split('?');
    if (urlParts.length > 1) {
        return urlParts[0];
    }
    return url;
}

function changeFileExtension(filename, newExtension) {
    let lastIndex = filename.lastIndexOf('.');
    if (lastIndex === -1) {
        return filename + '.' + newExtension;
    }
    return filename.substring(0, lastIndex + 1) + newExtension;
}

function handleSelection(selection) {
    let maxHeightIdx = 0;
    selection[0]['_links']['http://ns.adobe.com/adobecloud/rel/rendition'].forEach((rendition, index) => {
        if (rendition.height > selection[0]['_links']['http://ns.adobe.com/adobecloud/rel/rendition'][maxHeightIdx].height) {
            maxHeightIdx = index;
        }
    });

    let rennditionURL = removeQueryParams(selection[0]['_links']['http://ns.adobe.com/adobecloud/rel/rendition'][maxHeightIdx].href);
    rennditionURL = changeFileExtension(rennditionURL, "png");
    setToClipboard(rennditionURL);

    //onClose();
};

function handleNavigateToAsset(asset) {
    // onClose();
}

/**
 *
 * Render AssetSelector with IMS Flow. AssetSelector will use the registered IMS instance (created in registerAssetSelectorsIms) to get the required tokens.
 * If a valid token is not present, the sign-in flow will be triggered in either pop-up or full page reload mode based on the configurations set in the imsProps.
 * NOTE: registerAssetSelectorsIms must be called before triggering this flow.
 * For best user experience, it is recommended that registerAssetSelectorsIms is called on page load prior to calling this function.
 */
async function renderAssetSelectorWithImsFlow(cfg) {

    let apikey;
    let discoveryURL;
    let cm;


    if (cfg['environment'].toUpperCase() === 'STAGE') {
        discoveryURL = "https://aem-discovery-stage.adobe.io";
        cm = '-cmstg.adobeaemcloud.com';
    } else if (cfg['environment'].toUpperCase() === 'PROD') {
        discoveryURL = "https://aem-discovery.adobe.io";
        cm = '.adobeaemcloud.com';
    } else {
        throw 'Invalid environment setting!';
    }

    if (cfg['mode'].toLowerCase() === 'delivery') {
        apikey = "polaris-asset-search-api-key";
    } else if (cfg['mode'].toLowerCase() === 'author') {
        apikey = "aem-assets-backend-nr-1";
    } else {
        throw 'Invalid asset selector mode!';
    }


    const repoId = `${cfg['mode']}-${cfg['repository-id']}${cm}`;
    const assetSelectorProps = {
        "discoveryURL": discoveryURL,
        "repositoryId": repoId,
        hideTreeNav: true,
        "imsOrg": cfg['ims-org-id'],
        apiKey: apikey,
        onClose,
        handleSelection,
        handleNavigateToAsset: handleNavigateToAsset,
        env: cfg['environment']
    }
    const container = document.getElementById('asset-selector');
    // renderAssetSelectorWithIms will render AssetSelector with required tokens.
    // If a valid token is not present, the sign-in flow will be triggered in either pop-up or full page reload mode based on the configurations set in the imsProps.
    PureJSSelectors.renderAssetSelectorWithIms(container, assetSelectorProps, () => {
        const assetSelectorDialog = document.getElementById('asset-selector-dialog');
        assetSelectorDialog.showModal();
    });
}


export async function logoutImsFlow() {
    console.log("Signing out...", imsInstance);
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