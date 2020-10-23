/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './WishlistIcon.style';

class WishlistIcon extends PureComponent {
    static propTypes = {
        sku: PropTypes.string.isRequired,
        removeFromWishlist: PropTypes.func.isRequired,
        addToWishlist: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired
    };

    handleClick = () => {
        const {
            addToWishlist,
            removeFromWishlist,
            sku: skuFromProps,
            items
        } = this.props;
        const wishListItem = items.find(({ product: { sku } }) => sku === skuFromProps);

        if (wishListItem) {
            const { wishlist_item_id } = wishListItem;
            removeFromWishlist(wishlist_item_id);
            return;
        }

        addToWishlist(skuFromProps);
    };

    isBlack = (item) => {
        const { sku } = this.props;
        const { product: { sku: wishlistSku } } = item;

        return sku === wishlistSku;
    };

    renderIcon() {
        const { items } = this.props;
        const blackMod = items.some(this.isBlack);

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
