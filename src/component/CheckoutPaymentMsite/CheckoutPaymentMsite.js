import React from "react";
import "./CheckoutPaymentMsite.style";
import addNewCardIcon from "Component/CheckoutPayments/icons/addnewcard.png";
import { PAYMENTS_DATA } from "./CheckoutPaymentMsite.config";
import { CASH_ON_DELIVERY } from "Component/CheckoutPayments/CheckoutPayments.config";

function CheckoutPaymentMsite(props) {
  const {
    method = {},
    paymentRenderMap,
    selectPaymentMethod,
    selectedPaymentCode,
    setCashOnDeliveryFee,
  } = props;

  const {
    title,
    m_code,
    options: { method_description = "", method_title = "" } = {},
  } = method;
  const isSelected = m_code === selectedPaymentCode;

  const renderPayMethodIcon = () => {
    if (PAYMENTS_DATA[m_code]) {
      const { name, mod, paragraph, img } = PAYMENTS_DATA[m_code];

      return <img src={img} alt={name} className="card-icon" />;
    }

    return <img src={addNewCardIcon} alt="Card Icon" className="card-icon" />;
  };

  const renderPayment = () => {
    return (
      <div className="add-new-card">
        <label htmlFor="newCard">
          {renderPayMethodIcon()}
          <span>{method_title}</span>
        </label>
        <div block="radioSelect" mods={{ isSelected }}></div>
      </div>
    );
  };

  const renderSelectedPaymentMethodDetails = () => {
    const render = paymentRenderMap[m_code];

    if (!render) {
      return null;
    }

    return render(method);
  };

  return (
    <div
      block="checkoutPaymentMsite"
      mods={{ lastMethod: m_code === CASH_ON_DELIVERY }}
    >
      <div
        onClick={() => {
          selectPaymentMethod(method);
        }}
        block="cashOnDeliveryMsite"
      >
        {renderPayment()}

        {isSelected && (
          <div block="cashOnDeliveryMsite" elem="select">
            {renderSelectedPaymentMethodDetails()}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPaymentMsite;
