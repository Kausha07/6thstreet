import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
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
        return 'You have no items in your wish list.';
    }

    renderButtons(product) {
        const { url } = product;
        const { pathname } = new URL(url);

        const linkTo = {
            pathname,
            state: { product }
        };

        return (
            <div block="MyAccountMyWishlist" elem="Buttons">
                <Link to={ linkTo }>
                    { __('Details') }
                </Link>
                <Link to={ linkTo }>
                    { __('Add to bag') }
                </Link>
            </div>
        );
    }

    renderItem = (item) => {
        const { product, wishlist_item_id } = item;

        return (
            <div block="MyAccountMyWishlist" elem="Item">
                <ProductItem
                  key={ wishlist_item_id }
                  product={ product }
                />
                { this.renderButtons(product) }
            </div>
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
