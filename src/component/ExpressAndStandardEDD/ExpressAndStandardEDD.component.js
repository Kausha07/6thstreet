import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Shipping, ExpressDeliveryTruck } from "Component/Icons";
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
  isExpressServiceAvailable = false,
  express_delivery = "",
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

  // check product is express eligible  or not
  const isProductExpressEligible = [
    "today delivery",
    "tomorrow delivery",
  ].includes?.(express_delivery?.toLowerCase());

  // check selected SKU is express eligible or not
  const isSKUExpressEligible =
    isPDP &&
    +simple_products?.[sku]?.quantity !== 0 &&
    +simple_products?.[sku]?.whs_quantity === 0 &&
    +simple_products?.[sku]?.store_quantity === 0 &&
    +simple_products?.[sku]?.mp_quantity === 0
      ? false
      : true;

  const isInternationalProduct =
    edd_info?.international_vendors?.includes(
      international_vendor // for international products show standard delivery
    ) || cross_border;

  // find appropriate "todaysCutOffTime" based on inventory
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
      ? inventoryCheck(
          simple_products?.[sku]?.whs_quantity,
          warehouse_cutoff_time
        ) ||
        inventoryCheck(
          simple_products?.[sku]?.store_quantity,
          store_cutoff_time
        ) ||
        inventoryCheck(simple_products?.[sku]?.mp_quantity, mp_cutoff_time)
      : inventoryCheck(whs_quantity, warehouse_cutoff_time) ||
        inventoryCheck(store_quantity, store_cutoff_time) ||
        inventoryCheck(mp_quantity, mp_cutoff_time);

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

    if (isExpressServiceAvailable?.express_eligible && +customer?.vipCustomer) {
      if (isExpressServiceAvailable?.is_vip_chargeable) {
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
        {isExpressServiceAvailable?.express_eligible &&
          isExpressDelivery &&
          (isProductExpressEligible || isSKUExpressEligible) &&
          !isInternationalProduct &&
          isProductOfficeServicable && (
            <div block="eddExpressDelivery">
              <div
                block="EddExpressDeliveryTextBlock"
                mods={{ isVip: +customer?.vipCustomer, isArabic: isArabic() }}
              >
                <ExpressDeliveryTruck />
                <div block="EddExpressDeliveryText">
                  {isExpressServiceAvailable?.express_eligible &&
                  +customer?.vipCustomer &&
                  !isExpressServiceAvailable?.is_vip_chargeable ? (
                    <span block="freeVIPText">{__("FREE")}</span>
                  ) : null}
                  <span block="EddExpressDeliveryTextRed">
                    {__("Express")} {}
                  </span>
                  <span block="EddExpressDeliveryTextNormal">
                    {__("Delivery by")}
                  </span>
                  <span block="EddExpressDeliveryTextBold">
                    {express_delivery?.toLowerCase() !== "tomorrow delivery" &&
                    !isTimeExpired
                      ? __("Today")
                      : __("Tomorrow")}
                  </span>
                </div>
              </div>
              {!isTimeExpired &&
                express_delivery?.toLowerCase() !== "tomorrow delivery" && (
                  <div block="EddExpressDeliveryCutOffTime">
                    {__("Order within") + ` ${hours}Hrs ${minutes}Min`}
                  </div>
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
                {isIntlBrand || (international_shipping_fee && +cross_border)
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
