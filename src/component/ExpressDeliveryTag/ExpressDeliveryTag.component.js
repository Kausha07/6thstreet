import React from "react";
import { connect } from "react-redux";
import { ExpressDeliveryTruck } from "Component/Icons";
import "./ExpressDeliveryTag.style";
import { createReducer } from "Store/index";

export const mapStateToProps = (state) => ({
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  isExpressServiceAvailable: state.MyAccountReducer.isExpressServiceAvailable,
  edd_info: state.AppConfig.edd_info,
});

export const ExpressDeliveryTag = (props) => {
  const renderExpressDeliveryTag = () => {
    const {
      productInfo: {
        express_delivery = "",
        simple_products = {},
        international_vendor = "",
        cross_border = 0,
      },
      edd_info,
      isExpressServiceAvailable,
      isExpressDelivery,
    } = props;

    const selctedAddress = JSON.parse(
      localStorage.getItem("currentSelectedAddress")
    );

    const isInternationalProduct =
      edd_info?.international_vendors?.includes(international_vendor) ||
      cross_border;

    if (
      !isExpressDelivery ||
      isInternationalProduct ||
      !express_delivery ||
      !selctedAddress ||
      (selctedAddress && !isExpressServiceAvailable?.express_eligible) ||
      express_delivery === 1 ||
      express_delivery === 0 ||
      !["today delivery", "tomorrow delivery"].includes?.(
        express_delivery?.toLowerCase()
      )
    ) {
      return null;
    }

    return (
      <div block="ExpressDeliveryTagBlock">
        <ExpressDeliveryTruck />
        <div block="ExpressDeliveryText">
          <span block="ExpressDeliveryTextRed">
            {__("Express")} {}
          </span>
          <span block="ExpressDeliveryTextNormal">{__("Delivery by")}</span>
          <span block="ExpressDeliveryTextBold">
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
