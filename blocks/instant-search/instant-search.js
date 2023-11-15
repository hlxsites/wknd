import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-instant-search.js';

export default function decorate(block) {
  const { algoliasearch, instantsearch } = window;
  const {
    searchBox, hits, configure, panel, refinementList, pagination,
  } = instantsearch.widgets;
  const params = new URL(document.location).searchParams;
  const query = params.get('query');

  block.innerHTML = `
    <div class="container">
      <div class="search-panel">
        <div class="search-panel__filters">
          <div id="brand-list"></div>
        </div>

        <div class="search-panel__results">
          <div id="searchbox"></div>
          <div id="hits"></div>
          <div id="pagination"></div>
        </div>
      </div>
    </div>
  `;

  fetch('/config/algolia.json')
    .then(async (response) => {
      const { data } = await response.json();
      const config = new Map(data.map((obj) => [obj.name, obj.value]));

      const searchClient = algoliasearch(
        config.get('appId'),
        config.get('searchApiKey'),
      );

      const search = instantsearch({
        indexName: config.get('indexName'),
        searchClient,
        insights: true,
        routing: {
          stateMapping: {
            stateToRoute(uiState) {
              return {
                query: uiState[config.get('indexName')].query,
              };
            },
            routeToState(routeState) {
              return {
                [config.get('indexName')]: {
                  query: routeState.query,
                },
              };
            },
          },
        },
      });

      search.addWidgets([
        searchBox({
          container: '#searchbox',
          placeholder: config.get('placeholder'),
          autofocus: false,
          searchAsYouType: true,
          searchParameters: {
            query,
          },
        }),
        hits({
          container: '#hits',
          templates: {
            item: (hit, { html, components }) => html`
        <article>
          <h1>${components.Highlight({ hit, attribute: 'name' })}</h1>
          <p>${components.Highlight({ hit, attribute: 'description' })}</p>
        </article>
      `,
          },
        }),
        configure({
          hitsPerPage: 8,
        }),
        panel({
          templates: { header: 'brand' },
        })(refinementList)({
          container: '#brand-list',
          attribute: 'brand',
        }),
        pagination({
          container: '#pagination',
        }),
      ]);

      search.start();
    });
}
