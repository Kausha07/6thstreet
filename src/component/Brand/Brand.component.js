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
      } 
      else if(type=== "النساء"){
        requestedGender = "نساء"
      }
      else if(type=== "الرجال"){
        requestedGender = "رجال"
      }
      else if(type=== "الأطفال"){
        requestedGender = "صبي,فتاة,أطفال"
      }      
      else {
        requestedGender =  type;
      }
      finalURL = url
        ? `/${url}.html?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
            brandName
          )}&dFR[gender][0]=${this.capitalizeFirstLetter(requestedGender)}`
        : `/catalogsearch/result/?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(
            brandName
          )}&dFR[gender][0]=${this.capitalizeFirstLetter(requestedGender)}`;
    } else {
      finalURL = url
        ? `/${url}.html?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(name)}`
        : `/catalogsearch/result/?q=${encodeURIComponent(
            brandName
          )}&p=0&dFR[brand_name][0]=${encodeURIComponent(name)}`;
    }
    return (
      <div block="Brand">
        <Link to={finalURL} block="BrandLink">
          {/* {this.renderName()} */}
          {brandName}
        </Link>
      </div>
    );
  }
}

export default Brand;
