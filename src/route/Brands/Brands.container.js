import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { updateMeta } from "Store/Meta/Meta.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import { HistoryType, LocationType } from "Type/Common";
import { groupByName } from "Util/API/endpoint/Brands/Brands.format";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getQueryParam, setQueryParams } from "Util/Url";
import { getCountryFromUrl } from "Util/Url/Url";
import Brands from "./Brands.component";
import { TYPES_ARRAY } from "./Brands.config";

export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
  showErrorNotification: (message) =>
    dispatch(showNotification("error", message)),
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  setMeta: (meta) => dispatch(updateMeta(meta)),
});

class BrandsContainer extends PureComponent {
  static propTypes = {
    history: HistoryType.isRequired,
    location: LocationType.isRequired,
    showErrorNotification: PropTypes.func.isRequired,
    updateBreadcrumbs: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  };

  state = {
    brands: [],
    isLoading: true,
    brandMapping: [],
    isArabic: isArabic(),
  };

  containerFunctions = {
    changeBrandType: this.changeBrandType.bind(this),
  };

  componentDidMount() {
    const brandUrlParam = getQueryParam("type", location);
    const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam : "";

    this.requestBrandMapping();
    this.requestBrands(brandType);
    this.updateBreadcrumbs();
    this.updateHeaderState();
    this.setMetaData();
  }

  requestBrandMapping = () => {
    let brandMapping = this.getBrandMappingData();
  };

  getBrandMappingData() {
    const apiUrl = "/cdn/config/brandswithUrl.json";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        let ret = {};
        this.setState(
          {
            brandMapping: data.brands,
          }
        );
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
    const { updateBreadcrumbs } = this.props;
    const breadcrumbs = [
      {
        url: "",
        name: __("Brands"),
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  }

  changeBrandType(brandUrlParam) {
    const { location, history } = this.props;
    const { isArabic } = this.state;
    const brandType = TYPES_ARRAY.includes(brandUrlParam) ? brandUrlParam : "";
    const genderType = isArabic ? getGenderInArabic(brandType) : brandType;
    setQueryParams({ type: brandType }, location, history);
    this.requestBrands(genderType);
  }

  requestBrands(brandType = "") {
    const { showErrorNotification } = this.props;
    this.setState({ isLoading: true });
    this._brandRequest = new Algolia()
      .getBrands(brandType)
      .then((data) => {
        const groupedBrands = groupByName(data) || {};
        // This sort places numeric brands to the end of the list
        const sortedBrands = Object.entries(groupedBrands).sort(
          ([letter1], [letter2]) => {
            if (letter1 === "0-9") {
              return 1;
            }

            if (letter2 === "0-9") {
              return -1;
            }

            return letter1 - letter2;
          }
        );
        this.setState({
          brands: sortedBrands,
          isLoading: false,
        });
      })
      .catch((error) => showErrorNotification(error));
  }

  containerProps = () => {
    const { brands, isLoading, brandMapping } = this.state;
    return {
      brands,
      isLoading,
      brandMapping,
      type: getQueryParam("type", location),
    };
  };

  setMetaData() {
    const { setMeta } = this.props;
    setMeta({
      title: __("Brands | 6thStreet"),
      keywords: __("brands"),
      description: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Buy & Explore your favourite brands ✯ Free Recieving ✯ Cash On Recieving ✯ 100% original brands | 6thStreet."
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
        ),
      twitter_title: __("Brands | 6thStreet"),
      twitter_desc: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Buy & Explore your favourite brands ✯ Free Recieving ✯ Cash On Recieving ✯ 100% original brands | 6thStreet."
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
        ),
      og_title: __("Brands | 6thStreet"),
      og_desc: getCountryFromUrl() === 'QA' ? __(
        // eslint-disable-next-line max-len
        "Buy & Explore your favourite brands ✯ Free Recieving ✯ Cash On Recieving ✯ 100% original brands | 6thStreet."
      )
        :
        __(
          // eslint-disable-next-line max-len
          "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
        ),
    });
  }

  render() {
    return <Brands {...this.containerFunctions} {...this.containerProps()} />;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BrandsContainer)
);
