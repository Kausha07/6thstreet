import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Brand as BrandType } from "Util/API/endpoint/Brands/Brands.type";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
import "./Brand.style";
import { EVENT_MOE_GO_TO_BRAND, MOE_trackEvent } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";

class Brand extends PureComponent {
  static propTypes = {
    brand: BrandType.isRequired,
    type: PropTypes.string.isRequired,
  };
  state = {
    isArabic: isArabic(),
  };

  capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  renderName() {
    const {
      brand: { name },
    } = this.props;

    return name;
  }
  
  sendMoeEvent(brandName) {
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    MOE_trackEvent(EVENT_MOE_GO_TO_BRAND, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      brand_name: brandName || "",
      app6thstreet_platform: "Web",
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",
    });
  }
  render() {
    const {
      brand: { name = "", name_ar = "", url_path: url = "" },
      type,
    } = this.props;
    const { isArabic } = this.state;
    let finalURL;
    let requestedGender;
    let brandName = isArabic ? name_ar : name;

    if (type) {
      if (type === "kids") {
        requestedGender = isArabic ? "أولاد,بنات" : "Boy,Girl";
      } else if (type === "نساء") {
        requestedGender = "نساء";
      } else if (type === "رجال") {
        requestedGender = "رجال";
      } else if (type === "أطفال") {
        requestedGender = "أولاد,بنات";
      } else {
        requestedGender = type;
      }
      finalURL = url
        ? `/${url}.html?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
            brandName
          )}&dFR[gender][0]=${this.capitalizeFirstLetter(requestedGender)}&dFR[in_stock][0]=${1}`
        : `/catalogsearch/result/?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
            brandName
          )}&dFR[gender][0]=${this.capitalizeFirstLetter(requestedGender)}&dFR[in_stock][0]=${1}`;
    } else {
      finalURL = url
        ? `/${url}.html?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(brandName)}&dFR[in_stock][0]=${1}`
        : `/catalogsearch/result/?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(brandName)}&dFR[in_stock][0]=${1}`;
    }

    return (
      <div block="Brand">
        <Link
          to={finalURL}
          block="BrandLink"
          onClick={() => {
            this.sendMoeEvent(brandName);
          }}
        >
          {/* {this.renderName()} */}
          {brandName}
        </Link>
      </div>
    );
  }
}

export default Brand;
