/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import { getCountryFromUrl } from "Util/Url";
import isMobile from "Util/Mobile";

class Price extends PureComponent {
  static propTypes = {
    basePrice: PropTypes.number.isRequired,
    specialPrice: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    fixedPrice: PropTypes.bool,
  };

  static defaultProps = {
    fixedPrice: false,
  };

  state = {
    isArabic: isArabic(),
  };

  haveDiscount() {
    const { basePrice, specialPrice } = this.props;

    return (
      specialPrice !== "undefined" && specialPrice && basePrice !== specialPrice
    );
  }

  renderDiscountSpecialPrice(onSale, specialPrice) {
    const { country, showDiscountPercentage, isSidewideCouponEnabled } = this.props;
    const currency = getCurrency();
    if(isSidewideCouponEnabled) {
      return null;
    }
    return (
      <span
        block="Price"
        elem="Discount"
        mods={{ discount: this.haveDiscount() }}
      >
        {onSale ? (
          <>
            {currency}
            <span block="Price-Discount" elem="space"></span>
            &nbsp;
            {specialPrice}
          </>
        ) : country && showDiscountPercentage ? (
          <>{`${__("On Sale")} ${this.discountPercentage()} Off`}</>
        ) : null}
      </span>
    );
  }

  renderBasePrice() {
    const { basePrice, fixedPrice } = this.props;

    return (
      <span>
        {this.renderCurrency()}
        &nbsp;
        {fixedPrice ? (1 * basePrice).toFixed(3) : basePrice}
      </span>
    );
  }

  renderSpecialPrice() {
    const { specialPrice, fixedPrice } = this.props;
    const { isArabic } = this.state;

    return (
      <span
        block="Price"
        elem="Special"
        mods={{ discount: this.haveDiscount() }}
      >
        {this.renderCurrency()}
        &nbsp;
        {fixedPrice ? (1 * specialPrice).toFixed(3) : specialPrice}
        {!isArabic && <>&nbsp;</>}
      </span>
    );
  }

  discountPercentage() {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
      cart,
      country,
      showDiscountPercentage,
      pageType,
      itemType = "",
    } = this.props;

