/**
 * Event names
 *
 * @type {string}
 */
export const EVENT_GTM_CHECKOUT = "gtm_checkout";
export const EVENT_GTM_CHECKOUT_OPTION = "gtm_checkout_option";
export const EVENT_GTM_IMPRESSIONS_PLP = "gtm_impressions_plp";
export const EVENT_GTM_IMPRESSIONS_HOME = "gtm_impressions_home";
export const EVENT_GTM_IMPRESSIONS_CROSS_SELL = "gtm_impressions_cross_sell";
export const EVENT_GTM_IMPRESSIONS_WISHLIST = "gtm_impressions_wishlist";
export const EVENT_GTM_IMPRESSIONS_SEARCH = "gtm_impressions_search";
export const EVENT_GTM_IMPRESSIONS_LINKED = "gtm_impressions_linked";
export const EVENT_GTM_META_UPDATE = "gtm_meta_update";
export const EVENT_GTM_GENERAL_INIT = "gtm_general_init";
export const EVENT_GTM_PRODUCT_ADD_TO_CART = "gtm_product_add_to_cart";
export const EVENT_GTM_EDD_VISIBILITY = "gtm_edd_visibility";
export const EVENT_GTM_EDD_TRACK_ON_ORDER = "gtm_edd_track_on_order";
export const EVENT_GTM_PRODUCT_CLICK = "gtm_product_click";
export const EVENT_GTM_VUE_PRODUCT_CLICK = "gtm_vue_product_click";
export const EVENT_GTM_WISHLIST_PRODUCT_CLICK = "gtm_wishlist_product_click";
export const EVENT_GTM_PRODUCT_DETAIL = "gtm_product_detail";
export const EVENT_GTM_PRODUCT_REMOVE_FROM_CART =
  "gtm_product_remove_from_cart";
export const EVENT_GTM_PURCHASE = "gtm_purchase";
export const EVENT_GTM_BANNER_CLICK = "gtm_banner_widget_click";
export const EVENT_GTM_ADD_TO_CART = "add_to_cart";
export const EVENT_GTM_CHECKOUT_BILLING = "add_shipping_info";
export const EVENT_ADD_PAYMENT_INFO = "add_payment_info";

// new events
export const EVENT_GTM_TRENDING_BRANDS_CLICK = "gtm_trending_brands_click";
export const EVENT_GTM_TRENDING_TAGS_CLICK = "gtm_trending_tags_click";
export const EVENT_GTM_BRANDS_CLICK = "gtm_brands_click";
export const EVENT_GTM_RECOMMENDED_CLICK = "gtm_recommended_click";
export const EVENT_GTM_PRODUCT_ADD_TO_WISHLIST = "gtm_product_add_to_wishlist";
export const EVENT_GTM_PRODUCT_REMOVE_FROM_WISHLIST =
  "gtm_product_remove_from_wishlist";

export const VIEW_SEARCH_RESULTS_ALGOLIA = "view_search_results_algolia";
export const SELECT_ITEM_ALGOLIA = "select_item_algolia";
export const ADD_TO_CART_ALGOLIA = "add_to_cart_algolia";
export const ALGOLIA_PURCHASE_SUCCESS = "algolia_purchase_success";
export const VUE_CAROUSEL_SHOW = "carouselShow";
export const VUE_CAROUSEL_CLICK = "carouselClick";
export const VUE_CAROUSEL_SWIPE = "carouselSwipe";
export const VUE_PAGE_VIEW = "pageView";
export const VUE_ADD_TO_CART = "addToCart";
export const VUE_REMOVE_FROM_CART = "removeFromCart";
export const VUE_ADD_TO_WISHLIST = "addToWishlist";
export const VUE_REMOVE_TO_WISHLIST = "removeFromWishlist";
export const VUE_BUY = "buy";
export const VUE_PLACE_ORDER = "placeOrder";
export const EVENT_PROMOTION_IMPRESSION = "promotionImpression";
export const EVENT_GTM_VIEW_PROMOTION = "view_promotion";
export const EVENT_CLICK_PROMOTION_IMPRESSION = "promotionClick";
export const EVENT_GTM_SELECT_PROMOTION = "select_promotion";
export const EVENT_PRODUCT_IMPRESSION = "productImpression";
export const EVENT_GTM_VIEW_ITEM_LIST = "view_item_list";

