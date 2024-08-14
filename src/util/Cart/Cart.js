// eslint-disable-next-line import/prefer-default-export
export const checkProducts = (
  items = {},
  totals = {},
  isExpressEnable = false
) =>
  Object.entries(items).reduce((acc, item) => {
    const {
      full_item_info: { reserved_qty = 0 },
    } = item?.[1];
    const { status = null } = totals;
    if (status != null && reserved_qty < item[1].qty && isExpressEnable) {
      acc.push(0);
    } 
    //else 
    // if (status != null && isExpressEnable && reserved_qty != 0) {
    //   return acc;
    // } 
    //else 
    if (
      item[1].availableQty === 0 ||
      item[1].availableQty < item[1].qty
    ) {
      acc.push(0);
    }
    return acc;
  }, []);
