import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setGender } from "Store/AppState/AppState.action";
import { toggleBreadcrumbs } from "Store/Breadcrumbs/Breadcrumbs.action";
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { getSchema } from "Util/API/endpoint/Config/Config.endpoint";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { capitalize } from "Util/App";
import { getUUID } from "Util/Auth";
import { VUE_PAGE_VIEW } from "Util/Event";
import Logger from "Util/Logger";
import isMobile from "Util/Mobile";
import HomePage from "./HomePage.component";
import { HOME_STATIC_FILE_KEY } from "./HomePage.config";
import { setLastTapItemOnHome } from "Store/PLP/PLP.action";
import browserHistory from "Util/History";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  country: state.AppState.country,
  lastHomeItem: state.PLP.lastHomeItem,
  config: state.AppConfig.config,
  prevPath: state.PLP.prevPath,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleBreadcrumbs: (areBreadcrumbsVisible) =>
    dispatch(toggleBreadcrumbs(areBreadcrumbsVisible)),
  setGender: (gender) => dispatch(setGender(gender)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
  setLastTapItemOnHome: (item) => dispatch(setLastTapItemOnHome(item)),
});

export class HomePageContainer extends PureComponent {
  static propTypes = {
    setGender: PropTypes.func.isRequired,
    gender: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    toggleBreadcrumbs: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
  };

  state = {
    dynamicContent: [],
    isLoading: true,
    defaultGender: "women",
    isMobile: isMobile.any(),
    firstLoad: true,
  };

  constructor(props) {
    super(props);
    window.history.scrollRestoration = "manual";
    // this.requestDynamicContent();
  }

