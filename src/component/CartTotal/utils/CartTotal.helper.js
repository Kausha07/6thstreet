export const getValueFromTotals = (totalSegments, totalsCode) => {
  const { value } = totalSegments.find(({ code }) => code === totalsCode) || {
    value: 0,
  };

  return value;
};

export const checkIsAnyExpressShipment = ({
  expected_shipments = [],
  totals = [],
}) => {
  const expressFee = getValueFromTotals(totals, "express_delivery_charges");

  let checkIsExpressShipment = expected_shipments.some(
    (shipment) =>
      shipment.selected_delivery_type == 1 ||
      shipment.selected_delivery_type == 2
  );

  if (checkIsExpressShipment && expressFee === 0) {
    return true;
  } else return false;
};
