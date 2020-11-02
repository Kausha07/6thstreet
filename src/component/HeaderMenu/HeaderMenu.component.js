import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Menu from 'Component/Menu';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        newMenuGender: PropTypes.string.isRequired,
        toggleActiveMenu: PropTypes.func.isRequired
    };

    state = {
        prevLocation: '',
        isExpanded: true
    };

    static getDerivedStateFromProps(props, state) {
        const { location, activeOverlay } = props;
        const { prevLocation } = state;

        return location !== prevLocation ? ({
            isExpanded: false,
            prevLocation: location
        }) : ({ isExpanded: activeOverlay === MOBILE_MENU_SIDEBAR_ID });
    }

    onCategoriesClick = () => {
        const { toggleOverlayByKey, toggleActiveMenu } = this.props;

        toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
        toggleActiveMenu();
    };

    renderMenu() {
        const { newMenuGender } = this.props;

        return (
            <Menu newMenuGender={ newMenuGender } />
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
