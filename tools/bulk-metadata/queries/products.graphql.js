const query = `query getProducts($currentPage: Int=1){
    products(
        search: ""
        pageSize: 20
        currentPage: $currentPage
    ) {
        items {
            name
            sku
            url_key
            meta_description
            meta_keyword
            meta_title
        }
        page_info {
            current_page
            page_size
            total_pages
        }
        total_count
    }
       
}`;
export default query.replaceAll(/(?:\r\n|\r|\n|\t|[\s]{4})/g, ' ');
