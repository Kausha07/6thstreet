import { getCurrency, getDiscountFromTotals } from "Util/App";
import * as Sentry from "@sentry/react";
import CheckoutComQuery from "Query/CheckoutCom.query";
import { fetchMutation, fetchQuery } from "Util/Request";
import { tokenize } from "Util/API/endpoint/ApplePay/ApplePay.enpoint";

export const processApplePayOrder = ({
  savePaymentInformationApplePay,
  totals: {
    discount,
    subtotal = 0,
    total = 0,
    shipping_fee = 0,
    currency_code = getCurrency(),
    total_segments: totals = [],
    quote_currency_code,
    items,
  },
  totals: checkoutTotals,
  default_title,
  shippingAddress: { country_id, countryCode },
  shippingAddress,
  international_shipping_fee,
  isClubApparelEnabled,
  customer,
  showError,
  placeOrder,
  isApplePayAvailable,
  merchant_id,
  isLoading,
  setIsLoading,
  applePayData,
}) => {
  const LineItems = getLineItems({
    checkoutTotals,
    international_shipping_fee,
    isClubApparelEnabled,
  });

  const paymentRequest = {
    countryCode,
    currencyCode: quote_currency_code,
    supportedNetworks: getSupportedNetworks(applePayData),
    merchantCapabilities: getMerchantCapabilities(applePayData),
    total: { label: default_title, amount: total },
    lineItems: LineItems,
  };

  savePaymentInformationApplePay({
    billing_address: shippingAddress,
    paymentMethod: { code: "checkout_apple_pay" },
  });

  const applePaySession = new window.ApplePaySession(1, paymentRequest);

  try {
    addApplePayEvents({
      applePaySession,
      shippingAddress,
      checkoutTotals,
      customer,
      showError,
      default_title,
      placeOrder,
    });
    applePaySession.begin();
  } catch (error) {
    Sentry.captureException(e, function (sendErr, eventId) {
      // This callback fires once the report has been sent to Sentry
      if (sendErr) {
        console.error("Failed to send captured exception to Sentry");
      } else {
        console.log("Captured exception and send to Sentry successfully");
      }
    });
  }
};

export const getLineItems = ({
  checkoutTotals,
  international_shipping_fee,
  isClubApparelEnabled,
}) => {
  const {
    discount,
    shipping_fee = 0,
    international_shipping_amount = 0,
    total_segments: totals = [],
    items = [],
  } = checkoutTotals;

  let inventory_level_cross_border = false;
  const LineItems = items.map((item) => {
    ({
      label: `${item?.full_item_info?.brand_name} - ${item?.full_item_info?.name}`,
      amount: item?.full_item_info?.price * item?.qty,
    });
    if (
      item?.full_item_info &&
      item?.full_item_info?.cross_border &&
      parseInt(item?.full_item_info.cross_border) > 0
    ) {
      inventory_level_cross_border = true;
    }
  });
  if (discount) {
    LineItems.push({
      label: __("Discount"),
      amount: discount,
    });
  }

  if (!inventory_level_cross_border || !international_shipping_fee) {
    LineItems.push({
      label: __("Shipping Charges"),
      amount: shipping_fee ? shipping_fee : __("FREE"),
    });
  }

  if (inventory_level_cross_border && international_shipping_fee) {
    LineItems.push({
      label: __("International Shipping Fee"),
      amount: international_shipping_amount
        ? international_shipping_amount
        : __("FREE"),
    });
  }

  const storeCredit = getDiscountFromTotals(totals, "customerbalance");

  const reward = getDiscountFromTotals(totals, "reward");

  const clubApparel = isClubApparelEnabled
    ? getDiscountFromTotals(totals, "clubapparel")
    : null;

  if (storeCredit) {
    LineItems.push({
      label: __("My Cash"),
      amount: storeCredit,
    });
  }

  if (reward) {
    LineItems.push({
      label: __("My Rewards"),
      amount: reward,
    });
  }

  if (clubApparel) {
    LineItems.push({
      label: __("Club Apparel Redemption"),
      amount: clubApparel,
    });
  }
  return LineItems;
};

export const getSupportedNetworks = (applePayData) => {
  const { supported_networks = "" } = applePayData;

  return supported_networks.split(",");
};

export const getMerchantCapabilities = (applePayData) => {
  const { merchant_capabilities } = applePayData;
  const output = ["supports3DS"];
  const capabilities = merchant_capabilities.split(",");

  return output.concat(capabilities);
};

