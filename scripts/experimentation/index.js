/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  getMetadata,
  sampleRUM,
  toCamelCase,
  toClassName,
} from '../lib-franklin.js';

export const DEFAULT_OPTIONS = {
  root: '/experiments',
  configFile: 'manifest.json',
  metaTag: 'experiment',
  queryParameter: 'experiment',
};

/**
 * Returns script that initializes a queue for each alloy instance,
 * in order to be ready to receive events before the alloy library is loaded
 * Documentation
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/installing-the-sdk.html?lang=en#adding-the-code
 * @type {string}
 */
function getAlloyInitScript() {
  return `!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=
  function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,["alloy"]);`;
}


/**
 * Create inline script
 * @param document
 * @param element where to create the script element
 * @param innerHTML the script
 * @param type the type of the script element
 * @returns {HTMLScriptElement}
 */
function createInlineScript(document, element, innerHTML, type) {
  const script = document.createElement('script');
  if (type) {
    script.type = type;
  }
  script.innerHTML = innerHTML;
  element.appendChild(script);
  return script;
}

/**
 * Returns datastream id to use as edge configuration id
 * 
 * @returns {{edgeConfigId: string, orgId: string}}
 */
function getDatastreamConfiguration() {
  // Sites Internal
  return {
    edgeConfigId: '732b93f2-41e2-467a-95aa-3336e063418e',
    orgId: '908936ED5D35CC220A495CD4@AdobeOrg',
  };
}

/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
// eslint-disable-next-line no-unused-vars
function getAlloyConfiguration(document) {
  return {
    // enable while debugging
    debugEnabled: true, //document.location.hostname.startsWith('localhost'),
    // disable when clicks are also tracked via sendEvent with additional details
    clickCollectionEnabled: false,
    // adjust default based on customer use case
    defaultConsent: 'in',
    ...getDatastreamConfiguration(),
  };
}

/**
 * Sets up alloy (initializes and configures alloy)
 * @param document
 * @returns {Promise<void>}
 */
export async function setupAlloy(document) {
  createInlineScript(document, document.body, getAlloyInitScript(), 'text/javascript');

  // eslint-disable-next-line no-undef
  const configure = alloy('configure', getAlloyConfiguration(document));

  await import('../alloy.js');
  await configure;
}

/**
 * Parses the experimentation configuration sheet and creates an internal model.
 *
 * Output model is expected to have the following structure:
 *      {
 *        id: <string>,
 *        label: <string>,
 *        blocks: [<string>]
 *        audiences: {
 *          <string>: <string>,
 *        }
 *        status: Active | Inactive,
 *        variantNames: [<string>],
 *        variants: {
 *          [variantName]: {
 *            label: <string>
 *            percentageSplit: <number 0-1>,
 *            pages: <string>,
 *            blocks: <string>,
 *          }
 *        }
 *      };
 */
function parseExperimentConfig(json) {
  const config = {
    audiences: {},
  };
  try {
    json.settings.data.forEach((line) => {
      let key = toCamelCase(line.Name);
      if (key.startsWith('audience')) {
        key = toCamelCase(key.substring(8));
        config.audiences[key] = toCamelCase(line.Value);
        return;
      }
      if (key === 'experimentName') {
        key = 'label';
      }
      config[key] = line.Value;
    });
    const variants = {};
    let variantNames = Object.keys(json.experiences.data[0]);
    variantNames.shift();
    variantNames = variantNames.map((vn) => toCamelCase(vn));
    variantNames.forEach((variantName) => {
      variants[variantName] = {};
    });
    let lastKey = 'default';
    json.experiences.data.forEach((line) => {
      let key = toCamelCase(line.Name);
      if (!key) key = lastKey;
      lastKey = key;
      const vns = Object.keys(line);
      vns.shift();
      vns.forEach((vn) => {
        const camelVN = toCamelCase(vn);
        if (key === 'pages' || key === 'blocks') {
          variants[camelVN][key] = variants[camelVN][key] || [];
          if (key === 'pages') variants[camelVN][key].push(new URL(line[vn]).pathname);
          else variants[camelVN][key].push(line[vn]);
        } else {
          variants[camelVN][key] = line[vn];
        }
      });
    });
    config.variants = variants;
    config.variantNames = variantNames;
    return config;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error parsing experiment config:', e, json);
  }
  return null;
}

