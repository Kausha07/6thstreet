import PropTypes from "prop-types";
import { PureComponent } from "react";

import Image from "Component/Image";
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";
import Event from "Util/Event";
import "./DynamicContentMainBanner.style";
import {
  HOME_PAGE_BANNER_IMPRESSIONS,
  HOME_PAGE_BANNER_CLICK_IMPRESSIONS,
} from "Component/GoogleTagManager/events/BannerImpression.event";

import "./DynamicContentMainBanner.style";
class DynamicContentMainBanner extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        link: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      })
    ).isRequired,
  };
  state = {
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
  onclick = (item) => {
    this.sendBannerClickImpression(item);
  };

  sendBannerClickImpression(item) {
    Event.dispatch(HOME_PAGE_BANNER_CLICK_IMPRESSIONS, [item]);
  }

  renderImage(item, i) {
    const {
      url,
      link,
      // height,
      // width
    } = item;

    // TODO: calculate aspect ratio to ensure images not jumping.
    if (!link) {
      return <Image key={i} src={url} ratio="custom" height="auto" />;
    }

    return (
      <Link
        to={formatCDNLink(link)}
        onClick={() => {
          this.onclick(item);
        }}
        key={i}
      >
        <Image src={url} ratio="custom" height="auto" />
      </Link>
    );
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
      <div ref={setRef} block="DynamicContentMainBanner">
        {this.renderImages()}
      </div>
    );
  }
}

export default DynamicContentMainBanner;
