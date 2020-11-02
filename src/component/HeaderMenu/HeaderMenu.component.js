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
        newMenuGender: PropTypes.string.isRequired,
        toggleActiveMenu: PropTypes.func.isRequired
    };

    state = {
        prevLocation: '',
        expanded: false
    };

    renderMap = {
        renderCategoriesButton: this.renderCategoriesButton.bind(this)
    };

    static getDerivedStateFromProps(props, state) {
        const { location } = props;
        const { prevLocation } = state;

        return location !== prevLocation ? ({
            expanded: false,
            prevLocation: location
        }) : null;
    }

    onCategoriesClick = () => {
        const { toggleOverlayByKey, toggleActiveMenu } = this.props;

        this.setState(({ expanded }) => ({ expanded: !expanded }));
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
        const { expanded } = this.state;

        return (
            <button
              mix={ {
                  block: 'HeaderMenu',
                  elem: 'Button',
                  mods: { isExpanded: expanded }
              } }
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
