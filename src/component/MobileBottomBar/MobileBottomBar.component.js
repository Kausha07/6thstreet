/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';

import './MobileBottomBar.style';

class MobileBottomBar extends NavigationAbstract {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        isHome: false,
        redirectHome: false,
        redirectBrand: false,
        isBrand: false,
        isBottomBar: true,
        isLoggedIn: false,
        isWishlist: false,
        isAccount: false
    };

    renderMap = {
        home: this.renderHome.bind(this),
        menu: this.renderMenu.bind(this),
        brand: this.renderBrand.bind(this),
        wishlist: this.renderWishlist.bind(this),
        account: this.renderAccount.bind(this)
    };

    routeChangeHome=() => {
        this.setState({
            redirectHome: true
        });
    };

    routeChangeBrand=() => {
        this.setState({
            redirectBrand: true
        });
    };

    routeChangeAccount=() => {
        const { history } = this.props;
        const { isLoggedIn } = this.state;

        if (!isLoggedIn) {
            return history.push('/myaccount/login');
        }

        return null;
    };

    routeChangeWishlist=() => {
        const { history } = this.props;
        const { isLoggedIn } = this.state;

        if (!isLoggedIn) {
            return history.push('/myaccount/login');
        }

        return null;
    };

    routeChangeLogin=() => {
        this.setState({ redirectLogin: true });
    };

    renderHome() {
        const { history } = this.props;
        const { isHome, redirectHome } = this.state;

        if (redirectHome) {
            this.setState({ redirectHome: false });
            return history.push('/');
        }

        this.setState({ isHome: window.location.pathname === '/' });

        return (
            <button
                onClick={ this.routeChangeHome }
                key="homeButton"
                block="MobileBottomBar"
                elem="HomeAndBrand"
                mods={ { isHomeButton: true } }
                mix={ {
                    block: 'MobileBottomBar',
                    elem: 'HomeAndBrand',
                    mods: { isActive: isHome }
                } }
            >
                <label htmlFor="Home">{ __('Home') }</label>
            </button>
        );
    }

    renderBrand() {
        const { history } = this.props;
        const { isBrand, redirectBrand } = this.state;

        if (redirectBrand) {
            this.setState({ redirectBrand: false });
            return history.push('/brands.html');
        }

        this.setState({ isBrand: window.location.pathname === '/brands.html' });

        return (
            <button
                onClick={ this.routeChangeBrand }
                key="brandButton"
                block="MobileBottomBar"
                elem="HomeAndBrand"
                mods={ { isBrandButton: true } }
                mix={ {
                    block: 'MobileBottomBar',
                    elem: 'HomeAndBrand',
                    mods: { isActive: isBrand }
                } }
            >
                <label htmlFor="Home">{ __('Brand') }</label>
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

    renderWishlist() {
        const { isBottomBar, isWishlist } = this.state;

        return (
            <button
                onClick={ this.routeChangeWishlist }
                key="wishlistButton"
                block="MobileBottomBar"
                elem="WishListAndAccount"
            >
                <HeaderWishlist
                    isWishlist={ isWishlist }
                    isBottomBar={ isBottomBar }
                    key="wishlist"
                />
            </button>
        );
    }

    renderAccount() {
        const { isBottomBar, isAccount } = this.state;
        const { location } = this.props;

        this.setState({ isAccount: location.pathname === '/myaccount/login' });

        return (
            <button
                onClick={ this.routeChangeAccount }
                key="accountButton"
                block="MobileBottomBar"
                elem="WishListAndAccount"
            >
                <HeaderAccount
                    isAccount={ isAccount }
                    isBottomBar={ isBottomBar }
                    key="account"
                />
            </button>
        );
    }

    render() {
        return (
            <div block="MobileBottomBar">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default withRouter(MobileBottomBar);
