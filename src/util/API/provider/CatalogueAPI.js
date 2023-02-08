import { doFetch } from '../helper/Fetch';

class CatalogueAPI {
    get(brand_name) {
        const CATALOG_BASE_URL = process.env.REACT_APP_CATALOGUE_URL;
        return doFetch(`${CATALOG_BASE_URL}catalogue/brands`
            + `${brand_name ? '?name=' + encodeURIComponent(brand_name) : ''}`);
    }
}

export default new CatalogueAPI();
