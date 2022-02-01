import DragScroll from "Component/DragScroll/DragScroll.component";
import { HOME_PAGE_BANNER_IMPRESSIONS } from "Component/GoogleTagManager/events/BannerImpression.event";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import { isArabic } from "Util/App";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { VUE_CAROUSEL_SHOW, VUE_CAROUSEL_SWIPE } from "Util/Event";
import DynamicContentVueProductSliderItem from "./DynamicContentVueProductSlider.Item";
import "./DynamicContentVueProductSlider.style.scss";
import {connect} from 'react-redux'
;
export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
});

class DynamicContentVueProductSlider extends PureComponent {
  static propTypes = {
    withViewAll: PropTypes.bool,
    sliderLength: PropTypes.number,
    heading: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    widgetID: PropTypes.string.isRequired,
    pageType: PropTypes.string.isRequired,
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
      impressionSent: false,
      eventRegistered: false,
      apiCalled: false,
    };
  }
  componentDidMount() {
    if (this.state.customScrollWidth < 0) {
      this.renderScrollbar();
    }
    this.registerViewPortEvent();
  }
  componentWillUnmount() {}

  registerViewPortEvent() {
    const { index = 0 } = this.props;
    let observer;
    const elem = document.querySelector(`#productSlider-${index}`);

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

  handleCarouselShowEvent = () => {
    const {
      widgetID,
      pageType = "home",
      sourceProdID = null,
      sourceCatgID = null,
      prevPath= null,
      location: { state },
    } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_SHOW,
      params: {
        event: VUE_CAROUSEL_SHOW,
        pageType: pageType,
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath,
        url: window.location.href,
        widgetID: VueIntegrationQueries.getWidgetTypeMapped(widgetID, pageType),
        userID: userID,
        sourceProdID: sourceProdID,
        sourceCatgID: sourceCatgID,
      },
    });
    this.setState({ apiCalled: true });
  };
  handleIntersect = (entries, observer) => {
    const { impressionSent, apiCalled } = this.state;
    if (impressionSent) {
      return;
    }
    if (apiCalled) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.sendImpressions();
        this.handleCarouselShowEvent();
      }
    });
  };

  async handleContainerScroll(widgetID, event) {
    const { isArabic } = this.state;
    const {
      pageType = "home",
      sourceProdID = null,
      sourceCatgID = null,
    } = this.props;
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
      let destURL = productsToRender[index]?.link;
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
          url: destURL,
          sourceProdID: sourceProdID,
          sourceCatgID: sourceCatgID,
          widgetID: VueIntegrationQueries.getWidgetTypeMapped(
            widgetID,
            pageType
          ),
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
    const { isHome } = this.props;

    return (
      <div
        block="VueProductSlider"
        elem="HeaderContainer"
        mods={{
          isHome,
          isArabic: isArabic()
        }}
      >
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

  renderSliderContainer() {
    const items = this.getProducts();
    const { isHome, renderMySignInPopup } = this.props;
    const {
      widgetID,
      pageType,
      sourceProdID = null,
      sourceCatgID = null,
    } = this.props;
    return (
      <DragScroll data={{ rootClass: "ScrollWrapper", ref: this.cmpRef }}>
        <>
          <div
            block="VueProductSlider"
            elem="SliderContainer"
            id="ScrollWrapper"
            ref={this.cmpRef}
            mods={{
              isHome,
              isArabic: isArabic()
            }}
            onScroll={(e) => {
              this.handleContainerScroll(widgetID, e);
            }}
          >
            {isHome && <div block="SliderHelper" mods={{ isHome }}></div>}
            {items.map((item, i) => {
              const { sku } = item;
              return (
                <DynamicContentVueProductSliderItem
                  renderMySignInPopup={renderMySignInPopup}
                  key={sku}
                  data={item}
                  posofreco={i}
                  ref={this.itemRef}
                  widgetID={widgetID}
                  pageType={pageType}
                  sourceProdID={sourceProdID}
                  sourceCatgID={sourceCatgID}
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
    const { index = null } = this.props;
    return (
      <div id="productSlider">
        <div
          ref={setRef}
          id={`productSlider-${index}`}
          block="VueProductSlider"
          elem="Container"
          mods={{
            isArabic: isArabic()
          }}
        >
          {this.renderHeader()}
          {this.renderSliderContainer()}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(DynamicContentVueProductSlider);
