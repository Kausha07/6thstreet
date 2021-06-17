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

  renderProductsDesktop() {
    // const {
    //     isLoading,
    //     products = []
    // } = this.props;
    // // const { currentPage } = this.state;
    // if (isLoading) {
    //     return 'loading...';
    // }
    // const productArray = products.map(this.renderProduct) || [];
    // const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
    // const lastPageItemCount = products.length % ITEMS_PER_PAGE; // number of products on last page'
    // if (currentPage === lastPage) {
    //     if (lastPageItemCount === ITEMS_PER_PAGE) {
    //         return productArray
    //             .slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + lastPageItemCount);
    //     }
    //     return productArray
    //         .slice(
    //             (currentPage * ITEMS_PER_PAGE) - (ITEMS_PER_PAGE - lastPageItemCount),
    //             currentPage * ITEMS_PER_PAGE + lastPageItemCount
    //         );
    // }
    // return productArray.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
  }

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

  renderButtonNext() {
    const { isLoading, products = [] } = this.props;
    const { currentPage, isArabic } = this.state;

    if (isLoading || isMobile.any()) {
      return null;
    }
    const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
    if (currentPage !== lastPage) {
      return (
        <div
          role="button"
          aria-label="Next"
          tabIndex={0}
          onClick={this.handleClickNext}
          onKeyDown={this.handleClickNext}
          mix={{
            block: "DynamicContentProductSlider",
            elem: "ButtonNext",
            mods: { isArabic },
          }}
        >
          <div
            mix={{
              block: "DynamicContentProductSlider",
              elem: "ArrowNext",
              mods: { isArabic },
            }}
          />
        </div>
      );
    }

    return null;
  }

  renderButtonPrev() {
    const { isLoading } = this.props;
    const { currentPage, isArabic } = this.state;

    if (isLoading || isMobile.any()) {
      return null;
    }
    if (currentPage !== 0) {
      return (
        <div
          role="button"
          aria-label="Next"
          tabIndex={0}
          onClick={this.handleClickPrev}
          onKeyDown={this.handleClickPrev}
          mix={{
            block: "DynamicContentProductSlider",
            elem: "ButtonPrev",
            mods: { isArabic },
          }}
        >
          <div
            mix={{
              block: "DynamicContentProductSlider",
              elem: "ArrowPrev",
              mods: { isArabic },
            }}
          />
        </div>
      );
    }

    return null;
  }

  handleClickNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  handleClickPrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
  };

  renderProductsMobile() {
    const { isLoading, products = [] } = this.props;
    const { currentPage, isArabic } = this.state;

    if (isLoading) {
      return "loading...";
    }

    return (
      <div
        mix={{
          block: "DynamicContentProductSlider",
          elem: "MobileSliderWrapper",
          mods: { isArabic },
        }}
      >
        <Slider
          mix={{
            block: "DynamicContentProductSlider",
            elem: "MobileSlider",
            mods: { isArabic },
          }}
          activeImage={currentPage}
          onActiveImageChange={this.mobileSliderCallback}
        >
          {products.map(this.renderProduct)}
        </Slider>
      </div>
    );
  }

  mobileSliderCallback = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  render() {
    const { isArabic, withViewAll } = this.state;
    // const { products: productArray = [] } = this.props;
    const { products } = this.props;
    if (products.length === 0) {
      return null;
    }
    // const products = (
    //     <div mix={ { block: 'DynamicContentProductSlider', elem: 'ProductContainer', mods: { isArabic } } }>
    //         {/* { this.renderButtonPrev() } */}
    //         { this.renderProductsDesktop() }
    //         {/* { this.renderButtonNext() } */}
    //     </div>
    // );
    const { title } = this.props;
    const finalTitle = isArabic ? HOME_PAGE_TRANSLATIONS[title] : title;
    const productsDesktop = (
      <React.Fragment>
        {/* {
                        products.map((item, index) => {
                            return ( */}
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
        {isMobile.any() && (
          <div
            mix={{
              block: "DynamicContentProductSlider",
              elem: "HeaderContainer",
              mods: { isArabic },
            }}
          >
            {this.renderTitle()}
          </div>
        )}
        {isMobile.any() ? this.renderProductsMobile() : productsDesktop}
      </div>
    );
  }
}

export default DynamicContentProductSlider;
