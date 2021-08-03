import Link from "Component/Link";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { getCurrency } from "Util/App/App";
import { getUUID } from "Util/Auth";
import { VUE_CAROUSEL_CLICK } from "Util/Event";
import { isArabic } from 'Util/App';
class DynamicContentVueProductSliderItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  onclick = (widgetID) => {
    // vue analytics
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_CLICK,
      params: {
        event: VUE_CAROUSEL_CLICK,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: widgetID,
      },
    });
  };

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
      widgetID,
    } = this.props;
    return (
      <div
        block="VueProductSlider"
        elem="VueProductContainer"
        mods = {{isArabic: isArabic()}}
        data-sku={sku}
        data-category={category}
      >
        <Link
          to={link}
          data-banner-type="vueSlider"
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
        <WishlistIcon sku={sku} />
      </div>
    );
  }
}

export default DynamicContentVueProductSliderItem;
