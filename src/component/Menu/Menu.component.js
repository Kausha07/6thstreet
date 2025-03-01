/* eslint-disable react/jsx-boolean-value */
import HeaderGenders from "Component/HeaderGenders";
import MenuCategory from "Component/MenuCategory";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { Categories } from "Util/API/endpoint/Categories/Categories.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import BrowserDatabase from "Util/BrowserDatabase";
import MobileMegaMenu from "../../route/MobileMegaMenu";
import "./Menu.style";

class Menu extends PureComponent {
  state = {
    isArabic: isArabic(),
    isDefaultCategoryOpen: true,
    currentGender: "women",
  };

  activeCategories = {
    data: null,
  };

  static propTypes = {
    categories: Categories.isRequired,
    gender: PropTypes.string.isRequired,
    is_msite_megamenu_enabled: PropTypes.bool,
  };

  componentDidMount() {
    const { gender } = this.props;
    if (gender !== "") {
      this.setState({ currentGender: gender });
    }
  }

  componentDidUpdate() {
    this.setNewGender(BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender);
  }

  setNewGender = (newGender) => {
    const { currentGender } = this.state;
    if (currentGender !== newGender && newGender !== "") {
      this.setState({ currentGender: newGender, isDefaultCategoryOpen: true  });
    }
  };

  closeDefaultCategory = () => {
    this.setState({ isDefaultCategoryOpen: false });
  };

  renderCategory = (category) => {
    const { activeCategory, isDefaultCategoryOpen } = this.state;
    const { gender = "women" } = this.props;

    const { data, label, design, key, link } = category;

    return (
      <MenuCategory
        key={key}
        categoryKey={key}
        gender={gender}
        data={data}
        label={label}
        link={link}
        design={design}
        currentActiveCategory={activeCategory}
        closeDefaultCategory={this.closeDefaultCategory}
        isDefaultCategoryOpen={isDefaultCategoryOpen}
      />
    );
  };

  renderMobileMegaMenu = () => {
    return (
      <div block="header-mobile-megamenu">
        <MobileMegaMenu key="megamenu" />
      </div>
    );
  };

  renderCategories() {
    const { categories = [] } = this.props;
    if (!Array.isArray(categories)) {
      return null;
    }

    return categories.map(this.renderCategory);
  }

  render() {
    const { isArabic } = this.state;
    return (
      <div block="Menu" elem="Container">
       <div block="Menu" elem="Header-Mobile">
          <div
            mix={{
              block: "Menu",
              elem: "Header-Mobile-Top",
              mods: { isArabic },
            }}
          >
            <HeaderGenders isMenu={true} isMobileMegaMenu={this.props?.is_msite_megamenu_enabled && isMobile.any() ? true : false}/>
          </div>
        </div>
        <div
          mix={{
            block: `Menu ${this.props.gender}-menu`,
            mods: { isArabic },
          }}
        >
          {this.renderCategories()}
        </div>
      </div>
    );
  }
}

export default Menu;
