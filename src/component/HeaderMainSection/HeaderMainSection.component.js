import { matchPath, withRouter } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderCart from 'Component/HeaderCart';
import HeaderGenders from 'Component/HeaderGenders';
import HeaderLogo from 'Component/HeaderLogo';
import HeaderSearch from 'Component/HeaderSearch';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import {
    TYPE_ACCOUNT,
    TYPE_BRAND,
    TYPE_CATEGORY,
    TYPE_HOME,
    TYPE_PRODUCT
} from 'Route/UrlRewrites/UrlRewrites.config';
import isMobile from 'Util/Mobile';

import './HeaderMainSection.style';

class HeaderMainSection extends NavigationAbstract {
    stateMap = {
        [DEFAULT_STATE_NAME]: {
            account: true,
            cart: true,
            wishlist: true,
            gender: true,
            logo: true
        }
    };

    renderMap = {
        gender: this.renderGenderSwitcher.bind(this),
        logo: this.renderLogo.bind(this),
        account: this.renderAccount.bind(this),
        cart: this.renderCart.bind(this),
        wishlist: this.renderWishlist.bind(this),
        search: this.renderSearch.bind(this),
        back: this.renderBack.bind(this)
    };

    state = {
        type: null,
        delay: 150,
        lastProduct: null,
        lastCategory: null,
        search: ''
    };

    componentDidMount() {
        const { delay } = this.state;
        this.timer = setInterval(this.tick, delay);
    }

    componentDidUpdate(prevState) {
        const { delay } = this.state;
        if (prevState !== delay) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, delay);
        }
    }

    componentWillUnmount() {
        this.timer = null;
    }

    tick = () => {
        this.setState({
            type: this.getPageType(),
            lastCategory: this.getCategory(),
            lastProduct: this.getProduct()
        });
    };

    isPLP() {
        const { type } = this.state;
        return TYPE_CATEGORY === type;
    }

    isPDP() {
        const { type } = this.state;
        return TYPE_PRODUCT === type;
    }

    getPageType() {
        if (location.pathname === '/') {
            return TYPE_HOME;
        }
        if (matchPath(location.pathname, '/brands')) {
            return TYPE_BRAND;
        }
        if (matchPath(location.pathname, '/my-account')) {
            return TYPE_ACCOUNT;
        }

        return window.pageType;
    }

    getCategory() {
        return JSON.parse(localStorage.getItem('CATEGORY_NAME'));
    }

    getProduct() {
        return JSON.parse(localStorage.getItem('PRODUCT_NAME'));
    }

    setMainContentPadding(px = '0') {
        document.documentElement.style.setProperty('--main-content-padding', px);
    }

    renderAccount() {
        return (
            <HeaderAccount
              key="account"
              isMobile
            />
        );
    }

    renderCart() {
        return (
            <HeaderCart
              key="cart"
              CartButton="CartButton"
            />
        );
    }

    renderWishlist() {
        return (
            <HeaderWishlist
              key="wishlist"
              isMobile
            />
        );
    }

    renderGenderSwitcher() {
        return (this.isPLP() || this.isPDP()) && isMobile.any() ? null : (
            <HeaderGenders
              key="genders"
              isMobile
            />
        );
    }

    renderLogo() {
        if (isMobile.any()) {
            if (this.isPLP()) {
                const pagePLPTitle = this.getCategory() ? (
                    String(this.getCategory()).toUpperCase()
                ) : (
                    __('AVAILABLE PRODUCTS')
                );

                this.setMainContentPadding();

                return (
                    <span block="CategoryTitle">
                      { pagePLPTitle }
                    </span>
                );
            }
            if (this.isPDP()) {
                const pagePDPTitle = String(this.getProduct()).toUpperCase();

                this.setMainContentPadding('50px');

                return (
                    <span block="CategoryTitle">
                      { pagePDPTitle }
                    </span>
                );
            }
        }

        this.setMainContentPadding('150px');

        return (
            <HeaderLogo
              key="logo"
            />
        );
    }

    renderBack() {
        const { history } = this.props;
        return this.isPLP() || this.isPDP() ? (
            <div block="BackArrow">
                <button
                  block="BackArrow-Button"
                  onClick={ history.goBack }
                >
                    <p>{ __('Back') }</p>
                </button>
            </div>
        ) : null;
    }

    renderSearch() {
        // eslint-disable-next-line no-empty
        if (isMobile.any()) {
            return this.isPLP() || this.isPDP() ? null : (
                <HeaderSearch
                  key="search"
                />
            );
        }

        return null;
    }

    render() {
        return (
            <div block="HeaderMainSection">
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default withRouter(HeaderMainSection);
