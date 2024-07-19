import React, { useState } from "react";
import { connect } from "react-redux";
import CartItem from "Component/CartItem";
import {
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
} from "../../util/Common/index";
import { ExpressDeliveryTruck } from "Component/Icons";
import "./NewCheckoutShippment.style";
import { getFomatedItem } from "./utils/NewCheckoutShippment.helper";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { getCurrency } from "Util/App";

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
  shipment: state.CheckoutReducer.shipment,
  cartId: state.CartReducer.cartId,
});

export const mapDispatchToProps = (dispatch) => ({
  updateShipment: (shipmentData) =>
    CheckoutDispatcher.updateShipment(dispatch, shipmentData),
});

export const NewCheckoutShippment = (props) => {
  const {
    items,
    quote_currency_code,
    isSignedIn,
    shipment = {},
    updateShipment,
    cartId,
  } = props;
  const { expected_shipments = [] } = shipment;
  const totalShipmentCount = expected_shipments.length || 0;
  const currencyCode = getCurrency();
  const [actualEddMess, setActualEddMess] = useState("");
  const [isIntlBrand, setIsIntlBrand] = useState(false);

  const updateShipmentData = (DeliveryType = "", shipmentItem = {}) => {
    const { shipment_id = "", selected_delivery_type = "" } = shipmentItem;

    if (DeliveryType == selected_delivery_type) {
      return;
    }

    if (DeliveryType === 0 || DeliveryType === 1) {
      updateShipment({
        shipment_id,
        shipment_type: DeliveryType,
        quote_id: cartId,
      });
    }
  };

  const eddMessageForCheckoutPage = (EddMsg, IntlBrand) => {
    setActualEddMess(EddMsg);
    setIsIntlBrand(IntlBrand);
  };

  const renderItem = (shipmentItem, i) => {
    const {
      express_fee = 0,
      available_delivery_type = {},
      selected_delivery_type,
    } = shipmentItem;
    const shipmentNumber = ++i;
    const isExpressDeliveryAvailable =
      available_delivery_type[1] &&
      available_delivery_type[1].toLowerCase().includes("today");
    const isExpressDeliverySelected = selected_delivery_type == 1;

    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;
    return (
      <li block="NewShippmentItem">
        <div block="CartItemHeading">
          <span block="NumOfShipments">
            {__(`Shipment ${shipmentNumber} of ${totalShipmentCount}`)}
          </span>
          <span block="ShippedBy">{__("Shipped from 6thStreet")}</span>
        </div>
        <div block="ExpressOrStandadrdDeliverySelection">
          {isExpressDeliveryAvailable && (
            <div
              block="ExpressDeliveryBlock"
              mods={{
                isSelected: isExpressDeliverySelected,
              }}
              onClick={() => {
                updateShipmentData(1, shipmentItem);
              }}
            >
              <div block="EddExpressDelivery">
                <div block="EddExpressDeliveryTextBlock">
                  <ExpressDeliveryTruck />
                  <div block="EddExpressDeliveryText">
                    <span block="EddExpressDeliveryTextRed">
                      {__("Express")} {}
                    </span>
                    <span block="EddExpressDeliveryTextNormal">
                      {__("Delivery by")}
                    </span>
                    <span block="EddExpressDeliveryTextBold">
                      {isExpressDeliveryAvailable
                        ? __("Today")
                        : __("Tomorrow")}
                    </span>
                  </div>
                </div>
                <div block="EddExpressDeliveryCutOffTime">
                  {__("Order within 4hrs 10 Mins")}
                </div>
              </div>
              <div block="ExpressPrice">{`+ ${currencyCode} ${express_fee}`}</div>
            </div>
          )}
          <div
            block="StandardDeliveryBlock"
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
                    {/* {__("Standard")} {} */}
                    {actualEddMess.split(splitKey)[0]} {}
                    {splitKey} {}
                  </span>
                  <span block="EddStandardDeliveryTextBold">
                    {actualEddMess.split(splitKey)[1]}
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
          {shipmentItem?.items?.map((item, i) => {
            const fomatedItem = getFomatedItem({ item });
            return (
              <CartItem
                key={fomatedItem.item_id}
                item={fomatedItem}
                currency_code={currencyCode}
                brand_name={fomatedItem.brand_name}
                isCheckoutPage={true}
                eddMessageForCheckoutPage={eddMessageForCheckoutPage}
              />
            );
          })}
        </div>
      </li>
    );
  };

  return (
    <div block="NewCheckoutOrderShippment" elem="OrderItems">
      <ul block="NewCheckoutOrderShippment" elem="CartItemList">
        {expected_shipments.map((shipmentItem, i) =>
          renderItem(shipmentItem, i)
        )}
      </ul>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCheckoutShippment);
