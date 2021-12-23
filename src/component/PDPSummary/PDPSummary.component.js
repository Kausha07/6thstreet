/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { PureComponent } from "react";

import Image from "Component/Image";
import PDPAddToCart from "Component/PDPAddToCart/PDPAddToCart.container";
import PDPAlsoAvailable from "Component/PDPAlsoAvailable";
import PDPTags from "Component/PDPTags";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import ShareButton from "Component/ShareButton";
import TabbyMiniPopup from "Component/TabbyMiniPopup";
import { TABBY_TOOLTIP_PDP } from "Component/TabbyMiniPopup/TabbyMiniPopup.config";
import WishlistIcon from "Component/WishlistIcon";
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
    selectedSizeType: "eu",
    selectedSizeCode: "",
  };
  componentDidMount() {
    const {
      product: { price },
    } = this.props;
    const { isArabic } = this.state;
    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];

      const { country } = JSON.parse(
        localStorage.getItem("APP_STATE_CACHE_KEY")
      ).data;
      const { default: defPrice } = priceData;

      if ((country === "AE" || country === "SA") && defPrice >= 150) {
        const script = document.createElement("script");
        script.src = "https://checkout.tabby.ai/tabby-promo.js";
        script.async = true;
        script.onload = function () {
          let s = document.createElement("script");
          s.type = "text/javascript";
          const code = `new TabbyPromo({
        selector: '#TabbyPromo',
        currency: '${currency}',
        price: '${defPrice}',
        installmentsCount: 4,
        lang: '${isArabic ? "ar" : "en"}',
        source: 'product',
      });`;
          try {
            s.appendChild(document.createTextNode(code));
            document.body.appendChild(s);
          } catch (e) {
            s.text = code;
            document.body.appendChild(s);
          }
        };
        document.body.appendChild(script);
      }
    }
  }
  componentDidUpdate(prevProps) {
    const {
      product: { price },
    } = this.props;
    const { isArabic } = this.state;

    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];
      const { country } = JSON.parse(
        localStorage.getItem("APP_STATE_CACHE_KEY")
      ).data;
      const { default: defPrice } = priceData;
      if ((country === "AE" || country === "SA") && defPrice >= 150) {
        if (prevProps.product.price !== price) {
          const script = document.createElement("script");
          script.src = "https://checkout.tabby.ai/tabby-promo.js";
          script.async = true;
          script.onload = function () {
            let s = document.createElement("script");
            s.type = "text/javascript";
            const code = `new TabbyPromo({
          selector: '#TabbyPromo',
          currency: '${currency}',
          price: '${defPrice}',
          installmentsCount: 4,
          lang: '${isArabic ? "ar" : "en"}',
          source: 'product',
        });`;
            try {
              s.appendChild(document.createTextNode(code));
              document.body.appendChild(s);
            } catch (e) {
              s.text = code;
              document.body.appendChild(s);
            }
          };
          document.body.appendChild(script);
        }
      }
    }
  }
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

  setSize = (sizeType, sizeCode) => {
    this.setState({
      selectedSizeType: sizeType || "eu",
      selectedSizeCode: sizeCode || "",
    });
  };

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
        <ProductLabel product={product} section="PDPSummary" />
      </div>
    );
  }

  renderPDPSummaryHeaderAndShareAndWishlistButton() {
    const {
      product: { sku },
      product,
      renderMySignInPopup,
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
          <WishlistIcon
            sku={sku}
            renderMySignInPopup={renderMySignInPopup}
            data={product}
            pageType="pdp"
          />
        </div>
      </>
    );
  }

  renderPriceAndPDPSummaryHeader() {
    const {
      product: { price, stock_qty, additional_shipping_info },
    } = this.props;
    const { stockAvailibility } = this.state;

    if (!price || stock_qty === 0 || !stockAvailibility) {
      return null;
    }

    return (
      <div block="PriceContainer">
        <Price price={price} renderSpecialPrice={true} />
        {isMobile.any() && this.renderPDPSummaryHeader()}
        {additional_shipping_info ? (
          <span block="AdditionShippingInformation">
            {additional_shipping_info}
          </span>
        ) : null}
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
    const {
      product: { simple_products },
    } = this.props;
    return (
      <>
        {/* <div block="Seperator" /> */}
        <PDPAddToCart
          simple_products={simple_products}
          setStockAvailability={this.setStockAvailability}
          setSize={this.setSize}
        />
      </>
    );
  }

  renderPDPTags() {
    const {
      product: {
        prod_tag_1,
        prod_tag_2,
        in_stock,
        stock_qty,
        simple_products,
        discountable,
      },
    } = this.props;

    let { selectedSizeCode } = this.state;

    const tags = [prod_tag_1, prod_tag_2].filter(Boolean);

    if (simple_products && Object.keys(simple_products)?.length === 1) {
      selectedSizeCode = Object.keys(simple_products)[0];
    }

    if (
      simple_products &&
      selectedSizeCode &&
      parseInt(simple_products[selectedSizeCode]?.cross_border_qty) ===
        parseInt(simple_products[selectedSizeCode]?.quantity) &&
      parseInt(simple_products[selectedSizeCode]?.cross_border_qty) > 0
    ) {
      tags.push(__("International Shipment"));
    }
    if (discountable?.toLowerCase() === "no") {
      tags.push(__("Non Discountable"));
    }
    if (tags && tags.length) {
      return (
        <>
          {/* {in_stock === 0 && <div block="Seperatortop" />} */}
          <div block="Seperator" mods={{ isDesktop: !isMobile.any() }} />
          <PDPTags tags={tags} />
          {/* <div block="Seperator" /> */}
        </>
      );
    }
    return null;
  }

  renderAvailableItemsSection() {
    const {
      product: { sku },
      isLoading,
      renderMySignInPopup,
    } = this.props;
    const { alsoAvailable } = this.state;

    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <PDPAlsoAvailable
            productsAvailable={alsoAvailable}
            renderMySignInPopup={renderMySignInPopup}
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
            <div id="TabbyPromo"></div>
            {/*<button
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
              <Image lazyLoad={true} src={tabby} alt="tabby" />

              <span block="PDPSummary" elem="LearnMore">
                {__("Learn more")}
              </span>
            </button>*/}
            {/* <div block="Seperator" /> */}
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
        {/* <div block="Seperator" /> */}
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
