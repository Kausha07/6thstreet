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
import BrowserDatabase from "Util/BrowserDatabase";
import { getCookie } from "Util/Url/Url";
import Event, { EVENT_PAGE_LOAD } from "Util/Event";
import Influencer from "../Influencer/index";
import { getUUIDToken } from "Util/Auth";
import VueQuery from "../../query/Vue.query";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";

import {
  deleteAuthorizationToken,
  deleteMobileAuthorizationToken,
  getAuthorizationToken,
  getMobileAuthorizationToken,
  isSignedIn,
  setAuthorizationToken,
  setMobileAuthorizationToken,
} from "Util/Auth";

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  country: state.AppState.country,
  lastHomeItem: state.PLP.lastHomeItem,
  config: state.AppConfig.config,
  prevPath: state.PLP.prevPath,
  VueTrendingBrandsEnable: state.MyAccountReducer.VueTrendingBrandsEnable,
  vueTrendingBrandsUserID: state.MyAccountReducer.vueTrendingBrandsUserID,
});

export const MyAccountDispatcher = import(
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapDispatchToProps = (dispatch) => ({
  toggleBreadcrumbs: (areBreadcrumbsVisible) =>
    dispatch(toggleBreadcrumbs(areBreadcrumbsVisible)),
  setGender: (gender) => dispatch(setGender(gender)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
  setLastTapItemOnHome: (item) => dispatch(setLastTapItemOnHome(item)),
  requestCustomerData: (login) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch, login)
    ),
  logout: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.logout(null, dispatch)
    ),
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
    requestCustomerData: PropTypes.func.isRequired,
  };

  state = {
    dynamicContent: [],
    trendingBrands : [],
    trendingCategories : [],
    isLoading: true,
    defaultGender: "women",
    isMobile: isMobile.any(),
    firstLoad: true,
    vueBrandsNumOfResults: 10,
    vueCategoriesNumOfResults: 10,
    imageUrl: "",
    metaTitle: "",
    metaDesc: "",
  };

  constructor(props) {
    super(props);
    window.history.scrollRestoration = "manual";
  }

  componentDidMount() {
    const { prevPath = null, requestCustomerData, logout } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    this.getTrendingBrands();
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

    const decodedParams = atob(decodeURIComponent(getCookie("authData")));

    if (
      decodedParams.match("mobileToken") &&
      decodedParams.match("authToken")
    ) {
      const params = decodedParams.split("&").reduce((acc, param) => {
        acc[param.substr(0, param.indexOf("="))] = param.substr(
          param.indexOf("=") + 1
        );
        return acc;
      }, {});

      const { mobileToken } = params;
      const { authToken } = params;

      if (isSignedIn()) {
        if (
          getMobileAuthorizationToken() === mobileToken &&
          getAuthorizationToken() === authToken
        ) {
          requestCustomerData(true);
        } else {
          deleteAuthorizationToken();
          deleteMobileAuthorizationToken();
        }
      } else {
        setMobileAuthorizationToken(mobileToken);
        setAuthorizationToken(authToken);

        requestCustomerData().then(() => {
          window.location.reload();
        });
      }
    } else {
      const cartID = BrowserDatabase.getItem("CART_ID_CACHE_KEY");
      if (cartID === parseInt(cartID, 10)) {
        logout();
      }
    }

    const { gender, toggleBreadcrumbs } = this.props;
    toggleBreadcrumbs(false);
    this.setMetaData(gender);
    this.requestDynamicContent(true, gender);
    this.setSchemaJSON();
    Event.dispatch(EVENT_PAGE_LOAD);
  }

  requestCustomerData() {
    const { requestCustomerData } = this.props;

    requestCustomerData();
  }

  componentDidUpdate(prevProps) {
    const { gender: prevGender } = prevProps;
    const { gender, toggleBreadcrumbs, lastHomeItem } = this.props;

    toggleBreadcrumbs(false);

    if (gender !== prevGender) {
      this.setMetaData(gender);
      this.requestDynamicContent(true, gender);
    }

    if (this.props.VueTrendingBrandsEnable !== prevProps.VueTrendingBrandsEnable) {
      this.getTrendingBrands();
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

  getMainBannerForMeta() {
    const { dynamicContent } = this.state;

    for (const banners of dynamicContent) {
      if (
        banners.type === "fullWidthBannerSlider" &&
        banners.items?.[0] &&
        banners.items?.[0]?.url
      ) {
        this.setState({imageUrl: banners.items?.[0]?.url})
        return;
      }
    }
    return;
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
    const countryNameConfig =
      countryName == "Saudi Arabia" ? "KSA" : countryName;

    const homePageMetaTitle =
      pagePathName == "/"
        ? __(
            "Online Shopping @ 6thStreet %s | Fashion & Lifestyle Brands for Women, Men & Kids",
            countryNameConfig
          )
        : pagePathName == "/women.html"
        ? __(
            "6thStreet Online Shopping for Women - Get Fashionable from Biggest Brands in %s",
            countryNameConfig
          )
        : pagePathName == "/men.html"
        ? __(
            "6thStreet Online Shopping for Men - Get Fashionable from Biggest Brands in %s",
            countryNameConfig
          )
        : pagePathName == "/kids.html"
        ? __(
            "6thStreet Online Shopping for Kids - Get Fashionable from Biggest Brands in %s",
            countryNameConfig
          )
        : pagePathName == "/home.html"
        ? __(
            "6thStreet Online Shopping for Your Home - Get Fancy from Biggest Brands in %s",
            countryNameConfig
          )
        : pagePathName == "/influencer.html"
        ? __(
            "6thStreet Online Shopping With Influencer - Get Styling Tips from Biggest Influencers in %s",
            countryNameConfig
          )
        : __(
            "Online Shopping @ 6thStreet %s | Fashion & Lifestyle Brands for Women, Men & Kids",
            countryNameConfig
          );
    const homepageMetaDesc =
      pagePathName == "/"
        ? __(
            // eslint-disable-next-line max-len
            "6thStreet.com, an online shopping site for fashion & lifestyle brands in the %s. Find top brands offering footwear, clothing, accessories & lifestyle products for women, men & kids.",
            countryName
          )
        : pagePathName == "/women.html"
        ? __(
            // eslint-disable-next-line max-len
            "Shop for Women from top brands in %s such as Aldo, Ardene, Charles and Keith, BHPC and more. Get biggest collection of Shoes, Clothing, Bags & more with best deals. ✅ Free Delivery on minimum order",
            countryName
          )
        : pagePathName == "/men.html"
        ? __(
            // eslint-disable-next-line max-len
            "Shop for Men from top brands in %s such as BHPC, Levis, Skechers, Tommy and more. Get biggest collection of Shoes, Clothing, Bags & more with best deals. ✅ Free Delivery on minimum order",
            countryName
          )
        : pagePathName == "/kids.html"
        ? __(
            // eslint-disable-next-line max-len
            "Shop for Kids from top brands in %s such as R&B kids, Levis, LC Waikiki and more. Get biggest collection of Shoes, Clothing, Bags & more with best deals . ✅ Free Delivery on minimum order",
            countryName
          )
        : pagePathName == "/home.html"
        ? __(
            "Shop for Your Home from top brands in %s such as Lakeland, Fissman, Marks and Spencers, Hema and more. Get biggest collection of Shoes, Clothing, Bags & more with best deals . ✅ Free Delivery on minimum order",
            countryName
          )
        : pagePathName == "/influencer.html"
        ? __(
            // eslint-disable-next-line max-len
            "Shop with Influencers from top brands in %s such as Trendyol, BHPC, LC Waikiki, Aldo and more. Get biggest collection of Shoes, Clothing, Bags & more with best deals . ✅ Free Delivery on minimum order",
            countryName
          )
        : __(
            // eslint-disable-next-line max-len
            "Shop for %s fashion brands in %s. Exclusive collection of shoes, clothing, bags, grooming - Online Shopping ✯ Free Delivery ✯ COD ✯ 100% original brands - 6thStreet",
            genderName,
            countryName
          );
    this.setState({ metaTitle: homePageMetaTitle, metaDesc: homepageMetaDesc });
    setMeta({
      title: homePageMetaTitle,
      keywords: __(
        "online shopping for %s, %s online shopping, %s",
        ...Array(2).fill(genderName),
        countryName
      ),
      description: homepageMetaDesc,
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

  getTrendingBrands = () => {
    const { gender, vueTrendingBrandsUserID } = this.props;
    const { vueBrandsNumOfResults, vueCategoriesNumOfResults } = this.state;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const customer = BrowserDatabase.getItem("customer");
    const userID = vueTrendingBrandsUserID
      ? vueTrendingBrandsUserID
      : customer && customer.id
      ? customer.id
      : null;
    const newPersonalizedWidgetsTypes = ["vue_trending_brands","vue_trending_categories"];
    newPersonalizedWidgetsTypes.map(async(element)=>{
      const query = {
        filters: [],
        fields : ["title", "image_link", "product_id", "price", "discounted_price", "currency_code", "brand", "ontology", "gender", "custom_label_1", "custom_label_2", "category", "link"],
        num_results: element === "vue_trending_brands" ? vueBrandsNumOfResults : vueCategoriesNumOfResults,
        user_id:userID,
        product_id: "",
        mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
        widget_type : element
      };
  
      const payload = VueQuery.buildQuery(element, query, {
        gender,
        userID
      });
      try {
        await fetchVueData(payload)
          .then((resp) => {
            if(element === "vue_trending_brands"){
              this.setState({
                trendingBrands: resp?.data?.data[0],
              });
            }else {
              this.setState({
                trendingCategories: resp?.data?.data[0],
              });
            }
          })
          .catch((err) => {
            console.error("vue query catch", err);
          });
      } catch (e) {
        Logger.log(e);
      }
    })
  }

  async requestDynamicContent(isUpdate = false) {
    const { gender } = this.props;
    const devicePrefix = this.getDevicePrefix();
    if (isUpdate) {
      // Only set loading if this is an update
      this.setState({ isLoading: true });
    }
    if (gender !== "influencer") {
      try {
        const dynamicContent = await getStaticFile(HOME_STATIC_FILE_KEY, {
          $FILE_NAME: `${devicePrefix}${gender}.json`,
        });
        this.setState({
          dynamicContent: Array.isArray(dynamicContent) ? dynamicContent : [],
          isLoading: false,
        });
        this.getMainBannerForMeta();
        dynamicContent?.map((e) => {
          const { type } = e;
          if (type === "vue_brands_for_you") {
            this.setState({ vueBrandsNumOfResults: e?.query?.num_results });
          } else if (type === "vue_categories_for_you") {
            this.setState({ vueCategoriesNumOfResults: e?.query?.num_results });
          }
        });
      } catch (e) {
        Logger.log(e);
      }
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
          // document
          //   .querySelectorAll("script[type='application/ld+json']")
          //   .forEach((node) => node.remove());
          document.head.appendChild(tag);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  containerProps = () => {
    const { gender } = this.props;
    const { dynamicContent, isLoading, imageUrl, metaTitle, metaDesc } =
      this.state;

    return {
      dynamicContent,
      isLoading,
      gender,
      imageUrl,
      metaTitle,
      metaDesc,
    };
  };

  setLastTapItem = (item) => {
    this.props.setLastTapItemOnHome(item);
  };

  render() {
    const { trendingBrands = [], trendingCategories = [], metaTitle } = this.state;
    if (this.props.gender === "influencer") {
      return <Influencer metaTitle={metaTitle}  />;
    }
    return (
      <HomePage
        {...this.containerFunctions}
        {...this.containerProps()}
        setLastTapItem={this.setLastTapItem}
        HomepageProps={this.props}
        vue_trending_brands={trendingBrands}
        vue_trending_categories={trendingCategories}
        getTrendingBrands={this.getTrendingBrands}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePageContainer)
);
