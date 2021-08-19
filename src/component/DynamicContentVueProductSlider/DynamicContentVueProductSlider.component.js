import DragScroll from "Component/DragScroll/DragScroll.component";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import React, { PureComponent } from "react";
import { isArabic } from "Util/App";
import { getUUID } from "Util/Auth";
import { VUE_CAROUSEL_SHOW, VUE_CAROUSEL_SWIPE } from "Util/Event";
import DynamicContentVueProductSliderItem from "./DynamicContentVueProductSlider.Item";
import isMobile from "Util/Mobile";
import "./DynamicContentVueProductSlider.style.scss";
import { HOME_PAGE_BANNER_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import Event from "Util/Event";

class DynamicContentVueProductSlider extends PureComponent {
  static propTypes = {
    withViewAll: PropTypes.bool,
    sliderLength: PropTypes.number,
    heading: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    widgetID: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.itemRef = React.createRef();
    this.cmpRef = React.createRef();
    this.indexRef = React.createRef(0);
    this.scrollerRef = React.createRef();
    this.state = {
      customScrollWidth: null,
      isArabic: isArabic(),
    };
  }
  componentDidMount() {
    if (this.state.customScrollWidth < 0) {
      this.renderScrollbar();
    }
    const { widgetID } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();

    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_SHOW,
      params: {
        event: VUE_CAROUSEL_SHOW,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: widgetID,
      },
    });

    document.addEventListener("scroll", this.isInViewport);
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", this.isInViewport);
  }
  async handleContainerScroll(widgetID, event) {
    const { isArabic } = this.state;
    const target = event.nativeEvent.target;
    this.scrollerRef.current.scrollLeft = isArabic
      ? Math.abs(target.scrollLeft)
      : target.scrollLeft;
    let width = 0;
    if (screen.width > 1024) {
      width = 245;
    } else {
      width = 220;
    }
    let index = Math.floor(Math.abs(target.scrollLeft) / width);
    if (this.indexRef.current !== index) {
      this.indexRef.current = index;
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
        {/* {this.viewAllBtn()} */}
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
  sendImpressions() {
    const products = this.getProducts();
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
    const top = this.viewElement.getBoundingClientRect().top;

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

  renderSliderContainer() {
    const items = this.getProducts();
    const { isHome } = this.props;
    const { widgetID } = this.props;

    // debugger
    return (
      <DragScroll data={{ rootClass: "ScrollWrapper", ref: this.cmpRef }}>
        <>
          <div
            block="VueProductSlider"
            elem="SliderContainer"
            id="ScrollWrapper"
            ref={this.cmpRef}
            mods={{ isHome }}
            onScroll={(e) => {
              this.handleContainerScroll(widgetID, e);
            }}
          >
            {isHome && <div block="SliderHelper" mods={{ isHome }}></div>}
            {items.map((item) => {
              const { sku } = item;
              return (
                <DynamicContentVueProductSliderItem
                  key={sku}
                  data={item}
                  ref={this.itemRef}
                  widgetID={widgetID}
                />
              );
            })}
            {isHome && <div block="SliderHelper" mods={{ isHome }}></div>}
          </div>
          {this.renderScrollbar()}
        </>
      </DragScroll>
    );
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <div ref={setRef} block="VueProductSlider" elem="Container">
        {this.renderHeader()}
        {this.renderSliderContainer()}
      </div>
    );
  }
}

export default DynamicContentVueProductSlider;
