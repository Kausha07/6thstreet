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

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { CART_EDITING, CART_OVERLAY } from "Component/Header/Header.config";
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from "Component/MyAccountOverlay/MyAccountOverlay.config";
import { CHECKOUT_URL } from "Route/Checkout/Checkout.config";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import { TotalsType } from "Type/MiniCart";
import { isSignedIn } from "Util/Auth";
import history from "Util/History";
import Event, {
  EVENT_MOE_VIEW_BAG,
  EVENT_MOE_BEGIN_CHECKOUT,
  MOE_trackEvent,
  EVENT_GTM_CART,
} from "Util/Event";
import CartOverlay from "./CartOverlay.component";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";

export const CartDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Cart/Cart.dispatcher"
);

export const mapStateToProps = (state) => ({
  totals: state.CartReducer.cartTotals,
  guest_checkout: state.ConfigReducer.guest_checkout,
  currencyCode: state.ConfigReducer.default_display_currency_code,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  config: state.AppConfig.config,
  vwoData: state.AppConfig.vwoData,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
});

export const mapDispatchToProps = (dispatch) => ({
  setNavigationState: (stateName) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  updateTotals: (options) =>
    CartDispatcher.then(({ default: dispatcher }) =>
      dispatcher.updateTotals(dispatch, options)
    ),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
});

export class CartOverlayContainer extends PureComponent {
  static propTypes = {
    totals: TotalsType.isRequired,
    guest_checkout: PropTypes.bool,
    changeHeaderState: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    setNavigationState: PropTypes.func.isRequired,
    isPopup: PropTypes.bool.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    isCheckoutAvailable: PropTypes.bool.isRequired,
    closePopup: PropTypes.func.isRequired,
  };

  static defaultProps = {
    guest_checkout: true,
  };

  state = { 
    isEditing: false,
    isOosOverlayShow: false,
  };

  containerFunctions = {
    changeHeaderState: this.changeHeaderState.bind(this),
    handleCheckoutClick: this.handleCheckoutClick.bind(this),
    handleViewBagClick: this.handleViewBagClick.bind(this),
    handleOosOverlay: this.handleOosOverlay.bind(this),
  };


  getPageType() {
    const { urlRewrite, currentRouteName } = window;

    if (currentRouteName === "url-rewrite") {
      if (typeof urlRewrite === "undefined") {
        return "";
      }

      if (urlRewrite.notFound) {
        return "notfound";
      }

      return (urlRewrite.type || "").toLowerCase();
    }

    return (currentRouteName || "").toLowerCase();
  }

  handleOosOverlay(currentState) {
    this.setState({ isOosOverlayShow: currentState });
  }

