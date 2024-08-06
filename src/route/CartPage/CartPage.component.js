/* eslint-disable no-magic-numbers */
/**
 * @category  6thstreet
 * @author    Alona Zvereva <alona.zvereva@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import CartCoupon from "Component/CartCoupon";
import CartCouponList from "Component/CartCouponList";
import CartCouponDetail from "Component/CartCouponDetail";
import CartPageItem from "Component/CartPageItem";
import CmsBlock from "Component/CmsBlock";
import ContentWrapper from "Component/ContentWrapper";
import ExpandableContent from "Component/ExpandableContent";
import Link from "Component/Link";
import Loader from "Component/Loader";
import MyAccountTabList from "Component/MyAccountTabList";
import { getFinalPrice } from "Component/Price/Price.config";
import ProductLinks from "Component/ProductLinks";
import { tabMap } from "Route/MyAccount/MyAccount.container";
import { CROSS_SELL } from "Store/LinkedProducts/LinkedProducts.reducer";
import { activeTabType } from "Type/Account";
import { HistoryType } from "Type/Common";
import { TotalsType } from "Type/MiniCart";
import { ClubApparelMember } from "Util/API/endpoint/ClubApparel/ClubApparel.type";
import { getCurrency, getDiscountFromTotals, isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Image from "Component/Image";
import Event, {
  EVENT_MOE_VIEW_CART_ITEMS,
  MOE_trackEvent,
  EVENT_GTM_COUPON,
  EVENT_REMOVE_COUPON,
  EVENT_APPLY_COUPON,
  EVENT_APPLY_COUPON_FAILED,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import MyAccountOverlay from "Component/MyAccountOverlay";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";

import CartNudge from "./CartNudges/CartNudge";
import { RenderEmptyCartPage, RenderEmptyCartPageForMobile } from "./EmptyCart";
import DynamicContentVueProductSliderContainer from "../../component/DynamicContentVueProductSlider";
import { v4 } from "uuid";
import { Shipping } from "Component/Icons";

import ClubApparel from "./icons/club-apparel.png";
import EmptyCardIcon from "./icons/cart.svg";
import ProductItem from "Component/ProductItem";
import RemoveOOS from "Component/RemoveOOS/RemoveOOS";

import "./CartPage.style";
import CartCouponTermsAndConditions from "Component/CartCouponTermsAndConditions/CartCouponTermsAndConditions.component";

import { TYPE_HOME } from "Route/UrlRewrites/UrlRewrites.config";
import { Offer, Coupon } from "Component/Icons/index";
import CartPageSliders from "Component/CartPageSliders/index.js";
import { getShippingFees } from "Util/Common/index";
import { getLocaleFromUrl } from "Util/Url/Url";
import TamaraWidget from "Component/TamaraWidget/TamaraWidget";
import SideWideCoupon from "Component/SideWideCoupon";
import CartTotal from "Component/CartTotal";
import { handleSwcToPromoCall } from "Component/SideWideCoupon/utils/SideWideCoupon.helper";

export class CartPage extends PureComponent {
  constructor(props) {
    super(props);
    this.dynamicHeight = React.createRef();
    this.cartCouponPopup = React.createRef();
  }
  static propTypes = {
    totals: TotalsType.isRequired,
    onCheckoutButtonClick: PropTypes.func.isRequired,
    activeTab: activeTabType.isRequired,
    changeActiveTab: PropTypes.func.isRequired,
    clubApparel: ClubApparelMember,
    isSignedIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isCheckoutAvailable: PropTypes.bool.isRequired,
    processingRequest: PropTypes.bool,
    history: HistoryType.isRequired,
  };

  state = {
    isArabic: isArabic(),
    TermsAndConditions: "",
    isTermsAndConditionspopupOpen: false,
    isCouponPopupOpen: false,
    couponCode: "",
    couponName: "",
    couponDescription: "",
    isCouponDetialPopupOpen: false,
    couponModuleStatus: false,
    pageLoaded: true,
    showPopup: false,
    pdpWidgetsAPIData: [],
    couponModuleStatus: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    isLoading: false,
    isOOSProducts: false,
    tabbyResp: {},
  };

  static defaultProps = {
    clubApparel: {},
    processingRequest: false,
  };

  componentDidMount() {
    const {
      totals: { currency_code, total },
      getTabbyInstallment,
    } = this.props;

    const script = document.createElement("script");
    script.src = "https://checkout.tabby.ai/tabby-promo.js";
    document.body.appendChild(script);
    getTabbyInstallment(total)
      .then((response) => {
        this.setState({ tabbyResp: response });
        if (response?.value) {
          if (
            document.getElementById("TabbyPromo").classList.contains("d-none")
          ) {
            document.getElementById("TabbyPromo").classList.remove("d-none");
          }
          script.onload = this.addTabbyPromo(total, currency_code);
        } else {
          document.getElementById("TabbyPromo").classList.add("d-none");
        }
      }, this._handleError)
      .catch(() => {});
    this.getCouponModuleStatus();
    window.addEventListener("mousedown", this.outsideCouponPopupClick);
  }

  componentDidUpdate(prevProps) {
    const {
      totals: { currency_code, total },
      getTabbyInstallment,
    } = this.props;
    if (prevProps?.totals?.total !== total) {
      getTabbyInstallment(total)
        .then((response) => {
          this.setState({ tabbyResp: response });
          if (response?.value) {
            if (
              document.getElementById("TabbyPromo").classList.contains("d-none")
            ) {
              document.getElementById("TabbyPromo").classList.remove("d-none");
            }
            this.addTabbyPromo(total, currency_code);
          } else {
            document.getElementById("TabbyPromo").classList.add("d-none");
          }
        }, this._handleError)
        .catch(() => {});
    }
  }

  addTabbyPromo = (total, currency_code) => {
    const { isArabic } = this.state;
    new window.TabbyPromo({
      selector: "#TabbyPromo",
      currency: currency_code.toString(),
      price: total,
      installmentsCount: 4,
      lang: isArabic ? "ar" : "en",
      source: "product",
    });
  };

  sendMoeEvent() {
    const {
      totals: { items = [], discount, coupon_code, subtotal, total },
    } = this.props;
    const { pageLoaded } = this.state;
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
      productCategory.push(productKeys?.gender);
      productItemPrice.push(productKeys?.itemPrice);
    });
    if (pageLoaded) {
      MOE_trackEvent(EVENT_MOE_VIEW_CART_ITEMS, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        brand_name: productBrand.length > 0 ? productBrand : "",
        color: productColor.length > 0 ? productColor : "",
        coupon_code_applied: coupon_code || "",
        currency: getCurrency(),
        discounted_amount: discount || "",
        discounted_price: productItemPrice.length > 0 ? productItemPrice : "",
        full_price: productBasePrice.length > 0 ? productBasePrice : "",
        product_count: items.length > 0 ? items.length : 0,
        product_name: productName.length > 0 ? productName : "",
        product_sku: productSku.length > 0 ? productSku : "",
        subtotal_amount: subtotal || "",
        total_amount: total || "",
        size_id: productSizeOption.length > 0 ? productSizeOption : "",
        size: productSizeValue.length > 0 ? productSizeValue : "",
        category: productCategory.length > 0 ? productCategory : "",
        gender: productGender.length > 0 ? productGender : "",
        subcategory: productSubCategory.length > 0 ? productSubCategory : "",
        app6thstreet_platform: "Web",
      });
    }
  }

  fitlerItemArr = (items = []) => {
    let filterArrOne = [];
    let filterArrTwo = [];
    items.map((item) => {
      if (item?.availableQty === 0 || item?.availableQty < item?.qty) {
        filterArrOne.push(item);
      } else {
        filterArrTwo.push(item);
      }
    });
    return [...filterArrTwo, ...filterArrOne];
  };

  renderCartItems() {
    const {
      totals: { items = [], quote_currency_code },
    } = this.props;
    this.sendMoeEvent();
    this.setState({ pageLoaded: false });
    if (!items || items.length < 1) {
      return (
        <p block="CartPage" elem="Empty">
          {__("There are no products in cart.")}
        </p>
      );
    }
    const cartItems = this.fitlerItemArr(items);
    return (
      <ul block="CartPage" elem="Items" aria-label="List of items in cart">
        {cartItems.map((item) => (
          <CartPageItem
            key={item.item_id}
            item={item}
            currency_code={quote_currency_code}
            isEditing
            isCartPage
            isSignedIn={this.props.isSignedIn}
          />
        ))}
      </ul>
    );
  }

  outsideCouponPopupClick = (e) => {
    if (
      this.state.isCouponPopupOpen &&
      this.cartCouponPopup.current &&
      !this.cartCouponPopup.current.contains(e.target)
    ) {
      this.setState({
        isCouponPopupOpen: false,
      });
      const bodyElt = document.querySelector("body");
      bodyElt.removeAttribute("style");
    }
  };

  closeCouponPopup = () => {
    this.setState({
      isCouponPopupOpen: false,
    });
    const bodyElt = document.querySelector("body");
    bodyElt.removeAttribute("style");
  };
  openCouponPopup = () => {
    this.setState({
      isCouponPopupOpen: true,
    });
    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  };
  showCouponDetial = (e, coupon) => {
    e.stopPropagation();
    this.setState({
      couponCode: coupon.code,
      couponName: coupon.name,
      couponDescription: coupon.description,
      TermsAndConditions: coupon.term_and_cond,
      isCouponDetialPopupOpen: true,
    });

    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  };

  showTermsAndConditions = (e) => {
    e.stopPropagation();
    this.setState({
      isTermsAndConditionspopupOpen: true,
    });
  };

  hideCouponDetial = (e) => {
    e.stopPropagation();
    this.setState({
      isCouponDetialPopupOpen: false,
    });
    if (!this.state.isCouponPopupOpen) {
      const bodyElt = document.querySelector("body");
      bodyElt.removeAttribute("style");
    }
  };

  hideTermsAndConditions = (e) => {
    e.stopPropagation();
    this.setState({
      isTermsAndConditionspopupOpen: false,
    });
  };

  sendSiteWideCouponEvents = (event, coupon) => {
    MOE_trackEvent(event, { 
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      coupon_code: coupon || "",
      app6thstreet_platform: "Web",
    });
    const eventData = {
      name: event,
      coupon: coupon,
      discount: this.props?.totals?.discount || "",
      shipping: this.props?.totals?.shipping_fee || "",
      tax: this.props?.totals?.tax_amount || "",
      sub_total : this.props?.totals?.subtotal || "",
      subtotal_incl_tax : this.props?.totals?.subtotal_incl_tax || "",
      total: this.props?.totals?.total || "",
    };
    Event.dispatch(EVENT_GTM_COUPON, eventData);
  }

  handleSideWideCoupon = async (flag, sidewideCouponCode) => {
    const {
      isSignedIn,
      updateSidewideCoupon,
      applyCouponToCart,
      removeCouponFromCart,
      config,
    } = this.props;
    const countryCode = getCountryFromUrl();
    const SWCPromoCall =
      config?.countries?.[countryCode]?.swc_promo_call || false;

    if (SWCPromoCall) {
      handleSwcToPromoCall({
        SWCPromoCall,
        applyCouponToCart,
        pageType: "CartPage",
        setLoader: this.setLoader,
        removeCouponFromCart,
        flag,
        sidewideCouponCode,
        sendSiteWideCouponEvents: this.sendSiteWideCouponEvents,
        isSignedIn,
      });
      return;
    }

    const cart_id = BrowserDatabase.getItem(CART_ID_CACHE_KEY);
    const resp = await updateSidewideCoupon(cart_id, flag, !isSignedIn);

    if(!resp?.status){
      this.sendSiteWideCouponEvents(EVENT_APPLY_COUPON_FAILED, sidewideCouponCode );
    }else if(resp?.status && flag ) {
      this.sendSiteWideCouponEvents(EVENT_APPLY_COUPON, sidewideCouponCode );
    } else {
      this.sendSiteWideCouponEvents(EVENT_REMOVE_COUPON, sidewideCouponCode );
    }
  };

  handleRemoveCode = (e) => {
    e.stopPropagation();
    MOE_trackEvent(EVENT_REMOVE_COUPON, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      coupon_code: this.props?.totals?.coupon_code || "",
      app6thstreet_platform: "Web",
    });
    const eventData = {
      name: EVENT_REMOVE_COUPON,
      coupon: this.props?.totals?.coupon_code || "",
      discount: this.props?.totals?.discount || "",
      shipping: this.props?.totals?.shipping_fee || "",
      tax: this.props?.totals?.tax_amount || "",
      sub_total : this.props?.totals?.subtotal || "",
      subtotal_incl_tax : this.props?.totals?.subtotal_incl_tax || "",
      total: this.props?.totals?.total || "",
    };
    Event.dispatch(EVENT_GTM_COUPON, eventData);
    // if coupon is Sitewide coupon then pass isSiteWide flag as true
    const {
      isSignedIn,
      totals: { site_wide_applied = 0, coupon_code = "" },
      config,
    } = this.props;
    let isSiteWideCoupon = false;
    const countryCode = getCountryFromUrl();
    const langCode = getLanguageFromUrl();
    const sidewideCouponCode =
      config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";

    if (
      coupon_code &&
      coupon_code != "" &&
      sidewideCouponCode &&
      sidewideCouponCode != "" &&
      coupon_code.toLowerCase() === sidewideCouponCode.toLowerCase()
    ) {
      isSiteWideCoupon = true;
    }

    this.props.removeCouponFromCart({
      is_guest: !isSignedIn,
      isSiteWide: isSiteWideCoupon,
    });
  };
  getCouponModuleStatus = async () => {
    const { country, config } = this.props;
    if (config) {
      let couponModule = Object.keys(config?.countries).find(function (val) {
        return val == country;
      });
      this.setState({
        couponModuleStatus: couponModule,
      });
    }
  };
  setLoader = (currLoaderState) => {
    this.setState({
      isLoading: currLoaderState,
    });
  };
  handleApplyCode = async () => {
    const { couponCode } = this.state;
    this.setLoader(true);
    try {
      let apiResponse =
        (await this.props.applyCouponToCart(couponCode)) || null;
      if (typeof apiResponse !== "string") {
      }
      this.setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  closeremoveOosOverlay = (currstate) => {
    this.setState({ isOOSProducts: currstate });
  };

  renderRemoveOOS() {
    const { totals, updateTotals, isExpressDelivery } = this.props;
    const { isArabic } = this.state;
    return (
      <RemoveOOS
        closeremoveOosOverlay={this.closeremoveOosOverlay}
        totals={totals}
        isArabic={isArabic}
        isExpressDelivery={isExpressDelivery}
      />
    );
  }

  renderDiscountCode() {
    const {
      totals: {
        site_wide_applied = 0,
        coupon_code = "",
      },
      couponsItems = [],
      totals,
      isSidewideCouponEnabled,
      isCouponRequest,
      config,
    } = this.props;
    const isOpen = false;
    const { isArabic, isMobile, isLoading } = this.state;
    const promoCount = Object.keys(couponsItems).length;
    let appliedCoupon = {};
    if (couponsItems) {
      appliedCoupon = couponsItems.find(function (coupon) {
        return coupon.code == coupon_code;
      });
    }
    const countryCode = getCountryFromUrl();
    const langCode = getLanguageFromUrl();
    const sidewideCouponCode =
      config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";
    const promoCodeText =
      config?.countries?.[countryCode]?.sidewideCouponData?.heading?.[langCode] ||
      __("Enter coupon or promo code");

    return (
      <>
        {!this.state?.isCouponPopupOpen ? (
          <>
            <div block="cartCouponBlock">
              {isSidewideCouponEnabled ? (
                site_wide_applied || coupon_code ? (
                  <div block="appliedCouponBlock">
                    <div block="appliedCouponDetail">
                      <span block="showCouponBtnLeftBlock">
                        <img
                          block="couponImage"
                          src={Coupon}
                          alt="couponImage"
                        />
                        <p block="appliedCouponCode" mods={{ isArabic }}>
                          {coupon_code ? coupon_code : sidewideCouponCode}{" "}
                          &nbsp;
                          <span className="couponAppliedText">
                            {__("Coupon applied")}
                          </span>
                        </p>
                      </span>
                    </div>
                    <button
                      block="appliedCouponBtn remove"
                      onClick={(e) => {
                        coupon_code
                          ? this.handleRemoveCode(e)
                          : this.handleSideWideCoupon(0, sidewideCouponCode );
                      }}
                    >
                      {__("Remove")}
                    </button>
                  </div>
                ) : (
                  <button onClick={this.openCouponPopup} block="showCouponBtn">
                    <span block="showCouponBtnLeftBlock">
                      <img block="couponImage" src={Coupon} alt="couponImage" />
                      <span block="couponText" mods={{ isArabic }}>
                        {promoCodeText}
                      </span>
                    </span>
                  </button>
                )
              ) : coupon_code ? (
                <div block="appliedCouponBlock">
                  <div block="appliedCouponDetail">
                    <span block="showCouponBtnLeftBlock">
                      <img block="couponImage" src={Coupon} alt="couponImage" />
                      <p block="appliedCouponCode" mods={{ isArabic }}>
                        {coupon_code ? coupon_code : sidewideCouponCode} &nbsp;
                        <span className="couponAppliedText">
                          {__("Coupon applied")}
                        </span>
                      </p>
                    </span>
                  </div>
                  <button
                    block="appliedCouponBtn remove"
                    onClick={(e) => {
                      this.handleRemoveCode(e)
                    }}
                  >
                    {__("Remove")}
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={this.openCouponPopup} block="showCouponBtn">
                    <span block="showCouponBtnLeftBlock">
                      <img block="couponImage" src={Coupon} alt="couponImage" />
                      <span block="couponText" mods={{ isArabic }}>
                        {promoCodeText}
                      </span>
                    </span>
                    <span block="couponCodeSelectText">{__("Select")}</span>
                  </button>
                </>
              )}
            </div>
            {isSidewideCouponEnabled ? (
              <>
                <SideWideCoupon
                  handleRemoveCode={this.handleRemoveCode}
                  openCouponPopup={this.openCouponPopup}
                />
                <Loader isLoading={isCouponRequest} />
              </>
            ) : null}
            {this.state?.isCouponDetialPopupOpen && (
              <CartCouponDetail
                couponDetail={this.state}
                hideDetail={this.hideCouponDetial}
                showTermsAndConditions={this.showTermsAndConditions}
              />
            )}
          </>
        ) : (
          <>
            <div block="couponPopupBlock">
              <div
                block="couponPopupContent"
                ref={this.cartCouponPopup}
                mods={{ isArabic }}
              >
                <div block="couponPopupTop" mods={{ isArabic }}>
                  {isMobile ? __("Discount code") : __("Promo codes")}
                  <button
                    onClick={this.closeCouponPopup}
                    block="closeCouponPopupBtn"
                  >
                    <span>Close</span>
                  </button>
                </div>
                {isMobile ? null : (
                  <p>{__("Select a Promo or type a Coupon code")}</p>
                )}
                <div block="couponInputBox">
                  <CartCoupon
                    couponCode={coupon_code}
                    closePopup={this.closeCouponPopup}
                    totals={totals}
                  />
                </div>
                <CartCouponList
                  couponCode={coupon_code}
                  closePopup={this.closeCouponPopup}
                  showDetail={this.showCouponDetial}
                  {...this.props}
                />
                {this.state?.isCouponDetialPopupOpen && (
                  <CartCouponDetail
                    couponDetail={this.state}
                    hideDetail={this.hideCouponDetial}
                    showTermsAndConditions={this.showTermsAndConditions}
                  />
                )}
                {this.state?.isTermsAndConditionspopupOpen && (
                  <CartCouponTermsAndConditions
                    TermsAndConditions={this.state}
                    hideTermsAndConditions={this.hideTermsAndConditions}
                    hideDetail={this.hideCouponDetial}
                    handleApplyCode={this.handleApplyCode}
                  />
                )}
              </div>
              <Loader isLoading={isLoading} />
            </div>
          </>
        )}
      </>
    );
  }

  renderPriceLineForCouponSavings(price, name, mods, allowZero = false) {
    const {
      totals: { currency_code = getCurrency() },
    } = this.props;
    const finalPrice = parseFloat(getFinalPrice(price, currency_code)).toFixed(
      2
    );

    return (
      <li block="CartPage" elem="SummaryItem" mods={mods}>
        <strong block="CartPage" elem="Text">
          {name}
        </strong>
        <strong block="CartPage" elem="CouponSavingsPrice">
          {price === 0 ? (
            <span onClick={this.openCouponPopup} block="applyCouponButton">
              {__("Apply Coupon")}
            </span>
          ) : (
            currency_code + " -" + finalPrice
          )}
        </strong>
      </li>
    );
  }

  renderPriceLineForShipping(price, name, mods, allowZero = false) {
    const { isArabic } = this.state;
    const {
      totals: { currency_code = getCurrency() },
    } = this.props;
    const locale = getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    const finalPrice = getFinalPrice(price, currency_code);
    const shippingFee = parseInt(finalPrice) ? finalPrice : getShippingFees(country);

    if (parseInt(finalPrice) === 0) {
      return (
        <li block="CartPage" elem="SummaryItem" mods={mods}>
          <strong block="CartPage" elem="Text">
            {name}
          </strong>
          <span>
            {name !== __("International Shipping Fee") && (
              <strong block="CartPage" elem="Price">
                <del block="freeShipping" mods={{ isArabic }}>
                  {`${
                    parseFloat(price) || price === 0 ? currency_code : ""
                  } ${shippingFee}`}
                </del>
              </strong>
            )}

            {__("FREE")}
          </span>
        </li>
      );
    }

    return (
      <li block="CartPage" elem="SummaryItem" mods={mods}>
        <strong block="CartPage" elem="Text">
          {name}
        </strong>
        <strong block="CartPage" elem="Price">
          {`${
            parseFloat(price) || price === 0 ? currency_code : ""
          } ${shippingFee}`}
        </strong>
      </li>
    );
  }

  renderPriceLine(price, name, mods, allowZero = false) {
    if (!price && !allowZero) {
      return null;
    }

    const {
      totals: { currency_code = getCurrency() },
    } = this.props;
    const finalPrice = getFinalPrice(price, currency_code);

    return (
      <li block="CartPage" elem="SummaryItem" mods={mods}>
        <strong block="CartPage" elem="Text">
          {name}
        </strong>
        <strong block="CartPage" elem="Price">
          {`${
            parseFloat(price) || price === 0 ? currency_code : ""
          } ${finalPrice}`}
        </strong>
      </li>
    );
  }
  renderYourOffers() {
    const { isArabic, tabbyResp, isMobile } = this.state;
    const {
      totals: { currency_code, total,
        total_segments: totals = [],
      },
      config: { countries = {} }
    } = this.props;
    const countryCode = getCountryFromUrl();
    const cashOnDeliveryFee = getDiscountFromTotals(totals, "msp_cashondelivery") || 0;
    const isTamaraEnable = countries[countryCode]?.isTamaraEnable;
    const grandTotal =
      total > cashOnDeliveryFee
        ? getFinalPrice(total, currency_code) - getFinalPrice(cashOnDeliveryFee, currency_code)
        : getFinalPrice(total, currency_code);

    if (tabbyResp?.value || isTamaraEnable ) { 
      return (
        <div block="CartPage" elem="yourOffersBlock">
          <div block="CartPage" elem="yourOffersHeading">
            <img block="OfferIcon" src={Offer} alt="my-Offers" />
            <h4 block="yourOfferHeading" mods={{ isArabic }}>
              {__("Your Offers")}
            </h4>
          </div>
          {isTamaraEnable ? (
            <>
              <div id="TamaraPromo">
                <TamaraWidget
                  isArabic={isArabic}
                  countryCode={countryCode}
                  productPrice={grandTotal}
                  isMobile={isMobile}
                  pageType="cartPage"
                />
              </div>
              <br />
            </>
          ) : null}
          <div block="CartPage" elem="yourOffersItem">
            {" "}
            <div block="CartPage" elem="TabbyBlock">
              <div id="TabbyPromo"></div>
            </div>
          </div>
        </div>
      );
    }
  }
  renderTotal() {
    const {
      couponsItems = [],
      totals: {
        coupon_code: couponCode,
        discount,
        subtotal = 0,
        total = 0,
        currency_code = getCurrency(),
        total_segments: totals = [],
        shipping_fee = 0,
        international_shipping_amount = 0,
        items = [],
      },
      international_shipping_fee,
      isSidewideCouponEnabled,
    } = this.props;
    let appliedCoupon = {};
    if (couponsItems) {
      appliedCoupon = couponsItems.find(function (coupon) {
        if (coupon.code === couponCode) {
          return coupon;
        }
      });
    }
    const cashOnDeliveryFee = getDiscountFromTotals(totals, "msp_cashondelivery") || 0;
    const grandTotal =
      total > cashOnDeliveryFee
        ? getFinalPrice(total, currency_code) - getFinalPrice(cashOnDeliveryFee, currency_code)
        : getFinalPrice(total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);
    let inventory_level_cross_border = false;
    items.map((item) => {
      if (
        item.full_item_info &&
        item.full_item_info.cross_border &&
        parseInt(item.full_item_info.cross_border) > 0
      ) {
        inventory_level_cross_border = true;
      }
    });
    if(isSidewideCouponEnabled) {
      return(
        <CartTotal 
          pageType="CartPage"
          block="CartPage"
        />
      )
    }
    if (discount != 0) {
      return (
        <div block="CartPage" elem="OrderTotals">
          <h3 block="OrderTotalsHeading">{__("ORDER DETAILS")}</h3>
          <ul>
            <div block="CartPage" elem="Subtotals">
              {this.renderPriceLine(subTotal, __("Subtotal"))}
              {this.renderPriceLine(
                getDiscountFromTotals(totals, "customerbalance"),
                __("My Cash")
              )}
               {this.renderPriceLine(
                getDiscountFromTotals(totals, "reward"),
                __("My Rewards")
              )}
              {this.renderPriceLine(
                getDiscountFromTotals(totals, "clubapparel"),
                __("Club Apparel Redemption")
              )}
              {couponCode || (discount && discount != 0)
                ? this.renderPriceLine(discount, __("Discount"))
                : null}
              {(!inventory_level_cross_border || !international_shipping_fee)
                ? this.renderPriceLineForShipping(
                    shipping_fee,
                    __("Shipping fee")
                  )
                : null}
              {international_shipping_fee &&
                inventory_level_cross_border &&
                this.renderPriceLineForShipping(
                  international_shipping_amount,
                  __("International Shipping Fee")
                )}
              {this.renderPriceLine(grandTotal, __("Total Amount"), {
                divider: true,
              })}
            </div>
          </ul>
        </div>
      );
    } else {
      return (
        <div block="CartPage" elem="OrderTotals">
          <h3 block="OrderTotalsHeading">{__("ORDER DETAILS")}</h3>
          <ul>
            <div block="CartPage" elem="Subtotals">
              {this.renderPriceLine(subTotal, __("Subtotal"), {
                subtotalOnly: true,
              })}
              {(!inventory_level_cross_border || !international_shipping_fee)
                ? this.renderPriceLineForShipping(
                    shipping_fee,
                    __("Shipping fee")
                  )
                : null}
              {international_shipping_fee &&
                inventory_level_cross_border &&
                this.renderPriceLineForShipping(
                  international_shipping_amount,
                  __("International Shipping Fee")
                )}
              {this.renderPriceLine(grandTotal, __("Total Amount"), {
                divider: true,
              })}
            </div>
          </ul>
        </div>
      );
    }
  }

  scrollToSpecificSection(e) {
    window.scrollTo(0, 9999);
  }

  handleProceedTockButton() {
    const { onCheckoutButtonClick, isCheckoutAvailable } = this.props;

    if (!isCheckoutAvailable) {
      this.setState({ isOOSProducts: true });
    }
  }

  renderButtons() {
    const { onCheckoutButtonClick, isCheckoutAvailable } = this.props;

    const isDisabled = !isCheckoutAvailable;
    const {
      totals: { total = 0, currency_code = getCurrency() },
    } = this.props;
    const grandTotal = getFinalPrice(total, currency_code);

    if (isMobile.any()) {
      return (
        <div block="CartPage" elem="CheckoutButtons">
          <div block="msiteTotalPrice">
            <span block="msitePrice">
              {currency_code} {grandTotal}
            </span>
            <span
              block="msiteViewDetail"
              onClick={(e) => this.scrollToSpecificSection(e)}
            >
              {__("View details")}
            </span>
          </div>
          <button
            block="CartPage"
            elem="CheckoutButton"
            mods={{ isDisabled }}
            mix={{ block: "Button" }}
            onClick={onCheckoutButtonClick}
            id="ProceedToCheckoutButton"
          >
            <span />
            {__("Proceed to Checkout")}
          </button>
        </div>
      );
    }

    return (
      <div block="CartPage" elem="CheckoutButtons">
        <button
          block="CartPage"
          elem="CheckoutButton"
          mods={{ isDisabled }}
          mix={{ block: "Button" }}
          onClick={(e) => {
            onCheckoutButtonClick(e);
            this.handleProceedTockButton();
          }}
          id="ProceedToCheckoutButton"
        >
          <span />
          {__("Proceed to Checkout")}
        </button>
      </div>
    );
  }

  renderTotals() {
    const {
      totals: { extension_attributes },
      isClubApparelEnabled
    } = this.props;
    if (isMobile.any()) {
      return (
        <article block="CartPage" elem="Summary">
          <div
            block={
              extension_attributes &&
              extension_attributes?.club_apparel_estimated_pointsvalue !== 0
                ? "msiteScrollableBlock"
                : "msiteRemoveExtraMargin"
            }
          >
            {this.renderYourOffers()}
            {this.renderDiscountCode()}
            {this.renderWishlistSlider()}
            {this.renderLookingForThisSlider()}
            {this.renderTotal()}
          </div>

          <div block="msiteBottomFixed">
            {isClubApparelEnabled && this.renderClubApparel()}
            {this.renderButtons()}
          </div>
        </article>
      );
    }
    return (
      <article block="CartPage" elem="Summary">
        {this.renderDiscountCode()}
        {this.renderTotal()}
        {this.renderButtons()}
        {this.renderYourOffers()}
        {isClubApparelEnabled &&this.renderClubApparel()}
      </article>
    );
  }

  renderDiscount() {
    const {
      totals: { coupon_code, discount_amount = 0 },
    } = this.props;

    if (!coupon_code) {
      return null;
    }

    return (
      <>
        <dt>
          {__("Coupon?")}
          <strong block="CartPage" elem="DiscountCoupon">
            {coupon_code.toUpperCase()}
          </strong>
        </dt>
        <dd>{`-${this.renderPriceLine(Math.abs(discount_amount))}`}</dd>
      </>
    );
  }

  renderCrossSellProducts() {
    return (
      <ProductLinks
        linkType={CROSS_SELL}
        title={__("Frequently bought together")}
      />
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
      <figure block="CartPage" elem="PromoBlock">
        <figcaption block="CartPage" elem="PromoText" mods={{ isArabic }}>
          <Shipping />
          &nbsp;
          {__("Add")}
          &nbsp;
          {
            international_shipping_fee && inventory_level_cross_border ?
            <span>{`${currency_code} ${avail_free_intl_shipping_amount.toFixed(
              3
            )} `}</span>
            :
            <span>{`${currency_code} ${avail_free_shipping_amount.toFixed(
              3
            )} `}</span>
          }
          &nbsp;
          {__("more to your cart for ")}
          &nbsp;
          <span>{__("Free delivery")}</span>
        </figcaption>
      </figure>
    );
  }

  renderClubApparelContent() {
    const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
    const {
      totals: {
        currency_code,
        extension_attributes
      },
      clubApparel: { accountLinked },
      isSignedIn,
    } = this.props;
    const { isArabic } = this.state;

    if (cart_cms) {
      return <CmsBlock identifier={cart_cms} />;
    }

    if (!extension_attributes?.club_apparel_estimated_pointsvalue) {
      return null;
    }

    if (accountLinked && isSignedIn) {
      return (
        <div block="CartPage" elem="ClubApparelBlock" mods={{ isArabic }}>
          <Image
            lazyLoad={true}
            src={ClubApparel}
            alt="Club Apparel Logo"
            mods={{ isArabic }}
          />

          <div block="CartPage" elem="ClubApparelText" mods={{ isArabic }}>
            {__("You may earn ")}
            <span>{`${currency_code} ${extension_attributes?.club_apparel_estimated_pointsvalue} `}</span>
            {__("worth of Club Apparel points for this purchase.")}
          </div>
        </div>
      );
    }

    if (!accountLinked && isSignedIn) {
      return (
        <div block="CartPage" elem="ClubApparelBlock">
          <Image
            lazyLoad={true}
            src={ClubApparel}
            alt="Club Apparel Logo"
            mods={{ isArabic }}
          />

          <div block="CartPage" elem="ClubApparelText" mods={{ isArabic }}>
            {__("Link your Club Apparel Account to earn ")}
            <span>{`${currency_code} ${extension_attributes?.club_apparel_estimated_pointsvalue} `}</span>
            {__("worth of points for this purchase. ")}
            <Link
              block="CartPage"
              elem="ClubApparelLink"
              to="/my-account/club-apparel"
              mods={{ isArabic }}
            >
              {__("Link now")}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div block="CartPage" elem="ClubApparelBlock">
        <Image
          lazyLoad={true}
          src={ClubApparel}
          alt="Club Apparel Logo"
          mods={{ isArabic }}
        />

        <div block="CartPage" elem="ClubApparelText" mods={{ isArabic }}>
          {__("Link your Club Apparel Account to earn ")}
          <span>{`${currency_code} ${extension_attributes?.club_apparel_estimated_pointsvalue} `}</span>
          {__("worth of points for this purchase.")}
        </div>
      </div>
    );
  }

  renderPromo() {
    const {
      totals: { avail_free_shipping_amount, avail_free_intl_shipping_amount, items=[]},
      international_shipping_fee
    } = this.props;

    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });

    return ((!international_shipping_fee || (international_shipping_fee && !inventory_level_cross_border)) && (!avail_free_shipping_amount ||
      avail_free_shipping_amount === 0)) || (international_shipping_fee && inventory_level_cross_border && (!avail_free_intl_shipping_amount || avail_free_intl_shipping_amount === 0)) ? null : (
      <div block="CartPage" elem="Promo">
        {this.renderPromoContent()}
      </div>
    );
  }

  renderClubApparel() {
    const {
      totals: { extension_attributes },
    } = this.props;

    if (extension_attributes) {
      return extension_attributes?.club_apparel_estimated_pointsvalue !== 0 ? (
        <div block="CartPage" elem="ClubApparel">
          {this.renderClubApparelContent()}
        </div>
      ) : null;
    }

    return null;
  }

  renderItemSuffix() {
    const {
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );
    const desktopSuffix = totalQuantity === 1 ? __(" Item") : __(" Items");

    return isMobile.any() ? null : desktopSuffix;
  }

  renderHeading() {
    const {
      totals: { items = [] },
    } = this.props;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    return (
      <div block="CartPage" elem="headingBlock">
        {this.renderBack()}
        <h1
          block="CartPage"
          elem="Heading"
          mods={{ isArabic: isArabic() && !isMobile.any() }}
        >
          {isMobile.any() ? __("My SHOPPING BAG ") : __("My Bag ")}
          <span>
            ({totalQuantity}
            {this.renderItemSuffix()})
          </span>
        </h1>
      </div>
    );
  }

  renderBack() {
    const { history } = this.props;
    const self = this;
    function goHome() {
      self.shouldMobileBottomBarHidden();
      history.push("/");
    }
    const goBack = () => {
      history.goBack();
    };

    return (
      <div block="CartPage" elem="BackArrow">
        <button block="BackArrow-Button" onClick={goBack}>
          <span />
        </button>
      </div>
    );
  }

  renderContent() {
    const { activeTab, changeActiveTab } = this.props;
    const { name } = tabMap[activeTab];

    if (!isMobile.any()) {
      return null;
    }

    return (
      <ContentWrapper
        label={__("My Account page")}
        wrapperMix={{ block: "MyAccount", elem: "Wrapper" }}
      >
        <MyAccountTabList
          tabMap={tabMap}
          activeTab={activeTab}
          changeActiveTab={changeActiveTab}
        />
        <div block="MyAccount" elem="TabContent">
          <h1 block="MyAccount" elem="Heading">
            {name}
          </h1>
        </div>
      </ContentWrapper>
    );
  }

  renderRecentlyViewSlider() {
    const { cartWidgetApiData = [] } = this.props;
    const { innerWidth: width } = window;
    document.body.style.overflowX = "hidden";
    const { isArabic } = this.state;
    return (
      <div
        block="PDPWidgets-cart"
        elem="Slider"
        mods={{ largeScreen: width > 1440 }}
      >
        <div block="Seperator" mods={{ isDesktop: !isMobile.any() }}></div>
        <DynamicContentVueProductSliderContainer
          widgetID={"vue_recently_viewed_slider"}
          heading={__("Recently Viewed")}
          isHome={false}
          renderMySignInPopup={this.showPopup}
          pageType={"cart"}
          key={`DynamicContentVueProductSliderContainer${1}`}
          index={2}
          withViewAll={true}
          isArabic={isArabic}
          products={cartWidgetApiData}
        />
      </div>
    );
  }

  renderYouMayAlsoLikeSlider() {
    const { youMayAlsoLikeData = [] } = this.props;
    document.body.style.overflowX = "hidden";
    return (
      <>
        <div block="Seperator" mods={{ isDesktop: !isMobile.any() }}></div>
        <h2 class="cartAlsoLikeHeading">{__("You May Also Like")}</h2>
        <div block="PLPPage">
          <ul block="ProductItems">
            {youMayAlsoLikeData.map((item) => {
              return (
                <ProductItem
                  position={1}
                  product={item}
                  renderMySignInPopup={this.showPopup}
                  key={v4()}
                  page="cart"
                  pageType="cart"
                  isVueData={true}
                />
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  showPopup = () => {
    this.setState({ showPopup: true });
  };

  renderMySignInPopup() {
    const { showPopup } = this.state;
    const { onSignIn } = this.props;
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={onSignIn}
        isPopup
      />
    );
  }

  renderWishlistSlider = () => {
    const { wishListProducts } = this.props;

    return (
      <CartPageSliders
        sliderProducts={wishListProducts}
        heading={__("Your WishList")}
        linkTo={"/my-account/my-wishlist"}
        sliderType="wishlist"
        isVueData={false}
      />
    );
  };

  renderLookingForThisSlider = () => {
    const { lookingForThisData } = this.props;
    if (lookingForThisData) {
      return (
        <CartPageSliders
          sliderProducts={lookingForThisData}
          heading={__("Looking for this?")}
          linkTo={{
            pathname: "/viewall/?q=vue_compact_style_it_slider",
            state: {
              vueProducts: lookingForThisData,
              product_id: lookingForThisData.sku,
            },
          }}
          sliderType="LookingForThis"
          isVueData={true}
        />
      );
    }

    return null;
  };

  renderDynamicContent() {
    const {
      totals = {},
      totals: { total, items = [], extension_attributes, discount },
      isLoading,
      processingRequest,
      cartWidgetApiData = [],
      youMayAlsoLikeData = [],
      isSignedIn,
    } = this.props;
    const { isArabic, isOOSProducts } = this.state;
    const { country } = JSON.parse(
      localStorage.getItem("APP_STATE_CACHE_KEY")
    )?.data || {country: getCountryFromUrl().toUpperCase() };


    // if cart is not created and user goes to cart page in mobile view.

    const isMobiledev = isMobile ? isMobile.any() : false;

    const cart_id = BrowserDatabase.getItem(CART_ID_CACHE_KEY);

    if (isMobiledev && !cart_id) {
      return (
        <div block="CartPage" elem="Static" mods={{ isArabic }}>
          {this.renderMySignInPopup()}
          <div className="sidePadding">
            {this.renderHeading()}
            <RenderEmptyCartPageForMobile />
            <div className="PDPWidgets-cart">
              {cartWidgetApiData.length !== 0
                ? this.renderRecentlyViewSlider()
                : null}
            </div>
            <div className="PDPWidgets-cart">
              {youMayAlsoLikeData.length !== 0
                ? this.renderYouMayAlsoLikeSlider()
                : null}
            </div>
          </div>
        </div>
      );
    }

    if (!cart_id) {
      return (
        <div block="CartPage" elem="Static" mods={{ isArabic }}>
          <div className="sidePadding">
            {/* {this.renderHeading()} */}
            {this.renderMySignInPopup()}
            <RenderEmptyCartPage />
            <div block="Empty-cart-spacing"></div>
            <div className="PDPWidgets-cart">
              {cartWidgetApiData.length !== 0
                ? this.renderRecentlyViewSlider()
                : null}
            </div>
            <div className="PDPWidgets-cart">
              {youMayAlsoLikeData.length !== 0
                ? this.renderYouMayAlsoLikeSlider()
                : null}
            </div>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return <Loader isLoading={isLoading} />;
    }

    if (Object.keys(totals).length === 0 || items.length === 0) {
      if (isMobiledev) {
        return (
          <div block="CartPage" elem="Static" mods={{ isArabic }}>
            {this.renderMySignInPopup()}
            <div className="sidePadding">
              {this.renderHeading()}
              <RenderEmptyCartPageForMobile />

              <div className="PDPWidgets-cart">
                {cartWidgetApiData.length !== 0
                  ? this.renderRecentlyViewSlider()
                  : null}
              </div>

              <div className="PDPWidgets-cart">
                {youMayAlsoLikeData.length !== 0
                  ? this.renderYouMayAlsoLikeSlider()
                  : null}
              </div>
            </div>
          </div>
        );
      }
      return (
        <div block="CartPage" elem="Static" mods={{ isArabic }}>
          {/* {this.renderHeading()} */}
          {this.renderMySignInPopup()}
          <div className="sidePadding">
            <RenderEmptyCartPage />
            <div block="Empty-cart-spacing"></div>
            <div className="PDPWidgets-cart">
              {cartWidgetApiData.length !== 0
                ? this.renderRecentlyViewSlider()
                : null}
            </div>
            <div className="PDPWidgets-cart">
              {youMayAlsoLikeData.length !== 0
                ? this.renderYouMayAlsoLikeSlider()
                : null}
            </div>
          </div>
        </div>
      );
    }
    const additionalMargin =
      (country === "AE" || country === "SA") && total >= 150 ? 100 : 5;
    const showClubOverflow =
      items?.length > 1 &&
      extension_attributes?.club_apparel_estimated_pointsvalue !== 0
        ? true
        : false;
    const showClubOverflowWithDic = showClubOverflow && discount != 0;
    const showOverflow =
      items?.length > 1 &&
      extension_attributes?.club_apparel_estimated_pointsvalue === 0
        ? true
        : false;
    const finalOverlayCss = showClubOverflowWithDic
      ? 1
      : showClubOverflow
      ? 2
      : 3;
    return (
      <>
        {this.renderContent()}
        <ContentWrapper
          wrapperMix={{ block: "CartPage", elem: "Wrapper" }}
          label="Cart page details"
        >
          <Loader isLoading={processingRequest} />
          <div className="sidePadding">{this.renderHeading()}</div>
          <CartNudge />
          <div block="cartMain">
            <div
              block="CartPage"
              elem="StaticItemBlock"
              mods={{
                isArabic,
                showClubOverflowWithDic: finalOverlayCss === 1,
                showClubOverflow: finalOverlayCss === 2,
                showOverflow,
              }}
            >
              <div className="sidePadding">
                {this.renderCartItems()}
                {this.renderCrossSellProducts()}
                {isOOSProducts ? this.renderRemoveOOS() : null}
                {this.renderPromo()}
              </div>
            </div>
            <div
              ref={this.dynamicHeight}
              block="CartPage"
              elem="Floating"
              mods={{ isArabic }}
            >
              {this.renderTotals()}
            </div>
          </div>
          {isSignedIn && !isMobiledev && (
            <div block="cartPageSliders">
              <div block="WishlistSlider">{this.renderWishlistSlider()}</div>
              <div block="WishlistSlider">
                {this.renderLookingForThisSlider()}
              </div>
            </div>
          )}
        </ContentWrapper>
      </>
    );
  }

  shouldMobileBottomBarHidden() {
    const elem = document.getElementById("mobileBottomBar");
    if (elem) {
      if (location.pathname.match(/cart/)) {
        elem.classList.add("hidden");
      } else {
        elem.classList.remove("hidden");
      }
    }
  }
  componentWillUnmount() {
    const elem = document.getElementById("mobileBottomBar");
    if (elem) {
      elem.classList.remove("hidden");
    }
  }

  render() {
    const { isArabic } = this.state;

    return (
      <main block="CartPage" aria-label="Cart Page" mods={{ isArabic }}>
        {this.renderDynamicContent()}
        {this.shouldMobileBottomBarHidden()}
      </main>
    );
  }
}

export default CartPage;
