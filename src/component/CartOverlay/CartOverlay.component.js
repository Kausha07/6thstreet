/* eslint-disable no-magic-numbers */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import CartItem from "Component/CartItem";
import CmsBlock from "Component/CmsBlock";
import { CART_OVERLAY } from "Component/Header/Header.config";
import Image from "Component/Image";
import Link from "Component/Link";
import { FIXED_CURRENCIES } from "Component/Price/Price.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import Overlay from "SourceComponent/Overlay";
import { TotalsType } from "Type/MiniCart";
import { isArabic, getDiscountFromTotals } from "Util/App";
import isMobile from "Util/Mobile";
import "./CartOverlay.style";
import Delivery from "./icons/delivery-truck.png";
import CartNudge from "./../../route/CartPage/CartNudges/CartNudge";
import MiniEmptyCartNudge from "./MiniEmptyCartNudge/MiniEmptyCartNudge";
import RemoveOOS from "Component/RemoveOOS/RemoveOOS";
import { getSideWideSavingPercentages } from "Component/SideWideCoupon/utils/SideWideCoupon.helper";

export class CartOverlay extends PureComponent {
  static propTypes = {
    totals: TotalsType.isRequired,
    onVisible: PropTypes.func,
    handleCheckoutClick: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    handleViewBagClick: PropTypes.func.isRequired,
    isHidden: PropTypes.bool,
    isCheckoutAvailable: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isHidden: false,
    onVisible: () => { },
  };

  state = {
    isArabic: isArabic(),
    isPopup: false,
    isOOSProducts: false,
  };

  componentDidMount() {
    const { showOverlay } = this.props;
    if (!isMobile.any()) {
      showOverlay(CART_OVERLAY);
    }
  }

  renderPriceLine(price) {
    const {
      totals: { quote_currency_code },
    } = this.props;
    const decimals = FIXED_CURRENCIES.includes(quote_currency_code) ? 3 : 2;

    return `${quote_currency_code} ${parseFloat(price).toFixed(decimals)}`;
  }

  fitlerOutOfStokItems = ( items = [] ) => {
    let avibaleProducts = [];
    let outOfStokProducts =[];
    items.map((item)=>{
      if(item?.availableQty === 0 || item?.availableQty < item?.qty){
        outOfStokProducts.push(item);
      }else {
        avibaleProducts.push(item);
      }
    });
    
    if(outOfStokProducts.length > 0){
      this.setState({ isOOSProducts: true })
    }
      
    return [ ...avibaleProducts, ... outOfStokProducts ];
  }

  renderCartItems() {
    const {
      totals: { items = [], quote_currency_code },
      closePopup,
    } = this.props;

    if (!items || items.length < 1) {
      return this.renderNoCartItems();
    }

    const cartItems = this.fitlerOutOfStokItems(items);

    return (
      <ul block="CartOverlay" elem="Items" aria-label="List of items in cart">
        {cartItems.map((item) => (
          <CartItem
            key={item.item_id}
            item={item}
            currency_code={quote_currency_code}
            brand_name={item.brand_name}
            isEditing
            closePopup={closePopup}
          />
        ))}
      </ul>
    );
  }

  renderNoCartItems() {
    return (
      <>
        <p block="CartOverlay" elem="Empty">
          {__("You have no items in your shopping cart.")}
        </p>
        <MiniEmptyCartNudge />
      </>
    );
  }

  renderTotals() {
    const {
      totals: { items = [], subtotal },
    } = this.props;
    const { isArabic } = this.state;

    if (!items || items.length < 1) {
      return null;
    }

    return (
      <dl block="CartOverlay" elem="Total" mods={{ isArabic }}>
        <dt>
          {__("Subtotal ")}
        </dt>
        <dd>{this.renderPriceLine(subtotal)}</dd>
      </dl>
    );
  }

  renderDiscount() {
    const {
      totals: { coupon_code, 
        discount, 
        discount_amount,
        site_wide_applied = 0,
        site_wide_coupon,
        total_segments: totals = [],
        },
    } = this.props;
    const finalDiscount = discount_amount || discount || 0;
    const totalDiscount = getDiscountFromTotals(totals, "total_discount") || 0;
    const sideWideSavingPercentages = getSideWideSavingPercentages(totals);

    if (
      (!coupon_code &&
        !finalDiscount &&
        finalDiscount === 0 &&
        !site_wide_applied) ||
      sideWideSavingPercentages === 0
    ) {
      return null;
    }

    return (
      <dl block="CartOverlay" elem="Discount">
        <dt>
          {coupon_code || site_wide_applied ? __("Coupon ") : __("Discount")}
          <strong block="CartOverlay" elem="DiscountCouponSideWide">
            {coupon_code ? coupon_code.toUpperCase() : site_wide_applied ? site_wide_coupon.toUpperCase() : ""}
            <div className="sidewideSavingPercentages">{`(-${getSideWideSavingPercentages(totals)}%)`}</div>
          </strong>
        </dt>
        {coupon_code ? (
          <dd>{`-${this.renderPriceLine(Math.abs(finalDiscount))}`}</dd>
        ) : (
          <dd>{`${this.renderPriceLine(Math.abs(totalDiscount))}`}</dd>
        )}
      </dl>
    );
  }

  renderShipping() {
    const {
      totals: { shipping_fee },
    } = this.props;

    if (!shipping_fee || shipping_fee === 0) {
      return null;
    }

    return (
      <dl block="CartOverlay" elem="Discount">
        <dt>{__("Shipping fee")}</dt>
        <dd>{this.renderPriceLine(shipping_fee)}</dd>
      </dl>
    );
  }