  handleViewBagClick() {
    const {
      hideActiveOverlay,
      closePopup,
      isCheckoutAvailable,
      showNotification,
      totals,
    } = this.props;
    MOE_trackEvent(EVENT_MOE_VIEW_BAG, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      screen_name: this.getPageType() || "",
      isLoggedIn: isSignedIn(),
      app6thstreet_platform: "Web",
    });
    Event.dispatch(EVENT_GTM_CART, totals);
    hideActiveOverlay();
    closePopup();
    if (!isCheckoutAvailable) {
      showNotification(
        "error",
        __("Some products or selected quantities are no longer available")
      );
    }
  }
  sendBeginCheckoutEvent() {
    const {
      totals: {
        items,
        coupon_code,
        currency_code,
        discount,
        shipping_fee,
        subtotal,
        total,
      },
    } = this.props;
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    let productName = [],
      productColor = [],
      productBrand = [],
      productSku = [],
      productGender = [],
      productBasePrice = [],
      productSizeOption = [],
      productSizeValue = [],
      productSubCategory = [],
      productThumbanail = [],
      productUrl = [],
      productQty = [],
      productCategory = [],
      productItemPrice = [];
    let is_express_visible = false;
    items.forEach((item) => {
      let productKeys = item?.full_item_info;
      productName.push(productKeys?.name);
      productColor.push(productKeys?.color);
      productBrand.push(productKeys?.brand_name);
      productSku.push(productKeys?.config_sku);
      productGender.push(productKeys?.gender);
      productBasePrice.push(productKeys?.original_price);
      productSizeOption.push(productKeys?.size_option);
      productSizeValue.push(productKeys?.size_value);
      productSubCategory.push(productKeys?.subcategory);
      productThumbanail.push(productKeys?.thumbnail_url);
      productUrl.push(productKeys?.url);
      productQty.push(productKeys?.qty);
      productCategory.push(productKeys?.original_price);
      productItemPrice.push(productKeys?.itemPrice);
      if(['today delivery', 'tomorrow delivery'].indexOf(item?.full_item_info?.express_delivery?.toLowerCase()) > -1 ){
        is_express_visible= true;
      }
    });
    const city = BrowserDatabase.getItem("currentSelectedAddress") &&
        BrowserDatabase.getItem("currentSelectedAddress")?.city
        ? BrowserDatabase.getItem("currentSelectedAddress").city
        : null;
    const area = BrowserDatabase.getItem("currentSelectedAddress") &&
        BrowserDatabase.getItem("currentSelectedAddress")?.area
        ? BrowserDatabase.getItem("currentSelectedAddress").area
        : null;
    MOE_trackEvent(EVENT_MOE_BEGIN_CHECKOUT, {
      city: city,
      area: area,
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      category: currentAppState?.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      coupon_code_applied: coupon_code || "",
      currency: currency_code || "",
      discounted_amount: discount || "",
      product_count: productQty || "",
      shipping_fee: shipping_fee || "",
      subtotal_amount: subtotal || "",
      total_amount: total || "",
      brand_name: productBrand.length > 0 ? productBrand : "",
      color: productColor.length > 0 ? productColor : "",
      discounted_price: productItemPrice.length > 0 ? productItemPrice : "",
      full_price: productBasePrice.length > 0 ? productBasePrice : "",
      product_name: productName.length > 0 ? productName : "",
      product_sku: productSku.length > 0 ? productSku : "",
      gender: productGender.length > 0 ? productGender : "",
      size_id: productSizeOption.length > 0 ? productSizeOption : "",
      size: productSizeValue.length > 0 ? productSizeValue : "",
      subcategory: productSubCategory.length > 0 ? productSubCategory : "",
      app6thstreet_platform: "Web",
      is_express_visible: is_express_visible
    });
  }
  handleCheckoutClick(e) {
    const {
      guest_checkout,
      showOverlay,
      showNotification,
      setNavigationState,
      isCheckoutAvailable,
    } = this.props;

    if (isCheckoutAvailable) {
      // to prevent outside-click handler trigger
      e.nativeEvent.stopImmediatePropagation();
      if (guest_checkout) {
        this.sendBeginCheckoutEvent();
        history.push({ pathname: CHECKOUT_URL });
        return;
      }

      if (isSignedIn()) {
        this.sendBeginCheckoutEvent();
        history.push({ pathname: CHECKOUT_URL });
        return;
      }

      // there is no mobile, as cart overlay is not visible here
      showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
      showNotification("info", __("Please sign-in to complete checkout!"));
      setNavigationState({
        name: CUSTOMER_ACCOUNT_OVERLAY_KEY,
        title: "Sign in",
      });
    } else {
      this.handleOosOverlay(true);
      showNotification(
        "error",
        __("Some products or selected quantities are no longer available")
      );
    }
  }

  changeHeaderState() {
    const {
      changeHeaderState,
      totals: { count = 0 },
    } = this.props;
    const title = __("%s Items", count || 0);

    changeHeaderState({
      name: CART_OVERLAY,
      title,
      onEditClick: () => {
        this.setState({ isEditing: true });
        changeHeaderState({
          name: CART_EDITING,
          title,
          onOkClick: () => this.setState({ isEditing: false }),
          onCancelClick: () => this.setState({ isEditing: false }),
        });
      },
      onCloseClick: () => this.setState({ isEditing: false }),
    });
  }

  render() {
    const { vwoData } = this.props;
    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled = vwoData?.SiteWideCoupon?.isFeatureEnabled || false;
    return (
      <CartOverlay
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
        isSidewideCouponEnabled={isSidewideCouponEnabled}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartOverlayContainer);
