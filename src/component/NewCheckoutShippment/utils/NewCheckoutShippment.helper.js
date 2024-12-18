import { isObject } from "Util/API/helper/Object";
import { getTodaysCutOffTime } from "Util/Common";

export const getEddForShipment = ({
  shipmentItem = {},
  eddResponse = {},
  actualEddMess = "",
}) => {
  const { items = [] } = shipmentItem;
  const sku = items?.[0]?.sku;

  if (!sku) {
    return null;
  }

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
  // if city area is not selected
  return {
    edd_message_en: actualEddMess,
    edd_message_ar: actualEddMess,
  };
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

export const getCutOffTimeCheckoutPage = ({
  shipmentItems = [],
  cutOffTime = {},
  mailing_address_type,
}) => {
  let cutOffTimeShipment = [];

  shipmentItems.map((item, i) => {
    const {
      full_item_info: { mp_quantity = 0, store_quantity = 0, whs_quantity = 0 },
    } = item;

    let cutOffTimeSku = getTodaysCutOffTime({
      cutOffTime,
      whs_quantity,
      store_quantity,
      mp_quantity,
      mailing_address_type,
    });

    if (cutOffTimeSku) {
      cutOffTimeShipment.push(cutOffTimeSku);
    }
  });

  // Find the minimum time
  const minTime = cutOffTimeShipment.reduce(
    (min, time) => (time < min ? time : min),
    cutOffTimeShipment[0]
  );

  return minTime;
};
