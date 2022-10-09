import DragScroll from "Component/DragScroll/DragScroll.component";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import "react-circular-carousel/dist/index.css";
import { isArabic } from "Util/App";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentCircleItemSlider.style";

import Config from "../../route/LiveExperience/LiveExperience.config";
import VueIntegrationQueries from "Query/vueIntegration.query";
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";

const settings = {
  lazyload: true,
  nav: false,
  mouseDrag: true,
  touch: true,
  controlsText: ["&#x27E8", "&#x27E9"],
  loop: false,
  responsive: {
    1024: {
      items: 8,
    },
    420: {
      items: 6,
    },
    300: {
      items: 4,
    },
  },
};

class DynamicContentCircleItemSlider extends PureComponent {
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
  ref = React.createRef();
  state = {
    isArabic: isArabic(),
    impressionSent: false,
    livePartyItems: [],
    apiUrl: `https://liveshopping-api.bambuser.com/v1/channels/`,
  };
  componentDidMount() {
    this.registerViewPortEvent();
    this.getLiveLocation();
  }

  getcountrySepicificChannelId = (country) => {
    switch (country) {
      case "ae":
        return (Config.storeId = "RQi9v57VXHIFetDai47q");
      case "sa":
        return (Config.storeId = "LSC8XG1YSbgdX6Adwds4");
      case "kw":
        return (Config.storeId = "SbFHRnzIUHdcORz2ELjd");
      case "om":
        return (Config.storeId = "JFEsZsxpy6mp1HaawJvH");
      case "bh":
        return (Config.storeId = "TvklSoghpVJPJttPB94u");
      case "qa":
        return (Config.storeId = "mLnmwfhhDQZa8OzDYmni");
      default:
        return (Config.storeId = "RQi9v57VXHIFetDai47q");
    }
  };

  fetchLivePartyData = () => {
    const { channelID, apiUrl } = this.state;
    try {
      fetch(`${apiUrl}${Config.storeId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token CHkWEZ9PgCdcqbzJhMtXbmYa8FuNL8xEnSrAeCXMpsKE",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            livePartyItems: res.playlists[2].shows,
          });
        });
    } catch (err) {
      console.error(err);
    }
  };

  getLiveLocation() {
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    this.getcountrySepicificChannelId(country);
    this.fetchLivePartyData();
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
    const getStoreName = this.props?.promotion_name
      ? this.props?.promotion_name
      : "";
    const getIndexId = this.props?.index ? this.props.index : "";
    items.forEach((item, index) => {
      Object.assign(item, {
        store_code: getStoreName,
        indexValue: index + 1,
        default_Index: getIndexId,
      });
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

  sendImpressions() {
    const { items = [] } = this.props;
    const getStoreName = this.props?.promotion_name
      ? this.props?.promotion_name
      : "";
    const getIndexId = this.props?.index ? this.props.index : "";
    items.forEach((item, index) => {
      Object.assign(item, {
        store_code: getStoreName,
        indexValue: index + 1,
        default_Index: getIndexId,
      });
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

  clickLink = (a) => {
    const { index } = this.props;
    let link = a.link;
    localStorage.setItem("bannerData", JSON.stringify(a));
    localStorage.setItem("CircleBannerUrl", link);
    let banner = {
      link: a.link,
      promotion_name: a.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(a);
    this.props.setLastTapItemOnHome(`DynamicContentCircleItemSlider${index}`);
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderCircle = (item, i) => {
    const { link, label, image_url, plp_config } = item;
    const { isArabic } = this.state;
    let newLink = formatCDNLink(link) + "&plp_config=true";

    // TODO: move to new component

    return (
      <div block="CircleSlider" mods={{ isArabic }} key={i}>
        <Link
          to={newLink}
          key={i}
          data-banner-type="circleItemSlider"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.clickLink(item);
          }}
        >
          <div block="OuterCircle">
            <div block="OuterCircle" elem="InnerCircle"></div>
            <img
              src={image_url}
              alt={label}
              block="Image"
              width="70px"
              height="70px"
            />
          </div>
        </Link>
        <div block="CircleSliderLabel">{label}</div>
      </div>
    );
  };

  renderLiveParty = (item, i) => {
    // const { link, label, image_url, plp_config } = item;
    let link = `/live-party`;
    let label = item.title;
    let image_url = item.curtains.pending.backgroundImage;
    const { isArabic } = this.state;

    // TODO: move to new component

    return (
      <div block="CircleSlider" mods={{ isArabic }} key={i}>
        <Link
          to={formatCDNLink(link)}
          key={i}
          data-banner-type="circleItemSlider"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.clickLink(item);
          }}
        >
          <div block="OuterCircle OuterLiveParty">
            <div block="OuterCircle" elem="LiveParty"></div>
            <div block="OuterCircle" elem="LivePartyBackground"></div>
            <div block="OuterCircle" elem="LivePartyText">
              LIVE
            </div>
            <img
              src={image_url}
              alt={label}
              block="Image"
              width="70px"
              height="70px"
            />
          </div>
        </Link>
        <div block="CircleSliderLabel">{label}</div>
      </div>
    );
  };

  renderCircles() {
    const { items = [] } = this.props;
    return (
      <DragScroll data={{ rootClass: "CircleSliderWrapper", ref: this.ref }}>
        <div
          ref={this.ref}
          id="CircleSliderWrapper"
          block="CircleSliderWrapper"
        >
          <div className="CircleItemHelper"></div>
          {this.state.livePartyItems &&
            this.state.livePartyItems.length &&
            this.state.livePartyItems[0].isLive &&
            this.state.livePartyItems.map(this.renderLiveParty)}
          {items.map(this.renderCircle)}
          <div className="CircleItemHelper"></div>
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
        block="DynamicContentCircleItemSlider"
        id="DynamicContentCircleItemSlider"
      >
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderCircles()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentCircleItemSlider;
