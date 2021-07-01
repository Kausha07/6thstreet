import Link from "Component/Link";
import React from "react";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { getCurrency } from "Util/App/App";
import WishlistIcon from "Component/WishlistIcon";
import { isArabic } from "Util/App";

class DynamicContentVueProductSliderItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
    this.state = {
      isArabic: isArabic(),
    };
  }
  discountPercentage(basePrice, specialPrice, haveDiscount) {
    let discountPercentage = Math.round(100 * (1 - specialPrice / basePrice));
    if (discountPercentage === 0) {
      discountPercentage = 1;
    }

    return (
      <span
        block="VueProductSlider"
        elem="Discount"
        mods={{ discount: haveDiscount }}
      >
        -{discountPercentage}%<span> </span>
      </span>
    );
  }

  renderSpecialPrice(specialPrice, haveDiscount) {
    const currency = getCurrency();
    return (
      <span
        block="VueProductSlider"
        elem="SpecialPrice"
        mods={{ discount: haveDiscount }}
      >
        {currency}
        <span> </span>
        {specialPrice}
      </span>
    );
  }

  renderPrice(price) {
    if (price && price.length > 0) {
      const priceObj = price[0],
        currency = getCurrency();
      const basePrice = priceObj[currency]["6s_base_price"];
      const specialPrice = priceObj[currency]["6s_special_price"];
      const haveDiscount =
        specialPrice !== "undefined" &&
        specialPrice &&
        basePrice !== specialPrice;

      if (basePrice === specialPrice || !specialPrice) {
        return <span id="price">{`${currency} ${basePrice}`}</span>;
      }

      return (
        <div block="VueProductSlider" elem="SpecialPriceCon">
          <del block="VueProductSlider" elem="Del">
            <span id="price">{`${currency} ${basePrice}`}</span>
          </del>
          <span block="VueProductSlider" elem="PriceWrapper">
            {this.discountPercentage(basePrice, specialPrice, haveDiscount)}
            {this.renderSpecialPrice(specialPrice, haveDiscount)}
          </span>
        </div>
      );
    }
    return null;
  }

  renderPrice(price) {
    if (price && price.length > 0) {
      const priceObj = price[0],
        currency = getCurrency();
      const priceToShow = priceObj[currency]["6s_base_price"];
      return <span id="price">{`${currency} ${priceToShow}`}</span>;
    }
    return null;
  }

  renderIsNew(is_new_in) {
    if (is_new_in) {
      return (
        <div block="VueProductSlider" elem="VueIsNewTag">
          <span>{__("New")}</span>
        </div>
      );
    }
    return null;
  }

  render() {
    // return null;
    const { isArabic } = this.state;
    const {
      data: {
        thumbnail_url,
        name,
        brand_name,
        price,
        is_new_in = false,
        sku,
        link = "",
      },
    } = this.props;
    return (
      <div
        block="VueProductSlider"
        elem="VueProductContainer"
        mods={{ isArabic }}
        ref={this.childRef}
      >
        <Link to={link} data-banner-type="vueSlider">
          <img
            block="VueProductSlider"
            elem="VueProductImage"
            src={thumbnail_url}
            alt={name}
          />
        </Link>
        <h6 id="brandName">{brand_name}</h6>
        <span id="productName">{name}</span>
        {this.renderPrice(price)}
        {this.renderIsNew(is_new_in)}
        <WishlistIcon sku={sku} />
      </div>
    );
  }
}

export default DynamicContentVueProductSliderItem;
