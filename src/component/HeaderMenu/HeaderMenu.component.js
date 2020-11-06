import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Menu from 'Component/Menu';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';
import browserHistory from 'Util/History';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        newMenuGender: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        activeOverlay: PropTypes.string.isRequired
    };

    state = {
        expanded: false
    };

    renderMap = {
        renderCategoriesButton: this.renderCategoriesButton.bind(this)
    };

    static getDerivedStateFromProps(props) {
        const { location: { pathname }, gender, activeOverlay } = props;

        return {
            expanded: pathname.includes(`/${ gender }.html`) && activeOverlay === MOBILE_MENU_SIDEBAR_ID
        };
    }

    onCategoriesClick = () => {
        const { toggleOverlayByKey, gender } = this.props;

        this.setState(({ expanded }) => ({ expanded: !expanded }));
        toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
        browserHistory.push(`/${ gender }.html`);
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
