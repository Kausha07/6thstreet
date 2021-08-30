/* eslint-disable no-magic-numbers */
import PDPAddToCart from "Component/PDPAddToCart/PDPAddToCart.container";
import PDPAlsoAvailable from "Component/PDPAlsoAvailable";
import PDPTags from "Component/PDPTags";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import ShareButton from "Component/ShareButton";
import TabbyMiniPopup from "Component/TabbyMiniPopup";
import { TABBY_TOOLTIP_PDP } from "Component/TabbyMiniPopup/TabbyMiniPopup.config";
import WishlistIcon from "Component/WishlistIcon";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import isMobile from "Util/Mobile";
import tabby from "./icons/tabby.svg";
import "./PDPSummary.style";

class PDPSummary extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    alsoAvailable: [],
    prevAlsoAvailable: [],
    showPopup: false,
    stockAvailibility: true,
    isArabic: isArabic(),
  };

  static getDerivedStateFromProps(props, state) {
    const { product } = props;

    const { alsoAvailable, prevAlsoAvailable } = state;

    const derivedState = {};

    if (prevAlsoAvailable !== product["6s_also_available"]) {
      Object.assign(derivedState, {
        alsoAvailable: product["6s_also_available"],
        prevAlsoAvailable: alsoAvailable !== undefined ? alsoAvailable : null,
      });
    }
    return Object.keys(derivedState).length ? derivedState : null;
  }

  setStockAvailability = (status) => {
    const {
      product: { price },
    } = this.props;

    this.setState({ stockAvailibility: !!price && status });
  };

  renderBrand() {
    const {
      product: { brand_name },
    } = this.props;

    return <h1>{brand_name}</h1>;
  }

  renderName() {
    const {
      product: { name },
    } = this.props;

    return (
      <p block="PDPSummary" elem="Name">
        {name}
      </p>
    );
  }

  renderPDPSummaryHeader() {
    const { product } = this.props;
    return (
      <div block="PDPSummary" elem="Header">
        <ProductLabel product={product} />
      </div>
    );
  }

  renderPDPSummaryHeaderAndShareAndWishlistButton() {
    const {
      product: { sku },
      product,
    } = this.props;
    const url = new URL(window.location.href);

    if (isMobile.any()) {
      return null;
    }

    return (
      <>
        {this.renderPDPSummaryHeader()}
        <div block="ShareAndWishlistButtonContainer">
          <ShareButton
            title={document.title}
            text={`Hey check this out: ${document.title}`}
            url={url.searchParams.append("utm_source", "pdp_share")}
          />
          <WishlistIcon sku={sku} data={product} pageType="pdp" />
        </div>
      </>
    );
  }

  renderPriceAndPDPSummaryHeader() {
    const {
      product: { price, stock_qty },
    } = this.props;
    const { stockAvailibility } = this.state;

    if (!price || stock_qty === 0 || !stockAvailibility) {
      return null;
    }

    return (
      <div block="PriceContainer">
        <Price price={price} />
        {isMobile.any() && this.renderPDPSummaryHeader()}
      </div>
    );
  }

  openTabbyPopup = () => {
    this.setState({ showPopup: true });
  };

  closeTabbyPopup = () => {
    this.setState({ showPopup: false });
  };

  renderTabbyPopup = () => {
    const { showPopup } = this.state;

    if (!showPopup) {
      return null;
    }

    return (
      <TabbyMiniPopup
        content={TABBY_TOOLTIP_PDP}
        closeTabbyPopup={this.closeTabbyPopup}
      />
    );
  };

  renderColors() {
    const {
      product: { colorfamily = "", stock_qty },
    } = this.props;

    if (stock_qty === 0) {
      return null;
    }

    if (!colorfamily) {
      return <div block="PDPSummary" elem="ProductColorBlock" />;
    }

    if (Array.isArray(colorfamily)) {
      return (
        <div block="PDPSummary" elem="ProductColorBlock">
          <strong>{__("Color:")}</strong>
          {colorfamily.map((col) => this.renderColor(col))}
        </div>
      );
    }

    return (
      <div block="PDPSummary" elem="ProductColorBlock">
        <strong>{__("Color:")}</strong>
        {this.renderColor(colorfamily)}
      </div>
    );
  }

  renderColor(color) {
    const engColor = isArabic() ? translateArabicColor(color) : color;
    const fixedColor = engColor.toLowerCase().replace(/ /g, "_");
    const prodColor = SPECIAL_COLORS[fixedColor]
      ? SPECIAL_COLORS[fixedColor]
      : fixedColor;

    return (
      <>
        <span
          block="PDPSummary"
          elem="ProductColor"
          style={{ backgroundColor: prodColor }}
        />
        {color}
      </>
    );
  }

  renderAddToCartSection() {
    return (
      <>
        <PDPAddToCart setStockAvailability={this.setStockAvailability} />
      </>
    );
  }

  renderPDPTags() {
    const {
      product: { prod_tag_1, prod_tag_2, in_stock,stock_qty },
    } = this.props;

    const tags = [prod_tag_1, prod_tag_2].filter(Boolean);

    if (tags && tags.length) {
      return (
        <>
          {in_stock === 0 ||
            (in_stock === 1 && stock_qty === 0 && <div block="Seperatortop" />)}
          <PDPTags tags={tags} />
          <div block="Seperator" />
        </>
      );
    }
    return null;
  }

  renderAvailableItemsSection() {
    const {
      product: { sku },
      isLoading,
    } = this.props;
    const { alsoAvailable } = this.state;

    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <PDPAlsoAvailable
            productsAvailable={alsoAvailable}
            productSku={sku}
          />
        );
      }
    }

    return null;
  }

  renderTabby() {
    const {
      product: { price },
    } = this.props;
    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];
      const { country } = JSON.parse(
        localStorage.getItem("APP_STATE_CACHE_KEY")
      ).data;
      const { default: defPrice } = priceData;

      if ((country === "AE" || country === "SA") && defPrice >= 150) {
        const monthPrice = (defPrice / 4).toFixed(2);
        return (
          <>
            <button
              block="PDPSummary"
              elem="Tabby"
              onClick={this.openTabbyPopup}
            >
              {__("From")}
              <strong
                block="PDPSummary"
                elem="TabbyPrice"
              >{`${monthPrice} ${currency}`}</strong>
              {__(" a month with ")}
              <img src={tabby} alt="tabby" />
              <span block="PDPSummary" elem="LearnMore">
                {__("Learn more")}
              </span>
            </button>
            <div block="Seperator" />
          </>
        );
      }

      return null;
    }

    return null;
  }

  render() {
    const { isArabic } = this.state;
    return (
      <div block="PDPSummary" mods={{ isArabic }}>
        <div block="PDPSummaryHeaderAndShareAndWishlistButtonContainer">
          {this.renderPDPSummaryHeaderAndShareAndWishlistButton()}
        </div>
        {this.renderBrand()}
        {this.renderName()}
        <div block="PriceAndPDPSummaryHeader">
          {this.renderPriceAndPDPSummaryHeader()}
        </div>
        <div block="Seperator" />
        {this.renderTabby()}
        {/* { this.renderColors() } */}
        {this.renderAddToCartSection()}
        {this.renderPDPTags()}
        {this.renderAvailableItemsSection()}
        {this.renderTabbyPopup()}
      </div>
    );
  }
}

export default PDPSummary;
