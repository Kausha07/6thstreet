/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-one-expression-per-line */
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

import Field from "Component/Field";
import Image from "Component/Image";
import Loader from "Component/Loader";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate, getDefaultEddMessage } from "Util/Date/index";
import {
  DEFAULT_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
  DEFAULT_READY_MESSAGE,
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
  INTL_BRAND,
} from "../../util/Common/index";

import PropTypes from "prop-types";
import { PureComponent, lazy, Suspense } from "react";
import { withRouter } from "react-router";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import { Store } from "../Icons";
import "./CartPageItem.extended.style";
import "./CartPageItem.style";
import Price from "Component/Price";
import { EVENT_MOE_VIEW_CART_ITEMS_PRODUCT,MOE_trackEvent } from "Util/Event";
import WishlistIcon from "Component/WishlistIcon";
import trash from "./trash.png";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { getCurrency } from "Util/App";

import { Shipping, ExpressDeliveryTruck } from "Component/Icons";
import isMobile from "Util/Mobile";
const ExpressAndStandardEDD = lazy(() =>
  import("Component/ExpressAndStandardEDD")
);
/**
 * Cart and CartOverlay item
 * @class CartItem
 */
export class CartItem extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    item: CartItemType.isRequired,
    currency_code: PropTypes.string.isRequired,
    brand_name: PropTypes.string,
    isEditing: PropTypes.bool,
    isLikeTable: PropTypes.bool,
    history: PropTypes.object.isRequired,
    handleRemoveItem: PropTypes.func.isRequired,
    minSaleQuantity: PropTypes.number.isRequired,
    maxSaleQuantity: PropTypes.number.isRequired,
    handleChangeQuantity: PropTypes.func.isRequired,
    getCurrentProduct: PropTypes.func.isRequired,
    toggleCartItemQuantityPopup: PropTypes.func.isRequired,
    thumbnail: PropTypes.string.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func,
    availability: PropTypes.number.isRequired,
    isCartPage: PropTypes.bool,
  };

  state = {
    isArabic: isArabic(),
    isNotAvailble: false,

    dragStartX: 0,
    dragStartY: 0,
    dragCount: 0,
    dragDirection: 0,
    dragged: false,
    dragOpen: false,
    dragOpenEl: "",
    intlEddResponseState:{},
    isSignedIn: this.props.isSignedIn,
    setDraggable: true,
    isExpressTimeExpired: false,
  };

  static defaultProps = {
    isEditing: false,
    isLikeTable: false,
    brand_name: "",
    closePopup: () => {},
    isCartPage: false,
  };

  constructor(props) {
    super(props);
    this.cartItemRef = React.createRef();
  }

  setExpressVisible = (visible) => {
    this.setState({
      is_express_visible: visible
    });
  }

  componentDidMount() {
    this.cartItemRef.current.addEventListener(
      "mousedown",
      this.onDragStartMouse
    );
    this.cartItemRef.current.addEventListener("mouseup", this.onDragEndMouse);
    this.cartItemRef.current.addEventListener(
      "mouseleave",
      this.onDragEndMouse
    );
    this.cartItemRef.current.addEventListener(
      "touchstart",
      this.onDragStartTouch
    );
    this.cartItemRef.current.addEventListener("touchend", this.onDragEndTouch);
    this.cartItemRef.current.addEventListener(
      "touchcancel",
      this.onDragEndTouch
    );

    if (this.state.dragged) {
      this.cartItemRef.current.addEventListener("mousemove", this.onMouseMove);
      this.cartItemRef.current.addEventListener("touchmove", this.onTouchMove);
    } else {
      this.cartItemRef.current.removeEventListener(
        "mousemove",
        this.onMouseMove
      );
      this.cartItemRef.current.removeEventListener(
        "touchmove",
        this.onTouchMove
      );
    }
    this.sendMoeEvents();
  }
  componentDidUpdate() {
    if (this.state.dragged) {
      this.cartItemRef.current.addEventListener("mousemove", this.onMouseMove);
      this.cartItemRef.current.addEventListener("touchmove", this.onTouchMove);
    } else {
      this.cartItemRef.current.removeEventListener(
        "mousemove",
        this.onMouseMove
      );
      this.cartItemRef.current.removeEventListener(
        "touchmove",
        this.onTouchMove
      );
    }
  }

  static getDerivedStateFromProps(props) {
    const {
      item: {
        availability = "",
        availableQty,
        qty,
        full_item_info: { reserved_qty },
      },
      intlEddResponse,
      isExpressDelivery,
      totals: { status = null}
    } = props;

    // if (
    //   isExpressDelivery &&
    //   status != null && 
    //   reserved_qty === 0
    // ) {
    //   return { isNotAvailble: true, intlEddResponseState: intlEddResponse };
    // } else if (isExpressDelivery &&
    //   status != null && 
    //   reserved_qty > 0){
    //     return {
    //       isNotAvailble: false, 
    //       intlEddResponseState: intlEddResponse
    //     };
    // }

    return {
      isNotAvailble:
        availability === 0 || availableQty === 0 || qty > availableQty,
        intlEddResponseState:intlEddResponse
    };
  }

  renderProductConfigurationOption = ([key, attribute]) => {
    const {
      item: {
        product: { configurable_options = {} },
      },
    } = this.props;

    const { attribute_code, attribute_value } = attribute;

    if (!Object.keys(configurable_options).includes(key)) {
      return null;
    }

    const {
      [attribute_code]: {
        // configurable option attribute
        attribute_options: {
          [attribute_value]: {
            // attribute option value label
            label,
          },
        },
      },
    } = configurable_options;

    return (
      <li
        key={attribute_code}
        aria-label={attribute_code}
        block="CartPageItem"
        elem="Option"
      >
        {label}
      </li>
    );
  };

  renderProductConfigurations() {
    const {
      item: {
        product: { configurable_options, variants },
      },
      isLikeTable,
      getCurrentProduct,
    } = this.props;

    if (!variants || !configurable_options) {
      return null;
    }

    const { attributes = {} } = getCurrentProduct() || {};

    if (!Object.entries(attributes).length) {
      return null;
    }

    return (
      <ul block="CartPageItem" elem="Options" mods={{ isLikeTable }}>
        {Object.entries(attributes).map(this.renderProductConfigurationOption)}
      </ul>
    );
  }

  routeToProduct = () => {
    const {
      history,
      hideActiveOverlay,
      closePopup,
      item: {
        product: { url },
      },
    } = this.props;

    if (
      window.location.pathname !== "/cart" &&
      window.location.pathname !== "/checkout/shipping"
    ) {
      hideActiveOverlay();
      closePopup();
    }

    history.push(url.split(".com")[1]);
  };

  onDragStartMouse = (evt) => {
    const el = this.cartItemRef.current;
    el?.classList?.add("active");
    this.setState({
      dragged: true,
      dragStartX: evt.clientX,
    });
  };

  onDragStartTouch = (evt) => {
    const touch = evt.targetTouches[0];
    this.setState({
      dragged: true,
      dragStartX: touch.clientX,
    });
  };

  onDragEndMouse = (evt) => {
    this.setState({
      dragged: false,
    });
    const el = this.cartItemRef.current;
    el?.classList?.remove("active");
  };
  onDragEndTouch = (evt) => {
    const touch = evt.changedTouches[0];
    this.setState({
      dragged: false,
      dragStartY: Math.round(touch.clientY),
    });
  };

  onTouchMove = (evt) => {
    const touch = evt.targetTouches[0];
    const dragChange = Math.round(touch.clientX - this.state.dragStartX);
    const dragChangeY = Math.round(touch.clientY - this.state.dragStartY);
    const leftOrRight =
      touch.clientX > this.state.dragStartX
        ? "right"
        : touch.clientX < this.state.dragStartX
        ? "left"
        : "none";

    this.setState({
      dragDirection: leftOrRight,
      dragCount: dragChange,
    });

    const el = this.cartItemRef.current;
    const elBounding = el.getBoundingClientRect();
    if (this.state.isSignedIn) {
      const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    }

    const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    const el2 = el.getElementsByClassName("swipeableItemContent")[0];
    const el3 = el.getElementsByClassName("swipeableItemRightAction")[0];

    let leftDir = this.state.isArabic ? "right" : "left";
    let rightDir = this.state.isArabic ? "left" : "right";
    let leftDirMove = this.state.isArabic ? "98px" : "-98px";
    let rightDirMove = this.state.isArabic ? "-98px" : "98px";
    if (dragChangeY < 20 && dragChangeY > -20) {
      if (this.state.isSignedIn) {
        if (this.state.dragDirection === leftDir) {
          if (this.state.dragOpen && this.state.dragOpenEl === leftDir) {
            el1.style.setProperty("width", 0 + "px");
            el2.style.transform = `translateX(0)`;
            el3.style.setProperty("width", 0 + "px");
            this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
          } else if (!this.state.dragOpen) {
            el1.style.setProperty("width", 0 + "px");
            el2.style.transform = `translateX(${leftDirMove})`;
            el3.style.setProperty("width", 98 + "px");
            this.setState({
              dragOpen: true,
              dragged: false,
              dragOpenEl: rightDir,
            });
          }
        } else if (this.state.dragDirection === rightDir) {
          if (this.state.dragOpen && this.state.dragOpenEl == rightDir) {
            el1.style.setProperty("width", 0 + "px");
            el2.style.transform = `translateX(0)`;
            el3.style.setProperty("width", 0 + "px");
            this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
          } else if (!this.state.dragOpen) {
            el1.style.setProperty("width", 98 + "px");
            el2.style.transform = `translateX(${rightDirMove})`;
            el3.style.setProperty("width", 0 + "px");
            this.setState({
              dragOpen: true,
              dragged: false,
              dragOpenEl: leftDir,
            });
          }
        }
      } else {
        if (this.state.dragDirection === leftDir) {
          if (this.state.dragOpen && this.state.dragDirection === rightDir) {
            el2.style.transform = `translateX(0)`;
            el3.style.setProperty("width", 0 + "px");
            this.setState({ dragOpen: false, dragged: false });
          } else if (
            !this.state.dragOpen &&
            this.state.dragDirection === leftDir
          ) {
            el2.style.transform = `translateX(${leftDirMove})`;
            el3.style.setProperty("width", 98 + "px");
            this.setState({ dragOpen: true, dragged: false });
          }
        } else if (this.state.dragDirection === rightDir) {
          if (this.state.dragOpen && this.state.dragDirection === rightDir) {
            el2.style.transform = `translateX(0)`;
            el3.style.setProperty("width", 0 + "px");
            this.setState({ dragOpen: false, dragged: false });
          } else if (
            !this.state.dragOpen &&
            this.state.dragDirection === leftDir
          ) {
            el2.style.transform = `translateX(${rightDirMove})`;
            el3.style.setProperty("width", 98 + "px");
            this.setState({ dragOpen: true, dragged: false });
          }
        }
      }
    }
  };

  onMouseMove = (evt) => {
    if(!this.state.setDraggable){
      return;
    }
    const dragChange = evt.clientX - this.state.dragStartX;
    const leftOrRight =
      evt.clientX > this.state.dragStartX
        ? "right"
        : evt.clientX < this.state.dragStartX
        ? "left"
        : "none";
    this.setState({
      dragDirection: leftOrRight,
      dragCount: dragChange,
    });

    const el = this.cartItemRef.current;
    const elBounding = el.getBoundingClientRect();
    if (this.state.isSignedIn) {
      const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    }

    const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    const el2 = el.getElementsByClassName("swipeableItemContent")[0];
    const el3 = el.getElementsByClassName("swipeableItemRightAction")[0];

    let leftDir = this.state.isArabic ? "right" : "left";
    let rightDir = this.state.isArabic ? "left" : "right";
    let leftDirMove = this.state.isArabic ? "98px" : "-98px";
    let rightDirMove = this.state.isArabic ? "-98px" : "98px";

    if (this.state.isSignedIn) {
      if (this.state.dragDirection === leftDir) {
        if (this.state.dragOpen && this.state.dragOpenEl === leftDir) {
          el1.style.setProperty("width", 0 + "px");
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 0 + "px");
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: rightDir,
          });
        }
      } else if (this.state.dragDirection === rightDir) {
        if (this.state.dragOpen && this.state.dragOpenEl == rightDir) {
          el1.style.setProperty("width", 0 + "px");
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 98 + "px");
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: leftDir,
          });
        }
      }
    } else {
      if (this.state.dragDirection === leftDir) {
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
        }
      } else if (this.state.dragDirection === rightDir) {
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
        }
      }
    }
  };

  clickMove = (evt) => {
    evt.preventDefault();

    const el = this.cartItemRef.current;
    const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    const el2 = el.getElementsByClassName("swipeableItemContent")[0];
    const el3 = el.getElementsByClassName("swipeableItemRightAction")[0];

    let leftDir = this.state.isArabic ? "right" : "left";
    let rightDir = this.state.isArabic ? "left" : "right";
    let leftDirMove = this.state.isArabic ? "98px" : "-98px";
    let rightDirMove = this.state.isArabic ? "-98px" : "98px";

    if (this.state.dragOpen) {
      el2.style.transform = `translateX(0)`;
      el3.style.width = "0";
      this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
    } else {
      if (this.state.isSignedIn) {
        el1.style.width = "98px";
        el2.style.transform = `translateX(${rightDirMove})`;
        el3.style.width = "0px";
        setTimeout(() => {
          el1.style.width = "0px";
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.width = "98px";
        }, 900);
        this.setState({
          dragOpen: true,
          dragged: false,
          dragOpenEl: rightDir,
        });
      } else {
        el2.style.transform = `translateX(${leftDirMove})`;
        el3.style.width = "98px";
        this.setState({ dragOpen: true, dragged: false, dragOpenEl: leftDir });
      }
    }
  };
  handleSwipe = () => {
    return (
      <button block="SwipeActionBtn" onClick={this.clickMove}>
        <span />
      </button>
    );
  };
  handleSwipeRemoveItem = () => {
    const { handleRemoveItem } = this.props;
    return (
      <div block="actionItem">
        <button
          block=""
          id="RemoveItem"
          name="RemoveItem"
          elem="Delete"
          aria-label="Remove item from cart"
          onClick={handleRemoveItem}
        >
          <img src={trash} alt="trash" />
          <span block="title">{__("Delete")}</span>
        </button>
      </div>
    );
  };

  handleSwipeWishlistItem = () => {
    const { isArabic } = this.state;
    const {
      item: {
        sku,
        full_item_info,
        full_item_info: { config_sku },
      },
      item,
      is_express_visible=false
    } = this.props;
    this.setState({ isSwipe: false });
    const { handleRemoveItem } = this.props;
    return (
      <div block="actionItem">
        <WishlistIcon
          sku={config_sku}
          mods={{ isArabic }}
          pageType="cart-page"
          data={full_item_info}
          swipeWishlist={true}
          renderMySignInPopup={() => {
            handleRemoveItem();
          }}
          is_express_visible={is_express_visible}
        />
        {/* {handleRemoveItem()} */}
        <span block="title">{__("Save to Wishlist")}</span>
      </div>
    );
  };

  renderWrapper() {
    // TODO: implement shared-transition here?

    const {
      item: {
        row_total
      },
    } = this.props;

    if(row_total === 0){
      this.setState({setDraggable : false})
    }

    return (
      <div block="swipeableItem" ref={this.cartItemRef}>
        {this.state.isSignedIn ? (
          <div block="swipeableItemLeftAction" style={{ width: 0 }}>
            {this.handleSwipeWishlistItem()}
          </div>
        ) : null}

        <div block="swipeableItemContent">
          <figure block="CartPageItem" elem="Wrapper">
            {this.renderImage()}
            {this.renderContent()}
          </figure>
        </div>
        <div block="swipeableItemRightAction" style={{ width: 0 }}>
          {this.handleSwipeRemoveItem()}
        </div>
      </div>
    );
  }

  renderProductOptionValue = (optionValue, i, array) => {
    const { label, value } = optionValue;
    const isNextAvailable = Boolean(array[i + 1]);

    return (
      <span block="CartPageItem" elem="ItemOptionValue" key={label}>
        {label || value}
        {isNextAvailable && ", "}
      </span>
    );
  };

  renderProductOption = (option) => {
    const { label, values = [], id } = option;

    return (
      <div block="CartPageItem" elem="ItemOption" key={id}>
        <div block="CartPageItem" elem="ItemOptionLabel" key={`label-${id}`}>
          {`${label}:`}
        </div>
        <div block="CartPageItem" elem="ItemOptionValues">
          {values.map(this.renderProductOptionValue)}
        </div>
      </div>
    );
  };

  renderProductOptions(itemOptions = []) {
    const { isLikeTable } = this.props;

    if (!itemOptions.length) {
      return null;
    }

    return (
      <div
        block="CartPageItem"
        elem="ItemOptionsWrapper"
        mods={{ isLikeTable }}
      >
        {itemOptions.map(this.renderProductOption)}
      </div>
    );
  }

  renderProductName() {
    const {
      item: {
        product: { name },
      },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartPageItem" elem="Heading" mods={{ isArabic }}>
        {name}
      </p>
    );
  }

  renderBrandName() {
    const {
      item: { brand_name },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartPageItem" elem="Heading" mods={{ isArabic }}>
        {brand_name}
      </p>
    );
  }

  renderProductPrice() {
    const {
      currency_code,
      item: {
        row_total,
        basePrice,
        discount_amount = 0,
        full_item_info: { row_total: row_totalforAllQuantities },
        qty,
      },
      totals: { coupon_code },
      config,
      vwoData,
    } = this.props;

    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled = vwoData?.SiteWideCoupon?.isFeatureEnabled || false;
    const { isArabic } = this.state;
    const finalPrice = row_total
      ? row_totalforAllQuantities - discount_amount
      : basePrice - discount_amount;
    let price = [
      {
        [currency_code]: {
          "6s_base_price": basePrice,
          "6s_special_price": row_total,
          default: row_total,
          default_formated: `${currency_code} ${row_total}`,
          finalPrice: finalPrice,
          discount_amount: discount_amount / qty,
          newFinalPrice: finalPrice/qty,
        },
      },
    ];

    return (
      <>
        <div
          block="CartPageItem"
          elem={`Price ${
            coupon_code && discount_amount && !isSidewideCouponEnabled ? "couponPriceActive" : null
          }`}
          mods={{ isArabic }}
        >
          <Price
            price={price}
            renderSpecialPrice={false}
            cart={true}
            coupon_code={coupon_code}
            itemType={"Cart"}
            pageType="CartPage"
          />
        </div>
        {coupon_code && !isSidewideCouponEnabled ? (
          discount_amount ? (
            <div block="discountedCouponAppliedBlock">
              <span block="couponAppliedFinalPrice">
                {currency_code} {finalPrice.toFixed(2)}
              </span>
              <span block="couponAppliedText">
                {isMobile.any() && "("}
                {currency_code} {discount_amount.toFixed(2)}{" "}
                {__("Coupon applied")}
                {isMobile.any() && ")"}
              </span>
            </div>
          ) : null
        ) : null}
      </>
    );
  }

  renderClickAndCollectStoreName() {
    const {
      item: { extension_attributes },
    } = this.props;

    const { isArabic } = this.state;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div block="CartPageItem" elem="ClickAndCollect" mods={{ isArabic }}>
          <div block="CartPageItem-ClickAndCollect" elem="icon">
            <Store />
          </div>
          <div block="CartPageItem-ClickAndCollect" elem="StoreName">
            {extension_attributes?.click_to_collect_store_name}
          </div>
        </div>
      );
    }
    return null;
  }

  renderColSizeQty() {
    const {
      item: {
        color,
        optionValue,
        qty,
        full_item_info: { size_option },
      },
      toggleCartItemQuantityPopup,
    } = this.props;
    const { isArabic, setDraggable, isNotAvailble } = this.state;
    return (
      <div block="CartPageItem" elem="ColSizeQty" mods={{ isArabic }}>
        {color && (
          <>
            <span block="CartItem-ColSizeQty" elem="Col">
              <span>{__("Color:")}</span>
              <span>{color}</span>
            </span>
            <span block="pipe">&nbsp;|&nbsp;</span>
          </>
        )}
        <span
          block="CartItem-ColSizeQty"
          elem="Qty"
          onClick={() => !isNotAvailble && setDraggable ? toggleCartItemQuantityPopup() : null}
        >
          <span>{__("Qty:")}</span>
          <span>{qty}</span>
        </span>
        {optionValue && (
          <>
            <span block="pipe">&nbsp;|&nbsp;</span>
            <span>
              <span>{__("Size: ")}</span>
              <span>{`${size_option || ""} ${optionValue}`}</span>
            </span>
          </>
        )}
      </div>
    );
  }

  formatEddMessage = (crossBorder) => {
    const {
      eddResponse,
      edd_info,
      item: { extension_attributes, brand_name = "", sku, full_item_info: {international_vendor=null} },
      intlEddResponse,
    } = this.props;
    const { isArabic } = this.state;
    let actualEddMess = "";
    const defaultDay = extension_attributes?.click_to_collect_store
      ? edd_info.ctc_message
      : edd_info.default_message;
    const {
      defaultEddDay,
      defaultEddMonth,
      defaultEddDat,
    } = getDefaultEddDate(defaultDay);

    let itemEddMessage = extension_attributes?.click_to_collect_store
        ? DEFAULT_READY_MESSAGE
        : DEFAULT_MESSAGE;
      let customDefaultMess = isArabic
        ? EDD_MESSAGE_ARABIC_TRANSLATION[itemEddMessage]
        : itemEddMessage;

    if(edd_info.has_item_level){
      if(!(crossBorder && !edd_info.has_cross_border_enabled)) {
        if (eddResponse && isObject(eddResponse) && eddResponse["cart"]) {
          eddResponse["cart"].filter((data) => {
            if (data.sku === sku && data.feature_flag_status === 1) {
              if (extension_attributes?.click_to_collect_store) {
                actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
              } else {
                actualEddMess = isArabic
                  ? data.edd_message_ar
                  : data.edd_message_en;
              }
            }
          });
        } else {
          const isIntlBrand = edd_info.international_vendors && edd_info.international_vendors.indexOf(international_vendor)!==-1
          if(isIntlBrand && edd_info?.intl_vendor_edd_range) {
            const date_range = edd_info.intl_vendor_edd_range?.[international_vendor?.toLowerCase()]?.split("-");
            const start_date = date_range && date_range[0] ? date_range[0] : edd_info.default_message ;
            const end_date = date_range && date_range[1] ? date_range[1]: 0;
            const { defaultEddMess } = getDefaultEddMessage(
              parseInt(start_date),
              parseInt(end_date),
              1
            );
            actualEddMess = defaultEddMess;
          } else {
            actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
          }
        }
      }
    } else {
      const isIntlBrand =
      (edd_info.international_vendors && edd_info.international_vendors.includes(international_vendor?.toString().toLowerCase()) && crossBorder) ||
      (crossBorder && edd_info && edd_info.has_cross_border_enabled);
      const intlEddObj = intlEddResponse["cart"]?.find(
        ({ vendor }) => vendor.toLowerCase() === international_vendor?.toString().toLowerCase()
      );
      const intlEddMess = intlEddObj
        ? isArabic
          ? intlEddObj["edd_message_ar"]
          : intlEddObj["edd_message_en"]
        : isIntlBrand
        ? isArabic
          ? intlEddResponse["cart"][0]["edd_message_ar"]
          : intlEddResponse["cart"][0]["edd_message_en"]
        : "";
      if (eddResponse && isObject(eddResponse)) {

        if (isIntlBrand) {
          actualEddMess = intlEddMess;
        } else {
          Object.values(eddResponse).filter((entry) => {
            if (entry.source === "cart" && entry.feature_flag_status === 1) {
              if (extension_attributes?.click_to_collect_store) {
                actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
              } else {
                actualEddMess = isArabic
                  ? entry.edd_message_ar
                  : entry.edd_message_en;
              }
            }
          });
        }
      } else {
        actualEddMess = isIntlBrand
          ? intlEddMess
          : `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
      }
    }
    return actualEddMess;
  }

  setTimerStateThroughProps = (val) => {
    this.setState({ isExpressTimeExpired: val });
  };

  renderEddWhenExpressEnabled = (crossBorder) => {
    const {
      edd_info,
      item: {
        full_item_info: {
          cross_border = 0,
          express_delivery = "",
          mp_quantity = 0,
          store_quantity = 0,
          whs_quantity = 0,
        },
        extension_attributes,
      },
      international_shipping_fee,
      isExpressDelivery,
      vwoData,
      setExpressVisible
    } = this.props;

    let actualEddMess = this.formatEddMessage(crossBorder);
    const isIntlBrand =
      cross_border === 1 && edd_info && edd_info.has_cross_border_enabled;
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;

    if (!actualEddMess) {
      return null;
    }

    const isExpressProduct = false;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div block="" mods={{ isArabic }}>
          <Shipping />
          <span>{splitReadyByKey}</span>
          <span>{actualEddMess.split(splitReadyByKey)[1]}</span>
        </div>
      );
    }

    return (
      <div block="EddExpressWrapper">
        <Suspense fallback={<div>{__("Loading Express Info")}</div>}>
          <ExpressAndStandardEDD
            express_delivery={express_delivery}
            actualEddMess={actualEddMess}
            splitKey={splitKey}
            isPDP={false}
            isIntlBrand={isIntlBrand}
            cross_border={cross_border}
            isCart={true}
            whs_quantity={whs_quantity}
            store_quantity={store_quantity}
            mp_quantity={mp_quantity}
            isExpressTimeExpired={this.state.isExpressTimeExpired}
            setTimerStateThroughProps={this.setTimerStateThroughProps}
            setExpressVisible={setExpressVisible}
          />
        </Suspense>
      </div>
    );
  };

  renderEdd = (crossBorder) => {
    const { item: { extension_attributes } } = this.props;
    let actualEddMess = this.formatEddMessage(crossBorder);

    if (!actualEddMess) {
      return null;
    }
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;

    return (
      <div block="" mods={{ isArabic }}>
        <Shipping />
        {extension_attributes?.click_to_collect_store ? (
          <span>{splitReadyByKey}</span>
        ) : (
          <span>
            {actualEddMess.split(splitKey)[0]}
            {splitKey}
          </span>
        )}
        {extension_attributes?.click_to_collect_store ? (
          <span>{actualEddMess.split(splitReadyByKey)[1]}</span>
        ) : (
          <span>{actualEddMess.split(splitKey)[1]}</span>
        )}
      </div>
    );
  };

  renderIntlTag() {
    return (
      <span block="AdditionShippingInformation">
        {__("International Shipment")}
      </span>
    );
  }

  renderOOSMessage(){
    return(
      <span block="CartItem" elem="NotAvailable">
      {__("Not available")}
    </span>
    )
  }

  renderQTYUnavailableMSG = (qty, reserved_qty, availableQty) => {
    if (reserved_qty!= 0 && reserved_qty < qty) {
      return (
        <div block="stockQuantityNotReservedText">{__("Only %s qty available. Please update.", reserved_qty)}</div>
      );
    } else return null;
  };

  renderContent() {
    const {
      isLikeTable,
      edd_info,
      item: {
        customizable_options,
        bundle_options,
        full_item_info: { cross_border = 0, reserved_qty = 0, available_qty = 0 },
        international_vendor = null,
        brand_name = "",
        row_total,
        qty,
      },
      intlEddResponse,
      international_shipping_fee,
      isExpressDelivery,
      vwoData,
      totals: { status = null},
    } = this.props;
    const { isNotAvailble } = this.state;
    const isIntlBrand =
      (cross_border === 1) &&
      edd_info &&
      edd_info.has_cross_border_enabled;

    return (
      <figcaption block="CartPageItem" elem="Content" mods={{ isLikeTable }}>
        {row_total === 0 ? null : this.handleSwipe()}
        {this.renderBrandName()}
        {this.renderProductName()}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderProductConfigurations()}
        {this.renderColSizeQty()}
        {isNotAvailble ? this.renderOOSMessage() : <>{this.renderProductPrice()}</>}
        {this.renderClickAndCollectStoreName()}
        {this.renderActions()}
        {(!isExpressDelivery || !vwoData?.Express?.isFeatureEnabled) &&  edd_info && 
          edd_info.is_enable &&
          edd_info.has_cart &&
          ((isIntlBrand && Object.keys(intlEddResponse).length>0) || cross_border === 0 || edd_info?.has_item_level) &&
          !isNotAvailble &&
          this.renderEdd(cross_border === 1)}
          {isExpressDelivery && vwoData?.Express?.isFeatureEnabled && edd_info &&
          edd_info.is_enable &&
          edd_info.has_cart &&
          ((isIntlBrand && Object.keys(intlEddResponse).length>0) || cross_border === 0 || edd_info?.has_item_level) &&
          !isNotAvailble &&
          this.renderEddWhenExpressEnabled(cross_border === 1)}
        {(!isExpressDelivery || !vwoData?.Express?.isFeatureEnabled) && (isIntlBrand || (international_shipping_fee && (+cross_border || (edd_info.international_vendors && edd_info.international_vendors.indexOf(international_vendor)>-1)))) ?  this.renderIntlTag() : null}
        {!isNotAvailble && status!= null && 
          isExpressDelivery &&
          this.renderQTYUnavailableMSG(qty, reserved_qty, available_qty)}
      </figcaption>
    );
  }
  sendMoeEvents() {
    const {
      item: {
        full_item_info: {
          basePrice,
          brand_name,
          category,
          color,
          config_sku,
          gender,
          itemPrice,
          name,
          original_price,
          price,
          product_type_6s,
          size_option,
          size_value,
          sku,
          subcategory,
          thumbnail_url,
          url,
        },
      },
    } = this.props;
    MOE_trackEvent(EVENT_MOE_VIEW_CART_ITEMS_PRODUCT, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      brand_name: brand_name || "",
      category: gender|| category || "",
      subcategory: subcategory || "",
      color: color || "",
      brand_name: brand_name || "",
      full_price: original_price || basePrice || "",
      product_url: url || "",
      currency: getCurrency() || "",
      gender: gender || "",
      product_sku: config_sku || sku,
      discounted_price: itemPrice || price,
      product_image_url: thumbnail_url || "",
      product_name: name || "",
      size_id: size_option || "",
      size: size_value || "",
      app6thstreet_platform: "Web",
    });
  }
  renderActions() {
    const {
      isEditing,
      isLikeTable,
      item: { qty },
      minSaleQuantity,
      maxSaleQuantity,
      handleRemoveItem,
      handleChangeQuantity,
    } = this.props;
    const { isArabic, isNotAvailble } = this.state;

    return (
      <div
        block="CartPageItem"
        elem="Actions"
        mods={{ isEditing, isLikeTable, isArabic }}
      >
        <button
          block="CartPageItem"
          id="RemoveItem"
          name="RemoveItem"
          elem="Delete"
          aria-label="Remove item from cart"
          onClick={handleRemoveItem}
        >
          <span />
        </button>
        {isNotAvailble ? (
          <span block="CartPageItem" elem="NotAvailable">
            {__("Not available")}
          </span>
        ) : (
          <Field
            id="item_qty"
            name="item_qty"
            type="number"
            isControlled
            min={minSaleQuantity}
            max={maxSaleQuantity}
            mix={{ block: "CartPageItem", elem: "Qty" }}
            value={qty}
            onChange={handleChangeQuantity}
          />
        )}
      </div>
    );
  }

  renderImage() {
    const {
      item: {
        product: { name },
        full_item_info: { url_key },
      },
      thumbnail,
      isCartPage,
    } = this.props;
    const { isArabic } = this.state;
    let customURL = `${url_key}.html`;

    return (
      <div onClick={() => this.props.history.push(customURL)}>
        <Image
          lazyLoad={true}
          src={thumbnail}
          mix={{
            block: "CartPageItem",
            elem: "Picture",
            mods: { isArabic, isCartPage },
          }}
          ratio="custom"
          alt={`Product ${name} thumbnail.`}
        />
        <Image
          lazyLoad={true}
          style={{ display: "none" }}
          alt={name}
          src={thumbnail}
        />
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;
    return (
      <li block="CartPageItem">
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(CartItem);
