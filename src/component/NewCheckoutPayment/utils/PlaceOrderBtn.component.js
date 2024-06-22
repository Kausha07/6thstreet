import React from "react";
import Applepay from "Component/CheckoutBilling/icons/apple.png";
import { ThreeDots } from "react-loader-spinner";
import Image from "Component/Image";

import {
  CHECKOUT_APPLE_PAY,
  CARD,
  TAMARA,
  TABBY_ISTALLMENTS,
} from "Component/CheckoutPayments/CheckoutPayments.config";

const PlaceOrderBtn = (props) => {
  const {
    isCODInLimit,
    isOrderButtonVisible,
    isOrderButtonEnabled,
    processingRequest,
    processingPaymentSelectRequest,
    paymentMethod,
    applePayDisabled,
    binApplied,
    newCardVisible,
    processPlaceOrder,
  } = props;

  const renderButtonPlaceholder = () => {
    const isCardPayment = CARD === paymentMethod;
    const isTamaraPay = TAMARA === paymentMethod;
    let placeholder = isTamaraPay
      ? __("Place Tamara Order")
      : __("Place order");
    if (isCardPayment) {
      //if payment is from card.
      if (newCardVisible && !binApplied) {
        //if there is new card to add and bin is not applied
        placeholder = __("Add Credit Card");
      }
    }
    return <>{placeholder}</>;
  };

  const renderActions = () => {
    // check this for Apple pay
    // const {
    //   handleApplePayButtonClick,
    //   button_style,
    // } = this.props;

    if (!isOrderButtonVisible) {
      return null;
    }

    const isDisabled = !isOrderButtonEnabled;
    const isApplePay = paymentMethod === CHECKOUT_APPLE_PAY;
    const isTabbyPay = paymentMethod === TABBY_ISTALLMENTS;

    return (
      <>
        <div block="Checkout" elem="StickyButtonWrapper">
          {/* {this.renderTotals()}  // for msite    */}
          {isApplePay ? (
            <div block="CheckoutComApplePayPayment" elem="Wrapper">
              <button
                type="button"
                block="CheckoutComApplePayPayment"
                elem="Button"
                label="Pay with ApplePay"
                // onClick={handleApplePayButtonClick}
                disabled={applePayDisabled}
                // mods={{ button_style }}
              >
                <div>{__("Buy with ")}</div>
                <Image
                  lazyLoad={true}
                  block="CheckoutComApplePayPayment"
                  elem="icon"
                  mix={{
                    block: "CheckoutComApplePayPayment",
                    elem: "icon",
                  }}
                  // mods={{ button_style, isArabic }}
                  src={Applepay}
                  alt="Apple Pay"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              block="Button"
              disabled={
                isDisabled ||
                processingRequest ||
                processingPaymentSelectRequest ||
                isApplePay ||
                !isCODInLimit
              }
              onClick={processPlaceOrder}
              mix={{
                block: "CheckoutBilling",
                elem:
                  processingRequest || processingPaymentSelectRequest
                    ? "spinningButton"
                    : isTabbyPay
                    ? "tabbyButton"
                    : "Button",
              }}
            >
              {processingRequest || processingPaymentSelectRequest ? (
                <ThreeDots color="white" height={6} width={"100%"} />
              ) : isTabbyPay ? (
                __("Place tabby order")
              ) : (
                renderButtonPlaceholder()
              )}
            </button>
          )}
        </div>
      </>
    );
  };

  return <div>{renderActions()}</div>;
};

export default PlaceOrderBtn;
