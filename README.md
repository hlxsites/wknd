# Edge Delivery Services - WKND Demo
Codebase for the fictional WKND site, showcasing the capabilities of Adobe's Edge Delivery Services. Highlights include:

- Experimentation capabilities 
- Conversion tracking
- Slack Bot integration for monitoring Lighthouse score and conversions 
- Document based content authoring

<<<<<<< HEAD
## Environments
- Preview: https://main--wknd--hlxsites.hlx.page/
- Live: https://main--wknd--hlxsites.hlx.live/
=======
## Features

The AEM Experimentation plugin supports:
- :lock: privacy-first, as it doesn't use any, nor persists any, end-user data that could lead to their identification. No end-user opt-in nor cookie consent is required when using the default configuration that uses [AEM Edge Delivery Services Real User Monitoring](https://github.com/adobe/helix-rum-js/).*
- :busts_in_silhouette: serving different content variations to different audiences, including custom audience definitions for your project that can be either resolved directly in-browser or against a trusted backend API.
- :money_with_wings: serving different content variations based on marketing campaigns you are running, so that you can easily track email and/or social campaigns.
- :chart_with_upwards_trend: running A/B test experiments on a set of variants to measure and improve the conversion on your site. This works particularly with our :chart: [RUM conversion tracking plugin](https://github.com/adobe/franklin-rum-conversion).
- :rocket: easy simulation of each experience and basic reporting leveraging in-page overlays.

\* Bringing additional marketing technology such as visitor-based analytics or personalization to a project will cancel this privacy-first principle.
>>>>>>> 27c38b8 (Squashed 'plugins/experimentation/' changes from e04a21c..7efc8ed)

## Installation

```sh
npm i
```

## Tests

```sh
npm tst
```

## Capabilities

<<<<<<< HEAD
Before you begin, ensure you have the [AEM Sidekick Chrome extension](https://chrome.google.com/webstore/detail/aem-sidekick/ccfggkjabjahcjoljmgmklhpaccedipo) installed.

### Experimentation
[Experimentation docs](https://www.hlx.live/docs/experimentation)

- Load the site's Preview URL (above)
- Note the green "Experiment" pill-shaped button in the bottom right corner
- Click the button to open the Experimentation UI
- Click the "Simulate" button next to an experiment to view how that variant will render for the end user

<img src="/docs/images/experiment-simulate.png" width="300" alt="Experimentation UI opened from the green pill-shaped button">

- To see how this experiment is configured, right-click on the AEM Sidekick extension and select "View document source"
- Scroll down to the Metadata block at the bottom of the document
- Note the Experiment, and Instant Experiment properties
- The Instant Experiment property defines the pages used for the "challenger" variants in the Experimentation UI

<img src="/docs/images/experiment-metadata.png" width="500" alt="The document source which configures the experiments">

### Conversion Tracking
[RUM docs](https://www.hlx.live/developer/rum)

- You will need to fork this repository in order to access "Real User Monitoring" (RUM) data, including conversion data, via the Slack Bot
- In your fork, point fstab.yaml to a SharePoint or Google Drive folder that you own, and is shared with `helix@adobe.com`
- Download `documents.zip` from this project's [Demo Hub page](https://external.adobedemo.com/content/demo-hub/en/demos/external/aem_eds_demo0.html) in the Resources, Assets section. Note: you will need to be logged in to the Demo Hub to access this page
- Extract and upload the contents of `documents.zip` to seed this folder with content. Publish the content to your forked site using the AEM Sidekick
- Install the Github bot on your forked repository using this link: https://github.com/apps/helix-bot/installations/new
- Using the AEM sidekick, publish the content that you would like to track conversions for (at minimum, the index and adventures documents)
- For details on project setup, reference the [Developer Tutorial](https://www.hlx.live/developer/tutorial)
- Follow the [Slack Bot installation docs](https://www.hlx.live/docs/slack) to set up the bot in your own channel
- To generate some traffic data for your forked site, you can use the included Puppeteer script (/test/puppeteer/generate-traffic.mjs):

```sh
# Set the value of TEST_URL to your forked site's Preview URL
WKND_URL=https://main--wknd--<YOUR-GITHUB-USERNAME-OR-ORG>.hlx.live npm run generate-traffic

# For example, using the WKND Demo repository, and running 1000 iterations:
WKND_URL=https://main--wknd--hlxsites.hlx.live ITERATIONS=1000 npm run generate-traffic
=======
If the `subtree pull` command is failing with an error like:
>>>>>>> 27c38b8 (Squashed 'plugins/experimentation/' changes from e04a21c..7efc8ed)
```
fatal: can't squash-merge: 'plugins/experimentation' was never added
```
you can just delete the folder and re-add the plugin via the `git subtree add` command above.

## Project instrumentation

### Slack Bot
[Slack Bot docs](https://www.hlx.live/docs/slack)

- Follow the "Conversion Tracking" steps above to enable the Slack Bot
- Refer to the [Slack Bot Skills](https://www.hlx.live/docs/slack#slack-bot-skills) section for details on querying the underlying data from Slack
- To query the performance of an experiment, try the following command: `@Franklin Bot how is experiment experiment-0001 doing?` 

### Document based content authoring
[Authoring docs](https://www.hlx.live/docs/authoring)

<<<<<<< HEAD
- Follow the "Conversion Tracking" steps above, ensuring that fstab.yaml in your fork points to a SharePoint or Google Drive folder that you own
- Refer to the [Authoring docs](https://www.hlx.live/docs/authoring) for details on authoring functionality
- Modify and "Preview" the documents in your SharePoint or Google Drive folder to see the changes reflected on the Preview environment
- To go deeper, refer to the [Anatomy of a Project doc](https://www.hlx.live/developer/anatomy-of-a-franklin-project), and check out the [Block Collection](https://www.hlx.live/developer/block-collection)

## Local development

1. Clone this repository to your machine
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Helix Pages Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
=======
    /**
     * Gets all the metadata elements that are in the given scope.
     * @param {String} scope The scope/prefix for the metadata
     * @returns an array of HTMLElement nodes that match the given scope
     */
    export function getAllMetadata(scope) {
      return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
        .reduce((res, meta) => {
          const id = toClassName(meta.name
            ? meta.name.substring(scope.length + 1)
            : meta.getAttribute('property').split(':')[1]);
          res[id] = meta.getAttribute('content');
          return res;
        }, {});
    }
    ```
2. if this is the first plugin you add to your project, you'll also need to add:
    ```js
    // Define an execution context
    const pluginContext = {
      getAllMetadata,
      getMetadata,
      loadCSS,
      loadScript,
      sampleRUM,
      toCamelCase,
      toClassName,
    };
    ```
    And make sure to import any missing/undefined methods from `aem.js`/`lib-franklin.js` at the very top of the file:
    ```js
    import {
      ...
      getMetadata,
      loadScript,
      toCamelCase,
      toClassName,
    } from './aem.js';
    ```
3. Early in the `loadEager` method you'll need to add:
    ```js
    async function loadEager(doc) {
      …
      // Add below snippet early in the eager phase
      if (getMetadata('experiment')
        || Object.keys(getAllMetadata('campaign')).length
        || Object.keys(getAllMetadata('audience')).length) {
        // eslint-disable-next-line import/no-relative-packages
        const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
        await runEager(document, { audiences: AUDIENCES }, pluginContext);
      }
      …
    }
    ```
    This needs to be done as early as possible since this will be blocking the eager phase and impacting your LCP, so we want this to execute as soon as possible.
4. Finally at the end of the `loadLazy` method you'll have to add:
    ```js
    async function loadLazy(doc) {
      …
      // Add below snippet at the end of the lazy phase
      if ((getMetadata('experiment')
        || Object.keys(getAllMetadata('campaign')).length
        || Object.keys(getAllMetadata('audience')).length)) {
        // eslint-disable-next-line import/no-relative-packages
        const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
        await runLazy(document, { audiences: AUDIENCES }, pluginContext);
      }
    }
    ```
    This is mostly used for the authoring overlay, and as such isn't essential to the page rendering, so having it at the end of the lazy phase is good enough.

### On top of the plugin system

The easiest way to add the plugin is if your project is set up with the plugin system extension in the boilerplate.
You'll know you have it if `window.hlx.plugins` is defined on your page.

If you don't have it, you can follow the proposal in https://github.com/adobe/aem-lib/pull/23 and https://github.com/adobe/aem-boilerplate/pull/275 and apply the changes to your `aem.js`/`lib-franklin.js` and `scripts.js`.

Once you have confirmed this, you'll need to edit your `scripts.js` in your AEM project and add the following at the start of the file:
```js
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  // define your custom audiences here as needed
};

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length,
  options: { audiences: AUDIENCES },
  url: '/plugins/experimentation/src/index.js',
});
```

### Custom options

There are various aspects of the plugin that you can configure via options you are passing to the 2 main methods above (`runEager`/`runLazy`).
You have already seen the `audiences` option in the examples above, but here is the full list we support:

```js
runEager.call(document, {
  // Overrides the base path if the plugin was installed in a sub-directory
  basePath: '',

  // Lets you configure the prod environment.
  // (prod environments do not get the pill overlay)
  prodHost: 'www.my-website.com',
  // if you have several, or need more complex logic to toggle pill overlay, you can use
  isProd: () => window.location.hostname.endsWith('hlx.page')
    || window.location.hostname === ('localhost'),

  /* Generic properties */
  // RUM sampling rate on regular AEM pages is 1 out of 100 page views
  // but we increase this by default for audiences, campaigns and experiments
  // to 1 out of 10 page views so we can collect metrics faster of the relative
  // short durations of those campaigns/experiments
  rumSamplingRate: 10,

  // the storage type used to persist data between page views
  // (for instance to remember what variant in an experiment the user was served)
  storage: window.SessionStorage,

  /* Audiences related properties */
  // See more details on the dedicated Audiences page linked below
  audiences: {},
  audiencesMetaTagPrefix: 'audience',
  audiencesQueryParameter: 'audience',

  /* Campaigns related properties */
  // See more details on the dedicated Campaigns page linked below
  campaignsMetaTagPrefix: 'campaign',
  campaignsQueryParameter: 'campaign',

  /* Experimentation related properties */
  // See more details on the dedicated Experiments page linked below
  experimentsMetaTag: 'experiment',
  experimentsQueryParameter: 'experiment',
}, pluginContext);
```

For detailed implementation instructions on the different features, please read the dedicated pages we have on those topics:
- [Audiences](/documentation/audiences.md)
- [Campaigns](/documentation/campaigns.md)
- [Experiments](/documentation/experiments.md)
>>>>>>> 27c38b8 (Squashed 'plugins/experimentation/' changes from e04a21c..7efc8ed)
