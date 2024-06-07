import React, { useState } from "react";
import CartItem from "Component/CartItem";
import {
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
} from "../../util/Common/index";
import { ExpressDeliveryTruck } from "Component/Icons";
import "./NewCheckoutShippment.style";

export const NewCheckoutShippment = (props) => {
  const { items, quote_currency_code, isSignedIn } = props;
  const [actualEddMess, setActualEddMess] = useState("");
  const [isIntlBrand, setIsIntlBrand] = useState(false);

  const eddMessageForCheckoutPage = (EddMsg, IntlBrand) => {
    setActualEddMess(EddMsg);
    setIsIntlBrand(IntlBrand);
  };

  const renderItem = (item, i) => {
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;
    return (
      <li block="NewShippmentItem">
        <div block="CartItemHeading">
          <span block="NumOfShipments">{__("Shipment 1 of 4")}</span>
          <span block="ShippedBy">{__("Shipped from 6thStreet")}</span>
        </div>
        <div block="ExpressOrStandadrdDeliverySelection">
          <div
            block="ExpressDeliveryBlock"
            mods={{
              isSelected: true,
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
                    {__("Tomorrow")}
                  </span>
                </div>
              </div>
              <div block="EddExpressDeliveryCutOffTime">
                {__("Order within 4hrs 10 Mins")}
              </div>
            </div>
            <div block="ExpressPrice">{"+ AED 5"}</div>
          </div>
          <div
            block="StandardDeliveryBlock"
            mods={{
              isSelected: false,
            }}
          >
            <div block="EddStandardDelivery">
              <div block="EddStandardDeliveryTextBlock">
                <div block="shipmentText">
                  <span block="EddStandardDeliveryText">
                    {__("Standard")} {}
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
            <div block="StandardPrice">{"+ AED 5"}</div>
          </div>
        </div>

        <div block="ProductInfo">
          <CartItem
            key={item.item_id}
            item={item}
            currency_code={quote_currency_code}
            brand_name={item.brand_name}
            isCheckoutPage={true}
            eddMessageForCheckoutPage={eddMessageForCheckoutPage}
          />
        </div>
      </li>
    );
  };

  return (
    <div block="NewCheckoutOrderShippment" elem="OrderItems">
      <ul block="NewCheckoutOrderShippment" elem="CartItemList">
        {items.map((item, i) => renderItem(item))}
      </ul>
    </div>
  );
};

export default NewCheckoutShippment;
