const query = `query getProducts($currentPage: Int = 1) {
    products(search: "", pageSize: 20, currentPage: $currentPage) {
        items {
            name
            sku
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    label
                    values {
                        label
                    }
                }
                variants {
                    attributes {
                        code
                        label
                    }
                    product {
                        image {
                            url
                        }
                    }
                }
            }
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
