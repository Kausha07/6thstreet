/* eslint-disable import/no-cycle, @scandipwa/scandipwa-guidelines/create-config-files */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import MyAccountDispatcher, {
  CUSTOMER,
} from "Store/MyAccount/MyAccount.dispatcher";
import BrowserDatabase from "Util/BrowserDatabase";
import {
  EVENT_PROMOTION_IMPRESSION,
  EVENT_GTM_VIEW_PROMOTION,
  EVENT_PRODUCT_IMPRESSION,
  EVENT_GTM_VIEW_ITEM_LIST,
  EVENT_GTM_CANCEL_SEARCH,
  EVENT_GTM_CLEAR_SEARCH,
  EVENT_GTM_GO_TO_SEARCH,
  EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK,
  EVENT_CLICK_SEARCH_WISH_LIST_CLICK,
  EVENT_GTM_VIEW_SEARCH_RESULTS,
  EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW,
  EVENT_CLICK_RECENT_SEARCHES_CLICK,
  EVENT_EXPLORE_MORE_SEARCH_CLICK,
  EVENT_GTM_SEARCH_LOGS_SCREEN_VIEW,
  EVENT_GTM_SEARCH_SCREEN_VIEW,
  EVENT_CLICK_TOP_SEARCHES_CLICK,
  EVENT_CLICK_RECOMMENDATION_CLICK,
  EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK,
  EVENT_GTM_PAGE_NOT_FOUND,
  EVENT_GTM_SEARCH,
  EVENT_GTM_FOOTER,
  EVENT_GTM_COUPON,
  EVENT_GTM_SORT,
  EVENT_GTM_FILTER,
  EVENT_GTM_PDP_TRACKING,
  EVENT_GTM_AUTHENTICATION,
  EVENT_GTM_NEW_AUTHENTICATION,
  EVENT_GTM_TOP_NAV_CLICK,
  EVENT_GTM_CUSTOMER_SUPPORT,
  EVENT_GTM_CHECKOUT_BILLING,
  EVENT_PAGE_LOAD,
  EVENT_GTM_INFLUENCER,
  EVENT_FILTER_CLEAR_ALL,
  EVENT_FILTER_ATTRIBUTE_SELECTED,
  EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED,
  EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED,
  EVENT_FILTER_SEARCH_CLICK,
  EVENT_FILTER_SEARCH_VALUE_SELECTED,
  EVENT_GTM_CART,
  EVENT_SIZE_PREDICTION_CLICK,
  EVENT_COLOUR_VARIENT_CLICK,
  EVENT_FLIP_IMAGE_SCROLL,
  EVENT_PRODUCT_RATING_CLICK,
  EVENT_PRODUCT_RATING_CLEAR,
  EVENT_PRODUCT_RATING_VALUE,
  EVENT_MYORDERPAGE_VISIT,
  EVENT_ORDERDETAILPAGE_VISIT,
  EVENT_ORDERDETAILPAGE_CHANNEL,
} from "Util/Event";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";
import AddToCartEvent from "./events/AddToCart.event";
import EddVisibilityEvent from "./events/EddVisibility.event";
import EddTrackOnOrderEvent from "./events/EddDateOnOrder.event";
import AddToWishlistEvent from "./events/AddToWishlist.event";
import BannerClickEvent from "./events/BannerClickEvent.event";
import BannerImpressionEvent from "./events/BannerImpression.event";
import ProductImpressionEvent from "./events/ProductImpression.event";
import BrandsClickEvent from "./events/BrandsClick.event";
import CheckoutEvent from "./events/Checkout.event";
import CheckoutOptionEvent from "./events/CheckoutOption.event";
import General from "./events/General.event";
import Impression from "./events/Impression.event";
import ProductClickEvent from "./events/ProductClick.event";
import ProductDetailEvent from "./events/ProductDetail.event";
import PurchaseEvent from "./events/Purchase.event";
import RemoveFromCartEvent from "./events/RemoveFromCart.event";
import RemoveFromWishlistEvent from "./events/RemoveFromWishlist.event";
import TrendingBrandsClickEvent from "./events/TrendingBrandsClick.event";
import TrendingTagsClickEvent from "./events/TrendingTagsClick.event";
import WishlistClickEvent from "./events/WishlistClick.event";
import SearchEvent from "./events/Search.event";
import GoToSearchEvent from "./events/SearchEvents/GoToSearch.event";
import RecentSearchesClickEvent from "./events/SearchEvents/RecentSearchesClick.event";
import ExploreMoreClickEvent from "./events/SearchEvents/ExploreMore.event";
import TopSearchesClickEvent from "./events/SearchEvents/TopSearchesClick.event";
import SearchSuggesionClickEvent from "./events/SearchEvents/SearchSuggestionClick.event";
import CancelSearchEvent from "./events/SearchEvents/CancelSearch.event";
import RecommendedClickEvent from "./events/SearchEvents/RecommendedClick.event";
import SearchWishlistClickEvent from "./events/SearchEvents/SearchWishlistClick.event";
import ClearSearchEvent from "./events/SearchEvents/ClearSearch.event";
import SearchSuggestionProductClickEvent from "./events/SearchEvents/SearchSuggestionProductClick.event";
import NoResultSearchScreenEvent from "./events/SearchEvents/NoResultSearchScreen.event";
import PageNotFoundEvent from "./events/PageNotFound.event";
import SearchResultEvent from "./events/SearchEvents/SearchResult.event";
import FooterEvent from "./events/Footer.event";
import CouponEvent from "./events/Coupon.event";
import SortEvent from "./events/Sort.event";
import FilterEvent from "./events/Filter.event";
import PDPTrackingEvent from "./events/PDPTracking.event";
import AutheneticationEvent from "./events/Authentication.event";
import AuthenticationV1Event from "./events/AuthenticationV1.event";
import TopNavigationEvent from "./events/TopNavigation.event";
import CustomerSupportEvent from "./events/CustomerSupport.event";
import CheckoutBillingEvent from "./events/CheckoutBilling.event";
import PageLoadEvent from "./events/PageLoad.event";
import InfluencerEvent from "./events/Influencer.event";
import Scripts from "./Scripts";
import MoEngage from "react-moengage";
import FilterClearAll from "./events/PLPFiltersEvents/FilterClearAll.event";
import FilterAttributeSelected from "./events/PLPFiltersEvents/FilterAttributeSelected.event";
import FilterAttributeValueSelected from "./events/PLPFiltersEvents/FilterAttributeValueSelected.event";
import FilterAttributeValueDeselected from "./events/PLPFiltersEvents/FilterAttributeValueDeselected.event";
import FilterSearchClick from "./events/PLPFiltersEvents/FilterSearchClick.event";
import FilterSearchValueSelected from "./events/PLPFiltersEvents/FilterSearchValueSelected.event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import CartEvent from "./events/Cart.event";
import SizeSelectionOrSizeHelpClicked from "./events/SizePredictorClick.event";
import ColorVarientEvent from "./events/PLPFiltersEvents/ColorEvent.event";
import FlipImageScrollEvent from "./events/PLPFiltersEvents/FlipImageScrollEvent.event";
import ProductRating from "./events/ProductRating.event";
import ProductRatingClear from "./events/ProductRatingClear.event";
import MyOrder from "./events/MyOrder.event";
import MyOrderChannel from "./events/MyOrderChannel.event";

