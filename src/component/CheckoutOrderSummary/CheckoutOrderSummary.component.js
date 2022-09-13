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
import { getCountryFromUrl } from "Util/Url/Url";
import CartCouponList from "Component/CartCouponList";
import CartCouponDetail from 'Component/CartCouponDetail';
import CartCouponTermsAndConditions from "Component/CartCouponTermsAndConditions/CartCouponTermsAndConditions.component";

import Delivery from "./icons/delivery-truck.png";

import "./CheckoutOrderSummary.extended.style";

export const mapStateToProps = (state) => ({
  processingRequest: state.CartReducer.processingRequest,
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
          {totalQuantity}
          {totalQuantity === 1 ? __(" Item") : __(" Items")}
        </span>
        <Link
          block="CheckoutOrderSummary"
          elem="Edit"
          mods={{ isArabic }}
          to="/cart"
        >
          <span>{__(" Edit")}</span>
        </Link>
      </div>
    );
  }

  renderItems() {
    const {
      totals: { items = [] },
    } = this.props;

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

  renderPromoContent() {
    const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
    const {
      totals: { currency_code, avail_free_shipping_amount },
    } = this.props;
    const { isArabic } = this.state;

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
          <span block="CheckoutOrderSummary" elem="Currency">
            {`${currency_code} ${avail_free_shipping_amount.toFixed(3)} `}
          </span>
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

  handleRemoveCode = (e) => {
    e.stopPropagation()
    this.props.removeCouponFromCart()
  }

  setLoader = (currLoaderState) => {
    this.setState({
      isLoading: currLoaderState
    })
  }

  renderDiscountCode() {
    const {
      totals: { coupon_code },
      couponsItems = [], couponLists= []
    } = this.props;
    const isOpen = false;
    const { isArabic, isMobile, isLoading } = this.state;
    const promoCount = Object.keys(couponsItems).length;
    let appliedCoupon = {};
    if (couponsItems) {
      appliedCoupon = couponsItems.find(function (coupon) {
        return coupon.code == coupon_code
      })
    }
  
    return (
        <div block="wrapperCartCouponBlock" mods={{ isArabic }}>{
          (!this.state?.isCouponPopupOpen) ?
            <>
              <div block="cartCouponBlock" mods={{ isArabic }}>
                {
                  coupon_code ?
                    <div block="appliedCouponBlock" onClick={this.openCouponPopup}>
                      <div block="appliedCouponDetail">
                        <p block="appliedCouponCode">{appliedCoupon ? appliedCoupon?.code : coupon_code}</p>
                      </div>
                      <button block="appliedCouponBtn remove" onClick={(e) => { this.handleRemoveCode(e) }}>{__("Remove")}</button>
                    </div>
                    :
                    <button onClick={this.openCouponPopup} block="showCouponBtn">{__("Enter coupon or promo code")}</button>
                }
              </div>
              {this.state?.isCouponDetialPopupOpen && <CartCouponDetail couponDetail={this.state} hideDetail={this.hideCouponDetial} showTermsAndConditions={this.showTermsAndConditions}/>}
              {this.state?.isTermsAndConditionspopupOpen && <CartCouponTermsAndConditions TermsAndConditions={this.state} hideTermsAndConditions={this.hideTermsAndConditions} /> }
            </>
            :
            <>
              <div block="couponPopupBlock">
                <div block="couponPopupContent" ref={this.cartCouponPopup} mods={{ isArabic }}>
                  <div block="couponPopupTop" mods={{isArabic}}>
                  {isMobile ? __("Discount code") : __("Promo codes")}
                    <button onClick={this.closeCouponPopup} block="closeCouponPopupBtn">
                      <span>Close</span>
                    </button>
                  </div>
                    {isMobile ? (null) : (<p>{__("Select a Promo or type a Coupon code")}</p>)}
                    <div block="couponInputBox">
                      <CartCoupon couponCode={coupon_code} closePopup={this.closeCouponPopup} />
                    </div>
                  <CartCouponList couponCode={coupon_code} closePopup={this.closeCouponPopup} showDetail={this.showCouponDetial} {...this.props} setLoader={this.setLoader}/>
                  {this.state?.isCouponDetialPopupOpen && <CartCouponDetail couponDetail={this.state} hideDetail={this.hideCouponDetial} showTermsAndConditions={this.showTermsAndConditions}/>}
                  {this.state?.isTermsAndConditionspopupOpen && <CartCouponTermsAndConditions TermsAndConditions={this.state} hideTermsAndConditions={this.hideTermsAndConditions} /> }
                </div>
              <Loader isLoading={isLoading} />
              </div>
            </>
        }</div>
    );
  }

  renderCartCoupon() {
    const {
      totals: { coupon_code },
    } = this.props;

    if (isMobile.any()) {
      return null;
    }

    return <CartCoupon couponCode={coupon_code} />;
  }

  renderPromo() {
    const {
      totals: { avail_free_shipping_amount },
    } = this.props;

    return !avail_free_shipping_amount ||
      avail_free_shipping_amount === 0 ? null : (
        <div block="CheckoutOrderSummary" elem="Promo">
          {this.renderPromoContent()}
        </div>
      );
  }

  renderToggleableDiscountOptions() {
    if (!isSignedIn()) {
      return null;
    }

    return (
      <div block="CheckoutOrderSummary" elem="DiscountOptionWrapper">
        <StoreCredit canApply hideIfZero />
        <ClubApparel hideIfZero />
      </div>
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

    if(name === "Coupon Code"){
      return (
        <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
          <strong block="CheckoutOrderSummary" elem="Text">
            {name}
          </strong>
          <strong block="CheckoutOrderSummary" elem="PriceCouponCode">
            {`- ${parseFloat(price) || price === 0 ? currency_code : ""
              } ${Math.abs(finalPrice)}`}
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
      },
      checkoutStep,
    } = this.props;
    const grandTotal = getFinalPrice(total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);
    return (
      <div block="CheckoutOrderSummary" elem="OrderTotals">
        <ul>
          <div block="CheckoutOrderSummary" elem="Subtotals">
            {this.renderPriceLine(subTotal, __("Subtotal"))}
            {checkoutStep !== SHIPPING_STEP &&
              this.renderPriceLine(shipping_amount, __("Shipping"), {
                divider: true,
              })}
            {this.renderPriceLine(
              getDiscountFromTotals(totals, "customerbalance"),
              __("Store Credit")
            )}
            {this.renderPriceLine(
              getDiscountFromTotals(totals, "clubapparel"),
              __("Club Apparel Redemption")
            )}
            {(couponCode || (discount && discount != 0)) ? this.renderPriceLine(discount, __("Coupon Code")) : null}


            {this.renderPriceLine(
              getDiscountFromTotals(totals, "shipping") || __("FREE"),
              __("Shipping Charges")
            )}
            {this.renderPriceLine(
              getDiscountFromTotals(totals, "tax"),
              __("Tax")
            )}
            {this.renderPriceLine(
              cashOnDeliveryFee ??
              getDiscountFromTotals(totals, "msp_cashondelivery"),

              getCountryFromUrl() === 'QA' ? __("Cash on Receiving") : __("Cash on Delivery")
            )}
          </div>
          <div block="CheckoutOrderSummary" elem="Totals">
            {this.renderPriceLine(grandTotal, __("Total"), {}, true)}
            <span>{__("(Taxes included)")}</span>
          </div>
        </ul>
      </div>
    );
  }

  render() {
    const { processingRequest } = this.props;
    const { isMobile } = this.state;

    return (
      <article block="CheckoutOrderSummary" aria-label="Order Summary">
        {/* <Loader isLoading={processingRequest} /> */}
        {this.renderHeading()}
        {this.renderItems()}
        {this.renderToggleableDiscountOptions()}
        {/* {this.renderCartCoupon()} */}
        {isMobile ? "" : this.renderDiscountCode()}
        {this.renderPromo()}
        {this.renderTotals()}
      </article>
    );
  }
}

export default CheckoutOrderSummary;
