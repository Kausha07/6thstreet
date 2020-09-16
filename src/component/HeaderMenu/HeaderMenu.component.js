// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Menu from 'Component/Menu';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    state = {
        isExpanded: false
    };

    onCategoriesClick = () => {
        // Toggle dropdown
        this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    };

    renderMenu() {
        const { isExpanded } = this.state;

        return (
            <Menu isExpanded={ isExpanded } />
        );
    }

    renderCategoriesButton() {
        const { isExpanded } = this.state;

        return (
            <button
              block="HeaderMenu"
              elem="Button"
              mods={ { isExpanded } }
              onClick={ this.onCategoriesClick }
            >
                { __('Categories') }
            </button>
        );
    }

    render() {
        return (
            <div block="HeaderMenu">
                { this.renderCategoriesButton() }
                { this.renderMenu() }
            </div>
        );
    }
}

export default HeaderMenu;
