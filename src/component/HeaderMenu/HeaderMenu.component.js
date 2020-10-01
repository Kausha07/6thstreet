import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Menu from 'Component/Menu';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired
    };

    state = {
        prevLocation: ''
    };

    static getDerivedStateFromProps(props, state) {
        const { location } = props;
        const { prevLocation } = state;

        return location !== prevLocation ? ({
            isExpanded: false,
            prevLocation: location
        }) : null;
    }

    onCategoriesClick = () => {
        const { toggleOverlayByKey } = this.props;
        toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
    };

    renderMenu() {
        return (
            <Menu />
        );
    }

    renderCategoriesButton() {
        return (
            <button
              block="HeaderMenu"
              elem="Button"
              onClick={ this.onCategoriesClick }
            >
               <label htmlFor="Categories">{ __('Categories') }</label>
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

export default withRouter(HeaderMenu);