/**
 * Event list
 */
export const EVENT_GENERAL = "general";
export const EVENT_IMPRESSION = "ee.impression";
export const EVENT_PRODUCT_CLICK = "select_item";
export const EVENT_WISHLIST_PRODUCT_CLICK = "wishlistProductClick";
export const EVENT_ADD_TO_WISHLIST = "add_to_wishlist";
export const EVENT_REMOVE_FROM_WISHLIST = "remove_from_wishlist";
export const EVENT_ADD_TO_CART = "add_to_cart";
export const EVENT_EDD_VISIBILITY = "eddVisibility";
export const EVENT_EDD_TRACK_ON_ORDER = "eddTrackOnOrder";
export const EVENT_REMOVE_FROM_CART = "remove_from_cart";
export const EVENT_PRODUCT_DETAIL = "view_item";
export const EVENT_PURCHASE = "purchase";
export const EVENT_CHECKOUT = "begin_checkout";
export const EVENT_CHECKOUT_OPTION = "checkoutOption";
export const EVENT_BANNER_CLICK = "bannerClick";
export const EVENT_GTM_BRANDS_CLICK = "brandsClick";
export const EVENT_GTM_TRENDING_BRANDS_CLICK = "trendingBrandsClick";
export const EVENT_GTM_TRENDING_TAGS_CLICK = "trendingTagsClick";

/**
 * Const
 */
export const DATA_LAYER_NAME = "dataLayer";
export const GROUPED_PRODUCTS_PREFIX = "GROUPED_PRODUCTS_";
export const GROUPED_PRODUCTS_GUEST = `${GROUPED_PRODUCTS_PREFIX}GUEST`;
export const GTM_INJECTION_TIMEOUT = 4000;

/**
 * Google tag manager wrapper
 * This should have 1 instance to avoid multiple initializations
 */