export const EVENT_GTM_CANCEL_SEARCH = "cancel_search";
export const EVENT_GTM_CLEAR_SEARCH = "clear_search";
export const EVENT_GTM_GO_TO_SEARCH = "go_to_search";
export const EVENT_CLICK_SEARCH_QUERY_SUGGESSTION_CLICK =
  "search_query_suggestion_click";
export const EVENT_CLICK_SEARCH_WISH_LIST_CLICK = "search_wish_list_click";
export const EVENT_GTM_VIEW_SEARCH_RESULTS = "view_search_results";
export const EVENT_GTM_NO_RESULT_SEARCH_SCREEN_VIEW =
  "no_result_search_screen_view";
export const EVENT_CLICK_RECENT_SEARCHES_CLICK = "recent_searches_click";
export const EVENT_EXPLORE_MORE_SEARCH_CLICK = "search_explore_more";
export const EVENT_GTM_SEARCH_LOGS_SCREEN_VIEW = "search_logs_screen_view";
export const EVENT_GTM_SEARCH_SCREEN_VIEW = "search_screen_view";
export const EVENT_GTM_SEARCH = "search";
export const EVENT_CLICK_TOP_SEARCHES_CLICK = "top_searches_click";
export const EVENT_CLICK_RECOMMENDATION_CLICK = "recommendation_clicked";
export const EVENT_SEARCH_SUGGESTION_PRODUCT_CLICK =
  "search_product_suggestion_click";
export const EVENT_GTM_PAGE_NOT_FOUND = "404_error";
export const EVENT_PAGE_NOT_FOUND = "pageNotFound";
export const EVENT_GTM_FOOTER = "gtm_footer_events";
export const EVENT_GTM_COUPON = "gtm_coupon_events";
export const EVENT_GTM_SORT = "gtm_sort_events";
export const EVENT_GTM_FILTER = "gtm_filter_events";
export const EVENT_GTM_PDP_TRACKING = "gtm_pdp_tracking";
export const EVENT_GTM_AUTHENTICATION = "gtm_signin_signup";
export const EVENT_GTM_NEW_AUTHENTICATION = "gtm_new_signin_signup";
export const EVENT_GTM_ACCOUNT_TAB_CLICK = "top_nav_account_click";
export const EVENT_GTM_TOP_NAV_CLICK = "top_nav_click";
export const EVENT_GTM_CUSTOMER_SUPPORT = "customer_support";
//Influencer GTM Tracking Events
export const EVENT_GTM_INFLUENCER = "gtm_influencer";

//MOENGAGE EVENTS
export const EVENT_MOE_PROMOTION_IMPRESSION = "view_promotion";
export const EVENT_MOE_PROMOTION_CLICK = "select_promotion";
export const EVENT_MOE_PRODUCT_CLICK = "select_item";
export const EVENT_MOE_PRODUCT_DETAIL = "view_item";
export const EVENT_MOE_ADD_TO_CART = "add_to_cart";
export const EVENT_MOE_REMOVE_FROM_CART = "remove_from_cart";
export const EVENT_MOE_REMOVE_FROM_CART_FAILED = "remove_from_cart_failed";
export const EVENT_MOE_PURCHASE_SUCCESS = "ecommerce_purchase_success";
export const EVENT_MOE_PURCHASE_SUCCESS_PRODUCT =
  "ecommerce_purchase_success_product";
