/* eslint-disable eqeqeq */
import { Redirect } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    stateMap = {
        [DEFAULT_STATE_NAME]: {
            menu: true,
            search: true
        }
    };

    state = {
        isHome: false,
        redirect: false
    };

    renderMap = {
        home: this.renderHome.bind(this),
        menu: this.renderMenu.bind(this),
        brand: this.renderBrand.bind(this),
        wishlist: this.renderWishlist.bind(this),
        account: this.renderAccount.bind(this),
        search: this.renderSearch.bind(this)
    };

    onClickHomeButton() {
        history.push('/');
    }

    routeChange=() => {
        this.setState({ redirect: true });
    };

    renderHome() {
        const { isHome } = this.state;
        if (this.state.redirect) {
            this.setState({ redirect: false });
            return <Redirect push to="/" />;
        }

        if (window.location.pathname === '/') {
            this.setState({ isHome: true });
        }

        console.log('heree------------------');

        return (
            <button onClick={ this.routeChange } block="HeaderBottomBar" elem="Home" mods={ { isHome } }>
                Home
            </button>
        );
    }

    renderMenu() {
        return (
            <HeaderMenu
              key="menu"
            />
        );
    }

    renderBrand() {
        return (
            <div block="HeaderBottomBar" elem="Brand">
                Brand
            </div>
        );
    }

    renderWishlist() {
        return (
            <HeaderWishlist
              key="wishlist"
            />
        );
    }

    renderAccount() {
        return (
            <HeaderAccount
              key="account"
            />
        );
    }

    renderSearch() {
        return (
            <HeaderSearch
              key="search"
            />
        );
    }

    render() {
        return (
            <div block="HeaderBottomBar">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default HeaderBottomBar;
