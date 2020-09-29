import HeaderAccount from 'Component/HeaderAccount';
import HeaderCart from 'Component/HeaderCart';
import HeaderGenders from 'Component/HeaderGenders';
import HeaderLogo from 'Component/HeaderLogo';
import HeaderWishlist from 'Component/HeaderWishlist';
import NavigationAbstract from 'Component/NavigationAbstract/NavigationAbstract.component';
import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';

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
        wishlist: this.renderWishlist.bind(this)
    };

    renderAccount() {
        return (
            <div block="HeaderMainSection" mods={ { isMobile: true } }>
                <HeaderAccount
                  key="account"
                />
            </div>
        );
    }

    renderCart() {
        return (
            <div block="HeaderMainSection" elem="Cart">
                <HeaderCart
                  key="cart"
                />
            </div>
        );
    }

    renderWishlist() {
        return (
            <div block="HeaderMainSection" mods={ { isMobile: true } }>
                <HeaderWishlist
                  key="wishlist"
                />
            </div>
        );
    }

    renderGenderSwitcher() {
        return (
            <div block="HeaderMainSection" mods={ { isMobile: true } }>
                <HeaderGenders
                  key="genders"
                />
            </div>
        );
    }

    renderLogo() {
        return (
            <HeaderLogo
              key="logo"
            />
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

export default HeaderMainSection;
