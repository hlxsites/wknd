# Franklin RUM Conversion tracking extension

Adds conversion tracking functionality to Helix RUM Collection (client-side)

## Installation

```bash
git subtree add --squash --prefix plugins/rum-conversion git@github.com:adobe/franklin-rum-conversion.git main
```

You can then later update it from the source again via:
```bash
git subtree pull --squash --prefix plugins/rum-conversion git@github.com:adobe/franklin-rum-conversion.git main
```

:warning: If you are using a folder as a franklin docroot/codeBasePath: you must add that folder in the `prefix` argument in the commands above.
e.g.:
```
git subtree add --squash --prefix docroot/plugins/rum-conversion git@github.com:adobe/franklin-rum-conversion.git main
```

## Initialization
In your `script.js` find the method `loadLazy()`.
At the end of the method add the following code:

```
  const context = {
    getMetadata,
    toClassName,
  };
  // eslint-disable-next-line import/no-relative-packages
  const { initConversionTracking } = await import('../plugins/rum-conversion/src/index.js');
  await initConversionTracking.call(context, document);
```
Please, note that `getMetadata` and `toClassName` methods should be imported from `lib-franklin.js` in your `script.js`

:information_source: There are some mechanisms commonly used in Franklin projects, that load dynamically in the page, content from a different document after the page has been fully loaded.
e.g.: A contact us form that is displayed in a modal dialog when the user clicks a button.
If you are using such a mechanism, that includes extra elements in the DOM after `loadLazy()` and you want to track conversions in this included HTML fragment, you need to initialize conversion tracking for that content once it is loaded in the page.

```
  await initConversionTracking.call(context, fragmentElement, defaultFormConversionName)
```
`context` is the  object containing `getMetadata` and `getClassName` methods \
`fragmentElement` is the parent HTML Element included dynamically where we want to track conversions \
`defaultFormConversionName` is the name we want to use to track the conversion of a form, when a conversion name is not defined in the section or document metadata. This parameter is optional. Typical use case is to pass the path to the fragment that contains the form.

## Usage

At the moment, the conversion tracking that is used to report conversions to RUM is both too broad and too narrow.

* Too broad: any `click` on the page will be counted as a conversion, not just clicks on relevant elements such as the "sign-up", "free demo", "price quote" CTAs.
* Too narrow: if the user navigates away from the current page, and converts later, this can still indicate a successful conversion, just one that has been delayed

With this extension, developers can declare arbitrary elements to be conversion targets that track a conversion when they are `clicked` (or `submitted` in case of forms). Each conversion can carry either a conversion name such as "requested quote" or a conversion value such as a dollar amount (e.g. the value of the shopping cart upon checkout). To do so, the `sampleRUM.convert` function is used.

The conversion names and conversion values can later on be used in reporting the effectiveness of an experiment.
### Practitioner defined conversions
_**Identifying the user actions to track**_

In order to setup conversions a practitioner must define a page metadata property called `Conversion Element` which can have the values: `< Link | Labeled Link | Form >`

* `Link`:  Clicks on any link `<a href="...">` will be tracked as conversions.
* `Form`: form submissions in the page will be tracked as conversions.
* `Labeled Link`: Only links specified in the metadata property `Conversion Link Labels` will be considered for tracking conversions.

The three values can be combined, although if `Link` is configured, `Labeled Link` would be redundant.

In case of `Conversion Element = Labeled Link`, we can define the list of links for which we want to track clicks as conversions using the page metadata property:

* `Conversion Link Labels`:  Comma separated list of link labels that will be tracked as conversions. The link label is the inner text of the link.

