import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MenuDynamicContent from 'Component/MenuDynamicContent';
import { CategoryData } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './MenuCategory.style';

class MenuCategory extends PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(CategoryData).isRequired,
        label: PropTypes.string.isRequired
    };

    state = {
        isVisible: false,
        isArabic: isArabic()
    };

    onEnter = this.handleHover.bind(this, true);

    onLeave = this.handleHover.bind(this, false);

    componentDidMount() {
        const { label } = this.props;

        if (label === 'New In' && isMobile.any()) {
            this.handleHover(true);
        }
    }

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

        return (
            <div block="MenuCategory" elem="CategoryLabel">
                { label }
            </div>
        );
    }

    render() {
        const { isVisible, isArabic } = this.state;
        return (
            <div
              mix={ { block: 'MenuCategory', mods: { isArabic, isVisible } } }
              onMouseEnter={ this.onEnter }
              onMouseLeave={ this.onLeave }
            >
                { this.renderLabel() }
                { this.renderDynamicContent() }
            </div>
        );
    }
}

export default MenuCategory;