/**
 * Gets the experiment name, if any for the page based on env, useragent, queyr params
 * @returns {string} experimentid
 */
export function getExperimentName(tagName) {
  if (navigator.userAgent.match(/bot|crawl|spider/i)) {
    return null;
  }

  return toClassName(getMetadata(tagName)) || null;
}

/**
 * Checks whether we have a valid experimentation config.
 * Mostly used to validate custom parsers.
 *
 * @param {object} config the experimentation config
 * @returns a boolean indicating whether the config is valid or not
 */
export function isValidConfig(config) {
  if (!config.variantNames
    || !config.variantNames.length
    || !config.variants
    || !Object.values(config.variants).length
    || !Object.values(config.variants).every((v) => (
      typeof v === 'object'
      && !!v.blocks
      && !!v.pages
      && (v.percentageSplit === '' || !!v.percentageSplit)
    ))) {
    console.warn('Invalid experiment config. Please review your sheet and parser.');
    return false;
  }
  return true;
}

/**
 * Gets experiment config from the manifest and transforms it to more easily
 * consumable structure.
 *
 * the manifest consists of two sheets "settings" and "experiences", by default
 *
 * "settings" is applicable to the entire test and contains information
 * like "Audience", "Status" or "Blocks".
 *
 * "experience" hosts the experiences in rows, consisting of:
 * a "Percentage Split", "Label" and a set of "Links".
 *
 *
 * @param {string} experimentId the experimentation id
 * @param {string} instantExperiment the instant experiment config
 * @returns {object} containing the experiment manifest
 */
export function getConfigForInstantExperiment(experimentId, instantExperiment) {
  const config = {
    label: `Instant Experiment: ${experimentId}`,
    audiences: {},
    status: 'Active',
    id: experimentId,
    variants: {},
    variantNames: [],
  };

  const pages = instantExperiment.split(',').map((p) => new URL(p.trim()).pathname);
  const evenSplit = 1 / (pages.length + 1);

  config.variantNames.push('control');
  config.variants.control = {
    percentageSplit: '',
    pages: [window.location.pathname],
    blocks: [],
    label: 'Control',
  };

  pages.forEach((page, i) => {
    const vname = `challenger-${i + 1}`;
    config.variantNames.push(vname);
    config.variants[vname] = {
      percentageSplit: `${evenSplit.toFixed(2)}`,
      pages: [page],
      blocks: [],
      label: `Challenger ${i + 1}`,
    };
  });

  return (config);
}

/**
 * Gets experiment config from the manifest and transforms it to more easily
 * consumable structure.
 *
 * the manifest consists of two sheets "settings" and "experiences", by default
 *
 * "settings" is applicable to the entire test and contains information
 * like "Audience", "Status" or "Blocks".
 *
 * "experience" hosts the experiences in rows, consisting of:
 * a "Percentage Split", "Label" and a set of "Links".
 *
 *
 * @param {string} experimentId the experimentation id
 * @param {object} cfg the custom experimentation config
 * @returns {object} containing the experiment manifest
 */
export async function getConfigForFullExperiment(experimentId, cfg) {
  const path = `${cfg.root}/${experimentId}/${cfg.configFile}`;
  try {
    const resp = await fetch(path);
    if (!resp.ok) {
      console.log('error loading experiment config:', resp);
      return null;
    }
    const json = await resp.json();
    const config = cfg.parser
      ? cfg.parser(json)
      : parseExperimentConfig(json);
    if (!config) {
      return null;
    }
    config.id = experimentId;
    config.manifest = path;
    config.basePath = `${cfg.root}/${experimentId}`;
    return config;
  } catch (e) {
    console.log(`error loading experiment manifest: ${path}`, e);
  }
  return null;
}

