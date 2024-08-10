import React from "react";
import { connect } from "react-redux";
import { ExpressDeliveryTruck } from "Component/Icons";
import "./ExpressDeliveryTag.style";

export const mapStateToProps = (state) => ({
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  isExpressServiceAvailable: state.MyAccountReducer.isExpressServiceAvailable,
  edd_info: state.AppConfig.edd_info,
  vwoData: state.AppConfig.vwoData,
});

export const ExpressDeliveryTag = (props) => {
  const {
    productInfo: {
      express_delivery_home = "",
      express_delivery_work = "",
      express_delivery_other = "",
      simple_products = {},
      international_vendor = "",
      cross_border = 0,
      in_stock = 1,
      stock_qty = 1,
    },
    edd_info,
    isExpressServiceAvailable,
    isExpressDelivery,
    vwoData,
    setExpressVisible = () =>null
  } = props;

  const currentSelectedAddress = JSON.parse(
    localStorage.getItem("currentSelectedAddress")
  );

  const getFinalExpressDeliveryKey = () => {
    if (currentSelectedAddress?.mailing_address_type === "37303") {
      return express_delivery_home;
    } else if (currentSelectedAddress?.mailing_address_type === "37304") {
      return express_delivery_work;
    } else if (currentSelectedAddress?.mailing_address_type === "37305") {
      return express_delivery_other;
    } else return express_delivery_home;
  };

  const express_delivery = getFinalExpressDeliveryKey();

  const renderExpressDeliveryTag = () => {
    const isInternationalProduct =
      edd_info?.international_vendors?.includes(international_vendor);

    if (
      in_stock === 0 ||
      (in_stock === 1 && stock_qty === 0) ||
      !isExpressDelivery ||
      !vwoData?.Express?.isFeatureEnabled ||
      isInternationalProduct ||
      !express_delivery ||
      !currentSelectedAddress ||
      (currentSelectedAddress &&
        !isExpressServiceAvailable?.express_eligible) ||
      express_delivery === 1 ||
      express_delivery === 0 ||
      !["today delivery", "tomorrow delivery"].includes?.(
        express_delivery?.toLowerCase()
      )
    ) {
      return null;
    }
    setExpressVisible(true);

    return (
      <div block="ExpressDeliveryTagBlock">
        <ExpressDeliveryTruck />
        <div block="ExpressDeliveryText">
          <span block="ExpressDeliveryTextRed">
            {__("Express")} {}
          </span>
          <span block="ExpressDeliveryTextNormal">&nbsp;{__("Delivery")}</span>
          <span block="ExpressDeliveryTextNormal">&nbsp;{__("by")}</span>
          <span block="ExpressDeliveryTextBold">
            &nbsp;
            {express_delivery !== 1 &&
            express_delivery !== 0 &&
            express_delivery?.toLowerCase() !== "tomorrow delivery"
              ? __("Today")
              : __("Tomorrow")}
          </span>
        </div>
      </div>
    );
  };
  return renderExpressDeliveryTag();
};

export default connect(mapStateToProps, null)(ExpressDeliveryTag);
