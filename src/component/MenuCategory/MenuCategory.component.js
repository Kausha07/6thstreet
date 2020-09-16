import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MenuDynamicContent from 'Component/MenuDynamicContent';
import { CategoryData } from 'Util/API/endpoint/Categories/Categories.type';

import './MenuCategory.style';

class MenuCategory extends PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(CategoryData).isRequired,
        label: PropTypes.string.isRequired
        // TODO: implement design
        // design: Design.isRequired
    };

    state = {
        isVisible: false
    };

    onEnter = this.handleHover.bind(this, true);

    onLeave = this.handleHover.bind(this, false);

    handleHover(isVisible) {
        this.setState({ isVisible });
    }

    renderDynamicContent() {
        const { isVisible } = this.state;
        const { data } = this.props;

        if (!isVisible) {
            return null;
        }

        return (
            <MenuDynamicContent
              content={ data }
            />
        );
    }

    renderLabel() {
        const { label } = this.props;
        return label;
    }

    render() {
        return (
            <li
              block="MenuCategory"
              onMouseEnter={ this.onEnter }
              onMouseLeave={ this.onLeave }
            >
                { this.renderLabel() }
                { this.renderDynamicContent() }
            </li>
        );
    }
}

export default MenuCategory;
