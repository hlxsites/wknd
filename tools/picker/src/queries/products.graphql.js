const query = `query getProductsInCategory($uid: String!) {
    products(
        filter: { category_uid: { eq: $uid } }
        pageSize: 20
        currentPage: 1
    ) {
        items {
            name
            sku
            thumbnail {
                url
                label
            }
            ... on ConfigurableProduct {
                variants {
                    product {
                        thumbnail {
                            url
                            label
                        }
                    }
                }
            }
            url_key
            __typename
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
