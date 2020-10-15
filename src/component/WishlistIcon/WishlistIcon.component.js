/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './WishlistIcon.style';

class WishlistIcon extends PureComponent {
    static propTypes = {
        sku: PropTypes.string.isRequired,
        removeFromWishlist: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired
    };

    handleClick = () => {
        const { removeFromWishlist } = this.props;
        console.log(this.props);
        const s = '2961365';
        removeFromWishlist(s);
    };

    isBlack = (item) => {
        const { sku } = this.props;
        const { product: { sku: wishlistSku } } = item;

        return sku === wishlistSku;
    };

    renderIcon() {
        const { items } = this.props;
        const blackMod = items.some(this.isBlack);
        console.log(items);

        return (
            <div
              role="button"
              block="WishlistIcon"
              elem="Icon"
              mods={ { black: blackMod } }
              tabIndex={ 0 }
              aria-label="Wishlist"
              onClick={ this.handleClick }
              onKeyDown={ this.handleClick }
            />
        );
    }

    render() {
        return (
            <div block="WishlistIcon">
                { this.renderIcon() }
            </div>
        );
    }
}

export default WishlistIcon;