/**
 * Gets the UED compatible decision policy for the specified experimentation config
 * @param {object} config the experimentation config
 * @returns the decision policy to run through the UED engine
 */
function getDecisionPolicy(config) {
  const decisionPolicy = {
    id: 'content-experimentation-policy',
    rootDecisionNodeId: 'n1',
    decisionNodes: [{
      id: 'n1',
      type: 'EXPERIMENTATION',
      experiment: {
        id: config.id,
        identityNamespace: 'ECID',
        randomizationUnit: 'DEVICE',
        treatments: Object.entries(config.variants).map(([key, props]) => ({
          id: key,
          allocationPercentage: props.percentageSplit
            ? parseFloat(props.percentageSplit) * 100
            : 100 - Object.values(config.variants).reduce((result, variant) => {
              // eslint-disable-next-line no-param-reassign
              result -= parseFloat(variant.percentageSplit || 0) * 100;
              return result;
            }, 100),
        })),
      },
    }],
  };
  return decisionPolicy;
}

/**
 * this is an extensible stub to take on audience mappings
 * @param {object} audiences the experiment audiences
 * @param {object} selected the experiment config
 * @return {boolean} is member of this audience
 */
async function isValidAudience(audiences, selected) {
  const results = await Promise.all(Object.entries(selected).map(([key, value]) => {
    if (audiences[key] && typeof audiences[key] === 'function') {
      return audiences[key](value);
    }
    if (audiences[key] && audiences[key][value] && typeof audiences[key][value] === 'function') {
      return audiences[key][value]();
    }
    return true;
  }));
  return results.every((res) => res);
}

/**
 * Replaces element with content from path
 * @param {string} path
 * @param {HTMLElement} element
 * @param {boolean} isBlock
 */
async function replaceInner(path, element) {
  const plainPath = `${path}.plain.html`;
  try {
    const resp = await fetch(plainPath);
    if (!resp.ok) {
      console.log('error loading experiment content:', resp);
      return false;
    }
    const html = await resp.text();
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = html;
    return true;
  } catch (e) {
    console.log(`error loading experiment content: ${plainPath}`, e);
  }
  return false;
}

/**
 * Gets the experimentation config for the specified experiment
 * @param {string} experiment the experiment id
 * @param {string} [instantExperiment] the instant experiment config
 * @param {object} [config] the custom config for the experimentation plugin
 * @returns the experiment configuration
 */
export async function getConfig(experiment, instantExperiment = null, config = DEFAULT_OPTIONS) {
  const usp = new URLSearchParams(window.location.search);
  const [forcedExperiment, forcedVariant] = usp.has(config.queryParameter) ? usp.get(config.queryParameter).split('/') : [];

  const experimentConfig = instantExperiment
    ? await getConfigForInstantExperiment(experiment, instantExperiment)
    : await getConfigForFullExperiment(experiment, config);
  console.debug(experimentConfig);
  if (!experimentConfig || (toCamelCase(experimentConfig.status) !== 'active' && !forcedExperiment)) {
    return null;
  }

  experimentConfig.run = !!forcedExperiment
    || await isValidAudience(config.audiences, experimentConfig.audiences);
  window.hlx = window.hlx || {};
  window.hlx.experiment = experimentConfig;
  console.debug('run', experimentConfig.run, experimentConfig.audiences);
  if (!experimentConfig.run) {
    return null;
  }

  if (forcedVariant && experimentConfig.variantNames.includes(forcedVariant)) {
    experimentConfig.selectedVariant = forcedVariant;
  } else {
    // eslint-disable-next-line import/extensions
    const { ued } = await import('./ued.js');
    const decision = ued.evaluateDecisionPolicy(getDecisionPolicy(experimentConfig), {});
    experimentConfig.selectedVariant = decision.items[0].id;
  }
  return experimentConfig;
}

/**
 * Sites Internal alloy headers
 * 
 * @returns {object} the alloy headers
 */
