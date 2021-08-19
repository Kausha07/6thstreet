/* eslint-disable no-constant-condition */
import ProductItem from "Component/ProductItem";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import DynamicContentVueProductSliderContainer from "./../DynamicContentVueProductSlider/DynamicContentVueProductSlider.container";
import { HOME_PAGE_TRANSLATIONS } from "./DynamicContentProductSlider.config";
import "./DynamicContentProductSlider.style";
import { HOME_PAGE_BANNER_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import Event from "Util/Event";

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
    impressionSent: false,
  };

  componentDidMount() {
    document.addEventListener("scroll", this.isInViewport);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.isInViewport);
  }

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

  sendImpressions() {
    const { products = [] } = this.props;
    const items = products.map((item) => {
      return {
        id: item.sku,
        label: item.name,
      };
    });
    Event.dispatch(HOME_PAGE_BANNER_IMPRESSIONS, items);
  }

  isInViewport = () => {
    if (!this.viewElement) {
      return;
    }
    //get how much pixels left to scrolling our ReactElement
    const top =
      this.viewElement && this.viewElement.getBoundingClientRect().top;

    //here we check if element top reference is on the top of viewport
    /*
     * If the value is positive then top of element is below the top of viewport
     * If the value is zero then top of element is on the top of viewport
     * If the value is negative then top of element is above the top of viewport
     * */
    if (top <= 0) {
      // inside viewport
      const { header: { title } = {} } = this.props;

      const { impressionSent } = this.state;
      if (!impressionSent) {
        const { products = [] } = this.props;
        if (products.length > 0) {
          this.sendImpressions();
          this.setState({ impressionSent: true });
        }
      }
    }
  };

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
          pageType={"home"}
        />
        {/* );
                        })
                    } */}
      </React.Fragment>
    );

    let setRef = (el) => {
      this.viewElement = el;
    };

    return (
      <div
        ref={setRef}
        mix={{ block: "DynamicContentProductSlider", mods: { isArabic } }}
      >
        {productsDesktop}
      </div>
    );
  }
}

export default DynamicContentProductSlider;