class GoogleTagManager extends PureComponent {
  static propTypes = {
    gtm: PropTypes.shape(),
    // eslint-disable-next-line react/no-unused-prop-types
    state: PropTypes.shape(),
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    gtm: {
      enabled: false,
      gtm_id: "",
    },
    state: {},
    dispatch: () => {},
  };

  /**
   * Event list used in GTM
   * All used events should be registered in this data mapping
   * TODO: 404 page, categoryFilter, additional events
   *
   * @type {{[p: string]: General|Purchase|CheckoutEvent|OrderData|Impression|AddToCartEvent|ProductClickEvent|ProductDetail|CheckoutOptionEvent|RemoveFromCartEvent}}
   */
  static eventList = {
    [EVENT_GENERAL]: General,
    [EVENT_PURCHASE]: PurchaseEvent,
    [EVENT_CHECKOUT]: CheckoutEvent,
    [EVENT_CHECKOUT_OPTION]: CheckoutOptionEvent,
    [EVENT_IMPRESSION]: Impression,
    [EVENT_ADD_TO_CART]: AddToCartEvent,
    [EVENT_EDD_VISIBILITY]: EddVisibilityEvent,
    [EVENT_EDD_TRACK_ON_ORDER]: EddTrackOnOrderEvent,
    [EVENT_ADD_TO_WISHLIST]: AddToWishlistEvent,
    [EVENT_PRODUCT_CLICK]: ProductClickEvent,
    [EVENT_WISHLIST_PRODUCT_CLICK]: WishlistClickEvent,
    [EVENT_BANNER_CLICK]: BannerClickEvent,
    [EVENT_PRODUCT_DETAIL]: ProductDetailEvent,
    [EVENT_REMOVE_FROM_CART]: RemoveFromCartEvent,
    [EVENT_REMOVE_FROM_WISHLIST]: RemoveFromWishlistEvent,
    [EVENT_GTM_BRANDS_CLICK]: BrandsClickEvent,
    [EVENT_GTM_TRENDING_BRANDS_CLICK]: TrendingBrandsClickEvent,
    [EVENT_GTM_TRENDING_TAGS_CLICK]: TrendingTagsClickEvent,
    [EVENT_GTM_VIEW_PROMOTION]: BannerImpressionEvent,
    [EVENT_GTM_VIEW_ITEM_LIST]: ProductImpressionEvent,
    [EVENT_GTM_CANCEL_SEARCH]: CancelSearchEvent,
    [EVENT_GTM_CLEAR_SEARCH]: ClearSearchEvent,
    [EVENT_GTM_GO_TO_SEARCH]: GoToSearchEvent,
    [EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK]: SearchSuggesionClickEvent,
    [EVENT_CLICK_SEARCH_WISH_LIST_CLICK]: SearchWishlistClickEvent,
    [EVENT_GTM_VIEW_SEARCH_RESULTS]: SearchEvent,
    [EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW]: NoResultSearchScreenEvent,
    [EVENT_CLICK_RECENT_SEARCHES_CLICK]: RecentSearchesClickEvent,
    [EVENT_EXPLORE_MORE_SEARCH_CLICK]: ExploreMoreClickEvent,
    [EVENT_GTM_SEARCH_LOGS_SCREEN_VIEW]: SearchEvent,
    [EVENT_GTM_SEARCH_SCREEN_VIEW]: SearchEvent,
    [EVENT_CLICK_TOP_SEARCHES_CLICK]: TopSearchesClickEvent,
    [EVENT_CLICK_RECOMMENDATION_CLICK]: RecommendedClickEvent,
    [EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK]: SearchSuggestionProductClickEvent,
    [EVENT_GTM_PAGE_NOT_FOUND]: PageNotFoundEvent,
    [EVENT_GTM_SEARCH]: SearchResultEvent,
    [EVENT_GTM_FOOTER]: FooterEvent,
    [EVENT_GTM_COUPON]: CouponEvent,
    [EVENT_GTM_SORT]: SortEvent,
    [EVENT_GTM_FILTER]: FilterEvent,
    [EVENT_GTM_PDP_TRACKING]: PDPTrackingEvent,
    [EVENT_GTM_AUTHENTICATION]: AutheneticationEvent,
    [EVENT_GTM_NEW_AUTHENTICATION]: AuthenticationV1Event,
    [EVENT_GTM_TOP_NAV_CLICK]: TopNavigationEvent,
    [EVENT_GTM_CUSTOMER_SUPPORT]: CustomerSupportEvent,
    [EVENT_GTM_CHECKOUT_BILLING]: CheckoutBillingEvent,
    [EVENT_PAGE_LOAD]: PageLoadEvent,
    [EVENT_GTM_INFLUENCER]: InfluencerEvent,
    [EVENT_GTM_INFLUENCER]: InfluencerEvent,
    [EVENT_FILTER_CLEAR_ALL]: FilterClearAll,
    [EVENT_FILTER_ATTRIBUTE_SELECTED]: FilterAttributeSelected,
    [EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED]: FilterAttributeValueSelected,
    [EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED]: FilterAttributeValueDeselected,
    [EVENT_FILTER_SEARCH_CLICK]: FilterSearchClick,
    [EVENT_FILTER_SEARCH_VALUE_SELECTED]: FilterSearchValueSelected,
    [EVENT_GTM_CART]: CartEvent,
    [EVENT_SIZE_PREDICTION_CLICK]: SizeSelectionOrSizeHelpClicked,
    [EVENT_COLOUR_VARIENT_CLICK]: ColorVarientEvent,
    [EVENT_FLIP_IMAGE_SCROLL]: FlipImageScrollEvent,
    [EVENT_PRODUCT_RATING_CLICK]: ProductRating,
    [EVENT_PRODUCT_RATING_CLEAR]: ProductRatingClear,
    [EVENT_PRODUCT_RATING_VALUE]: ProductRating,
    [EVENT_MYORDERPAGE_VISIT]: MyOrder,
    [EVENT_ORDERDETAILPAGE_VISIT]: MyOrder,
    [EVENT_ORDERDETAILPAGE_CHANNEL]: MyOrderChannel,
  };

