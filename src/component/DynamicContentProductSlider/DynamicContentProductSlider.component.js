/* eslint-disable no-constant-condition */
import PropTypes from "prop-types";
import { PureComponent } from "react";

import ProductItem from "Component/ProductItem";
import Slider from "SourceComponent/Slider";
import isMobile from "SourceUtil/Mobile/isMobile";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";

import {
  HOME_PAGE_TRANSLATIONS,
  ITEMS_PER_PAGE,
} from "./DynamicContentProductSlider.config";

import "./DynamicContentProductSlider.style";
import { HOME_PAGE_BANNER_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import Event from "Util/Event";

class DynamicContentProductSlider extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    products: Products.isRequired,
  };

  state = {
    currentPage: 0,
    isArabic: isArabic(),
    impressionSent: false,
    eventRegistered: false,
  };

  registerViewPortEvent() {
    let observer;
    const elem = document.querySelector("#productSlider");

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer = new IntersectionObserver(this.handleIntersect, options);

    observer.observe(elem);
    this.setState({ eventRegistered: true });
  }

  sendImpressions() {
    const { products = [] } = this.props;
    const items = products.map((item) => {
      return {
        id: item.sku,
        label: item.name,
      };
    });
    Event.dispatch(HOME_PAGE_BANNER_IMPRESSIONS, items);
    this.setState({ impressionSent: true });
  }
  handleIntersect = (entries, observer) => {
    const { impressionSent } = this.state;
    if (impressionSent) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.sendImpressions();
      }
    });
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
        {/* { this.renderCTA() } */}
      </div>
    );
  };

  renderProductsDesktop() {
    const { isLoading, products = [] } = this.props;
    const { currentPage } = this.state;

    if (isLoading) {
      return "loading...";
    }
    const productArray = products.map(this.renderProduct) || [];
    const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
    const lastPageItemCount = products.length % ITEMS_PER_PAGE; // number of products on last page'

    if (currentPage === lastPage) {
      if (lastPageItemCount === ITEMS_PER_PAGE) {
        return productArray.slice(
          currentPage * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE + lastPageItemCount
        );
      }

      return productArray.slice(
        currentPage * ITEMS_PER_PAGE - (ITEMS_PER_PAGE - lastPageItemCount),
        currentPage * ITEMS_PER_PAGE + lastPageItemCount
      );
    }

    return productArray.slice(
      currentPage * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
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
    const { isArabic, eventRegistered } = this.state;
    const { products: productArray = [] } = this.props;
    if (productArray.length === 0) {
      return null;
    }
    if (!eventRegistered) {
      setTimeout(() => {
        this.registerViewPortEvent();
      }, 2000);
    }
    const products = (
      <div
        mix={{
          block: "DynamicContentProductSlider",
          elem: "ProductContainer",
          mods: { isArabic },
        }}
      >
        {this.renderButtonPrev()}
        {this.renderProductsDesktop()}
        {this.renderButtonNext()}
      </div>
    );

    let setRef = (el) => {
      this.viewElement = el;
    };

    return (
      <div
        ref={setRef}
        id="productSlider"
        mix={{ block: "DynamicContentProductSlider", mods: { isArabic } }}
      >
        <div
          mix={{
            block: "DynamicContentProductSlider",
            elem: "HeaderContainer",
            mods: { isArabic },
          }}
        >
          {this.renderTitle()}
        </div>
        {isMobile.any() || isMobile.tablet()
          ? this.renderProductsMobile()
          : products}
      </div>
    );
  }
}

export default DynamicContentProductSlider;
