import XLSX from 'xlsx';
import fs from 'fs';
import he from 'he';
import getAllProducts from './queries/products.graphql.js';

const endpoint = 'https://venia.magento.com/graphql';

const prodMetadata = [];
const createSheet = async () => {
  const data = [
    ['URL', 'keywords', 'title', 'og:title' , 'description' , 'og:description'],
  ];
  prodMetadata.forEach((metaData) => {
    data.push(
      [metaData.path, metaData.meta_keyword,
        metaData.meta_title, metaData.meta_title,
        metaData.meta_description, metaData.meta_description],
    );
  });
  // Write XLSX file
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
  const xlsx = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  await fs.promises.writeFile('metadata.xlsx', xlsx);
};

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
    result.data.products.items.forEach((item) => {
      const baseImageUrl = `https://venia.magento.com/product-images/${item.sku}.jpg`;
      const itemMeta = {
        path: `/products/${item.url_key}/${item.sku}`,
        meta_keyword: (item.meta_keyword !== null) ? item.meta_keyword : '',
        meta_title: he.decode((item.meta_title !== null) ? item.meta_title : item.name),
        meta_description: (item.meta_description !== null) ? item.meta_description : '',
        'og:image': baseImageUrl,
        'og:image:secure_url': baseImageUrl,
        'twitter:image': baseImageUrl,
      };
      prodMetadata.push(itemMeta);
    });
    const totalPages = result.data.products.page_info.total_pages;
    const currentPage = result.data.products.page_info.current_page;
    if (currentPage !== totalPages) {
      getProducts(currentPage + 1);
    } else {
      createSheet();
    }
  }
};

getProducts()
  .then()
  .catch((e) => console.error(e));