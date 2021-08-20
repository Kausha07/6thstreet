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
  };

  clickLink = (a) => {
    let link = "/" + a.link;
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
