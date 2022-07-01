import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setGender } from "Store/AppState/AppState.action";
import { updateMeta } from "Store/Meta/Meta.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { setPDPLoading } from "Store/PDP/PDP.action";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { getUUID } from "Util/Auth";
import {
  getBreadcrumbs,
  getBreadcrumbsUrl,
} from "Util/Breadcrumbs/Breadcrubms";
import Event, {
  EVENT_GTM_PRODUCT_DETAIL,
  VUE_PAGE_VIEW,
  EVENT_MOE_PRODUCT_DETAIL,
} from "Util/Event";
import PDP from "./PDP.component";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import browserHistory from "Util/History";
import { getCurrency } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";

export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  isLoading: state.PDP.isLoading,
  product: state.PDP.product,
  clickAndCollectStores: state.PDP.clickAndCollectStores,
  options: state.PDP.options,
  nbHits: state.PDP.nbHits,
  country: state.AppState.country,
  gender: state.AppState.gender,
  config: state.AppConfig.config,
  breadcrumbs: state.BreadcrumbsReducer.breadcrumbs,
  menuCategories: state.MenuReducer.categories,
  prevPath: state.PLP.prevPath,
  pdpWidgetsData: state.AppState.pdpWidgetsData,
});

export const mapDispatchToProps = (dispatch) => ({
  requestPdpWidgetData: () => PDPDispatcher.requestPdpWidgetData(dispatch),
  requestProduct: (options) => PDPDispatcher.requestProduct(options, dispatch),
  resetProduct: () => PDPDispatcher.resetProduct({}, dispatch),
  requestProductBySku: (options) =>
    PDPDispatcher.requestProductBySku(options, dispatch),
  getClickAndCollectStores: (brandName, sku, latitude, longitude) =>
    PDPDispatcher.getClickAndCollectStores(
      brandName,
      sku,
      latitude,
      longitude,
      dispatch
    ),
  setIsLoading: (isLoading) => dispatch(setPDPLoading(isLoading)),
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  setGender: (gender) => dispatch(setGender(gender)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
});

export class PDPContainer extends PureComponent {
  static propTypes = {
    options: PropTypes.shape({ id: PropTypes.number }).isRequired,
    requestProduct: PropTypes.func.isRequired,
    requestProductBySku: PropTypes.func.isRequired,
    getClickAndCollectStores: PropTypes.func.isRequired,
    clickAndCollectStores: PropTypes.object.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    product: Product.isRequired,
    id: PropTypes.number.isRequired,
    sku: PropTypes.string,
    updateBreadcrumbs: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
    setGender: PropTypes.func.isRequired,
    nbHits: PropTypes.number,
    setMeta: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    breadcrumbs: PropTypes.array.isRequired,
    gender: PropTypes.string.isRequired,
    menuCategories: PropTypes.array.isRequired,
    brandDeascription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
    categories_without_path: PropTypes.array,
    description: PropTypes.string,
  };

  static defaultProps = {
    // nbHits: 1,
    sku: "",
    isLoading: true,
  };

  state = {
    productSku: null,
    prevPathname: "",
    currentLocation: "",
  };

  constructor(props) {
    super(props);
    this.requestProduct();
  }

  componentDidMount() {
    const {
      requestPdpWidgetData,
      pdpWidgetsData,
      location: { pathname },
    } = this.props;
    if (!pdpWidgetsData || (pdpWidgetsData && pdpWidgetsData.length === 0)) {
      //request pdp widgets data only when not available in redux store.
      requestPdpWidgetData();
    }
    this.setState({ currentLocation: pathname });
  }

  componentDidUpdate(prevProps) {
    const {
      id,
      isLoading,
      setIsLoading,
      product: { product_type_6s, sku, brand_name: brandName, url, price } = {},
      product: { highlighted_attributes = [] },
      menuCategories = [],
    } = this.props;
    const currentIsLoading = this.getIsLoading();
    const { id: prevId } = prevProps;
    const { productSku, currentLocation } = this.state;

    // if (sku != undefined)
    if (productSku != sku && currentLocation === this.props.location.pathname) {
      this.renderVueHits();
    }

    // Request product, if URL rewrite has changed
    // if (id !== prevId) {
    //   this.requestProduct();
    // }
    // Update loading from here, validate for last options recieved results from
    // if (isLoading !== currentIsLoading) {
    //   console.log("isLoading on update",isLoading)
    //   setIsLoading(false);
    // }

    if (menuCategories.length !== 0 && sku && productSku !== sku) {
      this.updateBreadcrumbs();
      this.setMetaData();
      this.updateHeaderState();
      this.fetchClickAndCollectStores(brandName, sku);
    }
  }

  // componentWillUnmount() {
  //   const {resetProduct} =this.props;
  //   resetProduct();
  // }
  renderVueHits() {
    const {
      prevPath = null,
      product: { product_type_6s, sku, url, price },
    } = this.props;
    const itemPrice =
      price && price[0]
        ? price[0][Object.keys(price[0])[0]]["6s_special_price"]
        : price && Object.keys(price)[0] !== "0"
        ? price[Object.keys(price)[0]]["6s_special_price"]
        : null;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "pdp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath,
        url: window.location.href,
        sourceProdID: sku,
        sourceCatgID: product_type_6s, // TODO: replace with category id
        prodPrice: itemPrice,
      },
    });
  }

  fetchClickAndCollectStores(brandName, sku) {
    const { getClickAndCollectStores } = this.props;

    const options = {
      enableHighAccuracy: true,
    };

    const successCallback = ({ coords }) =>
      getClickAndCollectStores(
        brandName,
        sku,
        coords?.latitude,
        coords?.longitude
      );
    const errorCallback = (err) => console.error(err);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    }
  }

  updateHeaderState() {
    const { changeHeaderState } = this.props;

    changeHeaderState({
      name: DEFAULT_STATE_NAME,
      isHiddenOnMobile: true,
    });
  }

  updateBreadcrumbs() {
    const {
      updateBreadcrumbs,
      product: {
        categories = {},
        name,
        sku,
        image_url,
        url,
        product_type_6s,
        price,
        highlighted_attributes = [],
        size_eu = [],
        size_uk = [],
        size_us = [],
      },
      product,
      setGender,
      nbHits,
      menuCategories,
    } = this.props;
    console.log("product", product);
    if (nbHits === 1) {
      const rawCategoriesLastLevel =
        categories[
          Object.keys(categories)[Object.keys(categories).length - 1]
        ]?.[0];
      const categoriesLastLevel = rawCategoriesLastLevel
        ? rawCategoriesLastLevel.split(" /// ")
        : [];

      const urlArray =
        getBreadcrumbsUrl(categoriesLastLevel, menuCategories) || [];
      if (urlArray.length === 0) {
        categoriesLastLevel.map(() => urlArray.push("/"));
      }
      const breadcrumbsMapped =
        getBreadcrumbs(categoriesLastLevel, setGender, urlArray) || [];
      const productBreadcrumbs = breadcrumbsMapped.reduce((acc, item) => {
        acc.unshift(item);

        return acc;
      }, []);

      const breadcrumbs = [
        {
          url: "",
          name: __(name),
        },
        ...productBreadcrumbs,
      ];

      updateBreadcrumbs(breadcrumbs);
      this.setState({ productSku: sku });
    }
    const getDetails = highlighted_attributes.map((item) => ({
      [item.key]: item.value,
    }));
    const productKeys = Object.assign({}, ...getDetails);
    const specialPrice =
      price && price[0]
        ? price[0][Object.keys(price[0])[0]]["6s_special_price"]
        : price && Object.keys(price)[0] !== "0"
        ? price[Object.keys(price)[0]]["6s_special_price"]
        : null;
    const originalPrice =
      price && price[0]
        ? price[0][Object.keys(price[0])[0]]["6s_base_price"]
        : price && Object.keys(price)[0] !== "0"
        ? price[Object.keys(price)[0]]["6s_base_price"]
        : null;
    const checkCategoryLevel = () => {
      if (!categories) {
        return "this category";
      }
      if (categories.level4 && categories.level4.length > 0) {
        return categories.level4[0];
      } else if (categories.level3 && categories.level3.length > 0) {
        return categories.level3[0];
      } else if (categories.level2 && categories.level2.length > 0) {
        return categories.level2[0];
      } else if (categories.level1 && categories.level1.length > 0) {
        return categories.level1[0];
      } else if (categories.level0 && categories.level0.length > 0) {
        return categories.level0[0];
      } else return "";
    };
    const categoryLevel =
      product_type_6s && product_type_6s.length > 0
        ? product_type_6s
        : checkCategoryLevel().includes("///") == 1
        ? checkCategoryLevel().split("///").pop()
        : "";

    Event.dispatch(EVENT_GTM_PRODUCT_DETAIL, {
      product: {
        name: productKeys.name,
        id: sku,
        price: specialPrice || originalPrice,
        brand: productKeys?.brand_name,
        category: categoryLevel,
        varient: productKeys?.color || "",
      },
    });

    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)
      ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)
      : "";
    Moengage.track_event(EVENT_MOE_PRODUCT_DETAIL, {
      country: currentAppState.country.toUpperCase() || "",
      language: currentAppState.language.toUpperCase() || "",
      category: currentAppState.gender.toUpperCase() || "",
      subcategory: product_type_6s || categoryLevel,
      color: productKeys?.color || "",
      brand_name: productKeys?.brand_name || "",
      full_price: originalPrice || "",
      product_url: url,
      currency: getCurrency() || "",
      product_sku: sku || "",
      discounted_price: specialPrice || "",
      product_image_url: image_url || "",
      product_name: name || "",
    });
  }

  setMetaData() {
    const {
      setMeta,
      country,
      config,
      product: {
        brand_name: brandName,
        name,
        description,
        categories_without_path = [],
        color,
        categories,
      } = {},
    } = this.props;
    if (!name) {
      return;
    }
    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};

    const checkCategory = () => {
      if (!categories) {
        return "this category";
      }
      if (categories.level4 && categories.level4.length > 0) {
        return categories.level4[0];
      } else if (categories.level3 && categories.level3.length > 0) {
        return categories.level3[0];
      } else if (categories.level2 && categories.level2.length > 0) {
        return categories.level2[0];
      } else if (categories.level1 && categories.level1.length > 0) {
        return categories.level1[0];
      } else if (categories.level0 && categories.level0.length > 0) {
        return categories.level0[0];
      } else return "this category";
    };
    const categoryLevel = checkCategory().split("///").pop();
    const getTitle = () => {
      if (!color) {
        return __("Buy %s %s | 6thStreet %s", brandName, name, countryName);
      } else if (color == "Multi") {
        return __(
          "Buy %s %s in Multiple colors | 6thStreet %s",
          brandName,
          name,
          countryName
        );
      } else {
        return __(
          "Buy %s %s in %s | 6thStreet %s",
          brandName,
          name,
          color,
          countryName
        );
      }
    };

    const pdpMetaTitle = getTitle();
    const pdpMetaDescription = __(
      "Shop %s %s at best prices & deals on 6thStreet.com %s. Get top collection in %s with free delivery on minimum order & 100 days free return.",
      brandName,
      name,
      countryName,
      categoryLevel
    );
    setMeta({
      title: pdpMetaTitle,
      keywords: __(
        "%s, %s, %s, Online Shopping %s",
        brandName,
        name,
        categories_without_path.join(" "),
        countryName
      ),
      description: pdpMetaDescription,
      twitter_title: pdpMetaTitle,
      twitter_desc: pdpMetaDescription,
      og_title: pdpMetaTitle,
      og_desc: pdpMetaDescription,
    });
  }

  getIsLoading() {
    const {
      id,
      options: { id: requestedId },
    } = this.props;
    return id !== requestedId;
  }

  requestProduct() {
    const { requestProduct, requestProductBySku, id, setIsLoading, sku } =
      this.props;

    // ignore product request if there is no ID passed
    if (!id) {
      if (sku) {
        requestProductBySku({ options: { sku } });
        setIsLoading(false);
      }

      return;
    }

    requestProduct({ options: { id } });
  }

  containerProps = () => {
    const {
      nbHits,
      isLoading,
      brandDescription,
      brandImg,
      brandName,
      clickAndCollectStores,
    } = this.props;

    // const { isLoading: isCategoryLoading } = this.state;

    return {
      nbHits,
      isLoading,
      // isCategoryLoading : isLoading,
      brandDescription,
      brandImg,
      brandName,
      clickAndCollectStores,
    };
  };

  render() {
    const { product } = this.props;
    localStorage.setItem("PRODUCT_NAME", JSON.stringify(product.name));
    return <PDP {...this.containerProps()} {...this.props} />;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PDPContainer)
);
