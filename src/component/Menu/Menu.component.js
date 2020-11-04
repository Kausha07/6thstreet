import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import HeaderGenders from 'Component/HeaderGenders';
import MenuCategory from 'Component/MenuCategory';
import { APP_STATE_CACHE_KEY } from 'Store/AppState/AppState.reducer';
import { Categories } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';
import BrowserDatabase from 'Util/BrowserDatabase';

import './Menu.style';

class Menu extends PureComponent {
    state = {
        isArabic: isArabic(),
        isDefaultCategoryOpen: true,
        currentGender: 'men'
    };

    activeCategories = {
        data: null
    };

    static propTypes = {
        categories: Categories.isRequired,
        gender: PropTypes.string.isRequired
    };

    componentDidMount() {
        const { gender } = this.props;
        if (gender !== '') {
            this.setState({ currentGender: gender });
        }
    }

    componentDidUpdate() {
        this.setNewGender(BrowserDatabase.getItem(APP_STATE_CACHE_KEY).gender);
    }

    setNewGender = (newGender) => {
        const { currentGender } = this.state;
        if (currentGender !== newGender && newGender !== '') {
            this.setState({ currentGender: newGender });
            this.setState({ isDefaultCategoryOpen: true });
        }
    };

    closeDefaultCategory = () => {
        this.setState({ isDefaultCategoryOpen: false });
    };

    renderCategory = (category) => {
        const { activeCategory, isDefaultCategoryOpen } = this.state;

        const {
            data,
            label,
            design,
            key
        } = category;

        return (
            <MenuCategory
              key={ key }
              categoryKey={ key }
              data={ data }
              label={ label }
              design={ design }
              currentActiveCategory={ activeCategory }
              closeDefaultCategory={ this.closeDefaultCategory }
              isDefaultCategoryOpen={ isDefaultCategoryOpen }
            />
        );
    };

    renderCategories() {
        const { categories } = this.props;
        return categories.map(this.renderCategory);
    }

    render() {
        const { isArabic } = this.state;

        return (
            <div
              block="Menu"
              elem="Container"
            >
                <div
                  block="Menu"
                  elem="Header-Mobile"
                >
                    <div
                      mix={ {
                          block: 'Menu',
                          elem: 'Header-Mobile-Top',
                          mods: { isArabic }
                      } }
                    >
                        <HeaderGenders />
                    </div>
                </div>
                <div
                  mix={ {
                      block: 'Menu',
                      mods: { isArabic }
                  } }
                >
                    { this.renderCategories() }
                </div>
            </div>
        );
    }
}

export default Menu;
