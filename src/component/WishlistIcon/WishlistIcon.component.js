import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './WishlistIcon.style';

class WishlistIcon extends PureComponent {
    static propTypes = {
        sku: PropTypes.string.isRequired,
        addToWishlist: PropTypes.func.isRequired
    };

    handleClick = () => {
        const { sku, addToWishlist } = this.props;

        addToWishlist(sku);
    };

    renderIcon() {
        return (
            <div
              role="button"
              block="WishlistIcon"
              elem="Icon"
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
