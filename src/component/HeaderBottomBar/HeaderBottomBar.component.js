/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// import { withRouter } from 'react-router-dom';
import HeaderAccount from 'Component/HeaderAccount';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderSearch from 'Component/HeaderSearch';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

import './HeaderBottomBar.style';

class HeaderBottomBar extends NavigationAbstract {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    stateMap = {
        [DEFAULT_STATE_NAME]: {
            menu: true,
            search: true
        }
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
        account: this.renderAccount.bind(this),
        search: this.renderSearch.bind(this)
    };

    routeChangeHome=() => {
        this.setState({
            redirectHome: true,
            isWishlist: false,
            isAccount: false
        });
    };

    routeChangeBrand=() => {
        this.setState({
            redirectBrand: true,
            isWishlist: false,
            isAccount: false
        });
    };

    routeChangeAccount=() => {
        const { history } = this.props;
        const { isLoggedIn } = this.state;

        this.setState({
            isAccount: true,
            isWishlist: false
        });

        if (!isLoggedIn) {
            return history.push('/myaccount/login');
        }

        return null;
    };

    routeChangeWishlist=() => {
        const { history } = this.props;
        const { isLoggedIn } = this.state;

        this.setState({
            isWishlist: true,
            isAccount: false
        });

        if (!isLoggedIn) {
            return history.push('/myaccount/login');
        }

        return null;
    };

    componentDidUpdate(prevProps) {
        const { location } = this.props;

        if (location !== prevProps.location) {
            this.renderHome();
            this.renderBrand();
        }
    }

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

        if (window.location.pathname === '/') {
            this.setState({ isHome: true });
        } else {
            this.setState({ isHome: false });
        }

        return (
            <button onClick={ this.routeChangeHome } block="HeaderBottomBar" elem="Home" mods={ { isHome } }>
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
        const { history } = this.props;
        const { isBrand, redirectBrand } = this.state;

        if (redirectBrand) {
            this.setState({ redirectBrand: false });
            return history.push('/brands.html');
        }

        if (window.location.pathname === '/brands.html') {
            this.setState({ isBrand: true });
        } else {
            this.setState({ isBrand: false });
        }

        return (
            <button onClick={ this.routeChangeBrand } block="HeaderBottomBar" elem="Brand" mods={ { isBrand } }>
                Brand
            </button>
        );
    }

    renderWishlist() {
        const { isBottomBar, isWishlist } = this.state;

        return (
            <button onClick={ this.routeChangeWishlist } block="HeaderBottomBar" elem="WishList">
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

        return (
            <button onClick={ this.routeChangeAccount } block="HeaderBottomBar" elem="Account">
                <HeaderAccount
                  isAccount={ isAccount }
                  isBottomBar={ isBottomBar }
                  key="account"
                />
            </button>
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

export default withRouter(HeaderBottomBar);
