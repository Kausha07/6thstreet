import { getValueFromTotals } from "Component/CartTotal/utils/CartTotal.helper";
import {
  CARD,
  TABBY_ISTALLMENTS,
} from "Component/CheckoutPayments/CheckoutPayments.config";

export const getTabbyInstallmentFromTotal = ({
  getTabbyInstallment,
  createTabbySession,
  setTabbyWebUrl,
  totals = {},
  shippingAddress = {},
  currentSelectedCityArea = {},
}) => {
  const { total_segments = [] } = totals;

  const CODFee = getValueFromTotals(total_segments, "msp_cashondelivery");
  const grandTotal = getValueFromTotals(total_segments, "grand_total");

  return new Promise((resolve, reject) => {
    getTabbyInstallment(grandTotal - CODFee)
      .then((response) => {
        if (response?.value) {
          createTabbySession(shippingAddress)
            .then((response) => {
              if (response && response.configuration) {
                const {
                  configuration: {
                    available_products: { installments },
                  },
                  payment: { id },
                } = response;

                if (installments) {
                  setTabbyWebUrl(
                    installments[0].web_url,
                    id,
                    TABBY_ISTALLMENTS
                  );
                  resolve({ isTabbyInstallmentAvailable: true });
                } else {
                  resolve({ isTabbyInstallmentAvailable: false });
                }
              } else {
                resolve({ isTabbyInstallmentAvailable: false });
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve({ isTabbyInstallmentAvailable: false });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
