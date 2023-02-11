import CatalogueAPI from 'Util/API/provider/CatalogueAPI'

export const getProductDetailsById = (locale, productID) => CatalogueAPI.get(
   `products/${productID}?locale=${locale}`
) || {};

export const getProductDetailsBySKU = (locale, SKU) => CatalogueAPI.get(
    `products`
    + `?locale=${locale}&sku=${SKU}`
) || {};
