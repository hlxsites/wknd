import fetch from 'node-fetch';

fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
fetch('https://main--wknd--hlxscreens.hlx.page/screens-demo/product-list.json')
  .then(response => response.json())
  .then(data => {
    // Access and process each JSON object
    for (const key in data) {
      if (typeof data[key] === 'object' && Array.isArray(data[key].data)) {
        data[key].data.forEach(obj => {
          console.log('Product Name:', obj.product_name);
          console.log('Price:', obj.price);
          console.log('------------------');
        });
      }
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
