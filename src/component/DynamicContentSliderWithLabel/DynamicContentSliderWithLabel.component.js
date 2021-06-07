import Link from "Component/Link";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import TinySlider from "tiny-slider-react";
import { getUUID } from "Util/Auth";
import Event, {
  EVENT_GTM_BANNER_CLICK,
  VUE_CAROUSEL_CLICK,
  VUE_CAROUSEL_SWIPE,
} from "Util/Event";
import { formatCDNLink } from "Util/Url";
import DynamicContentFooter from "../DynamicContentFooter/DynamicContentFooter.component";
import DynamicContentHeader from "../DynamicContentHeader/DynamicContentHeader.component";
import "./DynamicContentSliderWithLabel.style";

class DynamicContentSliderWithLabel extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        label: PropTypes.string,
        link: PropTypes.string,
        plp_config: PropTypes.shape({}), // TODO: describe
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      settings: {
        lazyload: true,
        nav: false,
        mouseDrag: true,
        touch: true,
        controlsText: ["&#x27E8", "&#x27E9"],
        gutter: 8,
        loop: false,
        responsive: {
          1024: {
            items: 5,
            gutter: 25,
          },
          420: {
            items: 5,
          },
          300: {
            items: 2.3,
          },
        },
      },
    };
  }

  componentDidMount() {
    if (this.props.items.length < 8) {
      let setting = JSON.parse(JSON.stringify(this.state.settings));
      setting.responsive[1024].items = this.props.items.length;
      this.setState((prevState) => ({
        ...prevState,
        settings: {
          ...prevState.settings,
          responsive: {
            ...prevState.settings.responsive,
            1024: {
              ...prevState.settings.responsive[1024],
              items: this.props.items.length,
            },
          },
        },
      }));
    }
  }

  onclick = (item) => {
    // vue analytics
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_CLICK,
      params: {
        event: VUE_CAROUSEL_CLICK,
        pageType: "plp",
        currency: "en_AED",
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        widgetID: "vue_visually_similar_slider", // TODO: Find widget id and replace with it.
      },
    });
    let banner = {
      link: item.link,
      promotion_name: item.promotion_name,
    };
    Event.dispatch(EVENT_GTM_BANNER_CLICK, banner);
  };

  onSwipe = () => {
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_CAROUSEL_SWIPE,
      params: {
        event: VUE_CAROUSEL_SWIPE,
        pageType: "plp",
        currency: "en_AED",
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        sourceProdID: "",
        sourceCatgID: "",
        widgetID: "vue_visually_similar_slider", // TODO: Find widget id and replace with it.
      },
    });
  };

  renderCircle = (item, i) => {
    const { link, text, url, plp_config, height, width } = item;

    const linkTo = {
      pathname: formatCDNLink(link),
      state: { plp_config },
    };
    let wd;
    if (this.state.settings.responsive[300].items === 1) {
      wd = (screen.width - 16).toString() + "px";
    } else {
      wd = width.toString() + "px";
    }
    let ht = height.toString() + "px";

    // TODO: move to new component

    return (
      <div block="SliderWithLabel" key={i * 10}>
        <Link
          to={linkTo}
          key={i * 10}
          data-banner-type="sliderWithLabel"
          data-promotion-name={item.promotion_name ? item.promotion_name : ""}
          data-tag={item.tag ? item.tag : ""}
          onClick={() => {
            this.onclick(item);
          }}
        >
          <img
            src={url}
            alt={text}
            block="Image"
            style={{ width: wd, height: ht }}
          />
        </Link>
        <div block="CircleSliderLabel" style={{ width: wd }}>
          {text}
        </div>
      </div>
    );
  };

  renderCircles() {
    const { items = [] } = this.props;
    let { settings } = this.state;
    if (items[0] && items[0].height === 300 && items[0].width === 300) {
      settings.responsive[300] = 1.3;
    }
    return (
      <TinySlider
        settings={this.state.settings}
        block="SliderWithLabelWrapper"
        onIndexChanged={() => {
          this.onSwipe;
        }}
      >
        {items.map(this.renderCircle)}
      </TinySlider>
    );
  }

  render() {
    return (
      <div block="DynamicContentSliderWithLabel">
        {this.props.header && (
          <DynamicContentHeader header={this.props.header} />
        )}
        {this.props.title && <h1 block="Title">{this.props.title}</h1>}
        {this.renderCircles()}
        {this.props.footer && (
          <DynamicContentFooter footer={this.props.footer} />
        )}
      </div>
    );
  }
}

export default DynamicContentSliderWithLabel;
