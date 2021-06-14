// import PropTypes from 'prop-types';
import { PureComponent } from "react";

import { PRODUCT_SLIDER_TYPE } from "Component/DynamicContent/DynamicContent.config";
import DynamicContentBanner from "Component/DynamicContentBanner";
import DynamicContentCircleItemSlider from "Component/DynamicContentCircleItemSlider";
import DynamicContentFullWidthBannerSlider from "Component/DynamicContentFullWidthBannerSlider";
import DynamicContentGrid from "Component/DynamicContentGrid";
import DynamicContentMainBanner from "Component/DynamicContentMainBanner";
import DynamicContentProductSlider from "Component/DynamicContentProductSlider";
import DynamicContentSliderWithLabel from "Component/DynamicContentSliderWithLabel";
import DynamicContentRichContentBanner from "Component/DynamicContentRichContentBanner";
import { DynamicContent as DynamicContentType } from "Util/API/endpoint/StaticFiles/StaticFiles.type";
import DynamicContentTwiceBanner from "Component/DynamicContentTwiceBanner";
import Event, { EVENT_GTM_IMPRESSIONS_HOME } from "Util/Event";
import isMobile from 'Util/Mobile';
import Logger from "Util/Logger";
import VueQuery from "../../query/Vue.query";
import BrowserDatabase from "Util/BrowserDatabase";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";

import "./DynamicContent.style";

class DynamicContent extends PureComponent {
  static propTypes = {
    content: DynamicContentType.isRequired,
  };

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
    line_separator: "hr",
  };
  async getHomeWidgetsVueData(type) {
    const { gender } = this.props;
    const {
      USER_DATA: { deviceUuid },
    } = BrowserDatabase.getItem("MOE_DATA");
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: deviceUuid,
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
    let Component = "";
    if (type === "banner" && !isMobile.any()) {
      const typeofBanner = this.isCheckTwiceBanner(block);
      restProps.typeOfBanner = typeofBanner;
      Component = this.renderMap["twiceBanner"];
    } else {
      Component = this.renderMap[type];
    }
    // Component = this.renderMap[type];

    if (!Component) {
      // TODO: implement all types
      Logger.log(type, restProps);
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

    return <Component {...restProps} key={i} />;
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
        {this.sendImpressions()}
      </div>
    );
  }
}

export default DynamicContent;
