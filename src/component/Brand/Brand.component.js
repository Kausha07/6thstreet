import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Brand as BrandType } from "Util/API/endpoint/Brands/Brands.type";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import { isArabic } from "Util/App";
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

  render() {
    const {
      brand: { name = "", url = "" },
      type,
    } = this.props;
    const { isArabic } = this.state;
    let finalURL;
    let requestedGender;
    if (type) {
      if (type === "kids") {
        requestedGender = isArabic ? "أولاد~بنات" : "Boy~Girl";
      } else {
        requestedGender = isArabic ? getGenderInArabic(type) : type;
      }
      finalURL = url
        ? `${url}.html?brand_name=${encodeURI(
            name
          )}&gender=${this.capitalizeFirstLetter(requestedGender)}`
        : `/catalogsearch/result/?q=${encodeURI(name)}brand_name=${encodeURI(
            name
          )}&gender=${this.capitalizeFirstLetter(
            requestedGender
          )}&brand_name=${encodeURI(name)}`;
    } else {
      finalURL = url
        ? `${url}.html?brand_name=${encodeURI(name)}`
        : `/catalogsearch/result/?q=${encodeURI(name)}&brand_name=${encodeURI(
            name
          )}`;
    }
    return (
      <div block="Brand">
        <Link to={finalURL} block="BrandLink">
          {this.renderName()}
        </Link>
      </div>
    );
  }
}

export default Brand;
