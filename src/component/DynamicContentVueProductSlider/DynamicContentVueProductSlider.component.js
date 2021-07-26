import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { getUUID } from "Util/Auth";
import { VUE_CAROUSEL_SWIPE } from "Util/Event";
import DynamicContentVueProductSliderItem from "./DynamicContentVueProductSlider.Item";
import "./DynamicContentVueProductSlider.style.scss";
class DynamicContentVueProductSlider extends PureComponent {
  static propTypes = {
    withViewAll: PropTypes.bool,
    sliderLength: PropTypes.number,
    heading: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    widgetID: PropTypes.string.isRequired,
  };

  scrollerRef = React.createRef();
  cmpRef = React.createRef(0);
  async handleOnScroll(widgetID) {
    let width = 0;
    if (screen.width > 1024) {
      width = 245;
    } else {
      width = 220;
    }
    let index = Math.floor(this.scrollerRef.current.scrollLeft / width);
    if (this.cmpRef.current !== index) {
      this.cmpRef.current = index;
      const productsToRender = this.getProducts();
      let sourceProdID = productsToRender[index].sku;
      let sourceCatgID = productsToRender[index].category;
      const locale = VueIntegrationQueries.getLocaleFromUrl();
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_CAROUSEL_SWIPE,
        params: {
          event: VUE_CAROUSEL_SWIPE,
          pageType: "plp",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          uuid: getUUID(),
          referrer: "desktop",
          sourceProdID: sourceProdID,
          sourceCatgID: sourceCatgID,
          widgetID: widgetID,
        },
      });
    }
  }

  getProducts = () => {
    const { products: data, sliderLength } = this.props;
    let products = [...data];
    if (products.length > sliderLength) {
      products.length = sliderLength;
    }
    return [...products];
  };

  viewAllBtn() {
    const { withViewAll } = this.props;
    if (withViewAll) {
      return (
        <div block="VueProductSlider" elem="ViewAllBtn">
          <span>{"View All"}</span>
        </div>
      );
    }
    return null;
  }

  renderHeader() {
    const { heading } = this.props;
    return (
      <div block="VueProductSlider" elem="HeaderContainer">
        <h4>{heading}</h4>
        {this.viewAllBtn()}
      </div>
    );
  }

  renderSliderContainer() {
    const productsToRender = this.getProducts();
    const { widgetID } = this.props;
    return (
      <div
        block="VueProductSlider"
        elem="SliderContainer"
        ref={this.scrollerRef}
        onScroll={() => {
          this.handleOnScroll(widgetID);
        }}
      >
        {productsToRender.map((item) => {
          const { sku } = item;
          return (
            <DynamicContentVueProductSliderItem
              key={sku}
              data={item}
              widgetID={widgetID}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div block="VueProductSlider" elem="Container">
        {this.renderHeader()}
        {this.renderSliderContainer()}
      </div>
    );
  }
}

export default DynamicContentVueProductSlider;
