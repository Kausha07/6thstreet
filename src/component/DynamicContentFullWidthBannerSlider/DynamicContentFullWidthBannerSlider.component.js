import PropTypes from "prop-types";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
import Link from "Component/Link";
import { formatCDNLink } from "Util/Url";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import Event, { EVENT_GTM_BANNER_CLICK } from "Util/Event";
// import VueIntegrationQueries from "Query/vueIntegration.query";
// import { getUUID } from "Util/Auth";
import "./DynamicContentFullWidthBannerSlider.style";

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
  };

  onSliderChange = (activeSlide) => {
    this.setState({ activeSlide });
  };
  onclick = (item) => {
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  renderSlide = (item, i) => {
    const { link, label, url: image_url, plp_config } = item;

    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };

    return (
      <Link
        to={linkTo}
        key={i}
        data-banner-type="fullWidthBanner"
        data-promotion-name={item.promotion_name ? item.promotion_name : ""}
        data-tag={item.tag ? item.tag : ""}
        onClick={() => {
          this.onclick(item);
        }}
      >
        <img src={image_url} alt={label} />
      </Link>
    );
  };

  renderSlider() {
    const { items = [] } = this.props;
    const { activeSlide } = this.state;
    // const items = [];

    return (
      <>
        {items && items.length === 0 ? this.renderBannerAnimation() : null}
        <TinySlider settings={settings} block="">
          {items.map(this.renderSlide)}
        </TinySlider>
      </>
    );
  }

  render() {
    return (
      <div block="DynamicContentFullWidthBannerSlider">
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.renderSlider()}
      </div>
    );
  }
}

export default DynamicContentFullWidthBannerSlider;
