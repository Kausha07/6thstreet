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
import CartItemQuantityPopup from "Component/CartItemQuantityPopup";
import { CART_ITEM_QUANTITY_POPUP_ID } from "Component/CartItemQuantityPopup/CartItemQuantityPopup.config";
import { DEFAULT_MAX_PRODUCTS } from "../../util/Common/index";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
// import { getStore } from "Store";
import browserHistory from "Util/History";
import { showNotification } from "Store/Notification/Notification.action";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import { CartItemType } from "Type/MiniCart";
import { getUUID } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { isSignedIn } from "Util/Auth";
import Event, {
  EVENT_GTM_PRODUCT_ADD_TO_CART,
  EVENT_GTM_PRODUCT_REMOVE_FROM_CART,
  VUE_ADD_TO_CART,
  VUE_REMOVE_FROM_CART,
  EVENT_MOE_ADD_TO_CART,
  EVENT_MOE_REMOVE_FROM_CART,
  EVENT_MOE_REMOVE_FROM_CART_FAILED,
  MOE_trackEvent
} from "Util/Event";
import CartPageItem from "./CartPageItem.component";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getCurrency } from "Util/App";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { setEddResponse } from "Store/MyAccount/MyAccount.action";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { isArabic } from "Util/App";
import {CART_ITEMS_CACHE_KEY} from "../../store/Cart/Cart.reducer";

export const CartDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Cart/Cart.dispatcher"
);

export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
  eddResponse: state.MyAccountReducer.eddResponse,
  intlEddResponse: state.MyAccountReducer.intlEddResponse,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  addressCityData: state.MyAccountReducer.addressCityData,
  edd_info: state.AppConfig.edd_info,
  totals: state.CartReducer.cartTotals,
  couponsItems: state.CartReducer.cartCoupons,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  config: state.AppConfig.config,
  vwoData: state.AppConfig.vwoData,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
});

export const CART_ID_CACHE_KEY = "CART_ID_CACHE_KEY";

export const mapDispatchToProps = (dispatch) => ({
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(dispatch, request, type),
  setEddResponse: (response, request) =>
    dispatch(setEddResponse(response, request)),
  addProduct: (options) =>
    CartDispatcher.then(({ default: dispatcher }) =>
      dispatcher.addProductToCart(dispatch, options)
    ),
  updateProductInCart: (
    item_id,
    quantity,
    color,
    optionValue,
    discount,
    brand_name,
    thumbnail_url,
    url,
    row_total
  ) =>
    CartDispatcher.then(({ default: dispatcher }) =>
      dispatcher.updateProductInCart(
        dispatch,
        item_id,
        quantity,
        color,
        optionValue,
        discount,
        brand_name,
        thumbnail_url,
        url,
        row_total
      )
    ),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  removeProduct: (options) =>
    CartDispatcher.then(({ default: dispatcher }) =>
      dispatcher.removeProductFromCart(dispatch, options)
    ),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
});

export class CartItemContainer extends PureComponent {
  static propTypes = {
    item: CartItemType.isRequired,
    currency_code: PropTypes.string.isRequired,
    brand_name: PropTypes.string,
    updateProductInCart: PropTypes.func.isRequired,
    removeProduct: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    brand_name: "",
  };

  state = {
    isLoading: false,
    showCartItemQuantityPopup: false,
    isArabic: isArabic(),
    is_express_visible: false
  };

  setExpressVisible = (visible) => {
    this.setState({
      is_express_visible: visible
    });
  }

  handlers = [];

  containerFunctions = {
    handleChangeQuantity: this.handleChangeQuantity.bind(this),
    handleRemoveItem: this.handleRemoveItem.bind(this),
    getCurrentProduct: this.getCurrentProduct.bind(this),
    toggleCartItemQuantityPopup: () => this.toggleCartItemQuantityPopup(),
    setExpressVisible: this.setExpressVisible.bind(this)
  };

