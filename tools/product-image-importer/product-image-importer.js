import fs from 'fs';
import https from 'https';
import getAllProducts from './queries/products.graphql.js';

const endpoint = 'https://venia.magento.com/graphql';
const imageFolder = './product-images';

/**
 * Get products by page number
 * @param {INT} pageNumber - pass the pagenumber to retrieved paginated results
 */
const getProducts = async (pageNumber) => {
  const api = new URL(endpoint);
  api.searchParams.append('query', getAllProducts);
  api.searchParams.append('variables', JSON.stringify({ currentPage: pageNumber }));

  const response = await fetch(api, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      store: 'wknd',
    },
  });
  const result = await response.json();

  if (result && result.data) {
    const products = result.data.products.items;
    const totalPages = result.data.products.page_info.total_pages;
    const currentPage = result.data.products.page_info.current_page;
    if (currentPage !== totalPages) {
      console.log(`Retrieved page ${currentPage} of ${totalPages} pages`);
      return [...products, ...(await getProducts(currentPage + 1))];
    }
    return products;
  }
  return [];
};

/**
 * Download file from url and store it at fileName
 * @param {String} url Url that should be downloaded
 * @param {String} fileName Path where file should be stored
 */
const downloadFile = async (url, fileName) => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    const code = response.statusCode ?? 0;

    if (code >= 400) {
      return reject(new Error(response.statusMessage));
    }

    if (code > 300 && code < 400 && !!response.headers.location) {
      return resolve(downloadFile(response.headers.location, fileName));
    }

    const fileWriter = fs
      .createWriteStream(fileName)
      .on('finish', () => {
        resolve({});
      });

    response.pipe(fileWriter);

    return null;
  }).on('error', (error) => {
    reject(error);
  });
});

(async () => {
  const products = await getProducts(1);

  const imagePaths = products.map((product) => {
    // Look for color option
    const colorOption = product.configurable_options.find((option) => option.attribute_code === 'color');

    // Sort colors alphabetically to ensure the same color is always selected as base image
    const values = colorOption.values.sort((a, b) => a.label.localeCompare(b.label));

    // Get first color
    const color = values[0].label;
    console.log(`Select color ${color} as base color for ${product.sku}`);

    // Get first variant that matches color
    const variant = product.variants.find(
      (v) => v.attributes.find((attribute) => attribute.code === 'color' && attribute.label === color),
    );

    // Clean url
    const imageUrl = new URL(variant.product.image.url);
    imageUrl.search = '';

    return { sku: product.sku, image: imageUrl.toString() };
  });

  // Create image folder if it does not exist yet
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

  // Download all image urls as files and store in imageFolder
  await Promise.all(
    imagePaths.map(async ({ sku, image }) => {
      // Get extension from filename
      const filename = image.split('/').pop();
      const extension = filename.split('.').pop();

      await downloadFile(image, `${imageFolder}/${sku}.${extension}`);
      console.log(`Downloaded ${image} for ${sku}`);
    }),
  );
})();
