const query = `query getCategory($uid: String!) {
    categories(filters: { category_uid: { eq: $uid } }) {
        items {
            name
            uid
            id
            breadcrumbs {
                category_name
                category_uid
            }
        }
    }
}`;

export default query.replaceAll(/(?:\r\n|\r|\n|\t|[\s]{4})/g, ' ');