  getIdFromCityArea = (addressCityData, city, area) => {
    let cityEntry;
    let areaEntry;
    const { isArabic } = this.state;
    Object.values(addressCityData).filter((entry) => {
      if (entry.city === city || entry.city_ar === city) {
        cityEntry = isArabic ? entry.city_ar : entry.city;
        if (entry.city === city) {
          Object.values(entry.areas).filter((cityArea, index) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas_ar[index] : entry.areas[index];
            }
          });
        } else {
          Object.values(entry.areas_ar).filter((cityArea,index) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas_ar[index] : entry.areas[index];
            }
          });
        }
      }
    });
    return { cityEntry, areaEntry };
  };

  getCityAreaFromStorage = (addressCityData, countryCode) => {
    const sessionData = JSON.parse(localStorage.getItem("EddAddressReq"));
    const { city, area } = sessionData;
    const { cityEntry, areaEntry } = this.getIdFromCityArea(
      addressCityData,
      city,
      area
    );
    let data = { area: areaEntry, city: cityEntry, country: countryCode };
    this.getEddResponse(data, false);
  };

  getCityAreaFromDefault = (addressCityData, countryCode) => {
    const { defaultShippingAddress } = this.props;
    const { area, city } = defaultShippingAddress;
    const { cityEntry, areaEntry } = this.getIdFromCityArea(
      addressCityData,
      city,
      area
    );
    let data = { area: areaEntry, city: cityEntry, country: countryCode };
    this.getEddResponse(data, false);
  };

  getEddResponse = (data, type) => {
    const { estimateEddResponse, edd_info } = this.props;
    const { area, city, country } = data;

    let request = {
      country: country,
      city: city,
      area: area,
      courier: null,
      source: null,
    };
    let payload = {};
    if(edd_info?.has_item_level) {
      let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
      request.intl_vendors=null;
      let items = [];
      items_in_cart.map(item => {
        if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info.has_cross_border_enabled)) {
          payload = { sku : item.sku, intl_vendor : edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item.full_item_info.international_vendor: null}
          payload["qty"] = parseInt(item?.full_item_info?.available_qty);
          payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
          payload["brand"] = item?.full_item_info?.brand_name;
          items.push(payload);
        }
      });
      request.items = items;
      if(items.length) estimateEddResponse(request, type);
    } else {
      estimateEddResponse(request, type);
    }
  };

  validateEddStatus = () => {
    const countryCode = getCountryFromUrl();
    const { defaultShippingAddress, addressCityData, setEddResponse } =
      this.props;
    if (isSignedIn() && defaultShippingAddress) {
      this.getCityAreaFromDefault(addressCityData, countryCode);
    } else if (
      isSignedIn() &&
      !defaultShippingAddress &&
      localStorage.getItem("EddAddressReq")
    ) {
      this.getCityAreaFromStorage(addressCityData, countryCode);
    } else if (!isSignedIn() && localStorage.getItem("EddAddressReq")) {
      this.getCityAreaFromStorage(addressCityData, countryCode);
    } else {
      setEddResponse(null, null);
    }
  };
  componentDidMount() {
    let prevLocation;
    let finalPrevLocation;
    browserHistory.listen((nextLocation) => {
      finalPrevLocation = prevLocation;
      prevLocation = nextLocation;
      if (finalPrevLocation && finalPrevLocation.pathname === "/checkout") {
        this.validateEddStatus();
      }
    });
  }

  componentWillUnmount() {
    if (this.handlers.length) {
      [].forEach.call(this.handlers, (cancelablePromise) =>
        cancelablePromise.cancel()
      );
    }
  }

  /**
   * @returns {Product}
   */
  getCurrentProduct() {
    const {
      item: { product },
    } = this.props;
    return product;
  }

  getMinQuantity() {
    const { stock_item: { min_sale_qty } = {} } =
      this.getCurrentProduct() || {};
    return min_sale_qty || 1;
  }

  getMaxQuantity() {
    const {
      item: {
        availableQty = 0,
        full_item_info: { reserved_qty = 0 },
      },
      totals: { status = null },
      isExpressDelivery,
    } = this.props;
    let max_sale_qty = 0;

    if (status != null && isExpressDelivery &&  availableQty === 0) {
      max_sale_qty = reserved_qty;
    }

    max_sale_qty =
      availableQty === 0
        ? availableQty
        : availableQty >= DEFAULT_MAX_PRODUCTS
        ? DEFAULT_MAX_PRODUCTS
        : availableQty;
    return max_sale_qty;
  }

  setStateNotLoading = () => {
    this.setState({ isLoading: false });
  };

  containerProps = () => ({
    thumbnail: this._getProductThumbnail(),
    minSaleQuantity: this.getMinQuantity(),
    maxSaleQuantity: this.getMaxQuantity(),
  });

  /**
   * Handle item quantity change. Check that value is <1
   * @param {Number} quantity new quantity
   * @return {void}
   */
  handleChangeQuantity(quantity) {
    this.setState({ isLoading: true }, () => {
      const {
        updateProductInCart,
        item: {
          item_id,
          color,
          optionValue,
          product: { name, url, thumbnail },
          brand_name,
          basePrice,
          row_total,
          sku,
          qty: oldQuantity,
          objectID,
        },
        showNotification,
      } = this.props;

      updateProductInCart(
        item_id,
        quantity,
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail.url,
        url,
        row_total
      )
        .then((response) => {
          // Response exist only if error appear
          if (response) {
            showNotification("error", __(response));
          } else {
            showNotification("success", __("Quantity successfully updated"));
            if (oldQuantity < quantity) {
              this.sendMoEImpressions(EVENT_MOE_ADD_TO_CART);
            } else {
              this.sendMoEImpressions(EVENT_MOE_REMOVE_FROM_CART);
            }
          }

          this.setStateNotLoading();
        })
        .finally(() => {
          const { showCartItemQuantityPopup } = this.state;
          if (showCartItemQuantityPopup) {
            this.setState({
              showCartItemQuantityPopup: false,
            });
          }
        });

      const event =
        oldQuantity < quantity
          ? EVENT_GTM_PRODUCT_ADD_TO_CART
          : EVENT_GTM_PRODUCT_REMOVE_FROM_CART;

      Event.dispatch(event, {
        product: {
          brand: brand_name,
          category: "",
          id: sku,
          name,
          price: row_total,
          quantity: 1,
          size: optionValue,
          variant: color,
        },
      });
    });
  }

  removeEddData(sku) {
    const { edd_info, eddResponse } = this.props;
    let eddRequest = localStorage.getItem("EddAddressReq");
    if(edd_info && edd_info.is_enable && edd_info.has_item_level && eddResponse && isObject(eddResponse) && Object.keys(eddResponse).length) {
      let obj = {};
      Object.keys(eddResponse).map(page => {
        if(eddResponse[page] && eddResponse[page].length) {
          obj[page] = [];
          eddResponse[page].map((eddVal, i) => {
            if(eddVal.sku != sku) {
              obj[page].push(eddVal);
            }
          })
          if(obj[page].length==0){
            delete obj[page];
          }
        }
      })
      if(obj && Object.keys(obj).length==0){
        this.props.setEddResponse(null, eddRequest);
      } else {
        localStorage.setItem("EddAddressRes", obj);
        this.props.setEddResponse(obj, JSON.parse(eddRequest));
      }
    }
  }

  /**
   * @return {void}
   */
  handleRemoveItem() {
    this.setState({ isLoading: true }, () => {
      const {
        removeProduct,
        item: {
          item_id,
          brand_name,
          sku,
          color,
          qty,
          availability,
          product: { name } = {},
          full_item_info: {
            config_sku,
            category,
            price,
            size_option,
            size_value,
            itemPrice,
            original_price,
            discount_amount
          },
          product_type_6s,
        },
        prevPath = null,
      } = this.props;
      removeProduct(item_id)
        .then((data) => {
          this.setStateNotLoading();
          this.sendMoEImpressions(EVENT_MOE_REMOVE_FROM_CART);
          this.removeEddData(sku);
        })
        .catch(() => {
          this.sendMoEImpressions(EVENT_MOE_REMOVE_FROM_CART_FAILED);
        });
      Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
        product: {
          name,
          id: config_sku || sku,
          price: itemPrice,
          brand: brand_name,
          category: category,
          variant: color,
          quantity: qty,
          size: size_value,
          size_option: size_option, 
          variant_availability: availability, 
          discount: discount_amount,
          is_express_visible: this.state.is_express_visible
        },
      });

      // vue analytics
      const locale = VueIntegrationQueries.getLocaleFromUrl();
      const customer = BrowserDatabase.getItem("customer");
      const userID = customer && customer.id ? customer.id : null;
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_REMOVE_FROM_CART,
        params: {
          event: VUE_REMOVE_FROM_CART,
          pageType: "cart",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          uuid: getUUID(),
          referrer: prevPath,
          url: window.location.href,
          sourceProdID: config_sku,
          sourceCatgID: product_type_6s,
          prodPrice: price,
          userID: userID,
        },
      });
    });
  }
  sendMoEImpressions(event) {
    const {
      item: {
        full_item_info: {
          basePrice,
          brand_name,
          color,
          config_sku,
          gender,
          itemPrice,
          item_id,
          name,
          original_price,
          product_type_6s,
          qty,
          size_option,
          size_value,
          subcategory,
          thumbnail_url,
          price,
          url,
        },
      },
      prevPath = null,
    } = this.props;

    const getCartID = BrowserDatabase.getItem(CART_ID_CACHE_KEY)
      ? BrowserDatabase.getItem(CART_ID_CACHE_KEY)
      : "";
    const city = BrowserDatabase.getItem("currentSelectedAddress") &&
      BrowserDatabase.getItem("currentSelectedAddress")?.city
      ? BrowserDatabase.getItem("currentSelectedAddress").city
      : null;
    const area = BrowserDatabase.getItem("currentSelectedAddress") &&
        BrowserDatabase.getItem("currentSelectedAddress")?.area
        ? BrowserDatabase.getItem("currentSelectedAddress").area
        : null;
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    MOE_trackEvent(event, {
      city: city,
      area: area,
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      category: currentAppState?.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      subcategory: product_type_6s || subcategory || "",
      color: color || "",
      brand_name: brand_name || "",
      full_price: original_price || basePrice || "",
      product_url: url || "",
      currency: getCurrency() || "",
      gender: currentAppState?.gender?.toUpperCase() || gender || "",
      product_sku: config_sku || item_id || "",
      discounted_price: itemPrice || price || "",
      product_image_url: thumbnail_url || "",
      product_name: name || "",
      size_id: size_option || "",
      size: size_value || "",
      quantity: qty || "",
      cart_id: getCartID || "",
      isLoggedIn: isSignedIn(),
      app6thstreet_platform: "Web",
      is_express_visible: this.state.is_express_visible
    });

    // vue analytics
    let vueEventName = "";
    if (event === EVENT_MOE_ADD_TO_CART) {
      vueEventName = VUE_ADD_TO_CART;
    } else if (event === EVENT_MOE_REMOVE_FROM_CART) {
      vueEventName = VUE_REMOVE_FROM_CART;
    }

    const locale = VueIntegrationQueries.getLocaleFromUrl();
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: vueEventName,
      params: {
        event: vueEventName,
        pageType: "cart",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath,
        url: window.location.href,
        sourceProdID: config_sku,
        sourceCatgID: product_type_6s,
        prodPrice: price,
        userID: userID,
      },
    });
  }
  /**
   * @returns {int}
   */
  _getVariantIndex() {
    const {
      item: { sku: itemSku = "", product: { variants = [] } = {} },
    } = this.props;

    return variants.findIndex(
      ({ sku }) => sku === itemSku || itemSku.includes(sku)
    );
  }

  /**
   * Get link to product page
   * @param url_key Url to product
   * @return {{pathname: String, state Object}} Pathname and product state
   */

  _getProductThumbnail() {
    const product = this.getCurrentProduct();
    const { thumbnail: { url: thumbnail } = {} } = product;
    return thumbnail || "";
  }

  toggleCartItemQuantityPopup() {
    const { showOverlay } = this.props;
    const { showCartItemQuantityPopup } = this.state;

    if (!showCartItemQuantityPopup) {
      showOverlay(CART_ITEM_QUANTITY_POPUP_ID);
    }

    if (showCartItemQuantityPopup) {
      hideActiveOverlay(CART_ITEM_QUANTITY_POPUP_ID);
    }

    this.setState({
      showCartItemQuantityPopup: !showCartItemQuantityPopup,
    });
  }

  render() {
    const { minSaleQuantity, maxSaleQuantity } = this.containerProps();
    const { handleChangeQuantity } = this.containerFunctions;
    const {
      item: { qty },
    } = this.props;
    const { showCartItemQuantityPopup } = this.state;
    return (
      <>
        <CartPageItem
          {...this.props}
          {...this.state}
          {...this.containerFunctions}
          {...this.containerProps()}
        />
        {showCartItemQuantityPopup && (
          <CartItemQuantityPopup
            min={minSaleQuantity}
            max={maxSaleQuantity}
            value={qty}
            toggle={this.toggleCartItemQuantityPopup.bind(this)}
            onChange={handleChangeQuantity}
          />
        )}
      </>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CartItemContainer)
);