export const EVENT_MOE_ADD_TO_WISHLIST = "add_to_wishlist";
export const EVENT_MOE_REMOVE_FROM_WISHLIST = "remove_from_wishlist";
export const EVENT_MOE_TRENDING_BRANDS_CLICK = "trending_brands_click";
export const EVENT_MOE_TRENDING_TAGS_CLICK = "trending_tags_click";
export const EVENT_MOE_BRANDS_CLICK = "brands_click";
export const EVENT_TOP_NAV_HOME = "top_nav_home";
export const EVENT_TOP_NAV_MEN = "top_nav_men";
export const EVENT_TOP_NAV_WOMEN = "top_nav_women";
export const EVENT_TOP_NAV_KIDS = "top_nav_kids";
export const EVENT_TOP_NAV_ALL = "top_nav_all";
export const EVENT_TOP_NAV_DEFAULT = "top_nav_default";
export const EVENT_MOE_TOP_NAV_CHANGE = "top_nav_change";
export const EVENT_MOE_GO_TO_BAG = "go_to_bag";
export const EVENT_MOE_GO_TO_BRAND = "go_to_brand";
export const EVENT_GO_TO_SIZE_CHART = "go_to_size_chart";
export const EVENT_SELECT_SIZE = "select_size";
export const EVENT_MOE_ADD_TO_CART_FAILED = "add_to_cart_failed";
export const EVENT_MOE_VIEW_BAG = "view_bag";
export const EVENT_PHONE = "phone_support_icon";
export const EVENT_MAIL = "email_support_icon";
export const EVENT_MOE_CHAT = "whatsapp_support_icon";
export const EVENT_SHARE = "share";
export const EVENT_WHATSAPP_SHARE = "whatsapp_share_icon";
export const EVENT_MAIL_SHARE = "email_share_icon";
export const EVENT_FB_SHARE = "facebook_share_icon";
export const EVENT_PINTEREST_SHARE = "pinterest_share_icon";
export const EVENT_MOE_VIEW_PLP_ITEMS = "view_plp_items";
export const EVENT_MOE_PLP_FILTER = "plp_filter";
export const EVENT_MOE_PLP_FILTER_CLICK = "plp_filter_click";
export const EVENT_MOE_SET_LANGUAGE = "set_language";
export const EVENT_MOE_SET_COUNTRY = "set_country";
export const EVENT_TABBY_LEARN_MORE_CLICK = "tabby_learn_more_click";
export const EVENT_BRAND_SEARCH_FILTER = "brand_search_filter";
export const EVENT_BRAND_SEARCH_FOCUS = "brand_search_focus";
export const EVENT_COLOR_SEARCH_FILTER = "color_search_filter";
export const EVENT_COLOR_SEARCH_FOCUS = "color_search_focus";
export const EVENT_SIZES_SEARCH_FILTER = "sizes_search_filter";
export const EVENT_SIZES_SEARCH_FOCUS = "sizes_search_focus";
export const EVENT_CATEGORIES_WITHOUT_PATH_SEARCH_FILTER =
  "categories_without_path_search_filter";
export const EVENT_CATEGORIES_WITHOUT_PATH_SEARCH_FOCUS =
  "categories_without_path_search_focus";
export const EVENT_DISCOUNT_FILTER_CLICK = "discount_filter_click";
export const EVENT_MOE_PLP_SHOW_FILTER_RESULTS_CLICK =
  "plp_show_filter_results_click";
export const EVENT_PRICE_FILTER_CLICK = "price_filter_click";
export const EVENT_PLP_SORT = "plp_sort";
export const EVENT_SORT_BY_DISCOUNT = "sort_by_discount";
export const EVENT_SORT_BY_LATEST = "sort_by_latest";
export const EVENT_SORT_BY_PRICE_HIGH = "sort_by_price_high";
export const EVENT_SORT_BY_PRICE_LOW = "sort_by_price_low";
export const EVENT_SORT_BY_RECOMMENDED = "sort_by_recommended";
export const EVENT_SET_PREFERENCES_GENDER = "set_preferences_gender";
export const EVENT_ACCOUNT_ORDERS_CLICK = "account_orders_click";
export const EVENT_ACCOUNT_RETURNS_CLICK = "account_returns_click";
export const EVENT_ACCOUNT_ADDRESS_BOOK_CLICK = "account_address_book_click";
export const EVENT_ACCOUNT_PROFILE_CLICK = "account_profile_click";
export const EVENT_ACCOUNT_SETTINGS_CLICK = "account_settings_click";
export const EVENT_ACCOUNT_CUSTOMER_SUPPORT_CLICK =
  "account_customer_support_click";
