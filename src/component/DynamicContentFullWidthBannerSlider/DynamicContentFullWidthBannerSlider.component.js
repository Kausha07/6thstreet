import { createRef } from 'react';
import PropTypes from "prop-types";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
import Link from "Component/Link";
// import { getUUID } from "Util/Auth";
import { formatCDNLink } from "Util/Url";
import { preloadImg } from "Util/DOM";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
// import VueIntegrationQueries from "Query/vueIntegration.query";
// import { getUUID } from "Util/Auth";
import "./DynamicContentFullWidthBannerSlider.style";
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import Image from "Component/Image";
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer"

const settings = {
  lazyload: true,
  mouseDrag: true,
  touch: true,
  // controlsText: ["&#x27E8", "&#x27E9"],
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
const settingsTimer = {
  lazyload: true,
  mouseDrag: true,
  touch: true,
  nav: true,
  loop: true,
  rewind: true,
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
      items: 1,
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
    isHideWidget: true,
  };

  timerStartRef = createRef();
  timerEndRef = createRef();

  componentDidMount() {
    this.registerViewPortEvent();
    this.preloadImage();
    this.showWidgetPostRender()
  }

  componentWillUnmount() {
    clearTimeout(this.timerStartRef.current);
    clearTimeout(this.timerEndRef.current);
  }

  showWidgetPostRender = () => {
    const now = new Date();
    const utcString = now.toUTCString();
    const { end_time, start_time } = this.props;
    const finalendDate = end_time;
    const time = Date.parse(finalendDate) - Date.parse(utcString);
    const timeToStart = Date.parse(start_time) - Date.parse(utcString);
    if (timeToStart > 0) {
      this.timerStartRef.current = setTimeout(() => {
        this.setState({ isHideWidget: false })
      }, timeToStart)
      this.timerEndRef.current = setTimeout(() => { this.setState({ isHideWidget: true }); }, time)
    }
    if (time <= 0) {
      this.setState({ isHideWidget: true });
    } else if (Date.parse(start_time) < Date.parse(utcString) && Date.parse(utcString) < Date.parse(finalendDate)) {
      this.setState({ isHideWidget: false });
      this.timerEndRef.current = setTimeout(() => { this.setState({ isHideWidget: true }); }, time)
    }
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
  onSliderChange = (activeSlide) => {
    this.setState({ activeSlide });
  };
  onclick = (item) => {
    if (!!!item) {
      return;
    }
    const { index } = this.props;
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
    this.props.setLastTapItemOnHome(
      `DynamicContentFullWidthBannerSlider${index}`
    );
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderSlide = (item, i) => {
    const { link, label, url: image_url, plp_config } = item;
    return (
      <Link
        to={formatCDNLink(link)}
        key={i}
        data-banner-type="fullWidthBanner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        {/* {this.renderTimer()} */}
        <img src={image_url} alt={label ? label : "full-width-banner-image" } />
      </Link>
    );
  };

  renderSlider() {
    const { items = [], type="" } = this.props;
    const { activeSlide } = this.state;
    // const items = [];

    return (
      <>
        {items && items.length === 0 ? this.renderBannerAnimation() : null}
        <TinySlider settings={type === "timer_full_width_banner_slider" ? settingsTimer : settings } block="">
          {items.map(this.renderSlide)}
        </TinySlider>
      </>
    );
  }

  preloadImage() {
    const { items, isPreload, setPreload } = this.props;
    if(!isPreload &&  items && items.length ) {
      preloadImg(items[0]?.url);
      setPreload && setPreload(true);
    }
  }
  renderTimer = () => {
    const { start_time = "", end_time = "", text_alignment = "", title = "", alignment = "" } = this.props;
    return <DynamicContentCountDownTimer start={start_time} end={end_time} alignment={alignment} textAlignment={text_alignment} infoText={title} />
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    const  {index, start_time = "", end_time =""} = this.props; 

    if (start_time && end_time) {
      if (!this.state.isHideWidget) {
        return (
          <div
            ref={setRef}
            block="DynamicContentFullWidthBannerSlider"
            id={`DynamicContentFullWidthBannerSlider${index}`}
          >
            {/* {this.renderTimer()} */}
            {this.props.header && (
              <DynamicContentHeader header={this.props.header} />
            )}
            
            {this.renderSlider()}
          </div>
        );
      }else{
        return <div ref={setRef}></div>
      }
    }

    return (
      <div
        ref={setRef}
        block="DynamicContentFullWidthBannerSlider"
        id={`DynamicContentFullWidthBannerSlider${index}`}
      >
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderSlider()}
      </div>
    );
  }
}

export default DynamicContentFullWidthBannerSlider;
