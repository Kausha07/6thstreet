import { isObject } from "Util/API/helper/Object";

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

export const getShipmentItems = ({ shipmentItem = {}, cartItems = [] }) => {
  const { items = [] } = shipmentItem;
  let shipmentItems = [];

  const cartItemMap = cartItems.reduce((map, item) => {
    map[item.sku] = item;
    return map;
  }, {});

  items.forEach((item) => {
    const { sku } = item;
    const itemFromCartItem = cartItemMap[sku];

    if (itemFromCartItem) {
      shipmentItems.push(itemFromCartItem);
    }
  });

  return shipmentItems;
};
