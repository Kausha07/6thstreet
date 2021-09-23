import DragScroll from "Component/DragScroll/DragScroll.component";
import { HOME_PAGE_BANNER_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { isArabic } from "Util/App";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { VUE_CAROUSEL_SHOW, VUE_CAROUSEL_SWIPE } from "Util/Event";
import DynamicContentVueProductSliderItem from "./DynamicContentVueProductSlider.Item";
import "./DynamicContentVueProductSlider.style.scss";
class DynamicContentVueProductSlider extends PureComponent {
  static propTypes = {
    withViewAll: PropTypes.bool,
    sliderLength: PropTypes.number,
    heading: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    widgetID: PropTypes.string.isRequired,
    pageType: PropTypes.string.isRequired,
  };

  scrollerRef = React.createRef();
  cmpRef = React.createRef(0);
  state = {
    impressionSent: false,
    eventRegistered: false,
  };

  componentDidMount() {
    const { widgetID, pageType = "home" } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    console.log('window.location.href',window.location.href)
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_SHOW,
      params: {
        event: VUE_CAROUSEL_SHOW,
        pageType: pageType,
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: window.location.href,
        url: window.location.href,
        widgetID: VueIntegrationQueries.getWidgetTypeMapped(widgetID,pageType),
        userID: userID,
      },
    });
    this.registerViewPortEvent();
  }

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
    const products = this.getProducts();
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
  async handleOnScroll(widgetID, event) {
    const { pageType = "home" } = this.props;
    const target = event.nativeEvent.target;
    let width = 0;
    if (screen.width > 1024) {
      width = 245;
    } else {
      width = 220;
    }
    let index = Math.floor(Math.abs(target.scrollLeft) / width);
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
          pageType: pageType,
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          uuid: getUUID(),
          referrer: window.location.href,
          url: window.location.href,
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

  handleScroll = (event) => {
    const target = event.nativeEvent.target;
    const prentComponent = [...this.cmpRef.current.childNodes].filter(
      (node) => node.id == "ScrollWrapper"
    )[0];
    prentComponent.scrollLeft = target.scrollLeft;
  };

  renderScrollbar = () => {
    let items = this.getProducts();

    const width =
      (this.itemRef &&
        this.itemRef.current &&
        this.itemRef.current.childRef.current.clientWidth) *
        items.length +
      items.length * 7 * 2 -
      690;
    this.setState({
      customScrollWidth: width,
    });

    // return null;

    return (
      <div
        block="VueProductSlider"
        elem="SliderContainer"
        mods={{ isArabic: isArabic() }}
        ref={this.scrollerRef}
        mods={{
          Hidden:
            this.scrollerRef.current &&
            this.scrollerRef.current.clientWidth >=
              this.state.customScrollWidth,
        }}
        onScroll={this.handleScroll}
      >
        <div
          block="Outer"
          style={{ width: this.state.customScrollWidth }}
          elem="Inner"
        ></div>
      </div>
    );
  };

  renderSliderContainer() {
    const productsToRender = this.getProducts();
    const { widgetID, pageType } = this.props;
    return (
      <DragScroll data={{ rootClass: "ScrollWrapper", ref: this.cmpRef }}>
        <div
          id="ScrollWrapper"
          block="VueProductSlider"
          elem="SliderContainer"
          mods={{ isArabic: isArabic() }}
          ref={this.scrollerRef}
          onScroll={(e) => {
            this.handleOnScroll(widgetID, e);
          }}
        >
          {productsToRender.map((item) => {
            const { sku } = item;
            return (
              <DynamicContentVueProductSliderItem
                key={sku}
                data={item}
                widgetID={widgetID}
                pageType={pageType}
              />
            );
          })}
        </div>
      </DragScroll>
    );
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <div
        ref={setRef}
        id="productSlider"
        block="VueProductSlider"
        elem="Container"
      >
        {this.renderHeader()}
        {this.renderSliderContainer()}
      </div>
    );
  }
}

export default DynamicContentVueProductSlider;
