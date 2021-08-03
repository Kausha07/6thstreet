/* eslint-disable fp/no-let */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import Event, {
  EVENT_GTM_PRODUCT_ADD_TO_WISHLIST,
  EVENT_GTM_PRODUCT_REMOVE_FROM_WISHLIST,
} from "Util/Event";
import { Favourite, FavouriteFilled } from "../Icons";
import "./WishlistIcon.style";
class WishlistIcon extends PureComponent {
  static propTypes = {
    sku: PropTypes.string.isRequired,
    removeFromWishlist: PropTypes.func.isRequired,
    addToWishlist: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
  };

  state = {
    skuFromProps: "",
  };

  static getDerivedStateFromProps(props) {
    const { sku } = props;

    return {
      skuFromProps: sku,
    };
  }

  handleClick = () => {
    const { addToWishlist, removeFromWishlist, items, data } = this.props;
    const { skuFromProps } = this.state;
    const wishListItem = items.find(
      ({ product: { sku } }) => sku === skuFromProps
    );

    if (wishListItem) {
      const { wishlist_item_id } = wishListItem;
      removeFromWishlist(wishlist_item_id);
      Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_WISHLIST, {
        product: {
          brand_name: wishListItem.product.brand_name,
          name: wishListItem.product.name,
          price: wishListItem.product.price,
          sku: wishListItem.product.sku,
          thumbnail_url: wishListItem.product.thumbnail_url,
          url: wishListItem.product.url,
        },
      });
      return;
    }

    addToWishlist(skuFromProps);
    Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_WISHLIST, { product: data });
  };

  isBlack = (item) => {
    const { skuFromProps } = this.state;
    const {
      product: { sku: wishlistSku },
    } = item;

    return skuFromProps === wishlistSku;
  };

  renderIcon() {
    const { items = [] } = this.props;
    const blackMod = items.some(this.isBlack);

    return (
      <button
        block="WishlistIcon"
        elem="Icon"
        aria-label="Wishlist"
        onClick={this.handleClick}
      >
        {blackMod ? <FavouriteFilled /> : <Favourite />}
      </button>
    );
  }

  render() {
    return <div block="WishlistIcon">{this.renderIcon()}</div>;
  }
}

export default WishlistIcon;
