/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { DISPLAY_DISCOUNT_PERCENTAGE } from "./Price.config";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";

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
        ) : (
          <>{`${__("On Sale")} ${this.discountPercentage()} Off`}</>
        )}
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

    return (
      <span
        block="Price"
        elem="Special"
        mods={{ discount: this.haveDiscount() }}
      >
        {this.renderCurrency()}
        &nbsp;
        {fixedPrice ? (1 * specialPrice).toFixed(3) : specialPrice}
        &nbsp;
      </span>
    );
  }

  discountPercentage() {
    const { basePrice, specialPrice, renderSpecialPrice, cart } = this.props;

    const { isArabic } = this.state;

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
          -({discountPercentage}%)<span> </span>
        </span>
      );
    } else {
      return `-${discountPercentage}%`;
    }
  }

  renderPrice() {
    const { basePrice, specialPrice, country, renderSpecialPrice, cart } =
      this.props;
    const currency = getCurrency();

    if (!parseFloat(basePrice)) {
      return null;
    }

    if (basePrice === specialPrice || !specialPrice) {
      return this.renderBasePrice();
    }
    return (
      <>
        <span block="Price" elem="Wrapper">
          {renderSpecialPrice && this.renderSpecialPrice()}
          <del block="Price" elem="Del">
            {this.renderBasePrice()}
          </del>
        </span>
        {DISPLAY_DISCOUNT_PERCENTAGE[country] && !renderSpecialPrice ? (
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
    return (
      <div block={`Price ${this.haveDiscount() ? "discount" : ""}`}>
        {this.renderPrice()}
      </div>
    );
  }
}

export default Price;
