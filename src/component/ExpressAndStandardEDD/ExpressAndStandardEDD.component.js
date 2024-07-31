import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Shipping, ExpressDeliveryTruck } from "Component/Icons";
import ExpressTimer from "Component/ExpressTimer";
import VIPIcon from "Component/HeaderAccount/icons/vip.png";
import {
  getTodaysWeekDay,
  inventoryCheck,
  getTodaysCutOffTime,
  checkProductOfficeServicable,
  getFinalExpressDeliveryKey,
  getNumericAddressType,
  productOfficeServicable,
  checkProductExpressEligible,
} from "Util/Common";
import { isArabic } from "Util/App";
import "./ExpressAndStandardEDD.style";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  currentSelectedCityArea: state.MyAccountReducer.currentSelectedCityArea,
  cutOffTime: state.MyAccountReducer.cutOffTime,
  mailing_address_type: state.AppConfig.mailing_address_type,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  isExpressServiceAvailable: state.MyAccountReducer.isExpressServiceAvailable,
  edd_info: state.AppConfig.edd_info,
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

export const ExpressAndStandardEDD = ({
  isExpressDelivery = false,
  isExpressServiceAvailable = {},
  express_delivery = "",
  express_delivery_home = "",
  express_delivery_work = "",
  express_delivery_other = "",
  actualEddMess = "",
  simple_products = {},
  selectedSizeCode = "",
  splitKey = "",
  sku = "",
  customer = {},
  currentSelectedCityArea = {},
  cutOffTime = {},
  mailing_address_type = [],
  isPDP = false,
  isIntlBrand = false,
  international_shipping_fee,
  cross_border = 0,
  international_vendor = null,
  edd_info = {},
  whs_quantity = 0,
  store_quantity = 0,
  mp_quantity = 0,
  isCart = false,
  isSignedIn,
  isExpressTimeExpired = false,
  setTimerStateThroughProps,
}) => {
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(
    currentSelectedCityArea
      ? currentSelectedCityArea
      : JSON.parse(localStorage.getItem("currentSelectedAddress"))
      ? JSON.parse(localStorage.getItem("currentSelectedAddress"))
      : {}
  );
  let todaysCutOffTime = "00:00";
  let isProductOfficeServicable = true;

  const express_delivery_key = getFinalExpressDeliveryKey({
    isPDP,
    express_delivery_home,
    express_delivery_work,
    express_delivery_other,
    express_delivery,
  });

  // check product is express eligible  or not
  const isProductExpressEligible =
    checkProductExpressEligible(express_delivery_key);

  const checkSKUExpressEligible = () => {
    if (isPDP) {
      if (
        +simple_products?.[selectedSizeCode]?.cross_border_qty &&
        +simple_products?.[selectedSizeCode]?.quantity <=
          +simple_products?.[selectedSizeCode]?.cross_border_qty
      ) {
        return false;
      } else if (
        +simple_products?.[selectedSizeCode]?.quantity !== 0 &&
        +simple_products?.[selectedSizeCode]?.whs_quantity === 0 &&
        +simple_products?.[selectedSizeCode]?.store_quantity === 0 &&
        +simple_products?.[selectedSizeCode]?.mp_quantity === 0
      ) {
        return false;
      } else {
        return true;
      }
    } else if (
      whs_quantity === 0 &&
      store_quantity === 0 &&
      mp_quantity === 0
    ) {
      return false;
    }
    return true;
  };

  // check selected SKU is express eligible or not
  const isSKUExpressEligible = checkSKUExpressEligible();

  const isInternationalProduct =
    edd_info?.international_vendors?.includes(
      international_vendor // for international products show standard delivery
    ) || +cross_border;

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("currentSelectedAddress"))?.area) {
      setCurrentSelectedAddress(
        JSON.parse(localStorage.getItem("currentSelectedAddress"))
      );
    } else if (!isSignedIn) {
      setCurrentSelectedAddress(null);
    }
  }, [JSON.parse(localStorage.getItem("currentSelectedAddress"))?.area]);

  isProductOfficeServicable = productOfficeServicable({
    cutOffTime,
    express_delivery_key,
    isExpressTimeExpired,
  });

  todaysCutOffTime =
    getTodaysCutOffTime({
      cutOffTime,
      isPDP,
      simple_products,
      selectedSizeCode,
      express_delivery_key,
      whs_quantity,
      store_quantity,
      mp_quantity,
    }) || "00:00";

  const checkStandardDeliveryAvailable = () => {
    if (!isProductOfficeServicable) {
      return true;
    }

    if (isInternationalProduct) {
      return true;
    }

    if (!express_delivery_key) {
      return true;
    }

    if (!isExpressServiceAvailable) {
      return true;
    }

    if (isExpressServiceAvailable?.express_eligible && +customer?.vipCustomer) {
      if (isExpressServiceAvailable?.is_vip_chargeable && !isCart) {
        return true;
      } else {
        return false;
      }
    }

    if (isProductExpressEligible && isCart) {
      return false;
    }

    return true;
  };

  const renderIntlTag = () => (
    <div block="AdditionShippingInformationInternationalTag">
      {__("International Shipment")}
    </div>
  );

  const render = () => {
    const showStandardDelivery = checkStandardDeliveryAvailable();

    return (
      <div>
        {currentSelectedAddress &&
          isExpressServiceAvailable?.express_eligible &&
          isExpressDelivery &&
          ((isProductExpressEligible && !selectedSizeCode) ||
            isSKUExpressEligible) &&
          !isInternationalProduct &&
          isProductOfficeServicable &&
          express_delivery_key && (
            <div block="eddExpressDelivery">
              <div block="eddExpressDeliveryBlock">
                <div
                  block="EddExpressDeliveryTextBlock"
                  mods={{ isArabic: isArabic() }}
                >
                  <ExpressDeliveryTruck />
                  <div block="EddExpressDeliveryText">
                    <span block="EddExpressDeliveryTextRed">
                      {__("Express")} {}
                    </span>
                    {isExpressServiceAvailable?.express_eligible &&
                    +customer?.vipCustomer &&
                    !isCart &&
                    !isExpressServiceAvailable?.is_vip_chargeable ? (
                      <img
                        block="expressVipImage"
                        src={VIPIcon}
                        alt="vipIcon"
                      />
                    ) : null}
                    <span block="EddExpressDeliveryTextNormal">
                      {__("Delivery by")}
                    </span>
                    <span block="EddExpressDeliveryTextBold">
                      {express_delivery_key?.toLowerCase() ===
                        "today delivery" && !isExpressTimeExpired
                        ? __("Today")
                        : express_delivery_key?.toLowerCase() ===
                            "tomorrow delivery" ||
                          (express_delivery_key?.toLowerCase() ===
                            "today delivery" &&
                            isExpressTimeExpired)
                        ? __("Tomorrow")
                        : ""}
                    </span>
                  </div>
                </div>
                {isExpressServiceAvailable?.express_eligible &&
                +customer?.vipCustomer &&
                !isExpressServiceAvailable?.is_vip_chargeable &&
                !isCart ? (
                  <span block="freeVIPText">{__("Free")}</span>
                ) : null}
              </div>
              {express_delivery_key?.toLowerCase() !== "tomorrow delivery" && (
                <ExpressTimer
                  todaysCutOffTime={todaysCutOffTime}
                  setTimerStateThroughProps={setTimerStateThroughProps}
                />
              )}
            </div>
          )}

        {actualEddMess && (showStandardDelivery || !isSKUExpressEligible) && (
          <div block="eddStandardDelivery">
            <div block="EddStandardDeliveryTextBlock">
              <Shipping />
              <div block="shipmentText">
                <span block="EddStandardDeliveryText">
                  {__("Standard")} {}
                  {actualEddMess?.split(splitKey)?.[0]} {}
                  {splitKey} {}
                </span>
                <span block="EddStandardDeliveryTextBold">
                  {actualEddMess?.split(splitKey)?.[1]}
                </span>
              </div>
            </div>
            {isPDP ? (
              <div block="internationalShipmentTag">
                {/* here we are showing International Shipment tag based on inventory as soon as you select any size of the product*/}
                {(((+simple_products?.[sku]?.cross_border_qty && //from this line
                  +simple_products?.[sku]?.quantity <=
                    +simple_products?.[sku]?.cross_border_qty) ||
                  (international_vendor &&
                    edd_info &&
                    edd_info.international_vendors &&
                    edd_info.international_vendors.indexOf(
                      international_vendor
                    ) > -1)) &&
                  +simple_products?.[sku]?.quantity !== 0) || // to this line (including above 2 lines of code) here we are checking for CB inventory
                (actualEddMess?.split(splitKey)?.[1]?.includes("-") && // now from this line of code
                  simple_products?.[selectedSizeCode]?.quantity !== 0 && // we are checking when we don't have city/area then range EDD will get displayed then IS tag should also get visible
                  !selectedSizeCode) //  but get change as soon as you select any size
                  ? renderIntlTag()
                  : null}
              </div>
            ) : (
              <div block="internationalShipmentTag">
                {isIntlBrand ||
                (international_shipping_fee &&
                  (+cross_border ||
                    (edd_info.international_vendors &&
                      edd_info.international_vendors.indexOf(
                        international_vendor
                      ) > -1)))
                  ? renderIntlTag()
                  : null}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return render();
};

export default connect(mapStateToProps)(ExpressAndStandardEDD);
