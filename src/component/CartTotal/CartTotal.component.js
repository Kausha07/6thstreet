import React from "react";
import "./CartTotal.style";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import { connect } from "react-redux";
import { getValueFromTotals } from "./utils/CartTotal.helper";
import { getFinalPrice } from "Component/Price/Price.config";
import { getCurrency, isArabic as checkIsArabic } from "Util/App";
import { getSideWideSavingPercentages } from "Component/SideWideCoupon/utils/SideWideCoupon.helper";

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
    totals: { total_segments: totals = [] },
    block,
    pageType,
  } = props;

  const isArabic = checkIsArabic();
  const currency_code = getCurrency();
  const isInternationalShipment = getValueFromTotals(totals, "intl_shipping");

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
          } ${finalPrice}`}
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
                __("Shipping Charges")
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
            __("Store Credit")
          )}
          {renderPriceLine(
            getValueFromTotals(totals, "clubapparel"),
            __("Club Apparel Redemption")
          )}
          {renderPriceLine(
            getValueFromTotals(totals, "grand_total"),
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
