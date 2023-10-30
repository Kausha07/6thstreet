import { createRef } from 'react';
import {
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
  HOME_PAGE_BANNER_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";
import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentTimer.style";
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer"

class DynamicContentTimer extends PureComponent {
  static propTypes = {
    // items: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     url: PropTypes.string,
    //     link: PropTypes.string,
    //     height: PropTypes.any,
    //     width: PropTypes.any,
    //   })
    // ).isRequired,
    isMenu: PropTypes.bool,
    toggleMobileMenuSideBar: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.onclick = this.onclick.bind(this);    
  }

  static defaultProps = {
    isMenu: false,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
    impressionSent: false,
    isHideWidget: true,
  };

  timerStartRef = createRef();
  timerEndRef = createRef();

  componentDidMount() {
    const { doNotTrackImpression } = this.props;
    if (!doNotTrackImpression) {
      this.registerViewPortEvent();
    }
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

  onclick = (item) => {
    const { toggleMobileMenuSideBar, index } = this.props;
    if (toggleMobileMenuSideBar) {
      toggleMobileMenuSideBar();
    }
    setTimeout(() => { });
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
    this.props.setLastTapItemOnHome(`DynamicContentBanner${index}`);
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderTimer = () => {
    const { start_time = "", end_time = "", text_alignment = "", title = "", alignment = "" } = this.props;
    return <DynamicContentCountDownTimer start={start_time} end={end_time} alignment={alignment} textAlignment={text_alignment} infoText={title} />
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };
    const { index, start_time, end_time } = this.props;

    if (start_time && end_time) {
      if (!this.state.isHideWidget) {
        return (
          <div
            ref={setRef}
            block={"DynamicContentTimer"}
            id={`DynamicContentTimer${index}`}
          >
            {this.props.header && (
              <DynamicContentHeader header={this.props.header} />
            )}
            {this.renderTimer()}
            {this.props.footer && (
              <DynamicContentFooter footer={this.props.footer} />
            )}
          </div>
        )
      }
    }
    return <div ref={setRef}></div>
  }
}

export default DynamicContentTimer;
