import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setGender } from "Store/AppState/AppState.action";
import { updateMeta } from "Store/Meta/Meta.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { setPLPLoading } from "Store/PLP/PLP.action";
import PLPDispatcher from "Store/PLP/PLP.dispatcher";
import { getCountriesForSelect } from "Util/API/endpoint/Config/Config.format";
import {
  Filters,
  Pages,
  RequestedOptions,
} from "Util/API/endpoint/Product/Product.type";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { capitalize } from "Util/App";
import {
  getBreadcrumbs,
  getBreadcrumbsUrl,
} from "Util/Breadcrumbs/Breadcrubms";
import PLP from "./PLP.component";
import { isArabic } from "Util/App";
import Algolia from "Util/API/provider/Algolia";
import { deepCopy } from "../../../packages/algolia-sdk/app/utils";
import browserHistory from "Util/History";

export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  locale: state.AppState.locale,
  requestedOptions: state.PLP.options,
  isLoading: state.PLP.isLoading,
  pages: state.PLP.pages,
  filters: state.PLP.filters,
  options: state.PLP.options,
  country: state.AppState.country,
  config: state.AppConfig.config,
  menuCategories: state.MenuReducer.categories,
  plpWidgetData: state.PLP.plpWidgetData,
});

export const mapDispatchToProps = (dispatch, state) => ({
  requestProductList: (options) =>
    PLPDispatcher.requestProductList(options, dispatch, state),
  requestProductListPage: (options) =>
    PLPDispatcher.requestProductListPage(options, dispatch),
  setInitialPLPFilter: (initialOptions) =>
    PLPDispatcher.setInitialPLPFilter(initialOptions, dispatch, state),
  setIsLoading: (isLoading) => dispatch(setPLPLoading(isLoading)),
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  setGender: (gender) => dispatch(setGender(gender)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
  resetPLPData: () => PLPDispatcher.resetPLPData(dispatch),
});

export class PLPContainer extends PureComponent {
  static propTypes = {
    gender: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    requestProductList: PropTypes.func.isRequired,
    requestProductListPage: PropTypes.func.isRequired,
    setInitialPLPFilter: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    requestedOptions: RequestedOptions.isRequired,
    pages: Pages.isRequired,
    updateBreadcrumbs: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
    setGender: PropTypes.func.isRequired,
    filters: Filters.isRequired,
    options: PropTypes.object.isRequired,
    setMeta: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    menuCategories: PropTypes.array.isRequired,
    brandDeascription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  static requestProductList = PLPContainer.request.bind({}, false);

  static requestProductListPage = PLPContainer.request.bind({}, true);

  compareObjects(object1 = {}, object2 = {}) {
    if (Object.keys(object1).length === Object.keys(object2).length) {
      const isEqual = Object.entries(object1).reduce((acc, key) => {
        if (object2[key[0]]) {
          if (key[0] === "discount") {
            if (JSON.stringify(key[1]) !== JSON.stringify(object2[key[0]])) {
              acc.push(0);
            } else {
              acc.push(1);
            }
          } else {
            if (key[1].length !== object2[key[0]].length) {
              acc.push(0);
            } else {
              acc.push(1);
            }
          }
        } else {
          acc.push(1);
        }

        return acc;
      }, []);

      return !isEqual.includes(0);
    }

    return false;
  }

  static getRequestOptions() {
    let params;
    if (location.search && location.search.startsWith("?q")) {
      const { params: parsedParams } = WebUrlParser.parsePLP(location.href);
      params = parsedParams;
    } else {
      const { params: parsedParams } = WebUrlParser.parsePLPWithoutQuery(
        location.href
      );
      params = parsedParams;
    }
    return params;
  }

  static async request(isPage, props) {
    const { requestProductList, requestProductListPage } = props;
    const options = PLPContainer.getRequestOptions();

    const requestFunction = isPage
      ? requestProductListPage
      : requestProductList;
    requestFunction({ options });
  }

  state = {
    prevRequestOptions: PLPContainer.getRequestOptions(),
    brandDescription: "",
    brandImg: "",
    brandName: "",
    isArabic: isArabic(),
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
    resetPLPData: this.resetPLPData.bind(this),
    compareObjects: this.compareObjects.bind(this),
  };

  resetPLPData() {
    const { resetPLPData } = this.props;
    resetPLPData();
  }

  constructor(props) {
    super(props);
    const url = new URL(location.href.replace(/%20&%20/gi, "%20%26%20"));
    if (url.search.includes("?q=")) {
      url.searchParams.set("p", 0);
      // update the URL, preserve the state
      const { pathname, search } = url;
      browserHistory.replace(pathname + search);
    }
    if (this.getIsLoading()) {
      // this.props.setInitialPLPFilter({ initialOptions });
      PLPContainer.requestProductList(this.props);
    }
    this.setMetaData();
  }

  getInitialOptions = (options) => {
    const optionArr = ["categories.level1", "page", "q", "visibility_catalog"];
    let initialOptions = {};
    Object.keys(options).map((key) => {
      if (optionArr.includes(key)) {
        initialOptions[key] = options[key];
      }
    });
    return initialOptions;
  };

  componentDidMount() {
    const { menuCategories = [] } = this.props;
    const { isArabic } = this.state;
    if (menuCategories.length !== 0) {
      this.updateBreadcrumbs();
      this.setMetaData();
      this.updateHeaderState();
    }
    this.getBrandDetails();
  }

  async getBrandDetails() {
    const brandName = location.pathname
      .split(".html")[0]
      .substring(1)
      .split("/")?.[0];
    const data = await new Algolia({
      index: "brands_info",
    }).getBrandsDetails({
      query: brandName,
      limit: 1,
    });
    this.setState({
      brandDescription: isArabic() ? data?.hits[0]?.description_ar : data?.hits[0]?.description,
      brandImg: data?.hits[0]?.image,
      brandName: isArabic() ? data?.hits[0]?.name_ar : data?.hits[0]?.name,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, setIsLoading, menuCategories = [] } = this.props;
    const { isLoading: isCategoriesLoading } = this.state;
    const currentIsLoading = this.getIsLoading();
    const requestOptions = PLPContainer.getRequestOptions();
    const { pages } = this.props;
    const { page } = requestOptions;
    const {
      prevRequestOptions: { page: prevPage },
    } = this.state;
    // update loading from here, validate for last
    // options recieved results from
    if (
      isLoading !== currentIsLoading ||
      isCategoriesLoading !== currentIsLoading
    ) {
      setIsLoading(currentIsLoading);
    }

    if (menuCategories.length !== 0) {
      this.updateBreadcrumbs();
      this.setMetaData();
      this.updateHeaderState();
    }

    let comparableRequestOptions = deepCopy(requestOptions);
    if (comparableRequestOptions) {
      delete comparableRequestOptions.page;
    }
    let comparablePrevRequestOptions = deepCopy(this.state.prevRequestOptions);
    if (comparablePrevRequestOptions) {
      delete comparablePrevRequestOptions.page;
    }

    if (
      (page === prevPage &&
        !this.compareObjects(
          comparableRequestOptions,
          comparablePrevRequestOptions
        )) ||
      (page !== prevPage &&
        !this.compareObjects(
          comparableRequestOptions,
          comparablePrevRequestOptions
        ))
    ) {
      PLPContainer.requestProductList(this.props);
      this.setState({ prevRequestOptions: requestOptions });
    } else if (page !== prevPage && !pages[page]) {
      // if only page has changed, and it is not yet loaded => request that page
      PLPContainer.requestProductListPage(this.props);
      this.setState({ prevRequestOptions: requestOptions });
    }
  }

  capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
      options: { q: query },
      options,
      menuCategories,
    } = this.props;
    if (query) {
      const { updateBreadcrumbs, setGender } = this.props;
      const breadcrumbLevels = options["categories.level4"]
        ? options["categories.level4"]
        : options["categories.level3"]
        ? options["categories.level3"]
        : options["categories.level2"]
        ? options["categories.level2"]
        : options["categories.level1"]
        ? options["categories.level1"]
        : options["q"];

      if (breadcrumbLevels) {
        const levelArray = breadcrumbLevels.split(" /// ") || [];
        const urlArray = getBreadcrumbsUrl(levelArray, menuCategories) || [];
        if (urlArray.length === 0) {
          levelArray.map(() => urlArray.push("/"));
        }
        const breadcrumbsMapped =
          getBreadcrumbs(levelArray, setGender, urlArray) || [];
        const productListBreadcrumbs = breadcrumbsMapped.reduce((acc, item) => {
          acc.unshift(item);

          return acc;
        }, []);

        updateBreadcrumbs(productListBreadcrumbs);
      } else {
        const breadcrumbs = [
          {
            url: "/",
            name: options["categories.level0"],
          },
        ];

        updateBreadcrumbs(breadcrumbs);
      }
    }
  }

  setMetaData() {
    const {
      setMeta,
      country,
      config,
      requestedOptions: { q } = {},
      gender,
    } = this.props;

    if (!q) {
      return;
    }

    const genderName = capitalize(gender);
    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};
    const breadcrumbs = location.pathname
      .split(".html")[0]
      .substring(1)
      .split("/");
    const categoryName = capitalize(breadcrumbs.pop() || "");

    setMeta({
      title: __(
        "%s | 6thStreet.com %s",
        categoryName,
        countryName
      ),
      keywords: __(
        "%s, online shopping, %s, free shipping, returns",
        categoryName,
        countryName
      ),
      description: __(
        "Shop %s Online in %s | Free shipping and returns | 6thStreet.com %s",
        categoryName,
        countryName,
        countryName
      ),
    });
  }

  getIsLoading() {
    const { requestedOptions } = this.props;

    const options = PLPContainer.getRequestOptions();
    const {
      // eslint-disable-next-line no-unused-vars
      page: requestedPage,
      ...requestedRestOptions
    } = requestedOptions;

    const {
      // eslint-disable-next-line no-unused-vars
      page,
      ...restOptions
    } = options;

    // If requested options are not matching requested options -> we are loading
    // we also ignore pages, this is handled by PLPPages
    return JSON.stringify(requestedRestOptions) !== JSON.stringify(restOptions);
  }

  containerProps = () => {
    const {     
      query,
      plpWidgetData,
      gender,
      filters,
      pages,
    } = this.props;

    const brandDescription = this.state.brandDescription;
    const brandImg = this.state.brandImg;
    const brandName = this.state.brandName;

    // isDisabled: this._getIsDisabled()

    return {
      brandDescription,
      brandImg,
      brandName,
      query,
      plpWidgetData,
      gender,
      filters,
      pages,
    };
  };

  render() {
    const { requestedOptions, filters } = this.props;
    localStorage.setItem("CATEGORY_NAME", JSON.stringify(requestedOptions.q));
    return <PLP {...this.containerFunctions} {...this.containerProps()} />;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PLPContainer)
);