function getAlloyHeaders() {
  return {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE2ODY3MzYzNjY4MTdfOTU0MjQ5NjktZGZkZi00ZjNjLTg3Y2MtZGNkYTNlMGFmYWJkX2V3MSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJleGNfYXBwIiwidXNlcl9pZCI6Ijg1MUIyMEFENjMxQzMzRDQwQTQ5NUZGREA3ZWViMjBmODYzMWMwY2I3NDk1YzA2LmUiLCJzdGF0ZSI6IntcImpzbGlidmVyXCI6XCJ2Mi12MC4zMS4wLTItZzFlOGE4YThcIixcIm5vbmNlXCI6XCIzMTczODA2ODczMzUxNTQ1XCIsXCJzZXNzaW9uXCI6XCJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vaW1zL3Nlc3Npb24vdjEvTXpVd09UQTJOV1F0WWpOa1pDMDBOV001TFRnNU9XRXRPVEU0WmpFMU9UWXdObVkyTFMwNE5URkNNakJCUkRZek1VTXpNMFEwTUVFME9UVkdSa1JBTjJWbFlqSXdaamcyTXpGak1HTmlOelE1TldNd05pNWxcIn0iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IkJERUYyQ0E3NTQ4OUQ1OUUwQTRDOThBN0BhZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWFEySEFHRTdYUFA3TVA0S0dNUVYzWEFBSDQ9PT09PT0iLCJzaWQiOiIxNjg2NzM2MzY2NDQyXzZmZmY0YWZkLWQxYTYtNDMyZS04ZGRiLTlmMDRkZDM0NTA0OF9ldzEiLCJtb2kiOiJjMDc0YzlmYyIsInBiYSI6Ik1lZFNlY05vRVYsTG93U2VjIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJhYi5tYW5hZ2UsYWRkaXRpb25hbF9pbmZvLGFkZGl0aW9uYWxfaW5mby5qb2JfZnVuY3Rpb24sYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0LGFkZGl0aW9uYWxfaW5mby5yb2xlcyxBZG9iZUlELGFkb2JlaW8uYXBwcmVnaXN0cnkucmVhZCxhZG9iZWlvX2FwaSxhdWRpZW5jZW1hbmFnZXJfYXBpLGNyZWF0aXZlX2Nsb3VkLG1wcyxvcGVuaWQsb3JnLnJlYWQscmVhZF9vcmdhbml6YXRpb25zLHJlYWRfcGMscmVhZF9wYy5hY3AscmVhZF9wYy5kbWFfdGFydGFuLHNlc3Npb24iLCJjcmVhdGVkX2F0IjoiMTY4NjczNjM2NjgxNyJ9.RFxJYkOqPPMdrTHRGFgxPOveuTTjtB71VqTfDyr6CfJNHejB8kUuPX0bwAGHEzfP8y53hK5dpGI8-8VHhJ4CJtNPfYXjpCRxVw_4cKtXjZYbNJiZbN8P5gLzIDMag7haUUPsQlmf-oxgsc5OeSX4dO_179HpjMpgLIZY58IdgnrPnvEEtqbGxHiPa9EpXdaGNGdy-6YQeiUPRBhTuhgjkUiUP2H8MTKFiHRvtQkMEy_J9Sp0mtv3G74RKU3Lj3ErQn5ha0sPlobBqmRD2AJKVKwMp8uEUWDwG2iqgEIplVbGtVNuxSd3IYy4iDzqdMDcz4iCM1vQfIrv_e_qBrxQsA",
        "x-api-key": "acp_ui_platform",
        "x-gw-ims-org-id": "908936ED5D35CC220A495CD4@AdobeOrg",
  }
}

/**
 * Runs the configured experiments on the current page.
 * @param {string} experiment the experiment id
 * @param {string} instantExperiment the instant experiment config
 * @param {object} customOptions the custom config for the experimentation plugin
 * @returns a boolean indicating whether the experiment was run successfully or not
 */