export const EVENT_ACCOUNT_CLUB_APPAREL_CLICK = "account_club_apparel_click";
export const EVENT_ACCOUNT_SECTION_REFERRAL_TAB_CLICK =
  "account_section_referral_tab_click";
export const EVENT_MOE_ORDER_ITEM_CLICK = "order_item_click";
export const EVENT_MOE_UPDATE_PROFILE = "update_profile";
export const EVENT_MOE_RETURN_AN_ITEM_CLICK = "return_an_item_click";
export const EVENT_MOE_CANCEL_AN_ITEM_CLICK = "cancel_an_item_click";
export const EVENT_MOE_SELECT_RETURN_RESOLUTION = "select_return_resolution";
export const EVENT_MOE_SELECT_RETURN_REASON = "select_return_reason";
export const EVENT_MOE_SUBMIT_RETURN_REQUEST = "submit_return_request";
export const EVENT_MOE_BACK_TO_ORDER_DETAILS = "back_to_order_details";
export const EVENT_MOE_EDD_VISIBILITY = "edd_visibility";
export const EVENT_MOE_EDD_TRACK_ON_ORDER = "edd_track_on_order";
export const EVENT_MOE_ECOMMERCE_PURCHASE_FAILED = "ecommerce_purchase_failed";
export const EVENT_MOE_HOME_TAB_ICON = "home_tab_icon";
export const EVENT_MOE_CATEGORIES_TAB_ICON = "categories_tab_icon";
export const EVENT_MOE_BRANDS_TAB_ICON = "brands_tab_icon";
export const EVENT_MOE_WISHLIST_TAB_ICON = "wishlist_tab_icon";
export const EVENT_ACCOUNT_TAB_ICON = "account_tab_icon";
export const EVENT_MOE_BEGIN_CHECKOUT = "begin_checkout";
export const EVENT_TYPE_EMAIL_ID = "type_email_id";
export const EVENT_MOE_TYPE_FIRST_NAME = "type_first_name";
export const EVENT_MOE_TYPE_LAST_NAME = "type_last_name";
export const EVENT_MOE_TYPE_ADDRESS = "type_address";
export const EVENT_MOE_TYPE_CITY = "type_city";
export const EVENT_MOE_TYPE_AREA = "type_area";
export const EVENT_TYPE_PHONE_NUMBER = "type_phone_number";
export const EVENT_MOE_ADD_NEW_ADDRESS = "add_new_address";
export const EVENT_MOE_GO_TO_PAYMENT = "go_to_payment";
export const EVENT_MOE_GO_TO_PAYMENT_PRODUCT = "go_to_payment_product";
export const EVENT_MOE_NEW_ADDRESS_CLICK = "new_address_click";
export const EVENT_MOE_EDIT_ADDRESS_CLICK = "edit_address_click";
export const EVENT_MOE_CONTINUE_SHOPPING = "continue_shopping";
export const EVENT_MOE_VIEW_CART_ITEMS = "view_cart_items";
export const EVENT_MOE_VIEW_CART_ITEMS_PRODUCT = "view_cart_items_product";
export const EVENT_MOE_PDP_IMAGE_SCROLL = "pdp_image_scroll";
export const EVENT_MOE_RETURN_REQUEST_CLICK = "return_request_click";
export const EVENT_FEEDBACK_FORM_SUBMIT = "feedback_form_submit";
export const EVENT_MOE_ADD_PAYMENT_INFO = "add_payment_info";
export const EVENT_LOGIN_TAB_CLICK = "login_tab_click";
export const EVENT_FORGOT_PASSWORD_CLICK = "forgot_password_click";
export const EVENT_REGISTER_TAB_CLICK = "register_tab_click";
export const EVENT_LOGIN = "login";
export const EVENT_GTM_LOGIN_SUCCESS = "login_success";
export const EVENT_LOGIN_FAILED = "login_failed";
export const EVENT_REGISTER = "register";
export const EVENT_REGISTER_FAILED = "register_failed";
export const EVENT_SIGN_UP = "sign_up";
export const EVENT_SIGN_UP_FAIL = "sign_up_fail";
export const EVENT_GTM_CART = "cart_event";
export const EVENT_MOE_CUSTOM_TAB_ICON = "custom_tab_icon";

