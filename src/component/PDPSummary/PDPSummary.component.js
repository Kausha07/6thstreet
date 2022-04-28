/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import Link from "Component/Link";
import PDPAddToCart from "Component/PDPAddToCart/PDPAddToCart.container";
import PDPAlsoAvailable from "Component/PDPAlsoAvailable";
import PDPTags from "Component/PDPTags";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import ShareButton from "Component/ShareButton";
import WishlistIcon from "Component/WishlistIcon";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import isMobile from "Util/Mobile";
import BrowserDatabase from "Util/BrowserDatabase";
import fallbackImage from "../../style/icons/fallback.png";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";

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
      getTabbyInstallment,
    } = this.props;
    const { isArabic } = this.state;
    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];

      const { country } = JSON.parse(
        localStorage.getItem("APP_STATE_CACHE_KEY")
      ).data;
      const { default: defPrice } = priceData;
      getTabbyInstallment(defPrice).then((response) => {
        if (response?.value) {
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
      }, this._handleError).catch(() => { });
    }
  }
  componentDidUpdate(prevProps) {
    const {
      product: { price },
      getTabbyInstallment
    } = this.props;
    const { isArabic } = this.state;

    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];
      const { country } = JSON.parse(
        localStorage.getItem("APP_STATE_CACHE_KEY")
      ).data;
      const { default: defPrice } = priceData;
      getTabbyInstallment(defPrice).then((response) => {
        if (response?.value) {
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
      }, this._handleError).catch(() => { });
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
      product: { name, brand_name, gallery_images = [] },
    } = this.props;
    const { url_path } = this.props;
    const { isArabic } = this.state;
    let gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
      : "home";
    if (isArabic) {
      if (gender === "kids") {
        gender = "أولاد,بنات";
      } else {
        if (gender !== "home") {
          gender = getGenderInArabic(gender);
          gender = gender?.replace(
            gender?.charAt(0),
            gender?.charAt(0).toUpperCase()
          );
        }
      }
    } else {
      if (gender === "kids") {
        gender = "Boy,Girl";
      } else {
        if (gender !== "home") {
          gender = gender?.replace(
            gender?.charAt(0),
            gender?.charAt(0).toUpperCase()
          );
        }
      }
    }
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");
    if (isMobile.any()) {
      return (
        <div block="PDPSummary" elem="Heading">
          <h1>
            {url_path ?
              gender !== "home" ? (
                <Link
                  className="pdpsummarylinkTagStyle"
                  to={`/${url_path}.html?q=${encodeURIComponent(
                    brand_name
                  )}&p=0&dFR[categories.level0][0]=${encodeURIComponent(
                    brand_name
                  )}&dFR[gender][0]=${gender}`}
                >
                  {brand_name}
                </Link>
              ) : (
                <Link
                  className="pdpsummarylinkTagStyle"
                  to={`/${url_path}.html?q=${encodeURIComponent(
                    brand_name
                  )}&p=0&dFR[categories.level0][0]=${encodeURIComponent(
                    brand_name
                  )}`}
                >
                  {brand_name}
                </Link>
              ) : (
              brand_name
            )}{" "}
            <span block="PDPSummary" elem="Name">
              {name}
            </span>
          </h1>

          <ShareButton
            title={document.title}
            text={`Hey check this out: ${document.title}`}
            url={url.href}
            image={gallery_images[0] || fallbackImage}
          />
        </div>
      );
    }

    return (
      <h1>
        {url_path ? 
          gender !== "home" ? (
            <Link
              className="pdpsummarylinkTagStyle"
              to={`/${url_path}.html?q=${encodeURIComponent(
                brand_name
              )}&p=0&dFR[categories.level0][0]=${encodeURIComponent(
                brand_name
              )}&dFR[gender][0]=${gender}`}
            >
              {brand_name}
            </Link>
          ) : (
            <Link
              className="pdpsummarylinkTagStyle"
              to={`/${url_path}.html?q=${encodeURIComponent(
                brand_name
              )}&p=0&dFR[categories.level0][0]=${encodeURIComponent(
                brand_name
              )}`}
            >
              {brand_name}
            </Link>
          ) : (
          brand_name
        )}{" "}
        <span block="PDPSummary" elem="Name">
          {name}
        </span>
      </h1>
    );
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
      product: { sku, gallery_images = [] },
      product,
      renderMySignInPopup,
    } = this.props;
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");

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
            url={url.href}
            image={gallery_images[0] || fallbackImage}
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
    return (
      <>
        <div id="TabbyPromo"></div>
      </>
    );
  }

  render() {
    const { isArabic } = this.state;
    return (
      <div block="PDPSummary" mods={{ isArabic }}>
        <div block="PDPSummaryHeaderAndShareAndWishlistButtonContainer">
          {this.renderPDPSummaryHeaderAndShareAndWishlistButton()}
        </div>
        {this.renderBrand()}
        {/* {this.renderName()} */}
        <div block="PriceAndPDPSummaryHeader">
          {this.renderPriceAndPDPSummaryHeader()}
        </div>
        {/* <div block="Seperator" /> */}
        {this.renderTabby()}
        {/* { this.renderColors() } */}
        {this.renderAddToCartSection()}
        {this.renderPDPTags()}
        {this.renderAvailableItemsSection()}
      </div>
    );
  }
}

export default PDPSummary;
