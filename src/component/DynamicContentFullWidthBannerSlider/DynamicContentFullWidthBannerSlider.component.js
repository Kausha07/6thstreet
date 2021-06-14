import Link from "Component/Link";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
import { getUUID } from "Util/Auth";
import Event, {
  EVENT_GTM_BANNER_CLICK,
  VUE_CAROUSEL_CLICK,
  VUE_CAROUSEL_SWIPE,
} from "Util/Event";
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
  };

  onSliderChange = (activeSlide) => {
    this.setState({ activeSlide });
  };

  async onSwipeChange() {
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
        sourceProdID: "", // TODO: Need to find it
        sourceCatgID: "", // TODO: Need to find it
        widgetID: "vue_visually_similar_slider", // TODO: Find widget id and replace with it.
      },
    });
  }

  onclick = (item) => {
    // vue analytics
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_CLICK,
      params: {
        event: VUE_CAROUSEL_CLICK,
        pageType: "plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: "vue_visually_similar_slider", // // TODO: will be added after vue product slider.
      },
    });
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

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
        onIndexChanged={() => {
          this.onSwipeChange();
        }}
      >
        {items.map(this.renderSlide)}
      </TinySlider>
    );
  }

  render() {
    return (
      <div block="DynamicContentFullWidthBannerSlider">
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderSlider()}
      </div>
    );
  }
}

export default DynamicContentFullWidthBannerSlider;