//General Events for MOE and GTM
export const EVENT_INSTA_FOLLOW = "insta_follow_icon";
export const EVENT_FB_FOLLOW = "fb_follow_icon";
export const EVENT_TIKTOK_FOLLOW = "tiktok_follow_icon";
export const EVENT_SNAPCHAT_FOLLOW = "snapchat_follow_icon";
export const EVENT_TWITTER_FOLLOW = "twitter_follow_icon";
export const EVENT_PINTEREST_FOLLOW = "pinterest_follow_icon";
export const EVENT_YOUTUBE_FOLLOW = "youtube_follow_icon";
export const EVENT_SHIPPING_INFO_CLICK = "shipping_info_click";
export const EVENT_RETURN_INFO_CLICK = "return_info_click";
export const EVENT_FEEDBACK_CLICK = "feedback_click";
export const EVENT_PRIVACY_POLICY_CLICK = "privacy_policy_click";
export const EVENT_DISCLAIMER_CLICK = "disclaimer_click";
export const EVENT_CONSUMER_RIGHTS_CLICK = "consumer_rights_click";
export const EVENT_ABOUT6S_CLICK = "about6s_click";
export const EVENT_REMOVE_COUPON = "remove_coupon_code";
export const EVENT_APPLY_COUPON = "apply_coupon_code";
export const EVENT_APPLY_COUPON_FAILED = "apply_coupon_code_failed";
export const EVENT_SELECT_SIZE_TYPE = "select_size_type";
export const EVENT_MORE_FROM_THIS_BRAND_CLICK = "more_from_this_brand_click";
export const EVENT_EXPAND_PRODUCT_DETAILS = "expand_product_details";
export const EVENT_OUT_OF_STOCK = "out_of_stock";
export const EVENT_OUT_OF_STOCK_MAIL_SENT = "out_of_stock_mail_sent";
export const EVENT_LOGIN_DETAILS_ENTERED = "login_details_entered";
export const EVENT_OTP_VERIFICATION_SUCCESSFUL = "otp_verification_successful";
export const EVENT_OTP_VERIFICATION_FAILED = "otp_verification_failed";
export const EVENT_RESEND_VERIFICATION_CODE = "resend_verification_code";
export const EVENT_PASSWORD_RESET_LINK_SENT = "password_reset_link_sent";
export const EVENT_FORGOT_PASSWORD_RESET_SUCCESS =
  "forgot_password_reset_success";
export const EVENT_FORGOT_PASSWORD_RESET_FAIL = "forgot_password_reset_fail";
export const EVENT_REGISTERATION_DETAILS_ENTERED =
  "registeration_details_entered";
export const EVENT_CUSTOMER_SUPPORT_FAQ = "customer_support_faq";
export const EVENT_CUSTOMER_SUPPORT_FREE_DELIVERY_MIN_ORDER =
  "customer_support_free_delivery_min_order";
export const EVENT_CUSTOMER_SUPPORT_FREE_RETURN =
  "customer_support_free_return";
