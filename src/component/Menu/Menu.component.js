// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

// import DesktopContent from 'Component/DesktopContent';
import HeaderGenders from 'Component/HeaderGenders';
import MenuCategory from 'Component/MenuCategory';
import { Categories } from 'Util/API/endpoint/Categories/Categories.type';

import './Menu.style';

/* const MyComponent = () => {
    const width = window.innerWidth;
    const breakpoint = 1200;
    return width < breakpoint ? <HeaderGenders /> : <DesktopContent />;
}; */

// window.addEventListener('resize', MyComponent);

class Menu extends PureComponent {
    static propTypes = {
        categories: Categories.isRequired
    };

    // TODO: if needed, labels and renders of category content can be split here
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
            <div
              block="Menu"
              elem="Container"
            >
                <HeaderGenders />
                <div
                  block="Menu"
                >
                    { this.renderCategories() }
                </div>
            </div>
        );
    }
}

export default Menu;
