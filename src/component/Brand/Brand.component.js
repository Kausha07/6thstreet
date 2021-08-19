import PropTypes from "prop-types";
import { PureComponent } from "react";

import { KIDS_GENDERS } from "Route/Brands/Brands.config";
import { Brand as BrandType } from "Util/API/endpoint/Brands/Brands.type";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import browserHistory from "Util/History";
import { isArabic } from "Util/App";
import BRAND_MAPPING from "Component/SearchSuggestion/SearchSiggestion.config";

import "./Brand.style";

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

  renderCount() {
    const {
      brand: { count },
    } = this.props;

    return count;
  }

  getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  getBrandUrl = (brandName) => {
    const { isArabic } = this.state;
    let name = brandName;
    let brandMapping = this.props.brandMapping;
    if (isArabic) {
      name = this.getKeyByValue(brandMapping, brandName);
    }

    name = name ? name : brandName;
    const urlName = name
      // .replace("&", "")
      .replace(/'/g, "")
      .replace(/[(\s+).&]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/\-$/, "")
      .replace("@", "at")
      .toLowerCase();

    return urlName;
  };

  handleBrandRedirect = () => {
    const {
      brand: { name = "" },
      type,
    } = this.props;

    const urlName = this.getBrandUrl(name);

    switch (type) {
      case "women":
        browserHistory.push(`/${urlName}.html?q=${urlName}`);
        WebUrlParser.setParam("gender", this.capitalizeFirstLetter(type));
        break;
      case "men":
        browserHistory.push(`/${urlName}.html?q=${urlName}`);
        WebUrlParser.setParam("gender", this.capitalizeFirstLetter(type));
        break;
      case "kids":
        browserHistory.push(`/${urlName}.html?q=${urlName}`);
        WebUrlParser.setParam("gender", KIDS_GENDERS);
        break;
      default:
        browserHistory.push(`/${urlName}.html?q=${urlName}`);
    }
  };

  render() {
    return (
      <button onClick={this.handleBrandRedirect} block="Brand">
        {this.renderName()}
      </button>
    );
  }
}

export default Brand;
