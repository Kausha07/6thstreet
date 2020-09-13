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
        account: this.renderAccount.bind(this),
        cart: this.renderCart.bind(this),
        wishlist: this.renderWishlist.bind(this),
        gender: this.renderGenderSwitcher.bind(this),
        logo: this.renderLogo.bind(this)
    };

    renderAccount() {
        return <HeaderAccount />;
    }

    renderCart() {
        return <HeaderCart />;
    }

    renderWishlist() {
        return <HeaderWishlist />;
    }

    renderGenderSwitcher() {
        return <HeaderGenders />;
    }

    renderLogo() {
        return <HeaderLogo />;
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
