import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setGender } from "Store/AppState/AppState.action";
import { toggleBreadcrumbs } from "Store/Breadcrumbs/Breadcrumbs.action";
import { updateMeta } from "Store/Meta/Meta.action";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { capitalize } from "Util/App";
import { getUUID } from "Util/Auth";
import { VUE_PAGE_VIEW } from "Util/Event";
import Logger from "Util/Logger";
import isMobile from "Util/Mobile";
import HomePage from "./HomePage.component";
import { HOME_STATIC_FILE_KEY } from "./HomePage.config";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  country: state.AppState.country,
  config: state.AppConfig.config,
  prevPath: state.PLP.prevPath,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleBreadcrumbs: (areBreadcrumbsVisible) =>
    dispatch(toggleBreadcrumbs(areBreadcrumbsVisible)),
  setGender: (gender) => dispatch(setGender(gender)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
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
  };

  constructor(props) {
    super(props);

    // this.requestDynamicContent();
  }

  componentDidMount() {
    const {
      location: { state },
      prevPath= null,
    } = this.props;
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
  }

  componentDidUpdate(prevProps) {
    const { gender: prevGender } = prevProps;
    const { gender, toggleBreadcrumbs } = this.props;

    toggleBreadcrumbs(false);

    if (gender !== prevGender) {
      this.setMetaData(gender);
      this.requestDynamicContent(true, gender);
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
      const dynamicContent = await getStaticFile(
        HOME_STATIC_FILE_KEY,
        { $FILE_NAME: `${devicePrefix}${gender}.json` }
        // { $FILE_NAME: `http://mobilecdn.6thstreet.com/resources/20190121/en-ae/women.json` }
      );

      this.setState({
        dynamicContent: Array.isArray(dynamicContent) ? dynamicContent : [],
        isLoading: false,
      });
    } catch (e) {
      // TODO: handle error
      Logger.log(e);
    }

    // // TODO remove this try catch block after development
    // try {
    //   const response = await (await this.fetchDataFromLocal()).json();
    //   const dynamicContent = response.data ? response.data : [];
    //   this.setState({
    //     dynamicContent: Array.isArray(dynamicContent) ? dynamicContent : [],
    //     isLoading: false,
    //   });
    // } catch (error) {
    //   Logger.log(e);
    // }
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

  render() {
    return (
      <HomePage
        {...this.containerFunctions}
        {...this.containerProps()}
        abc={this.props}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePageContainer)
);
