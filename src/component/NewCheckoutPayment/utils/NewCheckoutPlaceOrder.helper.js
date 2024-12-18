import {
  CARD,
  TABBY_ISTALLMENTS,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import BrowserDatabase from "Util/BrowserDatabase";
import { FIVE_MINUTES_IN_SECONDS } from "Util/Request/QueryDispatcher";

export const newCheckoutProcessPlaceOrder = async ({
  currentPaymentMethod,
  newCardVisible,
  binApplied,
  applyBinPromotion,
  setCheckoutCreditCardData,
  number,
  expMonth,
  expYear,
  cvv,
  saveCard,
  shippingAddress,
  getCardType,
  addNewCreditCard,
  savePaymentInformation,
  showErrorNotification,
  getCartError,
  handleError,
  savedCards,
}) => {
  if (currentPaymentMethod === CARD) {
    if (newCardVisible) {
      //if payment is via new card.

      if (!binApplied) {
        await applyBinPromotion();
        return;
      }

      setCheckoutCreditCardData(
        number,
        expMonth,
        expYear,
        cvv,
        saveCard,
        shippingAddress?.email
      );

      getCardType(number.substr("0", "6")).then((response) => {
        if (response) {
          const { requires_3ds, type } = response;

          BrowserDatabase.setItem(
            type,
            "CREDIT_CART_TYPE",
            FIVE_MINUTES_IN_SECONDS
          );
          BrowserDatabase.setItem(
            requires_3ds,
            "CREDIT_CART_3DS",
            FIVE_MINUTES_IN_SECONDS
          );
        }
      });

      addNewCreditCard({ number, expMonth, expYear, cvv })
        .then((response) => {
          const { id, token } = response;
          if (id || token) {
            BrowserDatabase.setItem(
              id ?? token,
              "CREDIT_CART_TOKEN",
              FIVE_MINUTES_IN_SECONDS
            );

            savePaymentInformation({
              billing_address: shippingAddress,
              paymentMethod: { code: currentPaymentMethod },
              // finalEdd,
              // finalEddString
            });
          } else if (Array.isArray(response)) {
            const message = response[0];

            if (typeof message === "string") {
              showErrorNotification(getCartError(message));
            } else {
              showErrorNotification(__("Something went wrong"));
            }
          } else if (typeof response === "string") {
            showErrorNotification(response);
          }
        }, handleError)
        .catch(() => {
          showErrorNotification(__("Something went wrong"));
        });
    } else {
      //if payment is via saved card.
      let selectedCard = savedCards.find((a) => a.selected === true);
      if (selectedCard) {
        //if card is selected
        selectedCard["cvv"] = cvv;
        savePaymentInformation({
          billing_address: shippingAddress,
          paymentMethod: { code: currentPaymentMethod },
          selectedCard,
          // finalEdd,
          // finalEddString
        });
      } else {
        //if saved card is not selected
        showErrorNotification("Please select an card first.");
      }
    }
  } else {
    savePaymentInformation({
      billing_address: shippingAddress,
      paymentMethod: { code: currentPaymentMethod },
      // finalEdd,
      // finalEddString
    });
  }
};
