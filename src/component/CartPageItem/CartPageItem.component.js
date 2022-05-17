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
import { getDefaultEddDate } from "Util/Date/index";
import {
  DEFAULT_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
} from "../../util/Common/index";

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import { Store } from "../Icons";
import "./CartPageItem.extended.style";
import "./CartPageItem.style";
import Price from "Component/Price";

import WishlistIcon from "Component/WishlistIcon";
import trash from "./trash.png"

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
    dragCount: 0,
    dragDirection: 0,
    dragged: false,
    dragOpen: false,
    dragOpenEl: "",
    isSignedIn: this.props.isSignedIn,
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
  componentDidMount() {
    // window.addEventListener("mouseup", this.onDragEndMouse);
    // window.addEventListener("mouseleave", this.onDragEndMouse);
    // window.addEventListener("touchend", this.onDragEndTouch);

    this.cartItemRef.current.addEventListener(
      "mousedown",
      this.onDragStartMouse
    );
    this.cartItemRef.current.addEventListener("mouseup", this.onDragEndMouse);
    this.cartItemRef.current.addEventListener(
      "mouseleave",
      this.onDragEndMouse
    );
    //this.cartItemRef.current.addEventListener("mousemove", this.onMouseMove);

    this.cartItemRef.current.addEventListener(
      "touchstart",
      this.onDragStartTouch
    );
    this.cartItemRef.current.addEventListener("touchend", this.onDragEndTouch);
    this.cartItemRef.current.addEventListener(
      "touchcancel",
      this.onDragEndTouch
    );
    //this.cartItemRef.current.addEventListener("touchmove", this.onTouchMove);

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
      item: { availability = "", availableQty, qty },
    } = props;

    return {
      isNotAvailble:
        availability === 0 || availableQty === 0 || qty > availableQty,
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
    //this.onDragStart(evt.clientX);
    const el = this.cartItemRef.current;
    el.classList.add("active");
    this.setState({
      dragged: true,
      dragStartX: evt.clientX,
    });
    //el.addEventListener("mousemove", this.onMouseMove(evt));
    //console.log("onDragStartMouse", this.state);
  };

  // this.cartItemRef.current.addEventListener('ontouchstart',this.onDragStartTouch)
  //   this.cartItemRef.current.addEventListener('ontouchend',this.onDragEndTouch)
  //   this.cartItemRef.current.addEventListener('ontouchcancel',this.onDragEndTouch)
  //   this.cartItemRef.current.addEventListener('ontouchmove',this.onTouchMove)

  onDragStartTouch = (evt) => {
    const touch = evt.targetTouches[0];
    this.setState({
      dragged: true,
      dragStartX: touch.clientX,
    });
    //console.log("onDragStartTouch", this.state);
  };

  onDragEndMouse = (evt) => {
    //evt.preventDefault();
    this.setState({
      dragged: false,
    });
    const el = this.cartItemRef.current;
    el.classList.remove("active");
    //el.removeEventListener("mouseup", this.onMouseMove);
    //this.onDragEnd();
    //console.log("onDragEndMouse", this.state);
  };
  onDragEndTouch = (evt) => {
    this.setState({
      dragged: false,
    });
    //console.log("onDragEndTouch", this.state);
  };

  // onDragStart = (clientX) => {
  //   this.setState({
  //     dragged:true,
  //     dragStartX:clientX
  //   });

  //   // this.state.dragged = true;
  //   // this.state.dragStartX = clientX;
  //   //requestAnimationFrame(this.updatePosition);
  //   console.log("onDragStart", this.state);
  // };

  // onDragEnd = () => {
  //   if (this.state.dragged) {
  //     this.setState({ dragged: false });
  //     // const threshold = this.props.threshold || 0.3;

  //     // if (this.left < this.listElement.offsetWidth * threshold * -1) {
  //     //   this.left = -this.listElement.offsetWidth * 2;
  //     //   this.onSwiped();
  //     // } else {
  //     //   this.left = 0;
  //     // }
  //   }
  //   console.log("onDradEnd", this.state);
  // };

  onTouchMove = (evt) => {
    const touch = evt.targetTouches[0];
    const dragChange = touch.clientX - this.state.dragStartX;
    const leftOrRight =
      touch.clientX > this.state.dragStartX
        ? "right"
        : touch.clientX < this.state.dragStartX
        ? "left"
        : "none";
    //console.log("leftOrRight", evt, evt.type, evt.button);

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
    let leftDirMove = this.state.isArabic ? "116px" : "-116px";
    let rightDirMove = this.state.isArabic ? "-116px" : "116px";

    if (this.state.isSignedIn) {
      ////
      console.log("sign");

      if (this.state.dragDirection === leftDir) {
        if (this.state.dragOpen && this.state.dragOpenEl === leftDir) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(-16px)";
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(-16px)";
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: rightDir,
          });
        }
        //document.getElementById("myDIV").style.transform = "translateX(16px)";
      } else if (this.state.dragDirection === rightDir) {
        if (this.state.dragOpen && this.state.dragOpenEl == rightDir) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(16px)";
          el2.style.transform = `translateX(0})`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 98 + "px");
          //el2.style.transform = "translateX(16px)";
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: leftDir,
          });
        }
      }

      ////
    } else {
      if (this.state.dragDirection === leftDir) {
        //console.log("welcome left");
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
          console.log("llll-bbbbb");
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
          console.log("llll-aaaaa");
        }
        //document.getElementById("myDIV").style.transform = "translateX(16px)";
      } else if (this.state.dragDirection === rightDir) {
        //console.log("welcome right");
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
          console.log("rrrr- bbbbb");
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
          console.log("rrrr- aaaaa");
        }
      }
    }

    console.log("onTouchMove", this.state);
  };

  onMouseMove = (evt) => {
    //console.log("mouseMove", evt);
    const dragChange = evt.clientX - this.state.dragStartX;
    const leftOrRight =
      evt.clientX > this.state.dragStartX
        ? "right"
        : evt.clientX < this.state.dragStartX
        ? "left"
        : "none";
    //console.log("leftOrRight", evt, evt.type, evt.button);

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
    let leftDirMove = this.state.isArabic ? "116px" : "-116px";
    let rightDirMove = this.state.isArabic ? "-116px" : "116px";

    // let leftDir, rightDir, leftDirMove, rightDirMove;
    // if(this.state.isArabic){
    //   leftDir = "left";
    //   rightDir = "right";
    //   leftDirMove = "-16px";
    //   rightDirMove = "16px";
    // }else{
    //   leftDir = "right";
    //   rightDir = "left";
    //   leftDirMove = "16px";
    //   rightDirMove = "-16px";
    // }

    // if (this.state.dragDirection === leftDir) {
    //   el1.style.setProperty("width", 98 + "px");
    //   el2.style.transform = "translateX(16px)";
    //   el3.style.setProperty("width", 0 + "px");
    //   //document.getElementById("myDIV").style.transform = "translateX(16px)";
    // } else if (this.state.dragDirection === rightDir) {
    //   el1.style.setProperty("width", 0 + "px");
    //   el2.style.transform = "translateX(-16px)";
    //   el3.style.setProperty("width", 98 + "px");
    // }

    if (this.state.isSignedIn) {
      ////
      console.log("sign");

      if (this.state.dragDirection === leftDir) {
        if (this.state.dragOpen && this.state.dragOpenEl === leftDir) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(-16px)";
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(-16px)";
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: rightDir,
          });
        }
        //document.getElementById("myDIV").style.transform = "translateX(16px)";
      } else if (this.state.dragDirection === rightDir) {
        if (this.state.dragOpen && this.state.dragOpenEl == rightDir) {
          el1.style.setProperty("width", 0 + "px");
          //el2.style.transform = "translateX(16px)";
          el2.style.transform = `translateX(0})`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false, dragOpenEl: "" });
        } else if (!this.state.dragOpen) {
          el1.style.setProperty("width", 98 + "px");
          //el2.style.transform = "translateX(16px)";
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({
            dragOpen: true,
            dragged: false,
            dragOpenEl: leftDir,
          });
        }
      }

      ////
    } else {
      if (this.state.dragDirection === leftDir) {
        //console.log("welcome left");
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
          console.log("llll-bbbbb");
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${leftDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
          console.log("llll-aaaaa");
        }
        //document.getElementById("myDIV").style.transform = "translateX(16px)";
      } else if (this.state.dragDirection === rightDir) {
        //console.log("welcome right");
        if (this.state.dragOpen && this.state.dragDirection === rightDir) {
          el2.style.transform = `translateX(0)`;
          el3.style.setProperty("width", 0 + "px");
          this.setState({ dragOpen: false, dragged: false });
          console.log("rrrr- bbbbb");
        } else if (
          !this.state.dragOpen &&
          this.state.dragDirection === leftDir
        ) {
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.setProperty("width", 98 + "px");
          this.setState({ dragOpen: true, dragged: false });
          console.log("rrrr- aaaaa");
        }
      }
    }

    console.log(
      "drag fix",
      this.state.isArabic,
      this.state.dragDirection,
      this.state.dragged,
      this.state.dragOpenEl
    );

    // if (left < 0) {
    //   this.setState({
    //     dragDirection: leftOrRight,
    //     dragCount : dragChange
    //   })
    // }else{
    //   this.setState({
    //     dragDirection: leftOrRight,
    //     dragCount : dragChange
    //   })
    // }
    //console.log("onMouseMove", this.state);
  };

  clickMove = (evt) => {
    evt.preventDefault();

    const el = this.cartItemRef.current;
    const el1 = el.getElementsByClassName("swipeableItemLeftAction")[0];
    const el2 = el.getElementsByClassName("swipeableItemContent")[0];
    const el3 = el.getElementsByClassName("swipeableItemRightAction")[0];

    let leftDir = this.state.isArabic ? "right" : "left";
    let rightDir = this.state.isArabic ? "left" : "right";
    let leftDirMove = this.state.isArabic ? "116px" : "-116px";
    let rightDirMove = this.state.isArabic ? "-116px" : "116px";

    if (this.state.dragOpen) {
      console.log("aaa");
      el2.style.transform = `translateX(0)`;
      el3.style.width = "0";
      this.setState({ dragOpen: false, dragged: false, dragOpenEl: leftDir });
      
    } else {
      
      

      if (this.state.isSignedIn ) {
        el1.style.width = "0px";
        el2.style.transform = `translateX(${leftDirMove})`;
        el3.style.width = "98px";
        setTimeout(() => {
          el1.style.width = "98px";
          el2.style.transform = `translateX(${rightDirMove})`;
          el3.style.width = "0px";
        }, 800);
        this.setState({
          dragOpen: false,
          dragged: false,
          dragOpenEl: rightDir,
        });
      } else {        
        el2.style.transform = `translateX(${leftDirMove})`;
        el3.style.width = "98px";
        this.setState({ dragOpen: true, dragged: false, dragOpenEl: leftDir });
      }
    }
  }

  handleSwipeRemoveItem = () => {
    const {      
      handleRemoveItem,
    } = this.props;
    return(
        <div block="actionItem">
          <button
            block=""
            id="RemoveItem"
            name="RemoveItem"
            elem="Delete"
            aria-label="Remove item from cart"
            onClick={handleRemoveItem}
          >
            <img src={trash} alt="trash"/>
            <span block="title">Delete</span>
          </button>
        </div>
        
        
    )
  }

  handleSwipeWishlistItem = ()=>{
    const { isArabic } = this.state;
    const { item: { sku, full_item_info,full_item_info: { config_sku }, }, item } = this.props;
    console.log(this.props)
    this.setState({isSwipe : false})
    return(
      <div block="actionItem">
        <WishlistIcon
          sku={config_sku}      
          mods={{ isArabic }}
          pageType="cart-page"
          data={full_item_info}
          renderMySignInPopup = {()=>{}}
        />
        <span block="title">Save to Wishlist</span>
      </div>
      
    )
  }


  renderWrapper() {
    // TODO: implement shared-transition here?

    return (
      <div
        block="swipeableItem"
        ref={this.cartItemRef}
        // onMouseDown={this.onDragStartMouse}
        // onMouseUp={this.onDragEndMouse}
        //onTouchStart={this.onDragStartTouch}
      >
        {this.state.isSignedIn ? (
          <div block="swipeableItemLeftAction" style={{ width: 0 }}>
              {this.handleSwipeWishlistItem()}
          </div>
        ) : null}

        <div block="swipeableItemContent">
          {/* <button onClick={this.clickMove}>Close</button> */}
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
      item: { row_total, basePrice },
    } = this.props;

    const { isArabic } = this.state;
    let price = [
      {
        [currency_code]: {
          "6s_base_price": basePrice,
          "6s_special_price": row_total,
          default: row_total,
          default_formated: `${currency_code} ${row_total}`,
        },
      },
    ];

    return (
      <div block="CartPageItem" elem="Price" mods={{ isArabic }}>
        <Price price={price} renderSpecialPrice={false} cart={true} />
      </div>
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
    const { isArabic } = this.state;
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
          onClick={() => toggleCartItemQuantityPopup()}
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
  renderEdd = () => {
    const { eddResponse, edd_info } = this.props;
    const { isArabic } = this.state;
    let actualEddMess = "";
    let actualEdd = "";
    const {
      defaultEddDateString,
      defaultEddDay,
      defaultEddMonth,
      defaultEddDat,
    } = getDefaultEddDate(edd_info.default_message);
    let customDefaultMess = isArabic
      ? EDD_MESSAGE_ARABIC_TRANSLATION[DEFAULT_MESSAGE]
      : DEFAULT_MESSAGE;
    if (eddResponse) {
      if (isObject(eddResponse)) {
        Object.values(eddResponse).filter((entry) => {
          if (entry.source === "cart" && entry.featute_flag_status === 1) {
            actualEddMess = isArabic
              ? entry.edd_message_ar
              : entry.edd_message_en;
            actualEdd = entry.edd_date;
          }
        });
      } else {
        actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
        actualEdd = defaultEddDateString;
      }
    } else {
      actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
      actualEdd = defaultEddDateString;
    }

    if (!actualEddMess) {
      return null;
    }
    let splitKey = isArabic ? "بواسطه" : "by";

    return (
      <div block="AreaText">
        <span>
          {actualEddMess.split(splitKey)[0]}
          {splitKey}
        </span>
        <span>{actualEddMess.split(splitKey)[1]}</span>
      </div>
    );
  };

  renderContent() {
    const {
      isLikeTable,
      edd_info,
      item: {
        customizable_options,
        bundle_options,
        full_item_info: { cross_border },
      },
    } = this.props;
    const { isNotAvailble } = this.state;

    return (
      <figcaption block="CartPageItem" elem="Content" mods={{ isLikeTable }}>
        {this.renderBrandName()}
        {this.renderProductName()}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderProductConfigurations()}
        {this.renderColSizeQty()}
        {!isNotAvailble && (
          <>
            {this.renderProductPrice()}
            {this.renderClickAndCollectStoreName()}
          </>
        )}
        {this.renderActions()}
        {edd_info &&
          edd_info.is_enable &&
          edd_info.has_cart &&
          cross_border === 0 &&
          this.renderEdd()}
      </figcaption>
    );
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
          // onClick={handleRemoveItem}
          onClick={this.clickMove}
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
