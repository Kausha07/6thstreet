import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderCart from 'Component/HeaderCart';
import HeaderGenders from 'Component/HeaderGenders';
import HeaderLogo from 'Component/HeaderLogo';
import HeaderSearch from 'Component/HeaderSearch';
import HeaderWishlist from 'Component/HeaderWishlist';
import { MOBILE_MENU_SIDEBAR_ID } from 'Component/MobileMenuSideBar/MoblieMenuSideBar.config';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
import {
    TYPE_ACCOUNT,
    TYPE_BRAND,
    TYPE_CART,
    TYPE_CATEGORY,
    TYPE_HOME,
    TYPE_PRODUCT
} from 'Route/UrlRewrites/UrlRewrites.config';
import { isArabic } from 'Util/App';
import BrowserDatabase from 'Util/BrowserDatabase';
import isMobile from 'Util/Mobile';

import './HeaderMainSection.style';

export const mapStateToProps = (state) => ({
    activeOverlay: state.OverlayReducer.activeOverlay,
    chosenGender: state.AppState.gender
});

class HeaderMainSection extends NavigationAbstract {
    static propTypes = {
        activeOverlay: PropTypes.string.isRequired,
        changeMenuGender: PropTypes.func
    };

    static defaultProps = {
        changeMenuGender: () => {}
    };

    constructor(props) {
        super(props);
    
        this.state = {
          prevScrollpos: window.pageYOffset,
          visible: false
        };
    }

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

    handleScroll = () => {
        if(!this.isPDP()){
            return;
        }

        const { prevScrollpos } = this.state;
      
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollpos < currentScrollPos;
      
        this.setState({
          prevScrollpos: currentScrollPos,
          visible
        });
    };

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
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
        window.removeEventListener("scroll", this.handleScroll);
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
        const { location: { search, pathname = '' } } = this.props;
        const isSearch = pathname.includes('catalogsearch');

        return TYPE_CATEGORY === type && search && !isSearch;
    }

    isPDP() {
        const { type } = this.state;
        return TYPE_PRODUCT === type;
    }

    getPageType() {
        if (location.pathname === '/' || location.pathname === '') {
            return TYPE_HOME;
        }
        if (matchPath(location.pathname, '/brands')) {
            return TYPE_BRAND;
        }
        if (matchPath(location.pathname, '/my-account')) {
            return TYPE_ACCOUNT;
        }
        if (matchPath(location.pathname, '/cart')) {
            return TYPE_CART;
        }

        return window.pageType;
    }

    getCategory() {
        return BrowserDatabase.getItem('CATEGORY_NAME') || '';
    }

    getProduct() {
        return BrowserDatabase.getItem('PRODUCT_NAME') || '';
    }

    setMainContentPadding(px = '0') {
        document.documentElement.style.setProperty('--main-content-padding', px);
    }

    renderAccount() {
        const isFooter = false;

        return (
            <HeaderAccount
              key="account"
              isFooter={ isFooter }
              isMobile
            />
        );
    }

    renderCart() {
        return (
            <HeaderCart
              key="cart"
              CartButton="CartButton"
              showCartPopUp={ true }
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
        const { changeMenuGender, activeOverlay } = this.props;

        if (isMobile.any() && activeOverlay === MOBILE_MENU_SIDEBAR_ID) {
            return null;
        }

        return (this.isPLP() || this.isPDP() || this.getPageType() === TYPE_BRAND) && isMobile.any() ? null : (
            <HeaderGenders
              key="genders"
              isMobile
              changeMenuGender={ changeMenuGender }
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
                    <span block="CategoryTitle" mods={ { isArabic: isArabic() } }>
                      { pagePLPTitle }
                    </span>
                );
            }
            if (this.isPDP()) {
                const pagePDPTitle = String(this.getProduct()).toUpperCase();

                this.setMainContentPadding('50px');

                return (
                    <span block="CategoryTitle" mods={ { isArabic: isArabic() } }>
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

    backFromPLP = () => {
        const { history, chosenGender } = this.props;

        switch (chosenGender) {
        case 'women':
            history.push('/women.html');
            break;
        case 'men':
            history.push('/men.html');
            break;
        case 'kids':
            history.push('/kids.html');
            break;
        case 'home':
            history.push('/home.html');
            break;
        default:
            history.push('/');
        }
    };

    renderBack() {
        const { history } = this.props;
        
        return this.isPLP() || this.isPDP() ? (
            <div block="BackArrow" mods={ { isArabic: isArabic() } } key="back">
                <button
                  block="BackArrow-Button"
                  onClick={ this.isPLP() ? this.backFromPLP : history.goBack }
                >
                    <p>{ __('Back') }</p>
                </button>
            </div>
        ) : null;
    }

    renderSearch() {
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
        const pageWithHiddenHeader = [TYPE_CART, TYPE_ACCOUNT];

        return pageWithHiddenHeader.includes(this.getPageType()) && isMobile.any() ? null : (
            <div block="HeaderMainSection" data-visible={this.isPDP()?this.state.visible:true}>
                { this.renderNavigationState() }
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(HeaderMainSection));
