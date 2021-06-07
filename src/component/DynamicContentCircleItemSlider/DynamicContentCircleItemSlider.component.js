import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import "react-circular-carousel/dist/index.css";
import TinySlider from "tiny-slider-react";
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

  componentDidMount() {
    console.log("all well");
  }
  clickLink = (a) => {
    console.log("banner click", a);
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

    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };

    // TODO: move to new component

    return (
      <div block="CircleSlider" key={i}>
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
          <img
            src={image_url}
            alt={label}
            block="Image"
            width="70px"
            height="70px"
          />
          {/* <Image
                      src={ image_url }
                      alt={ label }
                      mix={ { block: 'DynamicContentCircleItemSlider', elem: 'Image' } }
                      ratio="custom"
                      height="70px"
                      width="70px"
                    /> */}
          {/* <button
                  block="DynamicContentCircleItemSlider"
                  elem="Label"
                  mix={ { block: 'button primary' } }
                >
                    { label }
                </button> */}
        </Link>
        <div block="CircleSliderLabel">{label}</div>
      </div>
    );
  };

  renderCircles() {
    const { items = [] } = this.props;
    return (
      <TinySlider settings={settings} block="CircleSliderWrapper">
        {items.map(this.renderCircle)}
      </TinySlider>
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
