/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import MenuDynamicContent from 'Component/MenuDynamicContent';
import { CategoryData } from 'Util/API/endpoint/Categories/Categories.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './MenuCategory.style';

class MenuCategory extends PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(CategoryData).isRequired,
        categoryKey: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        isDefaultCategoryOpen: PropTypes.bool.isRequired,
        closeDefaultCategory: PropTypes.func.isRequired
    };

    state = {
        isVisible: false,
        isArabic: isArabic()
    };

    onEnter = this.handleHover.bind(this, true);

    onLeave = this.handleHover.bind(this, false);

    handleHover(isVisible) {
        this.setState({ isVisible });
    }

    renderDynamicContent() {
        const { isVisible } = this.state;
        const {
            data,
            isDefaultCategoryOpen,
            categoryKey
        } = this.props;

        if (!isVisible) {
            if (categoryKey === 'new_in' && isDefaultCategoryOpen && isMobile.any()) {
                return (
                    <div block="DynamicContent" elem="Wrapper">
                        <MenuDynamicContent
                          content={ data }
                        />
                    </div>
                );
            }

            return null;
        }
        if (isMobile.any()) {
            return (
                <div block="DynamicContent" elem="Wrapper">
                    <MenuDynamicContent
                      content={ data }
                    />
                </div>
            );
        }

        return (
            <MenuDynamicContent
              content={ data }
            />
        );
    }

    getMenuCategoryLink() {
        const { data = [] } = this.props;

        if (data[0] && data[0].link !== undefined) {
            return data[0].link;
        }

        return location.pathname;
    }

    renderLabel() {
        const { label } = this.props;
        const link = this.getMenuCategoryLink();

        return (
            <Link to={ link } block="MenuCategory" elem="CategoryLink">
                <div block="MenuCategory" elem="CategoryLink-Label">
                    { label }
                </div>
            </Link>
        );
    }

    renderMobileLabel() {
        const { label, closeDefaultCategory } = this.props;

        return (
            <div block="MenuCategory" elem="CategoryLabel">
                <button
                  block="MenuCategory"
                  elem="CategoryButton"
                  onClick={ () => {
                      closeDefaultCategory();
                  } }
                >
                    { label }
                </button>
            </div>
        );
    }

    render() {
        const { isVisible, isArabic } = this.state;
        const { isDefaultCategoryOpen, categoryKey } = this.props;

        if (!isMobile.any() && categoryKey === 'stories') {
            return null;
        }

        if (isMobile.any()) {
            if (categoryKey === 'new_in') {
                return (
                    <div
                      mix={ { block: 'MenuCategory', mods: { isArabic, isVisible, isDefaultCategoryOpen } } }
                      onMouseEnter={ this.onEnter }
                      onMouseLeave={ this.onLeave }
                    >
                        { this.renderMobileLabel() }
                        { this.renderDynamicContent() }
                    </div>
                );
            }

            return (
                <div
                  mix={ { block: 'MenuCategory', mods: { isArabic, isVisible } } }
                  onMouseEnter={ this.onEnter }
                  onMouseLeave={ this.onLeave }
                >
                    { this.renderMobileLabel() }
                    { this.renderDynamicContent() }
                </div>
            );
        }

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
