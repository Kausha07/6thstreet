import cx from "classnames";
import Image from "Component/Image";
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import "react-circular-carousel/dist/index.css";
import TinySlider from "tiny-slider-react";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentRichContentBanner.style";

const settings = {
  lazyload: true,
  mouseDrag: true,
  touch: true,
  controlsText: ["&#x27E8", "&#x27E9"],
  nav: true,
  loop: true,
  navPosition: "bottom",
  autoplay: false,
  responsive: {
    1024: {
      items: 2,
      gutter: 36,
    },
    420: {
      items: 6,
    },
    300: {
      items: 1,
    },
  },
};

class DynamicContentRichContentBanner extends PureComponent {
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

  onclick = (item) => {
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderCircle = (item, i) => {
    const { link, title, image_url, plp_config } = item;

    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };
    let ht, wd;
    if (screen.width > 900) {
      let ht1 = (item.height / item.width) * 600;
      ht = ht1.toString() + "px";
      wd = "600px";
    } else {
      ht = screen.width.toString() + "px";
      wd = screen.width.toString() + "px";
    }

    // TODO: move to new component

    return (
      <div block="CircleSlider" key={i}>
        <Link
          to={linkTo}
          key={i}
          data-banner-type="richContentBanner"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <Image
            src={image_url}
            alt={title}
            mix={{ block: "DynamicContentRichContentBanner", elem: "Image" }}
            ratio="custom"
            height={ht}
            width={wd}
          />
          {/* <button
                  block="DynamicContentCircleItemSlider"
                  elem="Label"
                  mix={ { block: 'button primary' } }
                >
                    { label }
                </button> */}
        </Link>
        <div block="Label">
          {item.title && <p block="Label-Title">{item.title}</p>}
          {item.subtitle && <p block="Label-SubTitle">{item.subtitle}</p>}
          {item.button && (
            <a href={item.button.link} block="Label-Button">
              {item.button.label}
            </a>
          )}
        </div>
        {item.tag && (
          <div
            block={cx("Tag", {
              "Tag-TopLeft": item.tag.position === "top_left",
              "Tag-TopRight": item.tag.position === "top_right",
              "Tag-TopCenter": item.tag.position === "top_center",
              "Tag-BottomLeft": item.tag.position === "bottom_left",
              "Tag-BottomRight": item.tag.position === "bottom_right",
              "Tag-BottomCenter": item.tag.position === "bottom_center",
            })}
          >
            {item.tag.label}
          </div>
        )}
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
      <div block="DynamicContentRichContentBanner">
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

export default DynamicContentRichContentBanner;
