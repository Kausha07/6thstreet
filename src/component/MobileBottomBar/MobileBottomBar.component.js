/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import HeaderAccount from 'Component/HeaderAccount';
import HeaderMenu from 'Component/HeaderMenu';
import HeaderWishlist from 'Component/HeaderWishlist';
import MyAccountOverlay from 'Component/MyAccountOverlay';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { setIsMobileTabActive } from 'Store/MyAccount/MyAccount.action';

import './MobileBottomBar.style.scss';

export const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = (dispatch) => ({
    setMobileTabActive: (value) => dispatch(setIsMobileTabActive(value))
});

class MobileBottomBar extends NavigationAbstract {
    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        setIsMobileTabActive: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired
    };

    state = {
        isHome: false,
        redirectHome: false,
        redirectBrand: false,
        isBrand: false,
        isBottomBar: true,
        isWishlist: false,
        isAccount: false,
        isPopup: true,
        accountPopUp: ''
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
            redirectBrand: true,
            isCategoryMenu: false
        });
    };

    renderAccountPopUp = () => {
        const { isPopup } = this.state;
        const popUpElement = (
            <MyAccountOverlay isPopup={ isPopup } closePopup={ this.closePopup } />
        );

        this.setState({ accountPopUp: popUpElement });
        return popUpElement;
    };

    closePopup = () => {
        this.setState({ accountPopUp: '' });
    };

    routeChangeAccount=() => {
        const { history, setMobileTabActive } = this.props;

        setMobileTabActive(false);
        this.closePopup();

        return history.push('/my-account');
    };

    routeChangeWishlist=() => {
        const { history, setMobileTabActive } = this.props;

        setMobileTabActive(true);
        this.closePopup();

        return history.push('/my-account/my-wishlist');
    };

    routeChangeLogin=() => {
        this.setState({ redirectLogin: true });
    };

    renderHome() {
        const { history } = this.props;
        const { isHome, redirectHome, isCategoryMenu } = this.state;

        if (redirectHome) {
            this.setState({ redirectHome: false });
            return history.push('/');
        }

        this.setState({ isHome: window.location.pathname === '/' && !isCategoryMenu });

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
        const { isBrand, redirectBrand, isCategoryMenu } = this.state;

        if (redirectBrand) {
            this.setState({ redirectBrand: false });
            return history.push('/brands');
        }

        this.setState({ isBrand: window.location.pathname === '/brands' && !isCategoryMenu });

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
                <label htmlFor="Home">{ __('Brands') }</label>
            </button>
        );
    }

    renderMenu() {
        return <HeaderMenu key="menu" />;
    }

    renderWishlist() {
        const {
            isBottomBar,
            isWishlist,
            isCategoryMenu
        } = this.state;

        const { isSignedIn } = this.props;

        this.setState({ isWishlist: location.pathname === '/my-account/my-wishlist' && !isCategoryMenu });

        const onClickHandle = !isSignedIn ? this.renderAccountPopUp : this.routeChangeWishlist;

        return (
            <div>
                <button
                  onClick={ onClickHandle }
                  key="wishlistButton"
                  block="MobileBottomBar"
                  elem="WishListAndAccount"
                  mods={ { isActive: isWishlist } }
                >
                    <HeaderWishlist
                      isWishlist={ isWishlist }
                      isBottomBar={ isBottomBar }
                      key="wishlist"
                    />
                </button>
            </div>
        );
    }

    renderAccount() {
        const {
            isBottomBar,
            isAccount,
            accountPopUp
        } = this.state;
        const { location, isSignedIn } = this.props;

        this.setState({ isAccount: location.pathname === '/my-account' });

        const onClickHandle = !isSignedIn ? this.renderAccountPopUp : this.routeChangeAccount;

        return (
            <div>
                <button
                  onClick={ onClickHandle }
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
                { accountPopUp }
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileBottomBar));
