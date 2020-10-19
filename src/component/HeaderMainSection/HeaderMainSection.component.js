import { matchPath, withRouter } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderCart from 'Component/HeaderCart';
import HeaderGenders from 'Component/HeaderGenders';
import HeaderLogo from 'Component/HeaderLogo';
import HeaderSearch from 'Component/HeaderSearch/HeaderSearch.component';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import { TYPE_CATEGORY, TYPE_PRODUCT } from 'Route/UrlRewrites/UrlRewrites.config';
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
        type: '',
        delay: 150,
        lastProduct: null,
        lastCategory: null
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
            return 'HOME';
        }
        if (matchPath(location.pathname, '/brands')) {
            return 'BRANDS';
        }
        if (matchPath(location.pathname, '/my-account')) {
            return 'ACCOUNT';
        }

        return window.pageType;
    }

    getCategory() {
        return JSON.parse(localStorage.getItem('category'));
    }

    getProduct() {
        return JSON.parse(localStorage.getItem('product'));
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
        return (this.isPLP() || this.isPDP()) && isMobile.any() ? (
            ''
        ) : (
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
                    String(this.getCategory().q).toUpperCase()
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
                const pagePDPTitle = String(this.getProduct().name).toUpperCase();

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
        ) : (
            ''
        );
    }

    renderSearch() {
        return this.isPLP() || this.isPDP() ? (
            ''
        ) : (
            <HeaderSearch />
        );
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