  /**
   * GoogleTagManager instance
   *
   * @type {GoogleTagManager}
   */
  static instance = null;

  /**
   * Push data to GTM
   *
   * @param event
   * @param data
   */
  static pushData(event, data) {
    if (this.getInstance()) {
      this.getInstance().processDataPush(event, data);
    }
  }

  /**
   * Append Data Layer with new data
   *
   * @param data
   */
  static appendData(data) {
    if (this.getInstance()) {
      this.getInstance().addDataLayer(data);
    }
  }

  /**
   * Get event by name
   *
   * @param name
   * @return {null|BaseEvent}
   */
  static getEvent(name) {
    if (this.getInstance()) {
      return this.getInstance().getEvent(name);
    }

    return null;
  }

  /**
   * Get GoogleTagManager Instance
   *
   * @return {GoogleTagManager}
   */
  static getInstance() {
    return this.instance;
  }

  /**
   * Is GoogleTagManager enabled
   *
   * @type {boolean}
   */
  enabled = false;

  /**
   * Prepared Data Layer
   *
   * @type {{}}
   */
  currentDataLayer = {};

  /**
   * Data layer name
   *
   * @type {string}
   */
  currentDataLayerName = DATA_LAYER_NAME;

  /**
   * groupedProducts
   */
  groupedProductsStorageName = GROUPED_PRODUCTS_GUEST;

  /**
   * Event data object
   *
   * @type {{}}
   */
  events = {};

  /**
   * Data storage for event data
   *
   * @type {{}}
   */
  eventDataStorage = {};

  /**
   * Grouped product storage
   */
  groupedProducts = {};

  /**
   * Did mount
   */
  componentDidMount() {
    this.initialize();
    if (!window.__isBOT__) {
      MoEngage.init(process.env.REACT_APP_MOE_ID, {
        debugLogs: process.env.REACT_APP_MOE_LOGS,
        swPath: process.env.PUBLIC_URL + "/serviceworker.js",
      });
    }
  }

  /**
   * If props is updated
   */
  componentDidUpdate() {
    this.initialize();
  }

  /**
   * Unregister component
   */
  componentWillUnmount() {
    this.destruct();
  }

  /**
   * Get event by name
   *
   * @param name
   * @return {null|*}
   */
  getEvent(name) {
    if (Object.keys(this.events).indexOf(name) >= 0) {
      return this.events[name];
    }

    return null;
  }

  /**
   * Set event storage
   *
   * @param event
   * @param data
   */
  setEventStorage(event, data) {
    this.eventDataStorage[event] = data;
  }

  /**
   * Set grouped products to storage
   *
   * @param groupedProducts
   */
  setGroupedProducts(groupedProducts) {
    BrowserDatabase.setItem(
      groupedProducts,
      this.groupedProductsStorageName,
      ONE_MONTH_IN_SECONDS
    );
    this.groupedProducts = groupedProducts;
  }

  /**
   * Get reference to grouped products
   */
  getGroupedProducts() {
    return this.groupedProducts;
  }

