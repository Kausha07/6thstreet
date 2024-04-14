import { isArabic, getDiscountFromTotals } from "Util/App";

export const getSideWideSavingPercentages = (totals = []) => {
  const totalMrp = getDiscountFromTotals(totals, "total_mrp");
  const totalDiscount = getDiscountFromTotals(totals, "total_discount");

  let discountPercentage = Math.round(100 * (1 - totalDiscount / totalMrp));

  // let discountPercentage = Math.round(100 * ( totalDiscount / totalMrp));

  if (discountPercentage === 0) {
    discountPercentage = 1;
  }
  return discountPercentage;
};
