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
import "./DynamicContentBanner.style";
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer"

class DynamicContentBanner extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        link: PropTypes.string,
        height: PropTypes.any,
        width: PropTypes.any,
      })
    ).isRequired,
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
    this.timerStartRef.current && clearTimeout(this.timerStartRef.current);
    this.timerEndRef.current && clearTimeout(this.timerEndRef.current);
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
      banner_type: item?.has_video ? "video" : "image",
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

  renderImage = (item, i) => {
    const { index, type } = this.props;
    // const { height, width } = items[0];
    const { url, image_url, link, height = "", width = "",promotion_name, description, button_label, has_video = false, video_url = ""} = item;
    let ht, wd;
    // if (screen.width < 900) {
    //   wd = (screen.width - 20).toString() + "px";
    //   ht = (height / width) * screen.width;
    // } else {
    //   wd = width.toString() + "px";
    //   ht = height.toString() + "px";
    // }

    // TODO: calculate aspect ratio to ensure images not jumping.
    const aspectRatio = width/height || 1;
    let videoBannerStyle = (isMobile.any()) ?  {
      width: "100%",
      padding:"0 10px",
      objectFit: "cover"
    }: { width:"100%", height: "auto", objectFit: "cover" };
    if (!link) {
      return (
        <>
          {(has_video && video_url) ? (
            <video
              src={video_url}
              style={videoBannerStyle}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              lazyLoad={index === 21 || index === 35 ? false : true}
              key={i}
              src={url || image_url}
              ratio="custom"
              height={ht}
              width={wd}
              alt={
                promotion_name ? promotion_name : "DynamicContentBannerImage"
              }
            />
          )}
          {this.renderButton()}
          {this.renderDescription(description, button_label)}
        </>
      );
    }

    return (
      <Link
        to={formatCDNLink(link)}
        key={i}
        data-banner-type={type || "banner"}
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        {this.props.start_time && this.props.end_time && this.renderTimer()}
        {(has_video && video_url)? (
          <video
            src={video_url}
            style={videoBannerStyle}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            lazyLoad={index === 21 || index === 35 ? false : true}
            src={url || image_url}
            block="Image"
            style={
              isMobile.any() && width && height
                ? {
                    width: `${window.innerWidth - 20}px`,
                    height: `${(window.innerWidth - 40) / aspectRatio}px`,
                  }
                : { maxWidth: wd, height: ht, objectFit: "unset" }
            }
            alt={
              item.promotion_name
                ? item.promotion_name
                : "DynamicContentBannerImage"
            }
          />
        )}

        {this.renderButton()}
        {this.renderDescription(description, button_label)}
      </Link>
    );
  };
  renderDescription(description, button_label){
    const { isMobile } = this.state;
    return(
    <>
      {isMobile && description && <h4 block="BannerDesc">{description}</h4>}
      {isMobile && button_label && <button block="BannerButton">{button_label}</button>}
    </>
    )
  }

  renderButton() {
    const { isMobile } = this.state;
    const { isMenu } = this.props;

    return isMobile || !isMenu ? null : <button>{__("Shop now")}</button>;
  }

  renderImages() {
    const { items = [] } = this.props;
    return items.map(this.renderImage);
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
            block="DynamicContentBanner"
            id={`DynamicContentBanner${index}`}
          >
            {this.props.header && (
              <DynamicContentHeader header={this.props.header} />
            )}
            {this.renderImages()}
            {this.props.footer && (
              <DynamicContentFooter footer={this.props.footer} />
            )}
          </div>
        );
      } else {
        return <div ref={setRef}></div>
      }
    }

    return (
      <div
        ref={setRef}
        block="DynamicContentBanner"
        id={`DynamicContentBanner${index}`}
      >
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderImages()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentBanner;