  componentDidMount() {
    const { prevPath = null } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "home",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath,
        url: window.location.href,
      },
    });

    const { gender, toggleBreadcrumbs } = this.props;
    toggleBreadcrumbs(false);
    this.setMetaData(gender);
    this.requestDynamicContent(true, gender);
    this.setSchemaJSON();
  }

  componentDidUpdate(prevProps) {
    const { gender: prevGender } = prevProps;
    const { gender, toggleBreadcrumbs, lastHomeItem } = this.props;

    toggleBreadcrumbs(false);

    if (gender !== prevGender) {
      this.setMetaData(gender);
      this.requestDynamicContent(true, gender);
    }
    let element = document.getElementById(lastHomeItem);
    if (element) {
      setTimeout(() => {
        window.focus();
        element.style.scrollMarginTop = "180px";
        element.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
  }

  setDefaultGender() {
    const { setGender } = this.props;
    const { defaultGender } = this.state;
    setGender(defaultGender);
    this.requestDynamicContent(true, defaultGender);
  }

  setMetaData(gender) {
    const { setMeta, country, config } = this.props;
    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};
    const genderName = capitalize(gender);
    const pagePathName = new URL(window.location.href).pathname;
    const countryNameConfig = (countryName == "Saudi Arabia" ? "KSA" : countryName);
    if (pagePathName == "/") {
      setMeta({
        title: __(
          "Online Shopping @ 6thStreet %s | Fashion & Lifestyle Brands for Women, Men & Kids",
          countryNameConfig
        ),
        keywords: __(
          "online shopping for %s, %s online shopping, %s",
          ...Array(2).fill(genderName),
          countryName
        ),
        description: __(
          // eslint-disable-next-line max-len
          "6thStreet.com, an online shopping site for fashion & lifestyle brands in the %s. Find top brands offering footwear, clothing, accessories & lifestyle products for women, men & kids.",
          countryName
        ),
        twitter_title: __(
          "Online Shopping @ 6thStreet %s | Fashion & Lifestyle Brands for Women, Men & Kids",
          countryNameConfig
        ),
        twitter_desc: __(
          // eslint-disable-next-line max-len
          "6thStreet.com, an online shopping site for fashion & lifestyle brands in the %s. Find top brands offering footwear, clothing, accessories & lifestyle products for women, men & kids.",
          countryName
        ),
        og_title: __(
          "Online Shopping @ 6thStreet %s | Fashion & Lifestyle Brands for Women, Men & Kids",
          countryNameConfig
        ),
        og_desc: __(
          // eslint-disable-next-line max-len
          "6thStreet.com, an online shopping site for fashion & lifestyle brands in the %s. Find top brands offering footwear, clothing, accessories & lifestyle products for women, men & kids.",
          countryName
        ),
      });
    } else {
      setMeta({
        title: __(
          "%s Online Shopping - shoes, bags, clothing | 6thStreet %s",
          genderName,
          countryName
        ),
        keywords: __(
          "online shopping for %s, %s online shopping, %s",
          ...Array(2).fill(genderName),
          countryName
        ),
        description: __(
          // eslint-disable-next-line max-len
          "Shop for %s fashion brands in %s. Exclusive collection of shoes, clothing, bags, grooming - Online Shopping ✯ Free Delivery ✯ COD ✯ 100% original brands - 6thStreet",
          genderName,
          countryName
        ),
        twitter_title: __(
          "%s Online Shopping - shoes, bags, clothing | 6thStreet %s",
          genderName,
          countryName
        ),
        twitter_desc: __(
          // eslint-disable-next-line max-len
          "Shop for %s fashion brands in %s. Exclusive collection of shoes, clothing, bags, grooming - Online Shopping ✯ Free Delivery ✯ COD ✯ 100% original brands - 6thStreet",
          genderName,
          countryName
        ),
        og_title: __(
          "%s Online Shopping - shoes, bags, clothing | 6thStreet %s",
          genderName,
          countryName
        ),
        og_desc: __(
          // eslint-disable-next-line max-len
          "Shop for %s fashion brands in %s. Exclusive collection of shoes, clothing, bags, grooming - Online Shopping ✯ Free Delivery ✯ COD ✯ 100% original brands - 6thStreet",
          genderName,
          countryName
        ),
      });
    }
  }

  getDevicePrefix() {
    return isMobile.any() ? "m/" : "d/";
  }

  async fetchDataFromLocal() {
    const { isMobile } = this.state;
    let fileName = "women.json";
    if (isMobile) {
      fileName = "women_mobile.json";
    }
    return fetch(fileName, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async requestDynamicContent(isUpdate = false) {
    const { gender } = this.props;
    const devicePrefix = this.getDevicePrefix();
    if (isUpdate) {
      // Only set loading if this is an update
      this.setState({ isLoading: true });
    }

    // TODO commented thiss try catch block temp uncomment after development
    try {
      const dynamicContent = await getStaticFile(HOME_STATIC_FILE_KEY, {
        $FILE_NAME: `${devicePrefix}${gender}.json`,
      });

      this.setState({
        dynamicContent: Array.isArray(dynamicContent) ? dynamicContent : [],
        isLoading: false,
      });
    } catch (e) {
      // TODO: handle error
      Logger.log(e);
    }
  }

  async setSchemaJSON() {
    const { locale = "" } = this.props;
    try {
      const response = await getSchema(locale);
      if (!!!response?.error) {
        const tag = document.createElement("script");
        if (tag) {
          tag.type = "application/ld+json";
          tag.innerHTML = JSON.stringify(response);
          document
            .querySelectorAll("script[type='application/ld+json']")
            .forEach((node) => node.remove());
          document.head.appendChild(tag);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  containerProps = () => {
    const { gender } = this.props;
    const { dynamicContent, isLoading } = this.state;

    return {
      dynamicContent,
      isLoading,
      gender,
    };
  };

  setLastTapItem = (item) => {
    this.props.setLastTapItemOnHome(item);
  };

  render() {
    return (
      <HomePage
        {...this.containerFunctions}
        {...this.containerProps()}
        setLastTapItem={this.setLastTapItem}
        HomepageProps={this.props}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePageContainer)
);
