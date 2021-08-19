import { connect } from "react-redux";
import Link from "Component/Link";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import React, { PureComponent } from "react";
import { isArabic } from "Util/App";
import { getCurrency } from "Util/App/App";
import { getUUID } from "Util/Auth";
import { VUE_CAROUSEL_CLICK } from "Util/Event";
import { DISPLAY_DISCOUNT_PERCENTAGE } from "Component/Price/Price.config";

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
});

class DynamicContentVueProductSliderItem extends PureComponent {
  static propTypes = {
    country: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
    this.state = {
      isArabic: isArabic(),
    };
  }

  onclick = (widgetID) => {
    const { pageType } = this.props;
    // vue analytics
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_CLICK,
      params: {
        event: VUE_CAROUSEL_CLICK,
        pageType: pageType,
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: widgetID,
      },
    });
  };

  discountPercentage(basePrice, specialPrice, haveDiscount) {
    const { country } = this.props;
    if (!DISPLAY_DISCOUNT_PERCENTAGE[country]) {
      return null;
    }

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
        return (
          <div block="VueProductSlider" elem="SpecialPriceCon">
            <span block="VueProductSlider" elem="PriceWrapper">
              <span
                id="price"
                style={{ color: "#000000" }}
              >{`${currency} ${basePrice}`}</span>
            </span>
          </div>
        );
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
    const {
      data: {
        category,
        thumbnail_url,
        name,
        brand_name,
        price,
        is_new_in = false,
        sku,
        link = "",
      },
      data,
      widgetID,
    } = this.props;
    const { isArabic } = this.state;
    let newLink = link;
    if (this.props.data.url) {
      newLink = this.props.data.url;
    }
    return (
      <div
        block="VueProductSlider"
        elem="VueProductContainer"
        mods={{ isArabic }}
        data-sku={sku}
        data-category={category}
        mods={{ isArabic }}
        ref={this.childRef}
      >
        <Link
          to={newLink.split("?_ga")[0]}
          data-banner-type="vueSlider"
          block="VueProductSlider-Link"
          onClick={() => {
            this.onclick(widgetID);
          }}
        >
          <img
            block="VueProductSlider"
            elem="VueProductImage"
            src={thumbnail_url}
            alt={name}
          />
          <h6 id="brandName">{brand_name}</h6>
          <span id="productName">{name}</span>
          {this.renderPrice(price)}
          {this.renderIsNew(is_new_in)}
        </Link>
        <WishlistIcon sku={sku} data={data} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(DynamicContentVueProductSliderItem);