  renderInternationalShipping() {
    const {
      totals: { items = [], international_shipping_amount = 0 },
      international_shipping_fee,
    } = this.props;
    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });
    if (
      inventory_level_cross_border &&
      international_shipping_fee &&
      international_shipping_amount
    ) {
      return (
        <dl block="CartOverlay" elem="Discount">
          <dt>{__("International Shipping fee")}</dt>
          <dd>{this.renderPriceLine(international_shipping_amount)}</dd>
        </dl>
      );
    }
  }

  renderActions() {
    const {
      totals: { items = [] },
      handleCheckoutClick,
      handleViewBagClick,
      isCheckoutAvailable,
    } = this.props;

    if (!items || items.length < 1) {
      return null;
    }

    const isDisabled = !isCheckoutAvailable;

    return (
      <div block="CartOverlay" elem="Actions">
        <Link
          block="CartOverlay"
          elem="CartButton"
          to={{
            pathname: "/cart",
            state: {
              prevPath: window.location.href,
            },
          }}
          onClick={handleViewBagClick}
        >
          {__("View bag")}
        </Link>
        <button
          block="CartOverlay"
          elem="CheckoutButton"
          mods={{ isDisabled }}
          onClick={handleCheckoutClick}
        >
          {__("Checkout")}
        </button>
      </div>
    );
  }

  renderPromoContent() {
    const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
    const {
      totals: { currency_code, avail_free_shipping_amount, avail_free_intl_shipping_amount, items=[]},
      international_shipping_fee
    } = this.props;
    const { isArabic } = this.state;

    if (cart_cms) {
      return <CmsBlock identifier={cart_cms} />;
    }

    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });

    return (
      <div block="CartOverlay" elem="PromoBlock">
        <figcaption block="CartOverlay" elem="PromoText" mods={{ isArabic }}>
          <Image lazyLoad={true} src={Delivery} alt="Delivery icon" />
          {__("Add ")}
          {
            international_shipping_fee && inventory_level_cross_border ?
            <span block="CartOverlay" elem="Currency">
              {`${currency_code} ${avail_free_intl_shipping_amount.toFixed(3)} `}
            </span>
            :
            <span block="CartOverlay" elem="Currency">
              {`${currency_code} ${avail_free_shipping_amount.toFixed(3)} `}
            </span>
          }
          {__("more to your cart for ")}
          <span block="CartOverlay" elem="FreeDelivery">
            {__("Free delivery")}
          </span>
        </figcaption>
      </div>
    );
  }

  renderFreeShippingContent() {
    return (
      <div block="CartOverlay" elem="PromoFreeShipping">
        <span>{__("Free delivery*. More info ")}</span>
        <Link to="/shipping-policy">{__("here.")}</Link>
      </div>
    );
  }

  renderPromo() {
    const {
      totals: { avail_free_shipping_amount, avail_free_intl_shipping_amount, items = []},
      international_shipping_fee,
    } = this.props;

    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });

    if (((!international_shipping_fee || (international_shipping_fee && !inventory_level_cross_border)) && (!avail_free_shipping_amount && avail_free_shipping_amount !== 0)) || (international_shipping_fee && inventory_level_cross_border && !avail_free_intl_shipping_amount && avail_free_intl_shipping_amount !== 0)) {
      return null;
    }
    return (
      <div block="CartOverlay" elem="Promo">
        {((!international_shipping_fee || (international_shipping_fee && !inventory_level_cross_border)) && avail_free_shipping_amount === 0) || (international_shipping_fee && inventory_level_cross_border && avail_free_intl_shipping_amount === 0)
          ? this.renderFreeShippingContent()
          : this.renderPromoContent()}
      </div>
    );
  }

  onCloseClick = () => {
    this.setState({ isPopup: true });
  };

  renderItemSuffix() {
    const {
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    return totalQuantity === 1 ? __(" item") : __(" items");
  }

  renderItemCount() {
    const {
      hideActiveOverlay,
      closePopup,
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    const svg = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path
          d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
        />
      </svg>
    );

    return (
      <div block="CartOverlay" elem="ItemCount">
        <div>
          {__("My Basket")}
          <div>
            {/* {totalQuantity}
            {this.renderItemSuffix()} */}
          </div>
        </div>
        <button onClick={hideActiveOverlay && closePopup}>{svg}</button>
      </div>
    );
  }

  closeremoveOosOverlay =()=> {
    const { handleOosOverlay } =  this.props;
    handleOosOverlay(false);
  }

  renderRemoveOOS() {
    const { totals } = this.props;
    const { isArabic } = this.state;
    return (
        <RemoveOOS
          closeremoveOosOverlay={this.closeremoveOosOverlay}
          totals={totals}
          isArabic={isArabic}
        />
    )
  }

  render() {
    const { onVisible, isHidden, hideActiveOverlay, closePopup, totals, isOosOverlayShow } = this.props;
    const { isArabic, isPopup, isOOSProducts } = this.state;

    return (
      <>
        <button
          block="HeaderCart"
          elem="PopUp"
          mods={{ isHidden }}
          onClick={hideActiveOverlay && closePopup}
        >
          closes popup
        </button>
        <Overlay
          id={CART_OVERLAY}
          onVisible={onVisible}
          mix={{ block: "CartOverlay", mods: { isArabic, isPopup } }}
        >
          {this.renderItemCount()}
          { totals?.items?.length > 0 && <CartNudge /> }
          {this.renderCartItems()}
          {this.renderTotals()}
          {this.renderShipping()}
          {this.renderInternationalShipping()}
          {this.renderDiscount()}
          {this.renderActions()}
          {this.renderPromo()}
          {(isOOSProducts && isOosOverlayShow) ? this.renderRemoveOOS() : null}
        </Overlay>
      </>
    );
  }
}

export default CartOverlay;
