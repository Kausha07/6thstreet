import PropTypes from "prop-types";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";

import Image from "Component/Image";
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";

import "react-circular-carousel/dist/index.css";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import "./DynamicContentCircleItemSlider.style";
import DragScroll from "Component/DragScroll/DragScroll.component";
import { isArabic } from "Util/App";

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
  };

  clickLink = (a) => {
    let link = "/" + a.link.split("?")[0];
    localStorage.setItem("bannerData", JSON.stringify(a));
    localStorage.setItem("CircleBannerUrl", link);
    let banner = {
      link: a.link,
      promotion_name: a.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderCircle = (item, i) => {
    const { link, label, image_url, plp_config } = item;
    const { isArabic } = this.state;
    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };

    // TODO: move to new component

    return (
      <div block="CircleSlider" mods={{ isArabic }} key={i}>
        <Link
          to={linkTo}
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
          {items.map(this.renderCircle)}
          <div className="CircleItemHelper"></div>
        </div>
      </DragScroll>
    );
  }

  render() {
    return (
      <div block="DynamicContentCircleItemSlider">
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
