import React from "react";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { connect } from "react-redux";
import { getValueFromTotals } from "./utils/CartTotal.helper";
import { getFinalPrice } from "Component/Price/Price.config";
import { getCurrency, isArabic as checkIsArabic } from "Util/App";
import { getSideWideSavingPercentages } from "Component/SideWideCoupon/utils/SideWideCoupon.helper";
import { getCountryFromUrl } from "Util/Url";

export const mapDispatchToProps = (dispatch) => ({
  getCart: () => CartDispatcher.getCart(dispatch, false, false),
});

export const mapStateToProps = (state) => {
  return {
    totals: state.CartReducer.cartTotals,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    language: state.AppState.language,
  };
};

function CartTotal(props) {
  const {
    totals: { total_segments: totals = [], total = 0, },
    block,
    pageType,
    cashOnDeliveryFee,
  } = props;

  const isArabic = checkIsArabic();
  const currency_code = getCurrency();
  const isInternationalShipment = getValueFromTotals(totals, "intl_shipping");
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
          {!isInternationalShipment
            ? renderPriceLine(
                getValueFromTotals(totals, "shipping") || __("FREE"),
                __("Shipping Fee")
              )
            : null}
          {isInternationalShipment
            ? renderPriceLine(
                getValueFromTotals(totals, "intl_shipping") || __("FREE"),
                __("International Shipping Fee")
              )
            : null}
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
