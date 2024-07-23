import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Shipping, ExpressDeliveryTruck } from "Component/Icons";
import ExpressTimer from "Component/ExpressTimer";
import VIPIcon from "Component/HeaderAccount/icons/vip.png";
import { getTodaysWeekDay } from "Util/Common";
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
});

export const ExpressAndStandardEDD = ({
  isExpressDelivery = false,
  isExpressServiceAvailable = {},
  express_delivery = "",
  express_delivery_home = "",
  express_delivery_work = "",
  express_delivery_others = "",
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
}) => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const timerRef = useRef(null);
  let todaysCutOffTime = "00:00";
  let isProductOfficeServicable = true;
  let isOfficeSameDayExpressServicable = true;
  let isOfficeNextDayExpressServicable = true;

  // get today's week day e.g.: Monday
  const todaysWeekDayName = getTodaysWeekDay()?.toLowerCase() || "";

  // get current selected address of user
  const currentSelectedAddress =
    JSON.parse(localStorage.getItem("currentSelectedAddress")) || {};

  // get user's mailing address type, if there's no mailing_address_type then default is "home"
  const addressType = currentSelectedAddress?.mailing_address_type
    ? mailing_address_type.find(
        (obj) => obj?.value === currentSelectedAddress?.mailing_address_type
      )?.value || "37303"
    : "37303";

  const getFinalExpressDeliveryKey = () => {
    if (isPDP) {
      if (addressType === "37303" && express_delivery_home) {
        return express_delivery_home;
      } else if (addressType === "37304" && express_delivery_work) {
        return express_delivery_work;
      } else if (addressType === "37305" && express_delivery_others) {
        return express_delivery_others;
      } else return express_delivery_home;
    } else {
      return express_delivery;
    }
  };

  const express_delivery_key = getFinalExpressDeliveryKey();

  // check product is express eligible  or not
  const isProductExpressEligible = [
    "today delivery",
    "tomorrow delivery",
  ].includes?.(express_delivery_key?.toLowerCase());

  const checkSKUExpressEligible = () => {
    if (isPDP) {
      if (
        +simple_products?.[sku]?.cross_border_qty &&
        +simple_products?.[sku]?.quantity <=
          +simple_products?.[sku]?.cross_border_qty
      ) {
        return false;
      } else if (
        +simple_products?.[sku]?.quantity !== 0 &&
        +simple_products?.[sku]?.whs_quantity === 0 &&
        +simple_products?.[sku]?.store_quantity === 0 &&
        +simple_products?.[sku]?.mp_quantity === 0
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

  const isInternationalProduct = edd_info?.international_vendors?.includes(
    international_vendor // for international products show standard delivery
  );

  const inventoryCheck = (quantity, cutoffTime) => {
    return +quantity !== 0 ? cutoffTime : "00:00";
  };

  const getTodaysCutOffTime = () => {
    let tempTodaysCutOffTime = "00:00";

    const {
      warehouse_cutoff_time = "00:00",
      store_cutoff_time = "00:00",
      mp_cutoff_time = "00:00",
    } = cutOffTime?.data?.find(
      (item) =>
        item.day?.toLowerCase() === todaysWeekDayName &&
        item?.address_type === addressType
    ) || {};

    tempTodaysCutOffTime = isPDP
      ? (+simple_products?.[sku]?.whs_quantity != 0 &&
          inventoryCheck(
            simple_products?.[sku]?.whs_quantity,
            warehouse_cutoff_time
          )) ||
        (+simple_products?.[sku]?.store_quantity != 0 &&
          inventoryCheck(
            simple_products?.[sku]?.store_quantity,
            store_cutoff_time
          )) ||
        (+simple_products?.[sku]?.mp_quantity != 0 &&
          inventoryCheck(simple_products?.[sku]?.mp_quantity, mp_cutoff_time))
      : (+whs_quantity != 0 &&
          inventoryCheck(whs_quantity, warehouse_cutoff_time)) ||
        (+store_quantity != 0 &&
          inventoryCheck(store_quantity, store_cutoff_time)) ||
        (+mp_quantity != 0 && inventoryCheck(mp_quantity, mp_cutoff_time));

    if (
      !tempTodaysCutOffTime &&
      express_delivery_key?.toLowerCase()?.includes("today")
    ) {
      tempTodaysCutOffTime = warehouse_cutoff_time;
    }

    return tempTodaysCutOffTime;
  };

  const checkProductOfficeServicable = () => {
    if (addressType === "37304") {
      if (
        isOfficeSameDayExpressServicable &&
        !isOfficeNextDayExpressServicable &&
        isTimeExpired
      ) {
        return false;
      } else if (
        !isOfficeSameDayExpressServicable &&
        !isOfficeNextDayExpressServicable
      ) {
        return false;
      } else if (
        !isOfficeSameDayExpressServicable &&
        isOfficeNextDayExpressServicable &&
        isTimeExpired
      ) {
        return true;
      } else if (
        isOfficeSameDayExpressServicable &&
        !isOfficeNextDayExpressServicable &&
        express_delivery_key?.toLowerCase()?.includes("tomorrow")
      ) {
        return false;
      }
    }
    return true;
  };

  if (
    cutOffTime?.data &&
    todaysWeekDayName &&
    addressType &&
    isProductExpressEligible
  ) {
    if (
      addressType === "37304" &&
      ["friday", "saturday", "sunday"].includes?.(
        todaysWeekDayName?.toLowerCase()
      )
    ) {
      switch (todaysWeekDayName?.toLowerCase()) {
        case "friday":
          isOfficeSameDayExpressServicable = true;
          isOfficeNextDayExpressServicable = false;
          isProductOfficeServicable = checkProductOfficeServicable();
          todaysCutOffTime = getTodaysCutOffTime() || "00:00";
          break;

        case "saturday":
          isOfficeSameDayExpressServicable = false;
          isOfficeNextDayExpressServicable = false;
          isProductOfficeServicable = checkProductOfficeServicable();
          todaysCutOffTime = "00:00";
          break;

        case "sunday":
          isOfficeSameDayExpressServicable = false;
          isOfficeNextDayExpressServicable = true;
          isProductOfficeServicable = checkProductOfficeServicable();
          todaysCutOffTime = "00:00";
          break;

        default:
          isOfficeSameDayExpressServicable = true;
          isOfficeNextDayExpressServicable = true;
          todaysCutOffTime = getTodaysCutOffTime() || "00:00";
      }
    } else {
      isOfficeSameDayExpressServicable = true;
      isOfficeNextDayExpressServicable = true;
      todaysCutOffTime = getTodaysCutOffTime() || "00:00";
    }
  }

  const getTimeRemaining = () => {
    const now = new Date();
    const cutoffTimeParts = todaysCutOffTime?.split(":");
    const deadline = new Date();
    deadline.setHours(cutoffTimeParts?.[0]);
    deadline.setMinutes(cutoffTimeParts?.[1]);

    const time = deadline - now;
    if (time <= 0) {
      setHours("00");
      setMinutes("00");
      setIsTimeExpired(true);
      clearInterval(timerRef.current);
      return;
    }

    const Hours =
      Math.floor(time / (1000 * 60 * 60)) > 9
        ? Math.floor(time / (1000 * 60 * 60))
        : "0" + Math.floor(time / (1000 * 60 * 60));
    const Minutes =
      Math.floor((time / 1000 / 60) % 60) > 9
        ? Math.floor((time / 1000 / 60) % 60)
        : "0" + Math.floor((time / 1000 / 60) % 60);

    setHours(Hours.toString());
    setMinutes(Minutes.toString());
  };

  useEffect(() => {
    const initializeTimer = () => {
      const now = new Date();
      const cutoffTimeParts = todaysCutOffTime?.split(":");
      const deadline = new Date();
      deadline.setHours(cutoffTimeParts?.[0]);
      deadline.setMinutes(cutoffTimeParts?.[1]);

      const time = deadline - now;
      if (time > 0) {
        timerRef.current = setInterval(() => {
          getTimeRemaining();
          setIsTimeExpired(false);
        }, 1000);
      } else {
        setHours("00");
        setMinutes("00");
        setIsTimeExpired(true);
      }
    };

    initializeTimer();

    const checkMidnight = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        1,
        0
      );

      const timeUntilMidnight = midnight - now;
      setTimeout(() => {
        setIsTimeExpired(false);
        initializeTimer();
      }, timeUntilMidnight);
    };

    checkMidnight();

    return () => clearInterval(timerRef?.current);
  }, [todaysCutOffTime, isTimeExpired]);

  useEffect(() => {
    if (isTimeExpired) {
      clearInterval(timerRef?.current);
    }
  }, [isTimeExpired]);

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
                    !isCart ? (
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
                        "today delivery" && !isTimeExpired
                        ? __("Today")
                        : express_delivery_key?.toLowerCase() ===
                            "tomorrow delivery" ||
                          (express_delivery_key?.toLowerCase() ===
                            "today delivery" &&
                            isTimeExpired)
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
