import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import ProductItem from 'Component/ProductItem';
import { WishlistItems } from 'Util/API/endpoint/Wishlist/Wishlist.type';

import './MyAccountMyWishlist.style';

class MyAccountMyWishlist extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        items: WishlistItems.isRequired
    };

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    renderNoItems() {
        return 'no items in wishlist';
    }

    renderItem = (item) => {
        const { product, wishlist_item_id } = item;

        return (
            <ProductItem
              key={ wishlist_item_id }
              product={ product }
            />
        );
    };

    renderItems() {
        const { items, isLoading } = this.props;

        if (!items.length && !isLoading) {
            return this.renderNoItems();
        }

        return (
            <div block="MyAccountMyWishlist" elem="Items">
                { items.map(this.renderItem) }
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountMyWishlist">
                { this.renderLoader() }
                { this.renderItems() }
            </div>
        );
    }
}

export default MyAccountMyWishlist;
