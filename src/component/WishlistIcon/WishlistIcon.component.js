/* eslint-disable fp/no-let */
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { VUE_ADD_TO_WISHLIST, VUE_REMOVE_TO_WISHLIST } from "Util/Event";
import { Favourite, FavouriteFilled } from "../Icons";
import "./WishlistIcon.style";

class WishlistIcon extends PureComponent {
  static propTypes = {
    sku: PropTypes.string.isRequired,
    removeFromWishlist: PropTypes.func.isRequired,
    addToWishlist: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    pageType: PropTypes.string.isRequired,
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
    const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender;
    const {
      addToWishlist,
      removeFromWishlist,
      items,
      data,
      pageType = "wishlist",
    } = this.props;
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const { skuFromProps } = this.state;

    const wishListItem = items.find(
      ({ product: { sku } }) => sku === skuFromProps
    );

    if (wishListItem) {
      const { wishlist_item_id } = wishListItem;
      removeFromWishlist(wishlist_item_id);
      const prodPriceObject = wishListItem?.product?.price[0];
      const prodPrice = prodPriceObject
        ? prodPriceObject[Object.keys(prodPriceObject)[0]]["6s_base_price"]
        : "";
      // to do add 6s_special_price when we get response from backend.
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_REMOVE_TO_WISHLIST,
        params: {
          event: VUE_REMOVE_TO_WISHLIST,
          pageType: pageType,
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          prodPrice: prodPrice,
          sourceCatgID: gender,
          sourceProdID: skuFromProps,
          uuid: getUUID(),
          referrer: "desktop",
          userID: userID,
        },
      });
      return;
    }

    addToWishlist(skuFromProps);
    const priceObject = data.price[0];
    const itemPrice = priceObject
      ? priceObject[Object.keys(priceObject)[0]]["6s_special_price"]
      : "";
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_ADD_TO_WISHLIST,
      params: {
        event: VUE_ADD_TO_WISHLIST,
        pageType: pageType,
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        prodPrice: itemPrice,
        sourceCatgID: gender,
        sourceProdID: skuFromProps,
        uuid: getUUID(),
        referrer: "desktop",
        userID: userID,
      },
    });
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
