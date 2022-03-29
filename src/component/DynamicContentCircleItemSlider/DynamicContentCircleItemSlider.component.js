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
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import Image from "Component/Image";

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
    livePartyItems: null,
  };
  componentDidMount() {
    this.registerViewPortEvent();
    this.fetchLivePartyData();
  }

  fetchLivePartyData = () => {
    const isStaging = process.env.REACT_APP_SPOCKEE_STAGING;
    const apiUrl = `https://api.spockee.io/rest/v2/broadcast/upcoming?storeId=13207961&isStaging=${isStaging}`;
    fetch(apiUrl)
      .then((response) => response.json())

      .then((data) => {
        let newData = data.filter((val) => !val.m3u8URI);
        this.setState({
          livePartyItems: newData,
        });
      })
      .catch((error) => console.error(error));
  };

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
    const getStoreName = this.props.promotion_name
      ? this.props.promotion_name + "-"
      : "";

    // TODO: move to new component

    return (
      <div block="CircleSlider" mods={{ isArabic }} key={i}>
        <Link
          to={newLink}
          key={i}
          data-banner-type="circleItemSlider"
          data-promotion-name={
            getStoreName + (item.promotion_name ? item.promotion_name : "")
          }
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
    let link = `/live-party?broadcastId=${item.id}`;
    let label = item.name;
    let image_url = item.mainImageURI;
    const { isArabic } = this.state;
    const getStoreName = this.props.promotion_name
      ? this.props.promotion_name + "-"
      : "";

    // TODO: move to new component

    return (
      <div block="CircleSlider" mods={{ isArabic }} key={i}>
        <Link
          to={formatCDNLink(link)}
          key={i}
          data-banner-type="circleItemSlider"
          data-promotion-name={
            getStoreName + (item.promotion_name ? item.promotion_name : "")
          }
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