export const EVENT_LANGUAGE_CHANGE = "language_change";
export const EVENT_SIGN_IN_CTA_CLICK = "sign_in_cta_click";
export const EVENT_CONTINUE_AS_GUEST = "continue_as_guest";
export const EVENT_EMAIL_FOOTER_SUCCESS_CLICK = "email_footer_success_click";
export const EVENT_SIGN_IN_SCREEN_VIEWED = "sign_in_screen_viewed";
export const EVENT_PAGE_LOAD = "page_load";
export const EVENT_LOGIN_CLICK = "login_click";
export const EVENT_REGISTER_CLICK = "register_click";
export const EVENT_GUEST_ORDERS_CLICK = "guest_orders_click";
export const EVENT_GUEST_RETURNS_CLICK = "guest_returns_click";
export const EVENT_RETURN_POLICY_CLICK = "return_policy_click";
export const EVENT_SHIPPING_POLICY_CLICK = "shipping_policy_click";
export const EVENT_FAQ_CLICK = "faq_click";
export const EVENT_TYPE_USERNAME = "type_username";
export const EVENT_TYPE_PASSWORD = "type_password";
export const EVENT_SIGN_IN_BUTTON_CLICK = "sign_in_button_click";
export const EVENT_TYPE_NAME = "type_name";
export const EVENT_VERIFICATION_CODE_SCREEN_VIEW =
  "verification_code_screen_view";
export const EVENT_RESEND_OTP_CLICK = "resend_otp_click";
export const EVENT_OTP_VERIFY_WITH_PHONE = "otp_verify_with_phone";
export const EVENT_OTP_VERIFY_WITH_EMAIL = "otp_verify_with_email";
export const EVENT_OTP_VERIFY = "otp_verify";
export const EVENT_OTP_VERIFY_FAILED = "otp_verify_failed";
export const EVENT_RESET_YOUR_PASSWORD_SUCCESS = "reset_your_password_success";
export const EVENT_RESET_YOUR_PASSWORD_FAILED = "reset_your_password_failed";
export const EVENT_FORGOT_PASSWORD_SCREEN_VIEW = "forgot_password_screen_view";
export const EVENT_FORGOT_PASSWORD_SUCCESS_SCREEN_VIEW =
  "forgot_password_success_screen_view";
export const EVENT_ACCOUNT_PAYMENT_CLICK = "account_payment_click";
export const EVENT_WISHLIST_ICON_CLICK = "Wishlist_icon_click";
//influencer Tracking Events
export const EVENT_INFLUENCER_HOME_SCREEN_VIEW = "influencer_home_screen_view";
export const EVENT_INFLUENCER_SEARCH_CLICK = "influencer_search_click";
export const EVENT_INFLUENCER_REFINE_CLICK = "influencer_refine_click";
export const EVENT_INFLUENCER_REFINE_GENDER_CLICK =
  "influencer_refine_gender_click";
export const EVENT_INFLUENCER_DETAIL_CLICK = "influencer_detail_click";
export const EVENT_COLLECTION_DETAIL_CLICK = "collection_detail_click";
export const EVENT_SHARE_COLLECTION_CLICK = "share_collection_click";
export const EVENT_SHARE_STORE_CLICK = "share_store_click";
export const EVENT_GET_THE_LOOK_CLICK = "get_the_look_click";
export const EVENT_FOLLOW_INFLUENCER_CLICK = "follow_influencer_click";
export const EVENT_UNFOLLOW_INFLUENCER_CLICK = "unfollow_influencer_click";
export const EVENT_ACCOUNT_TOOLTIP_CLOSE_BUTTON_CLICK =
  "account_tooltip_close_button_click";
export const BIRTHDATE_UPDATE_SUCCESS = "birthdate_update_success";
export const REFERRAL_COPY = "referral_copy";
export const REFERRAL_SHARE = "referral_share";
export const REFERRAL_NUDGE_CLICK = "referral_nudge_click";

//Wallet events
export const EVENT_MOE_ACCOUNT_SECTION_WALLET_TAB_CLICK = "account_section_wallet_tab_click";
export const EVENT_MOE_MY_WALLET_SCREEN_VIEW = "my_wallet_screen_view";
export const EVENT_MOE_YOUR_TRANSACTIONS_SCREEN_VIEW = "your_transactions_screen_view";
export const EVENT_MOE_WALLET_BANNER_CLICK = "wallet_banner_click";
export const MOE_USER_ATTR_PROMOTIONAL_BALANCE = "promotional_balance";
export const MOE_USER_ATTR_TRANSACTIONAL_BALANCE = "transactional_balance"