![conversion-element](https://user-images.githubusercontent.com/43381734/218769859-8302c97d-98ad-4bfc-b7c4-0edcc0aa0f08.png)

_**Conversion Names for Link clicks**_

Practitioners can assign a conversion name to each of the link clicks. A metadata property for each link will be defined:

* `Conversion Name (<Link Label>)` : Link label as explained above is the inner text of the link. The value of this property will be used as conversion name when a user clicks the link.
* `Conversion Name`: it is also possible to use a default conversion name for all links in the document.

_By default_ If no conversion name is defined for a link, the link inner text converted `toClassName` will be used as conversion name. That is the inner text to lower case, replacing white spaces by dashes.

![link-conversion-metadata](https://user-images.githubusercontent.com/43381734/218726528-83570d0c-d2d6-4a00-a70d-46bcab15669d.png)

_**Conversion Names and Values for Form submission**_

While conversion names for link clicks are defined exclusively in the document metadata, the conversion name for a form submission can be defined by adding the property `Conversion Name`, either in the **section** metadata where the form resides (could be in a fragment document), or in the main document metadata.

* `Conversion Name`: the value of the property will be used as conversion name to track the form submission.

_By default_ If no conversion name is defined for a form, neither in section nor in page metadata, developers can still pass a default value in the call to the `initConversionTracking`. Last fallback is the form id.

Practitioners can also define a **conversion value** for form submissions. Conversion value should be a numeric value, and is normally related to the monetary aspect of the conversion.\
The conversion value is defined with another section metadata property called `Conversion Value Field`, allowed values for this property are:

* _Id_ of the form field whose value we want to use as conversion value
* _Name_ of the form field whose value we want to use as conversion value
* _Label_ of the field whose value we want to use as conversion value

![form-conversion-metadata](https://user-images.githubusercontent.com/43381734/218726040-81fb4d04-9a91-495e-a23b-50fcafd86a75.png)

:warning: the form element needs to be submitted, i.e. the `submit` event for the form must be triggered. If forms are submitted using a `click` listener on the button, and then doing a `fetch` request with the form information, the submission won't be detected by the conversion tracking framework.

### Developer defined conversions
For more specific requirements it is also possible for developers to invoke the conversion API using the following method:

`sampleRUM.convert(cevent, cvalueThunk, element, listenTo = []) `

`cevent` is the conversion name \
`cvalueThunk` can be the conversion value or a function that calculates the conversion value \
`element` is the element that generates the conversion \
`listenTo` is the array of events we want to listen to to generate a conversion.

This method has 2 modes:

* listener registration mode: If the method is called with `element` and `listenTo` values it will register a listener on the element for the given events. Every time the event is triggered a conversion with the given arguments will be tracked.
* conversion tracking mode: If the method is called with empty `listenTo` it will track a conversion using as conversion name the `cevent` and/or `cvalueThunk` as conversion value.

### Integration with Analytics solutions
In order to track conversions defined in Franklin in Analytics solutions, you can leverage the method `sampleRUM.always.on('convert', (data) => { ... })`\
This method is invoked by the RUM conversion framework after every call to convert method. The parameter `data` contains the information of the conversion event tracked.

It is **important** to note that while RUM data is sampled, in the sense it sends information to the RUM service from a small fraction of page views, this method is invoked for all conversions defined, regardless of whether the conversion event is sent to the RUM service or not.

The implementation should be provided in your `scripts.js` file, and declared after the call to `initConversionTracking`.

Typical implementations of this method are integration with Adobe Analytics WebSDK or pushing the conversion events to a Data Layer.


Below you can find an example implementation for Adobe Analytics WebSDK.
```
// Declare conversionEvent, bufferTimeoutId and tempConversionEvent outside the convert function to persist them for buffering between
// subsequent convert calls
let bufferTimeoutId;
let conversionEvent;
let tempConversionEvent;

// call upon conversion events, sends them to alloy
sampleRUM.always.on('convert', async (data) => {
  const { element } = data;
  // eslint-disable-next-line no-undef
  if (element && alloy) {
    if (element.tagName === 'FORM') {
      conversionEvent = {
        event: 'Form Complete',
        ...(data.source ? { conversionName: data.source } : {}),
        ...(data.target ? { conversionValue: data.target } : {}),
      };

      if (
        conversionEvent.event === 'Form Complete' &&
        (data.target === undefined || data.source === undefined)
      ) {
        // If a buffer has already been set and tempConversionEvent exists, merge the two conversionEvent objects to send to alloy
        if (bufferTimeoutId !== undefined && tempConversionEvent !== undefined) {
          conversionEvent = { ...tempConversionEvent, ...conversionEvent };
        } else {
          // Temporarily hold the conversionEvent object until the timeout is complete
          tempConversionEvent = { ...conversionEvent };

          // If there is partial form conversion data, set the timeout buffer to wait for additional data
          bufferTimeoutId = setTimeout(async () => {
            await analyticsTrackFormSubmission(element, {
              conversion: {
                ...(conversionEvent.conversionName
                  ? { conversionName: `${conversionEvent.conversionName}` }
                  : {}),
                ...(conversionEvent.conversionValue
                  ? { conversionValue: `${conversionEvent.conversionValue}` }
                  : {}),
              },
            });
            tempConversionEvent = undefined;
            conversionEvent = undefined;
          }, 100);
        }
      }
    } else if (element.tagName === 'A') {
      conversionEvent = {
        event: 'Link Click',
        ...(data.source ? { conversionName: data.source } : {}),
        ...(data.target ? { conversionValue: data.target } : {}),
      };
      await analyticsTrackLinkClicks(element, 'other', {
        conversion: {
          ...(conversionEvent.conversionName
            ? { conversionName: `${conversionEvent.conversionName}` }
            : {}),
          ...(conversionEvent.conversionValue
            ? { conversionValue: `${conversionEvent.conversionValue}` }
            : {}),
        },
      });
      tempConversionEvent = undefined;
      conversionEvent = undefined;
    }
  }
});
```
