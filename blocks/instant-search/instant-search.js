import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-instant-search.js';

export default function decorate(block) {
  const { algoliasearch, instantsearch } = window;
  const {
    searchBox, stats, hits, configure, panel, refinementList, pagination, rangeSlider
  } = instantsearch.widgets;
  const params = new URL(document.location).searchParams;
  const query = params.get('query');

  const { connectHits } = instantsearch.connectors;

  block.innerHTML = `
    <div id="searchbox" style="width:100%"></div>

    <div class="tab">
      <button id="All_Tab" class="tablinks">ALL RESULTS</button>
      <button id="Products_Tab" class="tablinks">Products</button>
      <button id="Articles_Tab" class="tablinks">Articles</button>
    </div>


    <div id="All" class="tabcontent" style="margin-left: 1rem; margin-right: 1rem; margin-top: 1rem; display: flex; flex-direction: column; ">
        <div id="productsBlock" style="width:100%;">
          <div id="productsBlockHeader" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 20px; text-transform: uppercase; font-weight: 600; ">Products</div>
            <button id="seeAllProductsButton">SEE ALL PRODUCTS</button>
          </div>
          <div style="display: flex; flex-wrap: nowrap; justify-content: space-between;">
            <div id="productsBlockHits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          </div>
        </div>

        <div id="articlesBlock" style="width:100%; margin-top: 2rem;">
          <div id="articlesBlockHeader" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 20px; text-transform: uppercase; font-weight: 600; ">Articles</div>
            <button id="seeAllArticlesButton">SEE ALL ARTICLES</button>
          </div>
          <div style="display: flex; flex-wrap: nowrap; justify-content: space-between;">
            <div id="artilesBlockHits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="Products" style="display: flex;" class="tabcontent">    
      <div style="flex-shrink: 0; padding: 1rem; width: 30%; ">
        <div id="catLvl0Facet"></div>  
        <div id="colorFacet"></div>
        <div id="priceFacet"></div>
      </div>

      <div style="flex-shrink: 0; padding: 1rem; width: 70%; ">
        <div style="display: flex; justify-content: flex-end; flex-direction: column; ">
          <div style="width: 100%; display: flex; justify-content: flex-end; border-top: solid 1px; border-color: rgb(210 210 210);">
            <div id="stats"></div>
            <div id="sorting"></div>
          </div>
          <div id="hits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          <div id="pagination" style="width: 100%;"></div>
        </div>
      </div>
    </div>

    <div id="Articles" style="display: flex;" class="tabcontent">
      <div style="flex-shrink: 0; padding: 1rem; width: 100%; ">
        <div style="display: flex; justify-content: flex-end; flex-direction: column; ">
          <div style="width: 100%; display: flex; justify-content: flex-end; border-top: solid 1px; border-color: rgb(210 210 210);">
            <div id="articlesStats"></div>
            <div id="articlesSorting"></div>
          </div>
          <div id="articlesHits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          <div id="articlesPagination" style="width: 100%;"></div>
        </div>
      </div>
    </div>
  `;

  /* =============== ADDING CLICK LISTENERS ===============  */

  const buttons = document.getElementsByClassName("tablinks");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (event) => {
      var j, tabcontent, tablinks;

      tabcontent = document.getElementsByClassName("tabcontent");
      for (j = 0; j < tabcontent.length; j++) {
        tabcontent[j].style.display = "none";
      }

      tablinks = document.getElementsByClassName("tablinks");
      for (j = 0; j < tablinks.length; j++) {
        tablinks[j].className = tablinks[j].className.replace(" active", "");
      }

      var divId = event.currentTarget.id.split('_')[0];
      document.getElementById(divId).style.display = "flex";
      event.currentTarget.className += " active";
    });
  }

  document.getElementById("seeAllProductsButton").addEventListener('click', (event) => {
    document.getElementById("Products_Tab").click();  
  });

  document.getElementById("seeAllArticlesButton").addEventListener('click', (event) => {
    document.getElementById("Articles_Tab").click();  
  });

  /* =============== END ADDING CLICK LISTENERS ===============  */


  /* Open "All" Tab By default */
  document.getElementById("All_Tab").click();

  fetch('/config/algolia.json')
    .then(async (response) => {
      const { data } = await response.json();
      const config = new Map(data.map((obj) => [obj.name, obj.value]));

      const searchClient = algoliasearch(
        config.get('appId'),
        config.get('searchApiKey'),
      );

      const articlesIndex = config.get('articles_indexName');
        
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

      const renderHits = (renderOptions, isFirstRender) => {
      const { hits, widgetParams } = renderOptions;
        widgetParams.container.innerHTML = `
            ${hits
              .map(
                item =>
                  `<div id="hit_card" class="transition-all" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-width: 1px; border: solid 1px ; border-color: rgb(210 210 210);">
                    <a href="${item.url}" style="text-decoration: none !important; " >
                      <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                        <div style="position: relative;">
                          <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                            <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.image_url}" />
                          </div>
                        </div>
                        <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column;">
                          <p style="margin-bottom: 0.25rem; font-size: .75rem; line-height: 1rem; font-weight: 600; text-transform: uppercase;">
                            ${item.name}
                          </p>
                          <div style="display: flex; flex-grow: 1; align-items: flex-end; justify-content: space-between;">
                            <p style="margin-bottom: 1rem; font-size: .875rem; line-height: 1.25rem; font-weight: 700; color: #003DFF; ">
                              <span>
                                ${item.price.USD.default_formated}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>

                    <div style="padding-left: 1rem; padding-right: 1rem; padding-bottom: 1rem; ">
                      <button class="relative flex w-full  rounded-button bg-colorBp-primary  py-4 text-center text-xs font-semibold leading-none text-colorBp-white transition duration-150 ease-in-out hover:opacity-80">
                        <div class="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 transition-all duration-300 ease-in-out -translate-y-1/2 opacity-100">
                          <span>
                            Add to Cart
                          </span>
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cart-shopping" class="svg-inline--fa fa-cart-shopping " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="currentColor" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z">
                            </path>
                          </svg>
                        </div>
                      </button>
                    </div> 
                  </div>`
              )
            .join('')
          }
        `;
      };
      const renderArticles = (articlesRenderOptions, isFirstRender) => {
        const { hits, widgetParams } = articlesRenderOptions;
        widgetParams.container.innerHTML = `
            ${hits
              .map(
                item =>
                  `<div id="hit_card" class="transition-all" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-width: 1px; border: solid 1px ; border-color: rgb(210 210 210);">
                    <a href="${item.prod_url}" style="text-decoration: none !important; " >
                      <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                        <div style="position: relative;">
                          <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                            <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.prod_img}" />
                          </div>
                        </div>
                        <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column; margin-bottom: 1rem;">
                          <p style="margin-bottom: 0.25rem; line-height: 1rem; font-weight: 600; text-transform: uppercase; text-align: center;">
                            ${item.title}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>`
              )
            .join('')
          }
        `;
      };
      const renderAllProductsHits = (renderOptions, isFirstRender) => {
      const { hits, widgetParams } = renderOptions;
        widgetParams.container.innerHTML = `
            ${hits.slice(0, 3)
              .map(
                item =>
                  `<div id="hit_card" class="transition-all" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-width: 1px; border: solid 1px ; border-color: rgb(210 210 210);">
                    <a href="${item.url}" style="text-decoration: none !important; " >
                      <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                        <div style="position: relative;">
                          <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                            <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.image_url}" />
                          </div>
                        </div>
                        <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column;">
                          <p style="margin-bottom: 0.25rem; font-size: .75rem; line-height: 1rem; font-weight: 600; text-transform: uppercase;">
                            ${item.name}
                          </p>
                          <div style="display: flex; flex-grow: 1; align-items: flex-end; justify-content: space-between;">
                            <p style="margin-bottom: 1rem; font-size: .875rem; line-height: 1.25rem; font-weight: 700; color: #003DFF; ">
                              <span>
                                ${item.price.USD.default_formated}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>`
              )
            .join('')
          }
        `;
      };
      const renderAllArticlesHits = (articlesRenderOptions, isFirstRender) => {
        const { hits, widgetParams } = articlesRenderOptions;
        widgetParams.container.innerHTML = `
            ${hits.slice(0, 3)
              .map(
                item =>
                  `<div id="hit_card" class="transition-all" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-width: 1px; border: solid 1px ; border-color: rgb(210 210 210);">
                    <a href="${item.prod_url}" style="text-decoration: none !important; " >
                      <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                        <div style="position: relative;">
                          <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                            <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.prod_img}" />
                          </div>
                        </div>
                        <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column; margin-bottom: 1rem;">
                          <p style="margin-bottom: 0.25rem; line-height: 1rem; font-weight: 600; text-transform: uppercase; text-align: center;">
                            ${item.title}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>`
              )
            .join('')
          }
        `;
      };
      
      const customAllProductsHits = connectHits(renderAllProductsHits );
      const customAllArticlesHits = connectHits(renderAllArticlesHits );
      const customHits = connectHits(renderHits);
      const customArticlesHits = connectHits(renderArticles);

      search.addWidgets([
        
        instantsearch.widgets.searchBox({
          container: '#searchbox',
          placeholder: config.get('placeholder'),
          autofocus: false,
          searchAsYouType: true,
          searchParameters: {
            query,
          },
        }),
        
        instantsearch.widgets.stats({
          container: '#stats',
          templates: {
            text(data, { html }) {
              let count = '';

              if (data.hasManyResults) {
                count += `${data.nbHits}`;
              } else if (data.hasOneResult) {
                count += `1`;
              } else {
                count += `no`;
              }

              return html`<p style="font-size: .875rem;"><span style="color: #003DFF; font-weight: 600;">${count} </span>
              <span>results found in</span>
              <span style="color: #003DFF; font-weight: 600;"> ${data.processingTimeMS}ms</span></p>`;
            },
          },
        }),

        customHits({
          container: document.querySelector('#hits'),
        }),
  
        customAllProductsHits({
          container: document.querySelector('#productsBlockHits'),
        }),
        
        instantsearch.widgets.configure({
          hitsPerPage: 8,
        }),
        
        instantsearch.widgets.panel({
          templates: { header: 'category' },
        })(refinementList)({
          container: '#catLvl0Facet',
          attribute: 'categories.level0',
        }),
        instantsearch.widgets.panel({
          templates: { header: 'color' },
        })(refinementList)({
          container: '#colorFacet',
          attribute: 'color',
        }),
        instantsearch.widgets.panel({
          templates: { header: 'price' },
        })(rangeSlider)({
          container: '#priceFacet',
          attribute: 'price.USD.default',
          pips: false,
        }),

        instantsearch.widgets.pagination({
          container: '#pagination',
        }),

        instantsearch.widgets.index({ indexName: articlesIndex }).addWidgets([
          instantsearch.widgets.configure({
            hitsPerPage: 8,
          }),
          customArticlesHits({
            container: document.querySelector('#articlesHits'),
          }),
          customAllArticlesHits({
            container: document.querySelector('#artilesBlockHits'),
          }),

          instantsearch.widgets.stats({
            container: '#articlesStats',
            templates: {
              text(data, { html }) {
                let count = '';

                if (data.hasManyResults) {
                  count += `${data.nbHits}`;
                } else if (data.hasOneResult) {
                  count += `1`;
                } else {
                  count += `no`;
                }

                return html`<p style="font-size: .875rem;"><span style="color: #003DFF; font-weight: 600;">${count} </span>
                <span>results found in</span>
                <span style="color: #003DFF; font-weight: 600;"> ${data.processingTimeMS}ms</span></p>`;
              },
            },
          }),
          instantsearch.widgets.pagination({
            container: '#articlesPagination',
          }),
        ]),

      ]);

      search.start();
    });
}
