import BrandGroup from "Component/BrandGroup";
import Loader from "Component/Loader";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { KIDS_TYPE, MEN_TYPE, WOMEN_TYPE } from "./Brands.config";
import "./Brands.style";

class Brands extends PureComponent {
  static propTypes = {
    changeBrandType: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    brands: PropTypes.array.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: null,
  };

  state = {
    filteredLetter: null,
  };

  onBrandCategoryClick = (categoryName) => () => {
    const { changeBrandType } = this.props;

    changeBrandType(categoryName);
  };

  onBrandLetterClick =
    (letter = null) =>
    () => {
      this.setState({ filteredLetter: letter });
    };

  renderCategorySelector() {
    let { type } = this.props;
    if (type) {
      type = decodeURIComponent(type);
    }
    return (
      <div block="Brands" elem="Categories">
        <button
          block="Brands"
          elem="CategoryButton"
          mods={{ isSelected: !type }}
          onClick={this.onBrandCategoryClick("")}
        >
          {__("All")}
        </button>
        <button
          block="Brands"
          elem="CategoryButton"
          mods={{ isSelected: type === WOMEN_TYPE }}
          onClick={this.onBrandCategoryClick(WOMEN_TYPE)}
        >
          {__("Women")}
        </button>
        <button
          block="Brands"
          elem="CategoryButton"
          mods={{ isSelected: type === MEN_TYPE }}
          onClick={this.onBrandCategoryClick(MEN_TYPE)}
        >
          {__("Men")}
        </button>
        <button
          block="Brands"
          elem="CategoryButton"
          mods={{ isSelected: type === KIDS_TYPE }}
          onClick={this.onBrandCategoryClick(KIDS_TYPE)}
        >
          {__("Kids")}
        </button>
      </div>
    );
  }

  renderBrandGroup = ([letter, brands]) => {
    const { type, brandMapping, testbrandMapping } = this.props;
    const { filteredLetter } = this.state;
    const finalArray = brands.map((brand) => {
      const testBrandItem = testbrandMapping.find(
        (item) => item.en.toUpperCase() === brand.name.toUpperCase()
      );
      return Object.assign({}, testBrandItem, brand);
    });
    return (
      <BrandGroup
        key={letter}
        letter={letter}
        brands={finalArray}
        isFiltered={!!filteredLetter}
        type={type}
        brandMapping={brandMapping}
      />
    );
  };

  renderLetterSelector() {
    const { brands = [] } = this.props;
    const { filteredLetter } = this.state;

    return (
      <div block="Brands" elem="LetterFilter">
        <button
          block="Brands"
          elem="LetterButton"
          mods={{ isSelected: !filteredLetter }}
          onClick={this.onBrandLetterClick()}
        >
          #
        </button>
        {brands.map(([key]) => (
          <button
            key={key}
            block="Brands"
            elem="LetterButton"
            mods={{ isSelected: filteredLetter === key }}
            onClick={this.onBrandLetterClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    );
  }

  renderBrandGroups() {
    const { brands = [] } = this.props;
    const { filteredLetter } = this.state;

    if (filteredLetter) {
      return brands
        .filter(([key]) => key === filteredLetter)
        .map(this.renderBrandGroup);
    }

    return brands.map(this.renderBrandGroup);
  }

  render() {
    const { isLoading } = this.props;
    const { filteredLetter } = this.state;

    return (
      <div block="Brands">
        <Loader isLoading={isLoading} />
        <h2 block="Brands" elem="Heading">
          {__("Brands A-Z")}
        </h2>
        {this.renderCategorySelector()}
        {this.renderLetterSelector()}
        <div
          block="Brands"
          elem="Groups"
          mods={{ isFiltered: !!filteredLetter }}
        >
          {this.renderBrandGroups()}
        </div>
      </div>
    );
  }
}

export default Brands;
