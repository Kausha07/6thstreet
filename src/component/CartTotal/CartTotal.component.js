import React from "react";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { connect } from "react-redux";
import { getValueFromTotals } from "./utils/CartTotal.helper";
import { getFinalPrice } from "Component/Price/Price.config";
import { getCurrency, isArabic as checkIsArabic } from "Util/App";
import { getSideWideSavingPercentages } from "Component/SideWideCoupon/utils/SideWideCoupon.helper";
import { getCountryFromUrl } from "Util/Url";
import { getShippingFees } from "Util/Common/index";
import { getLocaleFromUrl } from "Util/Url/Url";

export const mapDispatchToProps = (dispatch) => ({
  getCart: () => CartDispatcher.getCart(dispatch, false, false),
});

export const mapStateToProps = (state) => {
  return {
    totals: state.CartReducer.cartTotals,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    language: state.AppState.language,
    international_shipping_fee: state.AppConfig.international_shipping_fee,
  };
};

function CartTotal(props) {
  const {
    totals: {
      total_segments: totals = [],
      total = 0,
      items = [],
      shipping_fee = 0,
      international_shipping_amount = 0,
    },
    block,
    pageType,
    cashOnDeliveryFee,
    international_shipping_fee,
  } = props;
  const isArabic = checkIsArabic();
  const currency_code = getCurrency();
  let inventory_level_cross_border = false;
  items.map((item) => {
    if (
      item.full_item_info &&
      item.full_item_info.cross_border &&
      parseInt(item.full_item_info.cross_border) > 0
    ) {
      inventory_level_cross_border = true;
    }
  });
  const CODFee = getValueFromTotals(totals, "msp_cashondelivery") || 0;
  const grandTotal =
  total > CODFee  || !cashOnDeliveryFee
    ? getFinalPrice(total, currency_code) - getFinalPrice(CODFee, currency_code)
    : getFinalPrice(total, currency_code);

  const renderPriceLine = (price, name, mods, allowZero = false) => {
    if (!price && !allowZero) {
      return null;
    }

    const finalPrice = getFinalPrice(price, currency_code);

    return (
      <li block={block} elem="SummaryItem" mods={mods}>
        <strong block={block} elem="Text">
          {name}
          {name === "Total" && (
            <>
              &nbsp;
              <span className="taxesIncluded">{__("(Taxes Included)")}</span>
            </>
          )}
          {name === "Coupon Savings" ? (
            <>
              &nbsp;
              <span className="discountPercent">
                {`(-${getSideWideSavingPercentages(totals)}%)`}
              </span>
            </>
          ) : null}
        </strong>
        <strong block={block} elem="Price">
          {`${mods?.couponSavings ? "-" : ""} ${
            parseFloat(price) || price === 0 ? currency_code : ""
          } ${name === "Store Credit" ? Math.abs(finalPrice) : finalPrice}`}
        </strong>
      </li>
    );
  };

  const renderPriceLineForShipping = (price, name, mods, allowZero = false) => {
    const {
      totals: { currency_code = getCurrency() },
    } = props;
    const locale = getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    const finalPrice = getFinalPrice(price, currency_code);
    const shippingFee = parseInt(finalPrice)
      ? finalPrice
      : getShippingFees(country);

    if (parseInt(finalPrice) === 0) {
      return (
        <li block="CartPage" elem="SummaryItem" mods={mods}>
          <strong block="CartPage" elem="Text">
            {name}
          </strong>
          <span>
            {name !== __("International Shipping Fee") && (
              <strong block="CartPage" elem="Price">
                <del block="freeShipping" mods={{ isArabic }}>
                  {`${
                    parseFloat(price) || price === 0 ? currency_code : ""
                  } ${shippingFee}`}
                </del>
              </strong>
            )}
            {__("FREE")}
          </span>
        </li>
      );
    }

    return (
      <li block="CartPage" elem="SummaryItem" mods={mods}>
        <strong block="CartPage" elem="Text">
          {name}
        </strong>
        <strong block="CartPage" elem="Price">
          {`${
            parseFloat(price) || price === 0 ? currency_code : ""
          } ${shippingFee}`}
        </strong>
      </li>
    );
  };

  return (
    <div block={block} elem="OrderTotals">
      <h3 block="OrderTotalsHeading">{__("ORDER DETAILS")}</h3>
      <ul>
        <div block={block} elem="Subtotals">
          {renderPriceLine(
            getValueFromTotals(totals, "total_mrp"),
            __("Total MRP")
          )}
          {renderPriceLine(
            getValueFromTotals(totals, "total_discount"),
            __("Coupon Savings"),
            { couponSavings: true }
          )}
          {!inventory_level_cross_border || !international_shipping_fee
            ? renderPriceLineForShipping(shipping_fee, __("Shipping fee"))
            : null}
          {international_shipping_fee &&
            inventory_level_cross_border &&
            renderPriceLineForShipping(
              international_shipping_amount,
              __("International Shipping Fee")
            )}
          {renderPriceLine(
            getValueFromTotals(totals, "customerbalance"),
            __("Store Credit"),
            { couponSavings: true }
          )}
          {renderPriceLine(
            getValueFromTotals(totals, "clubapparel"),
            __("Club Apparel Redemption")
          )}
          {cashOnDeliveryFee
            ? renderPriceLine(
                getValueFromTotals(totals, "msp_cashondelivery"),
                getCountryFromUrl() === "QA"
                  ? __("Cash on Receiving")
                  : __("Cash on Delivery")
              )
            : null}
          {renderPriceLine(getValueFromTotals(totals, "tax"), __("Tax"))}
          {renderPriceLine(
            pageType === "CartPage" || !cashOnDeliveryFee
              ? grandTotal
              : getValueFromTotals(totals, "grand_total"),
            __("Total"),
            {
              divider: true,
            }
          )}
        </div>
      </ul>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CartTotal);
