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
});

export class PLPContainer extends PureComponent {
  static propTypes = {
    gender: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    requestProductList: PropTypes.func.isRequired,
    requestProductListPage: PropTypes.func.isRequired,
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

  static getDerivedStateFromProps(props, state) {
    const { pages } = props;
    const requestOptions = PLPContainer.getRequestOptions();
    const { page, ...restOptions } = requestOptions;
    const {
      prevRequestOptions: { page: prevPage, ...prevRestOptions },
    } = state;

    if (JSON.stringify(restOptions) !== JSON.stringify(prevRestOptions)) {
      // if queries match (excluding pages) => not inital
      PLPContainer.requestProductList(props);
    } else if (page !== prevPage && !pages[page]) {
      // if only page has changed, and it is not yet loaded => request that page
      PLPContainer.requestProductListPage(props);
    }

    return {
      prevRequestOptions: requestOptions,
    };
  }

  static getRequestOptions() {
    let params;
    if (location.search && location.search.startsWith('?q')) {
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
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
  };

  constructor(props) {
    super(props);

    if (this.getIsLoading()) {
      PLPContainer.requestProductList(props);
    }

    this.setMetaData();
  }

  componentDidMount() {
    const { menuCategories = [] } = this.props;
    if (menuCategories.length !== 0) {
      this.updateBreadcrumbs();
      this.setMetaData();
      this.updateHeaderState();
    }
  }

  componentDidUpdate() {
    const { isLoading, setIsLoading, menuCategories = [] } = this.props;
    const { isLoading: isCategoriesLoading } = this.state;
    const currentIsLoading = this.getIsLoading();

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
        "%s for %s | 6thStreet.com %s",
        categoryName,
        genderName,
        countryName
      ),
      keywords: __(
        "%s, %s, online shopping, %s, free shipping, returns",
        categoryName,
        genderName,
        countryName
      ),
      description: __(
        "Shop %s for %s Online in %s | Free shipping and returns | 6thStreet.com %s",
        categoryName,
        genderName,
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
      brandDescription,
      brandImg,
      brandName,
      query,
      plpWidgetData,
      gender,
    } = this.props;

    // isDisabled: this._getIsDisabled()
    return {
      brandDescription,
      brandImg,
      brandName,
      query,
      plpWidgetData,
      gender,
    };
  };

  render() {
    const { requestedOptions } = this.props;
    localStorage.setItem("CATEGORY_NAME", JSON.stringify(requestedOptions.q));
    return <PLP {...this.containerFunctions} {...this.containerProps()} />;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PLPContainer)
);
