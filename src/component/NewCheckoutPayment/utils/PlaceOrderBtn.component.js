import React from "react";
import Applepay from "Component/CheckoutBilling/icons/apple.png";
import { ThreeDots } from "react-loader-spinner";
import { Collapse } from "react-collapse";
import Image from "Component/Image";
import { getFinalPrice } from "Component/Price/Price.config";
import { getValueFromTotals } from "Component/CartTotal/utils/CartTotal.helper";
import CheckoutOrderSummary from "Component/CheckoutOrderSummary";

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
    totals,
    totals: { total, currency_code, total_segments = [] },
    vwoData,
    dropdownToggleIcon,
    isDropdownOpen,
    onDropdownClicked,
  } = props;

  const cashOnDeliveryFee = getValueFromTotals(
    total_segments,
    "msp_cashondelivery"
  );

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

  const renderPriceLine = (price, name, mods) => {
    return (
      <li
        block="CheckoutBillingTotal CheckoutOrderSummary"
        elem="SummaryItem"
        mods={mods}
      >
        <strong block="CheckoutOrderSummary" elem="Text">
          {name}
        </strong>
        {price !== undefined ? (
          <strong block="CheckoutOrderSummary" elem="Price">
            {`${currency_code} ${price}`}
          </strong>
        ) : null}
      </li>
    );
  };

  const renderTotals = () => {
    const grandTotal = getFinalPrice(total, currency_code);
    const isSidewideCouponEnabled =
      vwoData?.SiteWideCoupon?.isFeatureEnabled || false;

    return (
      <div block="Checkout" elem="OrderTotals">
        <div block="Checkout" elem="OrderSummaryTriggerContainer">
          <div
            onClick={onDropdownClicked}
            block="Checkout"
            elem="OrderSummaryTrigger"
            type="button"
            mods={{ dropdownToggleIcon }}
          ></div>
        </div>
        <div block="Checkout" elem="OrderSummaryTotalsContainer">
          <Collapse isOpened={isDropdownOpen}>
            <CheckoutOrderSummary
              checkoutStep="BILLING_STEP"
              totals={totals}
              cashOnDeliveryFee={cashOnDeliveryFee}
            />
          </Collapse>
        </div>
        {!isSidewideCouponEnabled
          ? renderPriceLine(grandTotal, __("Total Amount"), {
              isDropdownOpen,
            })
          : null}
      </div>
    );
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
          {renderTotals()}
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
