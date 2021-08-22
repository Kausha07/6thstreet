import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
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
import Event, { EVENT_GTM_PRODUCT_DETAIL, VUE_PAGE_VIEW } from "Util/Event";
import PDP from "./PDP.component";

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
});

export const mapDispatchToProps = (dispatch) => ({
  requestProduct: (options) => PDPDispatcher.requestProduct(options, dispatch),
  requestProductBySku: (options) => PDPDispatcher.requestProductBySku(options, dispatch),
  getClickAndCollectStores: (brandName, sku, latitude, longitude) => PDPDispatcher.getClickAndCollectStores(brandName, sku, latitude, longitude, dispatch),
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
    nbHits: 0,
    sku: "",
  };

  state = {
    productSku: null,
  };

  constructor(props) {
    super(props);
    this.requestProduct();
  }

  componentDidMount() {
    const {
      product: { product_type_6s, sku },
    } = this.props;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "pdp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: "desktop",
        sourceProdID: sku,
        sourceCatgID: product_type_6s, // TODO: replace with category id
      },
    });
  }

  componentDidUpdate(prevProps) {
    const {
      id,
      isLoading,
      setIsLoading,
      product: { sku, brand_name: brandName, } = {},
      product,
      menuCategories = [],
      getClickAndCollectStores
    } = this.props;
    const currentIsLoading = this.getIsLoading();
    const { id: prevId } = prevProps;
    const { productSku } = this.state;

    // Request product, if URL rewrite has changed
    if (id !== prevId) {
      this.requestProduct();
    }

    // Update loading from here, validate for last options recieved results from
    if (isLoading !== currentIsLoading) {
      setIsLoading(false);
    }

    if (menuCategories.length !== 0 && sku && productSku !== sku) {
      this.updateBreadcrumbs();
      this.setMetaData();
      this.updateHeaderState();
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => getClickAndCollectStores(brandName, sku, coords?.latitude, coords?.longitude),
        (err) => console.error(err),
        {
          enableHighAccuracy: true
        }
      )
    }

    Event.dispatch(EVENT_GTM_PRODUCT_DETAIL, {
      product: product,
    });
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
      product: { categories = {}, name, sku },
      setGender,
      nbHits,
      menuCategories,
    } = this.props;

    if (nbHits === 1) {
      const rawCategoriesLastLevel =
        categories[
          Object.keys(categories)[Object.keys(categories).length - 1]
        ][0];
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
        ...productBreadcrumbs
      ];

      updateBreadcrumbs(breadcrumbs);
      this.setState({ productSku: sku });
    }
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
      } = {},
    } = this.props;

    if (!name) {
      return;
    }

    const countryList = getCountriesForSelect(config);
    const { label: countryName = "" } =
      countryList.find((obj) => obj.id === country) || {};

    setMeta({
      title: __("%s %s | 6thStreet.com %s", brandName, name, countryName),
      keywords: __(
        "%s, %s, %s, Online Shopping %s",
        brandName,
        name,
        categories_without_path.join(" "),
        countryName
      ),
      description: `${description} | ${__(
        "Shop %s %s Online in %s. Discover the latest collection from %s. Free shipping and returns.",
        brandName,
        name,
        countryName,
        brandName
      )}`,
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
    const { nbHits, isLoading, brandDescription, brandImg, brandName } =
      this.props;

    const { isLoading: isCategoryLoading } = this.state;

    return {
      nbHits,
      isLoading,
      isCategoryLoading,
      brandDescription,
      brandImg,
      brandName,
    };
  };

  render() {
    const { product } = this.props;
    localStorage.setItem("PRODUCT_NAME", JSON.stringify(product.name));
    return <PDP {...this.containerProps()} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);
