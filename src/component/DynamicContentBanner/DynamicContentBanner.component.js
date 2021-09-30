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
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";

class DynamicContentBanner extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        link: PropTypes.string,
        height: PropTypes.string,
        width: PropTypes.string,
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
  };

  componentDidMount() {
    const { doNotTrackImpression } = this.props;
    if (!doNotTrackImpression) {
      this.registerViewPortEvent();
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
    const { toggleMobileMenuSideBar } = this.props;
    if (toggleMobileMenuSideBar) {
      toggleMobileMenuSideBar();
    }
    setTimeout(() => {});
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
    this.sendBannerClickImpression(item);
  };
  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderImage = (item, i) => {
    // const { items } = this.props;
    // const { height, width } = items[0];
    const { url, link, height = "", width = "" } = item;
    let ht, wd;
    // if (screen.width < 900) {
    //   wd = (screen.width - 20).toString() + "px";
    //   ht = (height / width) * screen.width;
    // } else {
    //   wd = width.toString() + "px";
    //   ht = height.toString() + "px";
    // }

    // TODO: calculate aspect ratio to ensure images not jumping.

    if (!link) {
      return (
        <>
          <Image lazyLoad={true} key={i} src={url} ratio="custom" height={ht} width={wd} />
          {this.renderButton()}
        </>
      );
    }

    return (
      <Link
        to={formatCDNLink(link)}
        key={i}
        data-banner-type="banner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        <Image lazyLoad={true}
          src={url}
          block="Image"
          style={{ maxWidth: wd, height: ht, objectFit: "unset" }}
        />

        {this.renderButton()}
      </Link>
    );
  };

  renderButton() {
    const { isMobile } = this.state;
    const { isMenu } = this.props;

    return isMobile || !isMenu ? null : <button>{__("Shop now")}</button>;
  }

  renderImages() {
    const { items = [] } = this.props;
    return items.map(this.renderImage);
  }

  render() {
    let setRef = (el) => {
      this.viewElement = el;
    };

    return (
      <div ref={setRef} block="DynamicContentBanner">
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
