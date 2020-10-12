/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './WishlistIcon.style';

class WishlistIcon extends PureComponent {
    static propTypes = {
        sku: PropTypes.string.isRequired,
        addToWishlist: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired
    };

    handleClick = () => {
        const { sku, addToWishlist } = this.props;

        addToWishlist(sku);
    };

    renderIcon() {
        const { sku, items } = this.props;

        let isBlack = false;

        items.forEach((item) => {
            if (item.product.sku === sku) {
                isBlack = true;
            }
        });

        return (
            <div
              role="button"
              block="WishlistIcon"
              elem="Icon"
              mods={ { black: isBlack } }
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