export async function runExperiment(experiment, instantExperiment, customOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
  };
  const experimentConfig = await getConfig(experiment, instantExperiment, options);
  if (!experimentConfig || !isValidConfig(experimentConfig)) {
    return false;
  }

  // setup Alloy and use AEP audiences
  setupAlloy(document);
  // obtain the ECID from the alloy
  alloy("getIdentity", { namespaces: ["ECID"] }).then(function (identity) {
    // Extract the ECID (Experience Cloud ID) from the identity
    const ecid = identity["ECID"];
    const url = 'https://platform.adobe.io/data/core/ups/identity/namespace';
    const requestBody = {
      ids: [
        {
          id: ecid,
          namespace: 'ECID'
        }
      ]
    };

    // Make an API request to retrieve the segments associated with the ECID
    fetch(url, {
      method: 'POST',
      headers: getAlloyHeaders(),
      body: JSON.stringify(requestBody)
    }).then(data => {
        console.log("Segments of the user's identity:", data);
      })
      .catch(error => {
        console.error("Error retrieving segments:", error);
      });
  })
  .catch(function (error) {
    console.error("Error retrieving identity:", error);
  });

  console.debug(`running experiment (${window.hlx.experiment.id}) -> ${window.hlx.experiment.selectedVariant}`);

  if (experimentConfig.selectedVariant === experimentConfig.variantNames[0]) {
    return false;
  }

  const { pages } = experimentConfig.variants[experimentConfig.selectedVariant];
  if (!pages.length) {
    return false;
  }

  const currentPath = window.location.pathname;
  const control = experimentConfig.variants[experimentConfig.variantNames[0]];
  const index = control.pages.indexOf(currentPath);
  if (index < 0 || pages[index] === currentPath) {
    return false;
  }

  // Fullpage content experiment
  document.body.classList.add(`experiment-${experimentConfig.id}`);
  const result = await replaceInner(pages[0], document.querySelector('main'));
  if (!result) {
    console.debug(`failed to serve variant ${window.hlx.experiment.selectedVariant}. Falling back to ${experimentConfig.variantNames[0]}.`);
  }
  document.body.classList.add(`variant-${result ? experimentConfig.selectedVariant : experimentConfig.variantNames[0]}`);
  sampleRUM('experiment', {
    source: experimentConfig.id,
    target: result ? experimentConfig.selectedVariant : experimentConfig.variantNames[0],
  });
  return result;
}

/**
 * Patches the block config for the experimentation use case.
 * @param {object} config the block config
 * @returns the patched block config for experimentation
 */
export function patchBlockConfig(config) {
  const { experiment } = window.hlx;

  // No experiment is running
  if (!experiment || !experiment.run) {
    return config;
  }

  // The current experiment does not modify the block
  if (experiment.selectedVariant === experiment.variantNames[0]
    || !experiment.blocks || !experiment.blocks.includes(config.blockName)) {
    return config;
  }

  // The current experiment does not modify the block code
  const variant = experiment.variants[experiment.selectedVariant];
  if (!variant.blocks.length) {
    return config;
  }

  let index = experiment.variants[experiment.variantNames[0]].blocks.indexOf('');
  if (index < 0) {
    index = experiment.variants[experiment.variantNames[0]].blocks.indexOf(config.blockName);
  }
  if (index < 0) {
    index = experiment.variants[experiment.variantNames[0]].blocks.indexOf(`/blocks/${config.blockName}`);
  }
  if (index < 0) {
    return config;
  }

  let origin = '';
  let path;
  if (/^https?:\/\//.test(variant.blocks[index])) {
    const url = new URL(variant.blocks[index]);
    // Experimenting from a different branch
    if (url.origin !== window.location.origin) {
      origin = url.origin;
    }
    // Experimenting from a block path
    if (url.pathname !== '/') {
      path = url.pathname;
    } else {
      path = `/blocks/${config.blockName}`;
    }
  } else { // Experimenting from a different branch on the same branch
    path = variant.blocks[index];
  }
  if (!origin && !path) {
    return config;
  }

  const { codeBasePath } = window.hlx;
  return {
    ...config,
    cssPath: `${origin}${codeBasePath}${path}/${config.blockName}.css`,
    jsPath: `${origin}${codeBasePath}${path}/${config.blockName}.js`,
  };
}
window.hlx.patchBlockConfig.push(patchBlockConfig);
