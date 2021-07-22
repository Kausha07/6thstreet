/* eslint-disable no-constant-condition */
import PropTypes from "prop-types";
import { PureComponent } from "react";

import ProductItem from "Component/ProductItem";
import Slider from "SourceComponent/Slider";
import isMobile from "SourceUtil/Mobile/isMobile";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import DynamicContentVueProductSliderContainer from "./../DynamicContentVueProductSlider/DynamicContentVueProductSlider.container";
import {
  HOME_PAGE_TRANSLATIONS,
  ITEMS_PER_PAGE,
} from "./DynamicContentProductSlider.config";

import "./DynamicContentProductSlider.style";

class DynamicContentProductSlider extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    products: Products.isRequired,
  };

  constructor(props) {
    super(props);
  }

  state = {
    currentPage: 0,
    isArabic: isArabic(),
    withViewAll: true,
  };

  renderProduct = (product, i) => {
    const { sku } = product;
    const { isArabic } = this.state;

    // TODO: remove if statement and add appropriate query for items with new
    return (
      <div
        mix={{
          block: "DynamicContentProductSlider",
          elem: "ProductItem",
          mods: { isArabic },
        }}
        key={i}
      >
        <ProductItem product={product} key={sku} />
        {this.renderCTA()}
      </div>
    );
  };

  renderProductsDesktop() {}

  renderTitle() {
    const { title } = this.props;
    const finalTitle = isArabic() ? HOME_PAGE_TRANSLATIONS[title] : title;
    return (
      <h2 mix={{ block: "DynamicContentProductSlider", elem: "Header" }}>
        {finalTitle}
      </h2>
    );
  }

  renderCTA() {
    const { isArabic } = this.state;
    return (
      <div
        mix={{
          block: "DynamicContentProductSlider",
          elem: "FavoriteOverlay",
          mods: { isArabic },
        }}
      />
    );
  }

  render() {
    const { isArabic, withViewAll } = this.state;
    const { products } = this.props;

    if (products.length === 0) {
      return null;
    }

    const { title } = this.props;
    const finalTitle = isArabic ? HOME_PAGE_TRANSLATIONS[title] : title;
    const productsDesktop = (
      <React.Fragment>
        <DynamicContentVueProductSliderContainer
          products={products}
          heading={finalTitle}
          withViewAll
          key={`VueProductSliderContainer`}
          isHome={true}
        />
        {/* );
                        })
                    } */}
      </React.Fragment>
    );
    return (
      <div mix={{ block: "DynamicContentProductSlider", mods: { isArabic } }}>
        {productsDesktop}
      </div>
    );
  }
}

export default DynamicContentProductSlider;
