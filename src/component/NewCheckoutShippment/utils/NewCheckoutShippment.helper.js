import { isObject } from "Util/API/helper/Object";

export const getFomatedItem = ({ item = {} }) => {
  const newItem = {
    customizable_options: [],
    bundle_options: [],
    item_id: item.item_id,
    discount_amount: item.discount_amount,
    discount_percent: item.discount_percent,
    product: {
      name: item.name,
      row_total: +item.row_total || 0,
      type_id: item.product_type,
      configurable_options: {},
      parent: {},
      thumbnail: {
        url: item.thumbnail,
      },
      url: item.url_key,
      variants: [],
      product_type_6s: item.product_type_6s,
    },
    row_total: +item.row_total || 0,
    product_type_6s: item.product_type_6s,
    sku: item.sku,
    qty: item.qty,
    color: item.color,
    optionValue: item.size_value,
    thumbnail_url: item.thumbnail_url,
    basePrice: +item.price,
    brand_name: item.brand_name,
    original_price: +item.original_price,
    availability: item.availability,
    availableQty: item.available_qty,
    extension_attributes: item.extension_attributes,
    full_item_info: item,
    processingRequest: false,
  };

  return newItem || {};
};

export const getEddForShipment = ({ shipmentItem = {}, eddResponse = {} }) => {
  const { items = [] } = shipmentItem;
  const sku = items[0].sku;

  if (
    eddResponse &&
    isObject(eddResponse) &&
    Object.keys(eddResponse).length &&
    eddResponse["checkout"]
  ) {
    const edd = eddResponse["checkout"].filter((eddVal) => {
      if (eddVal.sku == sku) {
        return eddVal;
      }
    });

    return edd[0];
  }
};