// Checkout Errors Tracking Event
export const EVENT_MOE_PLACE_ORDER_CLICK = "place_order_click";
export const EVENT_MOE_CREATE_ORDER_API_FAIL = "create_order_api_fail";
export const EVENT_GTM_CA_LINK = "gtm_ca_link";
export const EVENT_CA_LINKNOW_CLICK = "CA_linknow_click";
export const EVENT_CA_CHECKBOX_SELECT = "CA_checkbox_select";
export const EVENT_CA_CHECKBOX = "CA_checkbox";
export const EVENT_MOE_COMPONENT_DID_CATCH = "component_did_catch";
export const EVENT_MOE_OOOPS_SOMETHING_WENT_WRONG =
  "ooops_something_went_wrong";
// PLP filters event
export const EVENT_FILTER_CLEAR_ALL = "filter_clear_all";
export const EVENT_FILTER_ATTRIBUTE_SELECTED = "filter_attribute_selected";
export const EVENT_FILTER_ATTRIBUTE_VALUE_SELECTED =
  "filter_attribute_value_selected";
export const EVENT_FILTER_ATTRIBUTE_VALUE_DESELECTED =
  "filter_attribute_value_deselected";
export const EVENT_FILTER_SEARCH_CLICK = "filter_search_click";
export const EVENT_FILTER_SEARCH_VALUE_SELECTED =
  "filter_search_value_selected";
export const EVENT_GTM_VIEW_PLP_ITEMS = "view_plp_items";
export const VIP_CUSTOMER = "vip_customer";
export const EVENT_SIZE_PREDICTION_CLICK = "size_prediction_click";

// Colour Varients Tracking Events
export const EVENT_COLOUR_VARIENT_CLICK = "colour_variant_click";

// Flip Image Tracking Events
export const EVENT_FLIP_IMAGE_SCROLL = "product_image_scroll";
// Product Rating
export const EVENT_PRODUCT_RATING_CLICK = "add_user_rating";
export const EVENT_PRODUCT_RATING_CLEAR = "delete_user_rating";
export const EVENT_PRODUCT_RATING_VALUE = "edit_user_rating";
export const EVENT_MYORDERPAGE_VISIT = "my_orders_screen_view";
export const EVENT_ORDERDETAILPAGE_VISIT = "order_details_screen_view";
export const EVENT_ORDERDETAILPAGE_CHANNEL = "order_details_screen_Channel";

// MegaMenu Feature Tracking Events
export const EVENT_BOTTOM_NAV_CLICK = "bottom_nav_click";
export const EVENT_MEGA_MENU_BANNER = "mega_menu_banner";
export const EVENT_MEGA_MENU_CAROUSAL = "mega_menu_carousal";
export const EVENT_CATEGORY_EXPANDED = "category_expanded";
export const EVENT_SUBCATEGORY_CLICK = "subcategory_click";
export const EVENT_CLICK_BRAND_BANNER = "click_brand_banner";
export const EVENT_CLICK_BRAND_NAME = "click_brand_name";
export const EVENT_CLICK_BRAND_ALPHABET = "click_brand_alphabet";
export const EVENT_CLICK_BRAND_SEARCH_SCREEN = "click_brand_search";
export const EVENT_NO_RESULT_SEARCH_SCREEN_VIEW = "no_result_search_screen_view";
export const EVENT_CLICK_RECENT_SEARCH = "click_recent_search";
export const EVENT_CLICK_POPULAR_SEARCH = "click_popular_search";
export const EVENT_Track_USER_VARIANT =  "track_user_variant";

// Home Page Personalisation Tracking Events
export const EVENT_HOME_SCREEN_VIEW = "home_screen_view";
export const EVENT_PLP_SCREEN_VIEW = "plp_screen_view";

// Pdp Page Personalisation Tracking Events
export const EVENT_PDP_RATING_CLICK = "rating_click";
export const EVENT_PDP_FOLLOW_BRAND = "follow_brand";
export const EVENT_PDP_UNFOLLOW_BRAND = "unfollow_brand";
export const EVENT_PDP_CLOSE_POPUP = "close_popup";