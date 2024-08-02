import React, { useState } from "react";
import { connect } from "react-redux";
import CartItem from "Component/CartItem";
import {
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
} from "../../util/Common/index";
import { ExpressDeliveryTruck } from "Component/Icons";
import ExpressTimer from "Component/ExpressTimer";
import VIPIcon from "Component/HeaderAccount/icons/vip.png";
import Loader from "Component/Loader";
import Link from "Component/Link";
import "./NewCheckoutShippment.style";
import {
  getEddForShipment,
  getShipmentItems,
  getCutOffTimeCheckoutPage,
} from "./utils/NewCheckoutShippment.helper";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { getCurrency } from "Util/App";
import { isArabic } from "Util/App";

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  shipment: state.CheckoutReducer.shipment,
  cartId: state.CartReducer.cartId,
  totals: state.CartReducer.cartTotals,
  isExpressServiceAvailable: state.MyAccountReducer.isExpressServiceAvailable,
  eddResponse: state.MyAccountReducer.eddResponse,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  customer: state.MyAccountReducer.customer,
  cutOffTime: state.MyAccountReducer.cutOffTime,
  vwoData: state.AppConfig.vwoData,
});

export const mapDispatchToProps = (dispatch) => ({
  updateShipment: (shipmentData) =>
    CheckoutDispatcher.updateShipment(dispatch, shipmentData),
});

