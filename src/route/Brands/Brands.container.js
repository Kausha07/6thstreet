import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { TYPES_ARRAY } from "./Brands.config";
import { HistoryType, LocationType } from "Type/Common";
import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";

import { updateMeta } from "Store/Meta/Meta.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import { setLastTapItemOnHome } from "Store/PLP/PLP.action";

import { groupByName } from "Util/API/endpoint/Brands/Brands.format";
import Algolia from "Util/API/provider/Algolia";
import { isArabic } from "Util/App";
import { getCountryFromUrl } from "Util/Url/Url";
import isMobile from "Util/Mobile";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import { getAllBrands } from "Util/API/endpoint/Catalogue/Brand/Brand.endpoint";

import { DEFAULT_STATE_NAME } from "Component/NavigationAbstract/NavigationAbstract.config";
import Brands from "./Brands.component";

export const BreadcrumbsDispatcher = import(
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
  setLastTapItemOnHome: (item) => dispatch(setLastTapItemOnHome(item)),
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
    type: "",
    brandWidgetData: [],
  };

  containerFunctions = {
    changeBrandType: this.changeBrandType.bind(this),
  };

  getGenderInAR = (gender) => {
    switch (gender) {
      case "men":
        return "رجال";
      case "women":
        return "نساء";
      case "kids":
        return "أطفال";
      case "Girl":
        return "بنات";
      case "Boy":
        return "أولاد";
    }
  };
  getGenderInEn = (gender) => {
    switch (gender) {
      case "رجال":
        return "men";
      case "نساء":
        return "women";
      case "أطفال":
        return "kids";
      case "بنات":
        return "Girl";
      case "أولاد":
        return "Boy";
    }
  };

  componentDidMount() {
    const { isArabic } = this.state;
    const { location, history } = this.props;
    let brandType = "";
    location.pathname == "/shop-by-brands"
      ? (brandType = "")
      : (brandType = location.pathname.split("/")[1]);
    const genderTab = isArabic ? this.getGenderInAR(brandType) : brandType;
    const kidsGender = isArabic
      ? `${this.getGenderInAR("Boy")},${this.getGenderInAR("Girl")}`
      : "Boy,Girl";
    this.setState({ type: genderTab });
    this.requestShopByBrandWidgetData(brandType);
    this.requestShopbyBrands(brandType === "kids" ? kidsGender : genderTab);
    this.updateBreadcrumbs();
    this.updateHeaderState();
    this.setMetaData();
  }

  setLastTapItem = (item) => {
    this.props.setLastTapItemOnHome(item);
  };
  getDevicePrefix() {
    return isMobile.any() ? "m/" : "d/";
  }

  async requestShopByBrandWidgetData(brandType = "") {
    const { isArabic } = this.state;
    let gender = brandType;
    if (brandType == "") {
      gender = "all";
    }
    const devicePrefix = this.getDevicePrefix();
    if (gender) {
      try {
        const brandWidget = await getStaticFile(HOME_STATIC_FILE_KEY, {
          $FILE_NAME: `${devicePrefix}${gender}_shop_by_brand.json`,
        });
        if (Array.isArray(brandWidget)) {
          this.setState({ brandWidgetData: brandWidget || [] });
        } else {
          this.setState({ brandWidgetData: [] });
        }
      } catch (e) {
        this.setState({ brandWidgetData: [] });
        console.error(e);
      }
    } else {
      this.setState({ brandWidgetData: [] });
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
    const { updateBreadcrumbs } = this.props;
    const breadcrumbs = [
      {
        url: "",
        name: __("Shop by Brands"),
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
    let gender = isArabic ? this.getGenderInEn(brandType) : brandType;
    const kidsGender = isArabic
      ? `${this.getGenderInAR("Boy")},${this.getGenderInAR("Girl")}`
      : "Boy,Girl";
    gender
      ? history.push(`/${gender}/shop-by-brands`)
      : history.push(`/shop-by-brands`);
    this.requestShopByBrandWidgetData(gender);
    this.requestShopbyBrands(
      brandUrlParam === "kids" || brandUrlParam === "أطفال"
        ? kidsGender
        : brandType
    );
    this.setState({ type: brandType });
  }

  async requestShopbyBrands(gender) {
    try {
      const activeBrandsList = await this.requestBrands(gender);
        getAllBrands().then((brandResponse)=>{
          const groupedBrands = groupByName(brandResponse.result) || {};
          const sortedBrands = Object.entries(groupedBrands).sort(
            ([letter1], [letter2]) => {
              if (letter1 === "0-9") {
                return 1;
              }
              if (letter2 === "0-9") {
                return -1;
              }
              if (letter1 !== letter2) {
                if (letter1 < letter2) {
                  return -1;
                }
                return 1;
              }
            }
          );
          const activeBrands = [];
          sortedBrands.map((data) => {
            let filteredbrand = [];
            let combinedArr = [];
            Object.values(data[1]).filter((brand) => {
              const { name, name_ar } = brand;
              if (
                activeBrandsList.includes(name) ||
                activeBrandsList.includes(name_ar)
              ) {
                filteredbrand.push(brand);
              }
            });
            if (filteredbrand.length > 0) {
              combinedArr.push(data[0]);
              combinedArr.push(filteredbrand);
              activeBrands.push(combinedArr);
            }
          });
          this.setState({
            brands: activeBrands,
            isLoading: false,
          });
        })
      
    } catch (e) {
      this.setState({ brands: [] });
      console.error(e);
    }
  }

  async requestBrands(gender) {
    const { showErrorNotification } = this.props;
    this.setState({ isLoading: true });
    return new Algolia()
      .getBrands(gender)
      .then((data) => {
        return data;
      })
      .catch((error) => showErrorNotification(error));
  }

  containerProps = () => {
    const {
      brands,
      isLoading,
      brandMapping,
      type,
      brandWidgetData = [],
    } = this.state;
    return {
      brands,
      isLoading,
      brandMapping,
      type,
      brandWidgetData,
    };
  };

  setMetaData() {
    const { setMeta } = this.props;
    setMeta({
      title: __("Brands | 6thStreet"),
      keywords: __("brands"),
      description:
        getCountryFromUrl() === "QA"
          ? __(
              "Buy & Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet."
            )
          : __(
              "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
            ),
      twitter_title: __("Brands | 6thStreet"),
      twitter_desc:
        getCountryFromUrl() === "QA"
          ? __(
              "Buy & Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet."
            )
          : __(
              "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
            ),
      og_title: __("Brands | 6thStreet"),
      og_desc:
        getCountryFromUrl() === "QA"
          ? __(
              "Buy & Explore your favourite brands ✯ Free Receiving ✯ Cash On Receiving ✯ 100% original brands | 6thStreet."
            )
          : __(
              "Buy & Explore your favourite brands ✯ Free delivery ✯ Cash On Delivery ✯ 100% original brands | 6thStreet."
            ),
    });
  }

  render() {
    return (
      <Brands
        {...this.containerFunctions}
        {...this.containerProps()}
        setLastTapItem={this.setLastTapItem}
      />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BrandsContainer)
);
