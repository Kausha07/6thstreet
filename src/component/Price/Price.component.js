/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import isMobile from "Util/Mobile";
import { currencyInTwoDigits } from "Component/Price/Price.config";

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
    const { country, showDiscountPercentage } = this.props;
    const currency = getCurrency();
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

  renderDiscountSpecialPriceSidewide(onSale, specialPrice) {
    const {
      country,
      showDiscountPercentage,
      isSidewideCouponEnabled,
      pageType,
    } = this.props;
    const currency = getCurrency();
    if (
      isSidewideCouponEnabled &&
      (pageType !== "MiniCart" || pageType === "checkoutSuccess")
    ) {
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

  renderBasePriceSideWide() {
    const {
      basePrice,
      fixedPrice,
      isSidewideCouponEnabled,
      finalPrice,
      pageType,
    } = this.props;
    if (
      isSidewideCouponEnabled &&
      (pageType === "PDPPage" || pageType === "wishlist")
    ) {
      return (
        <span>
          {this.renderCurrency()}
          &nbsp;
          {fixedPrice ? (1 * basePrice).toFixed(3) : basePrice}
        </span>
      );
    }

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
          (-{Math.abs(discountPercentage)}%)<span> </span>
        </span>
      );
    } else {
      if (pageType === "cartSlider" || itemType === "Cart") {
        return (
          <span block="discountPercentageText">{`(-${Math.abs(discountPercentage)}%)`}</span>
        );
      }
      return `-${Math.abs(discountPercentage)}%  `;
    }
  }

  renderFinalPriceOnly = () => {
    const { basePrice, specialPrice, renderSpecialPrice } = this.props;
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

  discountPercentageSitewide() {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
      cart,
      country,
      showDiscountPercentage,
      pageType,
      itemType = "",
      finalPrice,
      isSidewideCouponEnabled,
      discount_amount = 0,
    } = this.props;
    const { isArabic } = this.state;

    if (!showDiscountPercentage && !isSidewideCouponEnabled) {
      return null;
    }

    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));

    if (
      pageType === "CartPage" ||
      pageType === "MiniCart" ||
      pageType === "checkoutSuccess"
    ) {
      if (finalPrice) {
        discountPercentage = Math.round(
          100 * (1 - (specialPrice - discount_amount) / basePrice)
        );
      }
    }

    if (!renderSpecialPrice && !cart) {
      return (
        <span
          block="SearchProduct"
          elem="Discount"
          mods={{ discount: this.haveDiscount() }}
        >
          (-{Math.abs(discountPercentage)}%)<span> </span>
        </span>
      );
    } else {
      if (pageType === "cartSlider" || itemType === "Cart") {
        return (
          <span block="discountPercentageText">{`(-${Math.abs(
            discountPercentage
          )}%)`}</span>
        );
      }
      return isArabic && pageType != "checkoutSuccess"
        ? `(${Math.abs(discountPercentage)}% -)`
        : `(-${Math.abs(discountPercentage)}%)  `;
    }
  }

  getBlockForSideWide() {
    const { pageType = "" } = this.props;

    if (pageType === "PDPPage") {
      return "PDPSideWideCouponInfo";
    } else {
      return "ProductItem";
    }
  }

  renderSideWideCouponInfo() {
    const {
      basePrice,
      specialPrice,
      pageType = "",
      config,
      finalPrice,
    } = this.props;
    const countryCode = getCountryFromUrl();
    const langCode = getLanguageFromUrl();
    const sidewideCouponCode =
    config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";
    const { isArabic } = this.state;

    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));

    if (
      (pageType !== "PDPPage" && pageType !== "plp" && pageType !== "wishlist") ||
      discountPercentage === 0
    ) {
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
    const {
      specialPrice,
      finalPrice,
      discount_amount = 0,
      newFinalPrice = 0,
    } = this.props;
    const { isArabic } = this.state;
    const countryCode = getCountryFromUrl();
    const decimals = currencyInTwoDigits.includes(countryCode) ? 2 : 3;

    return (
      <span
        block="Price"
        elem="Special"
        mods={{ discount: this.haveDiscount() }}
      >
        {this.renderCurrency()}
        &nbsp;
        {newFinalPrice ? (1 * newFinalPrice).toFixed(decimals) : specialPrice}
        {!isArabic && <>&nbsp;</>}
      </span>
    );
  }

  renderPriceSideWide() {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
      discount_amount = 0,
      pageType,
      itemType = "",
      isSidewideCouponEnabled,
      finalPrice,
      totals: { site_wide_applied = 0, coupon_code = "" },
      checkoutPageSiteWide = 0,
      checkoutPageCouponCode = "",
    } = this.props;
    const { isArabic } = this.state;

    const country = getCountryFromUrl();

    if (!parseFloat(basePrice)) {
      return null;
    }

    if (
      (basePrice === specialPrice && !isSidewideCouponEnabled) ||
      (!specialPrice && !specialPrice === 0) ||
      (basePrice === specialPrice &&
        isSidewideCouponEnabled &&
        (pageType === "plp" ||
          pageType === "PDPPage" ||
          pageType === "cartSlider" ||
          pageType === "wishlist" ||
          pageType === "checkoutSuccess"))
    ) {
      if (pageType === "cartSlider" && country === "KW") {
        return (
          <span block="Price" elem="Wrapper">
            {isArabic && <>&nbsp;</>}
            {this.renderBasePriceSideWide()}
            <span
              block="discountPercentageText"
              className="noDiscountEmptySpace"
            >{` `}</span>
          </span>
        );
      }
      return this.renderBasePriceSideWide();
    }

    if (pageType === "cartSlider") {
      return (
        <span block="Price" elem="Wrapper">
          {renderSpecialPrice && this.renderSpecialPrice()}
          {isArabic && <>&nbsp;</>}
          <del block="Price" elem="Del">
            {this.renderBasePriceSideWide()}
          </del>

          {this.discountPercentageSitewide()}
        </span>
      );
    }

    if (
      (pageType === "CartPage" && isSidewideCouponEnabled) ||
      (pageType === "MiniCart" && isSidewideCouponEnabled) ||
      (pageType === "checkoutSuccess" && isSidewideCouponEnabled)
    ) {
      let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));
      if (finalPrice) {
        discountPercentage = Math.round(
          100 * (1 - (specialPrice - discount_amount) / basePrice)
        );
      }
      if (
        (site_wide_applied && discountPercentage) ||
        (coupon_code && discountPercentage) ||
        (checkoutPageSiteWide && discountPercentage) ||
        (checkoutPageCouponCode && discountPercentage)
      ) {
        return (
          <>
            <span block="Price" elem="Wrapper">
              {coupon_code || checkoutPageCouponCode
                ? this.renderCartPageFinalPrice()
                : this.renderSpecialPrice()}
              {isArabic && <>&nbsp;</>}
              <del block="Price" elem="Del">
                {this.renderBasePriceSideWide()}
              </del>
            </span>
            {this.discountPercentageSitewide(basePrice, specialPrice)}
          </>
        );
      } else {
        return (
          <span block="Price" elem="Wrapper">
            {isArabic && <>&nbsp;</>}
            <span block="Price" elem="NoDel" className="noramlBasePrice">
              {this.renderBasePriceSideWide()}
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
                {this.renderDiscountSpecialPriceSidewide(true, specialPrice)}
              </span>
            )}
            <del block="Price" elem="Del">
              {this.renderBasePriceSideWide()}
            </del>
          </span>
          {!renderSpecialPrice ? (
            <span block="SearchProduct" elem="PriceWrapper">
              {this.discountPercentageSitewide(basePrice, specialPrice)}
            </span>
          ) : (
            this.renderDiscountSpecialPriceSidewide(false, specialPrice)
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
            {this.renderBasePriceSideWide()}
          </del>
        </span>
        {!renderSpecialPrice ? (
          <span block="SearchProduct" elem="PriceWrapper">
            {this.discountPercentageSitewide(basePrice, specialPrice)}
            {this.renderDiscountSpecialPriceSidewide(true, specialPrice)}
          </span>
        ) : (
          this.renderDiscountSpecialPriceSidewide(false, specialPrice)
        )}
      </>
    );
  }

  renderPrice() {
    const {
      basePrice,
      specialPrice,
      renderSpecialPrice,
      pageType,
      itemType = "",
    } = this.props;
    const { isArabic } = this.state;

    const country = getCountryFromUrl();

    if (!parseFloat(basePrice)) {
      return null;
    }

    if (basePrice === specialPrice || (!specialPrice && !specialPrice === 0)) {
      if (pageType === "cartSlider" && country === "KW") {
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
            : isSidewideCouponEnabled
            ? this.renderPriceSideWide()
            : this.renderPrice()}
        </div>
        {isSidewideCouponEnabled ? this.renderSideWideCouponInfo() : null}
      </>
    );
  }
}

export default Price;
