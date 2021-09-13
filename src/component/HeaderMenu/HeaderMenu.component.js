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
        activeOverlay: PropTypes.string.isRequired,
        setGender: PropTypes.func.isRequired
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
        const { toggleOverlayByKey, gender, setGender } = this.props;

        if (gender === 'home_beauty_women') {
            setGender('women');
        }

        this.setState(({ expanded }) => ({ expanded: !expanded }));
        toggleOverlayByKey(MOBILE_MENU_SIDEBAR_ID);
        browserHistory.push(`/${ gender === 'home_beauty_women' ? 'women' : gender }.html`);
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
                {!this.props.isMobileBottomBar && <label htmlFor="Categories">{ __('Categories') }</label>}
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
