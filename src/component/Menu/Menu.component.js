// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MenuCategory from 'Component/MenuCategory';
import { Categories } from 'Util/API/endpoint/Categories/Categories.type';

import './Menu.style';

class Menu extends PureComponent {
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

    render() {
        return (
            <div block="Menu">
                { this.renderCategories() }
            </div>
        );
    }
}

export default Menu;
