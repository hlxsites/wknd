import { request as graphqlRequest } from 'graphql-request';
import fetch from 'node-fetch';
const url = 'https://venia.magento.com/graphql'; // Replace with your GraphQL endpoint
// Define the value to be passed as the "categoryId" variable
const categoryIdValue = 'MTA0'; // Replace this with the value you want to compare


const dataRaw = `
query {
    products(filter: { category_uid: { eq: "MTA3"} }) {
      items {
        name 
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
`;
const variables = {
    categoryId: categoryIdValue,
  };
const headers = {
  // Add any custom headers you need, like authorization headers, etc.
  'Authority': 'venia.magento.com',
  'Store': 'wknd',
  'Content-type': 'application/json'
};
  
  /*graphqlRequest(url, dataRaw, variables, { headers })
  .then(response => {
    console.log('GraphQL request successful!');
    console.log('Response:');
    console.log(response);
  })
  .catch(error => {
    console.error('Error making the GraphQL request:', error.message);
  });
*/
console.log(await getItems(categoryIdValue));
export function getItems(categoryId) {
  return fetch("https://venia.magento.com/graphql", {
  "headers": {
    "accept": "*/*",
    "content-type": "application/json",
    "store": "wknd",
  },
  "body": `{\"query\":\"{\\n  products(filter: { category_uid: { eq: ${categoryId} } }) {\\n    items {\\n      name\\n      sku\\n      url_key\\n      is_returnable\\n      image {\\n        label\\n        url\\n      }\\n      small_image{\\n         label\\n        url\\n      }\\n      swatch_image\\n      price_range{\\n      maximum_price{\\n        final_price{\\n          currency\\n          value\\n        }\\n      }\\n      minimum_price{\\n        final_price{\\n          currency\\n          value\\n        }\\n      }\\n      }\\n    }\\n    page_info {\\n      current_page\\n      page_size\\n      total_pages\\n    }\\n    total_count\\n  }\\n}\\n\"}`,
  "method": "POST"
}).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
}






