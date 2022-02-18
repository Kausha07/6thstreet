// import PropTypes from 'prop-types';
import { PRODUCT_SLIDER_TYPE } from "Component/DynamicContent/DynamicContent.config";
import DynamicContentBanner from "Component/DynamicContentBanner";
import DynamicContentCircleItemSlider from "Component/DynamicContentCircleItemSlider";
import DynamicContentFullWidthBannerSlider from "Component/DynamicContentFullWidthBannerSlider";
import DynamicContentGrid from "Component/DynamicContentGrid";
import DynamicContentMainBanner from "Component/DynamicContentMainBanner";
import DynamicContentProductSlider from "Component/DynamicContentProductSlider";
import DynamicContentRichContentBanner from "Component/DynamicContentRichContentBanner";
import DynamicContentSliderWithLabel from "Component/DynamicContentSliderWithLabel";
import DynamicContentTwiceBanner from "Component/DynamicContentTwiceBanner";
import DynamicContentVueSlider from "Component/DynamicContentVueSlider";
import { PureComponent } from "react";
import { DynamicContent as DynamicContentType } from "Util/API/endpoint/StaticFiles/StaticFiles.type";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, { EVENT_GTM_IMPRESSIONS_HOME } from "Util/Event";
import Logger from "Util/Logger";
import isMobile from "Util/Mobile";
import VueQuery from "../../query/Vue.query";
import "./DynamicContent.style";
import { getUUIDToken } from "Util/Auth";

class DynamicContent extends PureComponent {
  static propTypes = {
    content: DynamicContentType.isRequired,
  };

  constructor(props) {
    super(props);
    const { content = [] } = this.props;
    this.comprefs = content.map((i) => {
      return React.createRef();
    });
  }

  state = {
    impressions: [],
    sliderImpressionCount: 0,
  };

  renderMap = {
    banner: DynamicContentBanner,
    mainBanner: DynamicContentMainBanner,
    grid: DynamicContentGrid,
    productSlider: DynamicContentProductSlider,
    fullWidthBannerSlider: DynamicContentFullWidthBannerSlider,
    circleItemSlider: DynamicContentCircleItemSlider,
    bannerSliderWithLabel: DynamicContentSliderWithLabel,
    rich_content_banner: DynamicContentRichContentBanner,
    twiceBanner: DynamicContentTwiceBanner,
    edge_to_edge_banner: DynamicContentBanner,
    line_separator: "hr",
    vue_slider: DynamicContentVueSlider,
  };
  async getHomeWidgetsVueData(type) {
    const { gender } = this.props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    const payload = VueQuery.buildQuery(type, query, {
      gender,
      userID,
    });

    try {
      const pdpWidgetsData = await fetchVueData(payload);
      if (pdpWidgetsData.length > 0 && pdpWidgetsAPIData.length > 0) {
        return "vue slider";
      }
    } catch (error) {
      onsole.log("Home widget vue query catch", err);
    }
  }
  isCheckTwiceBanner = (block) => {
    let isValid = false;
    if (block.header) {
      isValid = "header";
    } else if (block.footer) {
      isValid = "footer";
    }
    return isValid;
  };
  renderBlock = (block, i) => {
    const { type, ...restProps } = block;
    const { promotion_name, tag, items } = block;
    let vueSliderType = [
      "vue_browsing_history_slider",
      "vue_trending_slider",
      "vue_recently_viewed_slider",
      "vue_top_picks_slider",
      "vue_visually_similar_slider",
    ];
    let Component = "";
    if (type === "banner" && !isMobile.any()) {
      const typeofBanner = this.isCheckTwiceBanner(block);
      restProps.typeOfBanner = typeofBanner;
      if (this.isCheckTwiceBanner(block)) {
        Component = this.renderMap["twiceBanner"];
      } else {
        Component = this.renderMap["banner"];
      }
    } else if (vueSliderType.includes(type)) {
      Component = this.renderMap["vue_slider"];
      if (!Component) {
        return null;
      }
      return (
        <Component
          ref={this.comprefs[i]}
          {...restProps}
          setLastTapItemOnHome={this.props.setLastTapItemOnHome}
          renderMySignInPopup={this.props.renderMySignInPopup}
          promotion_name={promotion_name}
          tag={tag}
          type={type}
          key={i}
          isHomePage={true}
          index={i}
        />
      );
    } else {
      Component = this.renderMap[type];
    }
    // Component = this.renderMap[type];

    if (!Component) {
      // TODO: implement all types
      // Logger.log(type, restProps);
      return null;
    }

    // Gather product impressions from all page for gtm
    if (type === PRODUCT_SLIDER_TYPE) {
      restProps.setImpressions = (additionalImpressions = []) => {
        this.setState(({ impressions = [], sliderImpressionCount }) => ({
          impressions: [...impressions, ...additionalImpressions],
          sliderImpressionCount: sliderImpressionCount + 1,
        }));
      };
    }
    return (
      <Component
        ref={this.comprefs[i]}
        {...restProps}
        type={type}
        setLastTapItemOnHome={this.props.setLastTapItemOnHome}
        promotion_name={promotion_name}
        renderMySignInPopup={this.props.renderMySignInPopup}
        tag={tag}
        key={i}
        isHomePage={true}
        index={i}
      />
    );
  };

  renderBlocks() {
    const { content = [] } = this.props;
    return content.map(this.renderBlock);
  }

  sendImpressions() {
    const { impressions, sliderImpressionCount } = this.state;
    const { content } = this.props;
    const sliderCount = content.filter(
      ({ type }) => PRODUCT_SLIDER_TYPE === type
    ).length;

    if (impressions.length && sliderImpressionCount === sliderCount) {
      Event.dispatch(EVENT_GTM_IMPRESSIONS_HOME, { impressions });
      this.setState({ impressions: [] });
    }
  }

  render() {
    return (
      <div block="DynamicContent">
        {this.renderBlocks()}
        {/* {this.sendImpressions()} */}
      </div>
    );
  }
}

export default DynamicContent;