    if (!showDiscountPercentage) {
      return null;
    }

    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));
    if (discountPercentage === 0) {
      discountPercentage = 1;
    }
    if (!renderSpecialPrice && !cart) {
      return (
        <span
          block="SearchProduct"
          elem="Discount"
          mods={{ discount: this.haveDiscount() }}
        >
          (-{discountPercentage}%)<span> </span>
        </span>
      );
    } else {
      if (pageType === "cartSlider" || itemType === "Cart") {
        return (
          <span block="discountPercentageText">{`(-${discountPercentage}%)`}</span>
        );
      }
      return `-${discountPercentage}%  `;
    }
  }

  renderFinalPriceOnly = () => {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
    } = this.props;
    const { isArabic } = this.state;

    if (!parseFloat(basePrice)) {
      return null;
    }

    if (basePrice === specialPrice || (!specialPrice && !specialPrice === 0)) {
      return this.renderBasePrice();
    }
    return (
      <>
        <span block="Price" elem="Wrapper">
          {renderSpecialPrice && this.renderSpecialPrice()}
          {isArabic && <>&nbsp;</>}
        </span>
      </>
    );
  };

  getBlockForSideWide() {
    const { pageType = "" } = this.props;

    if (pageType === "PDPPage") {
      return "PDPSideWideCouponInfo";
    } else {
      return "ProductItem";
    }
  }

  renderSideWideCouponInfo() {
    const { basePrice, specialPrice, pageType = "", config } = this.props;
    const countryCode = getCountryFromUrl();
    const sidewideCouponCode = config?.countries[countryCode]?.sidewideCouponCode;
    const { isArabic } = this.state;

    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));
    if (discountPercentage === 0) {
      discountPercentage = 1;
    }

    if (pageType !== "PDPPage" && pageType !== "plp") {
      return null;
    }

    return (
      <div
        block={this.getBlockForSideWide()}
        elem="sidewideCoupon"
        mods={{ isArabic }}
      >
        <span>
          {discountPercentage}%{isArabic ? "" : <>&nbsp;</>}
          {__("OFF")}
        </span>
        <span>&nbsp;|&nbsp;</span>
        <span>
          {__("CODE:")}&nbsp;{sidewideCouponCode}
        </span>
      </div>
    );
  }

  renderCartPageFinalPrice() {
    const { specialPrice, finalPrice } = this.props;
    const { isArabic } = this.state;

    return (
      <span
        block="Price"
        elem="Special"
        mods={{ discount: this.haveDiscount() }}
      >
        {this.renderCurrency()}
        &nbsp;
        {finalPrice ? (1 * finalPrice).toFixed(3) : specialPrice}
        {!isArabic && <>&nbsp;</>}
      </span>
    );
  }

  renderPrice() {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
      pageType,
      itemType = "",
      isSidewideCouponEnabled,
      totals: {
        site_wide_applied = 0,
        coupon_code = "",
      },
    } = this.props;
    const { isArabic } = this.state;

    const country = getCountryFromUrl();

    if (!parseFloat(basePrice)) {
      return null;
    }

    if (basePrice === specialPrice || (!specialPrice && !specialPrice === 0)) {
      if (pageType === "cartSlider" && country === "KW" ) {
        return (
          <span block="Price" elem="Wrapper">
            {isArabic && <>&nbsp;</>}
            {this.renderBasePrice()}
            <span
              block="discountPercentageText"
              className="noDiscountEmptySpace"
            >{` `}</span>
          </span>
        );
      }
      return this.renderBasePrice();
    }

    if (pageType === "cartSlider") {
      return (
        <span block="Price" elem="Wrapper">
          {renderSpecialPrice && this.renderSpecialPrice()}
          {isArabic && <>&nbsp;</>}
          <del block="Price" elem="Del">
            {this.renderBasePrice()}
          </del>

          {this.discountPercentage()}
        </span>
      );
    }

    if (pageType === "CartPage" && isSidewideCouponEnabled) {
      if (site_wide_applied || coupon_code) {
        return (
          <>
            <span block="Price" elem="Wrapper">
              {coupon_code ? this.renderCartPageFinalPrice() : this.renderSpecialPrice()}
              {isArabic && <>&nbsp;</>}
              <del block="Price" elem="Del">
                {this.renderBasePrice()}
              </del>
            </span>
            {this.discountPercentage(basePrice, specialPrice)}
          </>
        );
      } else {
        return (
          <span block="Price" elem="Wrapper">
            {isArabic && <>&nbsp;</>}
            <span block="Price" elem="NoDel" className="noramlBasePrice">
              {this.renderBasePrice()}
            </span>
          </span>
        );
      }
    }

    if (itemType === "Cart") {
      return (
        <>
          <span block="Price" elem="Wrapper">
            {renderSpecialPrice && this.renderSpecialPrice()}
            {isArabic && <>&nbsp;</>}
            {!renderSpecialPrice && (
              <span block="SearchProduct" elem="PriceWrapper">
                {this.renderDiscountSpecialPrice(true, specialPrice)}
              </span>
            )}
            <del block="Price" elem="Del">
              {this.renderBasePrice()}
            </del>
          </span>
          {!renderSpecialPrice ? (
            <span block="SearchProduct" elem="PriceWrapper">
              {this.discountPercentage(basePrice, specialPrice)}
            </span>
          ) : (
            this.renderDiscountSpecialPrice(false)
          )}
        </>
      );
    }
    return (
      <>
        <span block="Price" elem="Wrapper">
          {renderSpecialPrice && this.renderSpecialPrice()}
          {isArabic && <>&nbsp;</>}
          <del block="Price" elem="Del">
            {this.renderBasePrice()}
          </del>
        </span>
        {!renderSpecialPrice ? (
          <span block="SearchProduct" elem="PriceWrapper">
            {this.discountPercentage(basePrice, specialPrice)}
            {this.renderDiscountSpecialPrice(true, specialPrice)}
          </span>
        ) : (
          this.renderDiscountSpecialPrice(false)
        )}
      </>
    );
  }

  renderCurrency() {
    const { currency } = this.props;
    return (
      <span block="Price" elem="Currency">
        {currency}
      </span>
    );
  }

  render() {
    const { isArabic } = this.state;
    const { pageType = "", isSidewideCouponEnabled } = this.props;
    return (
      <>
      <div
        block={`Price ${this.haveDiscount() ? "discount" : ""}`}
        mix={{ block: "Price", mods: { isArabic } }}
      >
        {pageType === "wishlist" && isMobile.any()
          ? this.renderFinalPriceOnly()
          : this.renderPrice()}
      </div>
        {isSidewideCouponEnabled ? this.renderSideWideCouponInfo() : null}
      </>
    );
  }
}

export default Price;
