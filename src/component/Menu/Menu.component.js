import { PureComponent } from 'react';

import HeaderCart from 'Component/HeaderCart';
import HeaderGenders from 'Component/HeaderGenders';
import HeaderSearch from 'Component/HeaderSearch';
import MenuCategory from 'Component/MenuCategory';
import { Categories } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './Menu.style';

class Menu extends PureComponent {
    state = {
        isArabic: isArabic()
    };

    static propTypes = {
        categories: Categories.isRequired
    };

    renderCategory(category) {
        const {
            data,
            label,
            design,
            key
        } = category;

        return (
            <MenuCategory
              key={ key }
              data={ data }
              label={ label }
              design={ design }
            />
        );
    }

    renderCategories() {
        const { categories } = this.props;
        return categories.map(this.renderCategory);
    }

    renderSearch() {
        if (isMobile.any()) {
            return (
            <HeaderSearch />
            );
        }

        return null;
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
                        <HeaderCart />
                    </div>
                    { this.renderSearch() }
                </div>
                <div
                  mix={ {
                      block: 'Menu',
                      mods: { isArabic }
                  } }
                >
                    { this.renderCategories() }
                    <div
                      mix={ {
                          block: 'MenuCategory',
                          elem: 'LastCategoryBackground',
                          mods: { isArabic }
                      } }
                    />
                </div>
            </div>
        );
    }
}

export default Menu;
