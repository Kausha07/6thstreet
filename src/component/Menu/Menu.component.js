import { PureComponent } from 'react';

import HeaderGenders from 'Component/HeaderGenders';
import MenuCategory from 'Component/MenuCategory';
import { Categories } from 'Util/API/endpoint/Categories/Categories.type';

import './Menu.style';

class Menu extends PureComponent {
    static propTypes = {
        categories: Categories.isRequired
    };

    constructor() {
        super();
        this.state = {
            isArabic: false
        };
    }

    static getDerivedStateFromProps() {
        return ({
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        });
    }

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

    render() {
        const { isArabic } = this.state;

        return (
            <div
              block="Menu"
              elem="Container"
            >
                <HeaderGenders />
                <div
                  mix={ { block: 'Menu', mods: { isArabic } } }
                >
                    { this.renderCategories() }
                    <div block="MenuCategory" elem="LastCategoryBackground" />
                </div>
            </div>
        );
    }
}

export default Menu;
