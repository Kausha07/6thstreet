import CatalogueAPI from 'Util/API/provider/CatalogueAPI'

export const getBrandInfoByName = (brandName) => CatalogueAPI.get(
    `brands`
    + `?name=${brandName}`
) || {};

export const getAllBrands = () => CatalogueAPI.get(
    `brands`
) || {};