export const addApplePayEvents = ({
  applePaySession,
  shippingAddress: { email },
  checkoutTotals: { total: grand_total },
  customer: { email: customerEmail },
  showError,
  default_title,
  placeOrder,
}) => {
  applePaySession.onvalidatemerchant = (event) => {
    const promise = performValidation(event.validationURL);
    promise
      .then((response) => {
        const {
          verifyCheckoutComApplePay: merchantSession,
          verifyCheckoutComApplePay: { statusMessage = "" },
        } = response;
        if (statusMessage) {
          showError(__(statusMessage));
          Logger.log("Cannot validate merchant:", merchantSession);

          return;
        }
        try {
          applePaySession.completeMerchantValidation(merchantSession);
          Logger.log("Completed merchant validation", merchantSession);
        } catch (error) {
          console.error("error on validation complete", error);
        }
      })
      .catch((error) => Logger.log(error));
  };

  applePaySession.onshippingcontactselected = (event) => {
    const status = window.ApplePaySession.STATUS_SUCCESS;
    const newTotal = {
      type: "final",
      label: default_title,
      amount: grand_total,
    };
    try {
      applePaySession.completeShippingContactSelection(
        status,
        [],
        newTotal,
        getLineItems()
      );
    } catch (error) {
      Logger.log("error on shipping contact selected", error);
    }
  };

  applePaySession.onshippingmethodselected = () => {
    const status = window.ApplePaySession.STATUS_SUCCESS;

    const newTotal = {
      type: "final",
      label: default_title,
      amount: grand_total,
    };
    try {
      applePaySession.completeShippingMethodSelection(
        status,
        newTotal,
        getLineItems()
      );
    } catch (error) {
      Logger.log("error on shipping methiod selected", error);
    }
  };

  applePaySession.onpaymentmethodselected = () => {
    const newTotal = {
      type: "final",
      label: default_title,
      amount: grand_total,
    };
    try {
      applePaySession.completePaymentMethodSelection(newTotal, getLineItems());
    } catch (error) {
      Logger.log("payment method selected error", error);
    }
  };

  applePaySession.onpaymentauthorized = (event) => {
    tokenize({
      type: "applepay",
      token_data: event.payment.token.paymentData,
    })
      .then((response) => {
        if (response && response.token) {
          const data = {
            source: {
              type: "token",
              token: response.token,
            },
            customer: {
              email: customerEmail ?? email,
            },
            "3ds": {
              enabled: false,
            },
            metadata: {
              udf1: null,
            },
          };
          applePaySession.completePayment(
            window.ApplePaySession.STATUS_SUCCESS
          );

          placeOrder(CHECKOUT_APPLE_PAY, data);
        }
      })
      .catch((err) => {
        applePaySession.completePayment(window.ApplePaySession.STATUS_FAILURE);
      });
  };

  applePaySession.oncancel = () =>
    Logger.log("Apple Pay session was cancelled.");
};

export const performValidation = (validationUrl) => {
  // this.setState({ isLoading: true });
  const mutation =
    CheckoutComQuery.getVerifyCheckoutComApplePayQuery(validationUrl);

  return fetchMutation(mutation).finally(() =>
    this.setState({ isLoading: false })
  );
};

/**
 * Launch payment method
 */
export const launchPaymentMethod = ({
  showError,
  isApplePayAvailable,
  merchant_id,
  isLoading,
  setIsLoading,
  setApplePayDisabled,
}) => {
  if (!isApplePayAvailable) {
    const missingApplePayMessage =
      "Apple Pay is not available for this browser.";

    showError(__(missingApplePayMessage));
    Logger.log(missingApplePayMessage);

    return;
  }

  new Promise((resolve) => {
    resolve(window.ApplePaySession.canMakePaymentsWithActiveCard(merchant_id));
  })
    .then((canMakePayments) => {
      if (canMakePayments) {
        setApplePayDisabled(false);
      } else {
        const missingApplePayMessage =
          "Apple Pay is available but not currently active.";

        showError(__(missingApplePayMessage));
        Logger.log(missingApplePayMessage);
      }
    })
    .catch((error) => {
      showError(__("Something went wrong!"));
      Logger.log(error);
    });
};

/**
 * Load Apple pay configuration
 * @return {Promise<Request>}
 */
export const requestConfig = ({ setIsLoading, setApplePayData }) => {
  const promise = fetchQuery(CheckoutComQuery.getApplePayConfigQuery());

  promise.then(
    ({
      storeConfig: {
        checkout_com: { apple_pay },
      },
    }) => {
      setIsLoading(false);
      setApplePayData(apple_pay || {});
    },
    () => setIsLoading(false)
  );

  return promise;
};
