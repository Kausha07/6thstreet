/* eslint-disable no-magic-numbers */
import CartCoupon from "Component/CartCoupon";
import ClubApparel from "Component/ClubApparel";
import CmsBlock from "Component/CmsBlock";
import Link from "Component/Link";
import Loader from "Component/Loader";
import { getFinalPrice } from "Component/Price/Price.config";
import StoreCredit from "Component/StoreCredit";
import { SHIPPING_STEP } from "Route/Checkout/Checkout.config";
import { CheckoutOrderSummary as SourceCheckoutOrderSummary } from "SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component";
import { getCurrency, getDiscountFromTotals, isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import Image from "Component/Image";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import CartCouponList from "Component/CartCouponList";
import CartCouponDetail from 'Component/CartCouponDetail';
import CartCouponTermsAndConditions from "Component/CartCouponTermsAndConditions/CartCouponTermsAndConditions.component";
import UseMyWallet from "../MyWallet/UseMyWallet/UseMyWallet";
import { connect } from "react-redux";
import Event, {
  MOE_trackEvent,
  EVENT_GTM_COUPON,
  EVENT_REMOVE_COUPON,
  EVENT_APPLY_COUPON,
  EVENT_APPLY_COUPON_FAILED,
} from "Util/Event";
import Delivery from "./icons/delivery-truck.png";
import SideWideCoupon from "Component/SideWideCoupon";
import BrowserDatabase from "Util/BrowserDatabase";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";
import { Coupon } from "Component/Icons/index";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CartTotal from "Component/CartTotal";
import NewCheckoutShippment from "Component/NewCheckoutShippment";

import "./CheckoutOrderSummary.extended.style";

export const mapDispatchToProps = (dispatch) => ({
  updateSidewideCoupon: (quoteId, flag, is_guest) =>
    CartDispatcher.updateSidewideCoupon(dispatch, quoteId, flag, is_guest),
});

export const mapStateToProps = (state) => ({
  processingRequest: state.CartReducer.processingRequest,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  config: state.AppConfig.config,
  isCouponRequest: state.CartReducer.isCouponRequest,
  vwoData: state.AppConfig.vwoData,
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

export class CheckoutOrderSummary extends SourceCheckoutOrderSummary {
  constructor(props) {
    super(props);
    this.cartCouponPopup = React.createRef();
  }
  state = {
    isArabic: isArabic(),
    TermsAndConditions: "",
    isTermsAndConditionspopupOpen:false,
    isCouponPopupOpen: false,
    couponCode: "",
    couponName: "",
    couponDescription: "",
    isCouponDetialPopupOpen: false,
    couponModuleStatus: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    isLoading: false,
  };

  componentDidMount() {
    window.addEventListener("mousedown", this.outsideCouponPopupClick);
  }

  outsideCouponPopupClick = e => {
    if (this.state.isCouponPopupOpen && this.cartCouponPopup.current && !this.cartCouponPopup.current.contains(e.target)) {
      this.setState({
        isCouponPopupOpen: false
      })
      const bodyElt = document.querySelector("body");
      bodyElt.removeAttribute("style");
    }
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

    return totalQuantity === 1 ? __(" Item") : __(" Items");
  }

  renderHeading() {
    const {
      totals: { items = [] },
    } = this.props;
    const { isArabic } = this.state;

    const itemQuantityArray = items.map((item) => item.qty);
    const totalQuantity = itemQuantityArray.reduce(
      (qty, nextQty) => qty + nextQty,
      0
    );

    return (
      <div block="CheckoutOrderSummary" elem="HeaderWrapper">
        <span block="CheckoutOrderSummary" elem="ItemCount">
          {__(" Coupon & offer ")}
        </span>
      </div>
    );
  }

  renderItems() {
    const {
      totals: { items = [], quote_currency_code },
      isSignedIn,
    } = this.props;

    if(!isSignedIn) {
      return (
        <div block="CheckoutOrderSummary" elem="OrderItems">
          <ul block="CheckoutOrderSummary" elem="CartItemList">
            {
              items.map((item) => (
                React.cloneElement(this.renderItem(item), {
                  readOnly: true
                })
              ))}
          </ul>
        </div>
      );
    }

    return (
      <NewCheckoutShippment
        items={items}
        quote_currency_code={quote_currency_code}
        isSignedIn={this.props.isSignedIn}
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

    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });

    if (cart_cms) {
      return <CmsBlock identifier={cart_cms} />;
    }

    return (
      <div block="CheckoutOrderSummary" elem="PromoBlock">
        <figcaption
          block="CheckoutOrderSummary"
          elem="PromoText"
          mods={{ isArabic }}
        >
          <Image lazyLoad={true} src={Delivery} alt="Delivery icon" />
          {__("Add ")}
          {
            international_shipping_fee && inventory_level_cross_border ?
            <span block="CheckoutOrderSummary" elem="Currency">
              {`${currency_code} ${avail_free_intl_shipping_amount.toFixed(3)} `}
            </span>
            :
            <span block="CheckoutOrderSummary" elem="Currency">
              {`${currency_code} ${avail_free_shipping_amount.toFixed(3)} `}
            </span>
          }
          {__("more to your cart for ")}
          <span block="CheckoutOrderSummary" elem="FreeDelivery">
            {__("Free delivery")}
          </span>
        </figcaption>
      </div>
    );
  }

  closeCouponPopup = () => {
    this.setState({
      isCouponPopupOpen: false
    })
    const bodyElt = document.querySelector("body");
    bodyElt.removeAttribute("style");
  }
  openCouponPopup = () => {
    this.setState({
      isCouponPopupOpen: true
    })
    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  }

  showCouponDetial = (e, coupon) => {
    e.stopPropagation()
    this.setState({
      couponCode: coupon.code,
      couponName: coupon.name,
      couponDescription: coupon.description,
      TermsAndConditions: coupon.term_and_cond,
      isCouponDetialPopupOpen: true
    })
  
    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  
  }

  showTermsAndConditions = (e) => {
    e.stopPropagation();
    this.setState({
      isTermsAndConditionspopupOpen: true,
      // isCouponDetialPopupOpen: false
    })
  }
  
  hideTermsAndConditions = (e) => {
    e.stopPropagation();
    this.setState({
      isTermsAndConditionspopupOpen: false
    })
  }

  hideCouponDetial = (e) => {
    e.stopPropagation()
    this.setState({
      isCouponDetialPopupOpen: false
    })
    if (!this.state.isCouponPopupOpen) {
      const bodyElt = document.querySelector("body");
      bodyElt.removeAttribute("style");
    }
  }

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
    const { isSignedIn, updateSidewideCoupon } = this.props;

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
    this.props.removeCouponFromCart()
  }

  setLoader = (currLoaderState) => {
    this.setState({
      isLoading: currLoaderState
    })
  }

  handleApplyCode = async () => {
    const { couponCode } = this.state;
    this.setLoader(true);
    try{            
        let apiResponse = await (this.props.applyCouponToCart(couponCode)) || null;
        if (typeof apiResponse !== "string") {
        }
        this.setLoader(false);
    }
    catch(error){
        console.error(error);
    }
  }

  renderDiscountCode() {
    const {
      totals: { site_wide_applied = 0, coupon_code = "" },
      couponsItems = [],
      couponLists = [],
      config,
      vwoData,
      isCouponRequest,
    } = this.props;
    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled =
      vwoData?.SiteWideCoupon?.isFeatureEnabled || false;
    const isOpen = false;
    const { isArabic, isMobile, isLoading } = this.state;
    const promoCount = Object.keys(couponsItems).length;
    let appliedCoupon = {};
    if (couponsItems) {
      appliedCoupon = couponsItems.find(function (coupon) {
        return coupon.code == coupon_code;
      });
    }
    const langCode = getLanguageFromUrl();
    const sidewideCouponCode =
      config?.countries?.[countryCode]?.sidewideCouponCode?.[langCode] || "";

    return (
      <div block="wrapperCartCouponBlock" mods={{ isArabic }}>
        {!this.state?.isCouponPopupOpen ? (
          <>
            <div block="cartCouponBlock" mods={{ isArabic }}>
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
                          : this.handleSideWideCoupon(0, sidewideCouponCode);
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
                        {__("Enter coupon or promo code")}
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
                      this.handleRemoveCode(e);
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
                        {__("Enter coupon or promo code")}
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
                  />
                </div>
                <CartCouponList
                  couponCode={coupon_code}
                  closePopup={this.closeCouponPopup}
                  showDetail={this.showCouponDetial}
                  {...this.props}
                  setLoader={this.setLoader}
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
      </div>
    );
  }

  renderCartCoupon() {
    const {
      totals: { coupon_code },
      totals
    } = this.props;

    if (isMobile.any()) {
      return null;
    }

    return <CartCoupon couponCode={coupon_code} totals={totals} />;
  }

  renderPromo() {
    const {
      totals: { avail_free_shipping_amount, avail_free_intl_shipping_amount, items=[]}, international_shipping_fee
    } = this.props;

    let inventory_level_cross_border = false;
    items.map(item => {
      if(item.full_item_info && item.full_item_info.cross_border && parseInt(item.full_item_info.cross_border) > 0) {
        inventory_level_cross_border = true;
      }
    });

    return ((!international_shipping_fee || (international_shipping_fee && !inventory_level_cross_border)) && (!avail_free_shipping_amount ||
      avail_free_shipping_amount === 0)) ||
      (international_shipping_fee && inventory_level_cross_border && (!avail_free_intl_shipping_amount || avail_free_intl_shipping_amount === 0)) ? null : (
        <div block="CheckoutOrderSummary" elem="Promo">
          {this.renderPromoContent()}
        </div>
      );
  }

  renderToggleableDiscountOptions() {
    const {
      totals: {
        eligible_amount,
      },
    } = this.props;
    const { isMobile } = this.state;

    if (!isSignedIn() || isMobile) {
      return null;
    }

    return (
      <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
        <UseMyWallet eligibleAmount = {eligible_amount}/>
        <StoreCredit canApply hideIfZero />
        {this.props?.isClubApparelEnabled ? <ClubApparel hideIfZero /> : null}
      </div>
    );
  }

  renderPriceLine(price, name, mods, allowZero = false) {
    if (!price && !allowZero) {
      return null;
    }
    const { isArabic, } = this.state;

    const {
      totals: { currency_code = getCurrency() },
    } = this.props;
    const finalPrice = getFinalPrice(price, currency_code);

    if(name === "Coupon Code" || name === "My Cash"|| name === "My Rewards"){
      return (
        <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
          <strong block="CheckoutOrderSummary" elem="Text">
            {name}
          </strong>
          <strong block="CheckoutOrderSummary" elem="PriceCouponCode">
            {isArabic ?`${parseFloat(price) || price === 0 ? currency_code : ""} ${Math.abs(finalPrice)} -` 
              : `- ${parseFloat(price) || price === 0 ? currency_code : ""} ${Math.abs(finalPrice)}`}
          </strong>
        </li>
      );
    }

    return (
      <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
        <strong block="CheckoutOrderSummary" elem="Text">
          {name}
        </strong>
        <strong block="CheckoutOrderSummary" elem="Price">
          {`${parseFloat(price) || price === 0 ? currency_code : ""
            } ${finalPrice}`}
        </strong>
      </li>
    );
  }

  renderTotals() {
    const {
      cashOnDeliveryFee,
      totals: {
        coupon_code: couponCode,
        discount,
        subtotal = 0,
        total = 0,
        shipping_amount = 0,
        currency_code = getCurrency(),
        total_segments: totals = [],
        total_wallet_credit,
        items = [],
      },
      international_shipping_fee,
      checkoutStep,
      config,
      vwoData,
    } = this.props;
    const cashOnDelivery = getDiscountFromTotals(totals, "msp_cashondelivery") || 0;
    const countryCode = getCountryFromUrl();
    const isSidewideCouponEnabled =  vwoData?.SiteWideCoupon?.isFeatureEnabled || false;
    const grandTotal =
      checkoutStep === SHIPPING_STEP && total > cashOnDelivery
        ? getFinalPrice(total, currency_code) - getFinalPrice(cashOnDelivery, currency_code)
        : getFinalPrice(total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);
    let inventory_level_cross_border = false;
    items?.map((item) => {
      if (
        item?.full_item_info &&
        item?.full_item_info?.cross_border &&
        parseInt(item.full_item_info.cross_border) > 0
      ) {
        inventory_level_cross_border = true;
      }
    });

    if(isSidewideCouponEnabled) {
      return(
        <CartTotal 
          pageType="CheckoutPage"
          block="CheckoutOrderSummary"
          cashOnDeliveryFee={cashOnDeliveryFee}
        />
      )
    }

    return (
      <div block="CheckoutOrderSummary" elem="OrderTotals">
        <ul>
          <div block="CheckoutOrderSummary" elem="Subtotals">
            {this.renderPriceLine(subTotal, __("Subtotal"))}
            {checkoutStep !== SHIPPING_STEP &&
              this.renderPriceLine(shipping_amount, __("Shipping"), {
                divider: true,
              })}
            {(!inventory_level_cross_border || !international_shipping_fee) &&
              this.renderPriceLine(
                getDiscountFromTotals(totals, "shipping") || __("FREE"),
                __("Shipping Charges")
              )}
            {international_shipping_fee &&
              inventory_level_cross_border &&
              this.renderPriceLine(
                getDiscountFromTotals(totals, "intl_shipping")  || __("FREE"),
                __("International Shipping Fee")
              )}
            {this.renderPriceLine(
              getDiscountFromTotals(totals, "customerbalance"),
              __("My Cash"),
              { couponSavings: true }
            )}
              {this.renderPriceLine(
              getDiscountFromTotals(totals, "reward"),
              __("My Rewards"), 
              { couponSavings: true }
            )}
            {this.props?.isClubApparelEnabled ? this.renderPriceLine(
              getDiscountFromTotals(totals, "clubapparel"),
              __("Club Apparel Redemption")
            ) : null}
            {(couponCode || (discount && discount != 0)) ? this.renderPriceLine(discount, __("Coupon Code")) : null}

            {this.renderPriceLine(
              getDiscountFromTotals(totals, "tax"),
              __("Tax")
            )}
            {cashOnDeliveryFee ? this.renderPriceLine(
              getDiscountFromTotals(totals, "msp_cashondelivery"),

              getCountryFromUrl() === 'QA' ? __("Cash on Receiving") : __("Cash on Delivery")
            ) : null}
          </div>
          <div block="CheckoutOrderSummary" elem="Totals">
            {this.renderPriceLine(grandTotal, __("Total"), {}, true)}
          </div>
          <div block="CheckoutOrderSummary" elem="Cashback">
            {this.renderPriceLine(
                total_wallet_credit,
              __("Cashback"), 
              { cashBack: true }
            )}
          </div>
        </ul>
      </div>
    );
  }

  render() {
    const { isCouponRequest } = this.props;
    const { isMobile } = this.state;

    return (
      <article block="CheckoutOrderSummary" aria-label="Order Summary">
        <Loader isLoading={isCouponRequest} />
        <div className="summaryWrapper">
          {this.renderHeading()}
          {isMobile ? "" : this.renderDiscountCode()}
          {this.renderPromo()}
          {this.renderToggleableDiscountOptions()}
          {this.renderTotals()}
        </div>
        {isMobile ? null : this.renderItems()}
      </article>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutOrderSummary);