  /**
   * Get reference to the storage
   *
   * @param event
   * @return {*}
   */
  getEventDataStorage(event) {
    if (typeof this.eventDataStorage[event] === "undefined") {
      this.resetEventDataStorage(event);
    }

    return this.eventDataStorage[event];
  }

  /**
   * Reset storage data
   *
   * @param event
   */
  resetEventDataStorage(event) {
    this.eventDataStorage[event] = {};
  }

  updateGroupedProducts() {
    this.groupedProducts =
      BrowserDatabase.getItem(this.groupedProductsStorageName) || {};
  }

  updateGroupedProductsStorageName(name) {
    this.groupedProductsStorageName = name
      ? `${GROUPED_PRODUCTS_PREFIX}${name}`
      : GROUPED_PRODUCTS_GUEST;

    this.updateGroupedProducts();
  }

  /**
   * Register GTM event handlers
   */
  registerEvents() {
    this.events = Object.entries(GoogleTagManager.eventList || {}).reduce(
      (acc, [name, Event]) => {
        acc[name] = new Event(name, this);
        acc[name].bindEvent();

        return acc;
      },
      {}
    );
  }

  /**
   * Send event and data to the GoogleTagManager
   *
   * @param event
   * @param data
   */

  processDataPush(event, data) {
    const isCustomerID = isSignedIn()
      ? this.props?.state?.MyAccountReducer?.customer?.id || null
      : null;
    const uuid = BrowserDatabase.getItem("uuid")
      ? BrowserDatabase.getItem("uuid")
      : null;
    const isVipCustomer =
      (isSignedIn() &&
        this.props?.state?.MyAccountReducer?.customer?.vipCustomer) ||
      false;
    if (this.enabled) {
      dataLayer.push({
        ecommerce: null,
        eventCategory: null,
        eventAction: null,
        UserType: isSignedIn() ? "Logged In" : "Logged Out",
        search_term: null,
        BannerName: null,
      });
      const additionalDetails = {
        ...(!data?.screen_name && {
          screen_name: sessionStorage.getItem("currentScreen") || null,
        }),
        ...(!data?.prev_screen_name && {
          prev_screen_name: sessionStorage.getItem("prevScreen") || null,
        }),
        ...{
          country: getCountryFromUrl().toUpperCase(),
        },
        ...{
          language: getLanguageFromUrl().toLowerCase(),
        },
        ...((data?.isLoggedIn === undefined || data?.isLoggedIn === null) && {
          isLoggedIn: isSignedIn(),
        }),
        vip_customer: isVipCustomer || false,
        device_id: uuid,
        user_id: isCustomerID,
      };
      this.addDataLayer({ ...data, ...additionalDetails });

      if (this.debug) {
        // eslint-disable-next-line no-console
      }

      window[this.currentDataLayerName].push({
        event,
        ...this.currentDataLayer,
      });

      this.currentDataLayer = {};
    }
  }

  /**
   * Unregister/ destruct all parts related to the gtm
   */
  destruct() {
    Object.values(this.events).forEach((event, name) => {
      event.destruct();
      // eslint-disable-next-line fp/no-delete
      delete this.events[name];
    });

    this.events = {};
  }

  /**
   * Append current DataLayer with new nata
   *
   * @param data
   */

  addDataLayer(data) {
    if (this.enabled) {
      this.currentDataLayer = { ...this.currentDataLayer, ...data };
    }
  }

  /**
   * Initialize GTM
   */
  initialize() {
    const {
      gtm: { enabled },
    } = this.props;

    if (this.enabled || !enabled || GoogleTagManager.getInstance()) {
      return;
    }

    this.enabled = true;
    GoogleTagManager.instance = this;

    this.initGroupedProducts();
    // this.injectGTMScripts();
    this.registerEvents();
  }

  /**
   * Insert GTM scripts to the document
   */
  injectGTMScripts() {
    const {
      gtm: { gtm_id: id },
    } = this.props;

    const script = document.createElement("script");
    script.innerHTML = Scripts.getScript({
      id,
      dataLayerName: this.currentDataLayerName,
    });

    setTimeout(() => {
      document.head.insertBefore(script, document.head.childNodes[0]);
    }, GTM_INJECTION_TIMEOUT);
    window[this.currentDataLayerName] = window[this.currentDataLayerName] || [];
  }

  /**
   * Initialize grouped products
   */
  initGroupedProducts() {
    const customer = BrowserDatabase.getItem(CUSTOMER);

    this.updateGroupedProductsStorageName(customer && customer.id);

    this.groupedProducts =
      BrowserDatabase.getItem(this.groupedProductsStorageName) || {};
  }

  /**
   * Skip render
   *
   * @return {null}
   */
  render() {
    return null;
  }
}

export default GoogleTagManager;
