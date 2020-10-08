import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Wishlist from 'Store/Wishlist/Wishlist.dispatcher';

import WishlistIcon from './WishlistIcon.component';

export const mapDispatchToProps = (dispatch) => ({
    addToWishlist: (sku) => Wishlist.addSkuToWishlist(dispatch, sku)
});

class WishlistIconContainer extends PureComponent {
    static propTypes = {
        sku: PropTypes.string.isRequired
    };

    render() {
        return (
            <WishlistIcon
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(WishlistIconContainer);