export const NewCheckoutShippment = (props) => {
  const {
    isSignedIn,
    shipment = {},
    updateShipment,
    cartId,
    isExpressServiceAvailable = {},
    eddResponse,
    totals: { items = [], quote_currency_code },
    isExpressDelivery,
    customer,
    cutOffTime,
    vwoData,
  } = props;
  const { expected_shipments = [] } = shipment;
  const totalShipmentCount = expected_shipments.length || 0;
  const currencyCode = getCurrency();
  const [actualEddMess, setActualEddMess] = useState("");
  const [isIntlBrand, setIsIntlBrand] = useState(false);
  const [loadingShipmentId, setLoadingShipmentId] = useState(null);
  const { is_vip_chargeable = true, express_eligible = true } =
    isExpressServiceAvailable;
  const isArSite = isArabic();

  const updateShipmentData = async (DeliveryType = "", shipmentItem = {}) => {
    const { shipment_id = "", selected_delivery_type = "" } = shipmentItem;

    if (DeliveryType == selected_delivery_type) {
      return;
    }

    setLoadingShipmentId(shipment_id);
    if (DeliveryType === 0 || DeliveryType === 1 || DeliveryType === 2) {
      await updateShipment({
        shipment_id,
        shipment_type: DeliveryType,
        quote_id: cartId,
      });
      setLoadingShipmentId(null);
    }
  };

  const eddMessageForCheckoutPage = (EddMsg, IntlBrand) => {
    setActualEddMess(EddMsg);
    setIsIntlBrand(IntlBrand);
  };

  const renderShipmentItem = (shipmentItem, i) => {
    const {
      express_fee = 0,
      available_delivery_type = {},
      selected_delivery_type,
      shipment_id = "",
    } = shipmentItem;
    const shipmentNumber = ++i;
    const isExpressDeliveryAvailable =
      (available_delivery_type[1] &&
        available_delivery_type[1].toLowerCase().includes("today")) ||
      (available_delivery_type[2] &&
        available_delivery_type[2].toLowerCase().includes("tomorrow"));
    const isVipCustomerChargeable =
      express_eligible && customer?.vipCustomer && !is_vip_chargeable;
    const expressDeliveryToday =
      available_delivery_type[1] &&
      available_delivery_type[1].toLowerCase().includes("today");
    const isExpressDeliverySelected =
      selected_delivery_type == 1 || selected_delivery_type == 2;
    const EddForShipment =
      getEddForShipment({ shipmentItem, eddResponse, actualEddMess }) || {};
    const { edd_message_en = "", edd_message_ar = "" } = EddForShipment;
    const shipmentItems = getShipmentItems({ shipmentItem, cartItems: items });
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;
    const todaysCutOffTime = isExpressDeliveryAvailable
      ? getCutOffTimeCheckoutPage({ shipmentItems, cutOffTime }) || "00:00"
      : "00:00";
    if (shipmentItems && !shipmentItems.length) {
      return null;
    }
    return (
      <li block="NewShippmentItem">
        <div block="CartItemHeading">
          <span block="NumOfShipments">
            {__(`Shipment ${shipmentNumber} of ${totalShipmentCount}`)}
          </span>
        </div>
        <div block="ExpressOrStandadrdDeliverySelection">
          {isExpressDeliveryAvailable && (
            <div
              block="ExpressDeliveryBlock"
              mods={{
                isSelected: isExpressDeliverySelected,
              }}
              onClick={() => {
                updateShipmentData(expressDeliveryToday ? 1 : 2, shipmentItem);
              }}
            >
              <div block="EddExpressDelivery">
                <div block="EddExpressDeliveryTextBlock">
                  <ExpressDeliveryTruck />
                  <div block="EddExpressDeliveryText">
                    <span block="EddExpressDeliveryTextRed">
                      {__("Express")} {}
                    </span>
                    {isVipCustomerChargeable ? (
                      <img
                        block="expressVipImage"
                        src={VIPIcon}
                        alt="vipIcon"
                      />
                    ) : null}
                    <span block="EddExpressDeliveryTextNormal">
                      &nbsp;{__("Delivery by")}
                    </span>
                    <span block="EddExpressDeliveryTextBold">
                      {expressDeliveryToday ? __("Today") : __("Tomorrow")}
                    </span>
                  </div>
                </div>
                {expressDeliveryToday && (
                  <ExpressTimer
                    todaysCutOffTime={todaysCutOffTime}
                    setTimerStateThroughProps={() => {}}
                  />
                )}
              </div>
              {/* check is VIP chargeable or not */}
              <div block="ExpressPrice">
                {isVipCustomerChargeable && (
                  <span block="ExpressPrice" elem="freeExpressText">
                    {__("Free")}
                  </span>
                )}
                <span
                  block="ExpressPrice"
                  elem={isVipCustomerChargeable ? "freeExpressPrice" : ""}
                >
                  {`+ ${currencyCode} ${express_fee}`}
                </span>
              </div>
            </div>
          )}
          <div
            block="StandardDeliveryBlock"
            className={isExpressDeliveryAvailable ? "" : "topBorder"}
            mods={{
              isSelected: !isExpressDeliverySelected,
            }}
            onClick={() => {
              updateShipmentData(0, shipmentItem);
            }}
          >
            <div block="EddStandardDelivery">
              <div block="EddStandardDeliveryTextBlock">
                <div block="shipmentText">
                  <span block="EddStandardDeliveryText">
                    {__("Standard")} {}
                    {isArSite ? edd_message_ar : edd_message_en}
                  </span>
                </div>
              </div>
              {/* <div block="internationalShipmentTag">
                {isIntlBrand || (international_shipping_fee && +cross_border)
                  ? this.renderIntlTag()
                  : null}
              </div> */}
            </div>
            <div block="StandardPrice">{__("Free")}</div>
          </div>
        </div>

        <div block="ProductInfo">
          {shipmentItems?.map((item, i) => {
            return (
              <CartItem
                key={item.item_id}
                item={item}
                currency_code={currencyCode}
                brand_name={item.brand_name}
                isCheckoutPage={true}
                eddMessageForCheckoutPage={eddMessageForCheckoutPage}
                isRenderQuantitySelection={false}
              />
            );
          })}
        </div>
        <Loader isLoading={shipment_id === loadingShipmentId ? true : false} />
      </li>
    );
  };

  const renderItem = (item, i) => {
    return (
      <CartItem
        key={item.item_id}
        item={item}
        currency_code={currencyCode}
        brand_name={item.brand_name}
        isCheckoutPage={true}
        eddMessageForCheckoutPage={eddMessageForCheckoutPage}
        isRenderQuantitySelection={true}
      />
    );
  };

  const renderContent = () => {
    const isShipmentAvailable =
      expected_shipments && expected_shipments.length ? true : false;
    if (isExpressDelivery && isShipmentAvailable) {
      return (
        <>
          {expected_shipments.map((shipmentItem, i) =>
            renderShipmentItem(shipmentItem, i)
          )}
        </>
      );
    }

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    return (
      <div block="cartItemsWrapper">
        <div block="cartItemsWrapper" elem="Header">
          <span block="cartItemsWrapper" elem="ItemCount">
            {totalQuantity}
            {totalQuantity === 1 ? __(" Item") : __(" Items")}
          </span>
          <Link
            block="cartItemsWrapper"
            elem="Edit"
            mods={{ isArabic: isArSite }}
            to="/cart"
          >
            <span>{__(" Edit")}</span>
          </Link>
        </div>
        {items.map((item, i) => {
          return renderItem(item, i);
        })}
      </div>
    );
  };

  return (
    <div block="NewCheckoutOrderShippment" elem="OrderItems">
      <ul block="NewCheckoutOrderShippment" elem="CartItemList">
        {renderContent()}
      </ul>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCheckoutShippment);
