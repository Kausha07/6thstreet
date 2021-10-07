import {
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
  HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import Link from "Component/Link";
import PropTypes from "prop-types";
// import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
// import { getUUID } from "Util/Auth";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentFullWidthBannerSlider.style";

const settings = {
  lazyload: true,
  mouseDrag: true,
  touch: true,
  controlsText: ["&#x27E8", "&#x27E9"],
  nav: true,
  loop: true,
  navPosition: "bottom",
  autoplay: true,
  responsive: {
    1024: {
      items: 1,
    },
    420: {
      items: 1,
    },
    300: {
      items: 1.2,
    },
  },
};
class DynamicContentFullWidthBannerSlider extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string,
        label: PropTypes.string,
        link: PropTypes.string,
        plp_config: PropTypes.shape({}), // TODO: describe
      })
    ).isRequired,
  };

  state = {
    activeSlide: 0,
    impressionSent: false,
  };

  componentDidMount() {
    this.registerViewPortEvent();
  }

  registerViewPortEvent() {
    let observer;

    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer = new IntersectionObserver(this.handleIntersect, options);
    observer.observe(this.viewElement);
  }
  sendImpressions() {
    const { items = [] } = this.props;
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

  onSliderChange = (activeSlide) => {
    this.setState({ activeSlide });
  };

  onclick = (item) => {
    // vue analytics
    // const locale = VueIntegrationQueries.getLocaleFromUrl();
    // VueIntegrationQueries.vueAnalayticsLogger({
    //   event_name: VUE_CAROUSEL_CLICK,
    //   params: {
    //     event: VUE_CAROUSEL_CLICK,
    //     pageType: "plp",
    //     currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
    //     clicked: Date.now(),
    //     uuid: getUUID(),
    //     referrer: "desktop",
    //     widgetID: "vue_visually_similar_slider", // // TODO: will be added after vue product slider.
    //   },
    // });
    if(!!!item){
      return;
    }
  
    const banner = {
      link: item?.link,
      promotion_name: item?.promotion_name,
    };
  
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
  };

  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }
  renderSlide = (item, i) => {
    const { link, label, url: image_url, plp_config } = item;

    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };

    return (
      <Link
        to={linkTo}
        key={i}
        data-banner-type="fullWidthBanner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        <img src={image_url} alt={label} />
      </Link>
    );
  };

  renderSlider() {
    const { items = [] } = this.props;
    const { activeSlide } = this.state;

    return (
      <TinySlider
        settings={settings}
        block=""
      >
        {items.map(this.renderSlide)}
      </TinySlider>
    );
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    return (
      <div ref={setRef} block="DynamicContentFullWidthBannerSlider">
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderSlider()}
      </div>
    );
  }
}

export default DynamicContentFullWidthBannerSlider;
