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
import { EVENT_MOE_VIEW_CART_ITEMS, MOE_trackEvent } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import BrowserDatabase from "Util/BrowserDatabase";
import MyAccountOverlay from "Component/MyAccountOverlay";
import { CART_ID_CACHE_KEY } from "Store/MyAccount/MyAccount.dispatcher";

import CartNudge from "./CartNudges/CartNudge"
import { RenderEmptyCartPage, RenderEmptyCartPageForMobile } from "./EmptyCart"
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
    isTermsAndConditionspopupOpen:false,
    isCouponPopupOpen: false,
    couponCode: "",
    couponName: "",
    couponDescription: "",
    isCouponDetialPopupOpen: false,
    couponModuleStatus: false,
    pageLoaded: true,
    showPopup:false,
    pdpWidgetsAPIData: [],
    couponModuleStatus: false,
    isMobile: isMobile.any() || isMobile.tablet(),
    isLoading: false,
    isOOSProducts: false,
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

  fitlerItemArr = ( items = [] ) => {
    let filterArrOne =[];
    let filterArrTwo = [];
    items.map((item)=>{
      if(item?.availableQty === 0 || item?.availableQty < item?.qty){
        filterArrOne.push(item);
      }else {
        filterArrTwo.push(item);
      }
    });
    return [ ...filterArrTwo, ...filterArrOne ];
  }

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
    })
  }

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
    })
  }

  handleRemoveCode = (e) => {
    e.stopPropagation();
    this.props.removeCouponFromCart();
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

  closeremoveOosOverlay =(currstate)=> {
    this.setState({isOOSProducts: currstate})
  }

  renderRemoveOOS() {
    const { totals, updateTotals } = this.props;
    const { isArabic } = this.state;
    return (
        <RemoveOOS
          closeremoveOosOverlay={this.closeremoveOosOverlay}
          totals={totals}
          isArabic={isArabic}
        />
    )
  }
  
  renderDiscountCode() {
    const {
      totals: { coupon_code },
      couponsItems = [],
    } = this.props;
    const isOpen = false;
    const { isArabic, isMobile, isLoading }= this.state;
    const promoCount = Object.keys(couponsItems).length;
    let appliedCoupon = {};
    if (couponsItems) {
      appliedCoupon = couponsItems.find(function (coupon) {
        return coupon.code == coupon_code;
      });
    }
    return (
    // this.state?.couponModuleStatus ? (
    //   <ExpandableContent
    //     isOpen={isOpen}
    //     heading={__("Have a discount code?")}
    //     mix={{ block: "CartPage", elem: "Discount" }}
    //   >
    //     <CartCoupon couponCode={coupon_code} />
    //   </ExpandableContent>
    // ) : (
      <>
        {!this.state?.isCouponPopupOpen ? (
          <>
            <div block="cartCouponBlock">
              {coupon_code ? (
                <div block="appliedCouponBlock" onClick={this.openCouponPopup}>
                  <div block="appliedCouponDetail">
                    <p block="appliedCouponCode">
                      {appliedCoupon ? appliedCoupon?.code : coupon_code}
                    </p>
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
                <button onClick={this.openCouponPopup} block="showCouponBtn">
                  {__("Enter coupon or promo code")}
                </button>
              )}
            </div>
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
              <div block="couponPopupContent" ref={this.cartCouponPopup} mods={{isArabic}}>
                <div block="couponPopupTop" mods={{isArabic}}>
                  {isMobile ? __("Discount code") : __("Promo codes")}
                  <button
                    onClick={this.closeCouponPopup}
                    block="closeCouponPopupBtn"
                  >
                    <span>Close</span>
                  </button>
                </div>
                  {isMobile ? (null) : (<p>{__("Select a Promo or type a Coupon code")}</p>)}
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
  renderTabbyPromo() {
    return (
      <div block="CartPage" elem="TabbyBlock">
        <div id="TabbyPromo"></div>
      </div>
    );
  }
  renderTotal() {
    const {
      totals: {
        coupon_code: couponCode,
        discount,
        subtotal = 0,
        total = 0,
        currency_code = getCurrency(),
        total_segments: totals = [],
        shipping_fee = 0,
      },
    } = this.props;
    const grandTotal = getFinalPrice(total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);
    if (discount != 0) {
      return (
        <div block="CartPage" elem="OrderTotals">
          <ul>
            <div block="CartPage" elem="Subtotals">
              {this.renderPriceLine(subTotal, __("Subtotal"))}
              {this.renderPriceLine(shipping_fee, __("Shipping fee"))}
              {this.renderPriceLine(
                getDiscountFromTotals(totals, "customerbalance"),
                __("Store Credit")
              )}
              {this.renderPriceLine(
                getDiscountFromTotals(totals, "clubapparel"),
                __("Club Apparel Redemption")
              )}
              {couponCode || (discount && discount != 0)
                ? this.renderPriceLine(discount, __("Discount"))
                : null}
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
          <ul>
            <div block="CartPage" elem="Subtotals">
              {this.renderPriceLine(subTotal, __("Subtotal"), {
                subtotalOnly: true,
              })}
              {this.renderPriceLine(shipping_fee, __("Shipping fee"))}
              {this.renderPriceLine(grandTotal, __("Total Amount"), {
                divider: true,
              })}
            </div>
          </ul>
        </div>
      );
    }
  }

  handleProceedTockButton() {
    const { onCheckoutButtonClick, isCheckoutAvailable } = this.props;

    if(!isCheckoutAvailable){
      this.setState({ isOOSProducts: true })
    }
    
  }

  renderButtons() {
    const { onCheckoutButtonClick, isCheckoutAvailable } = this.props;

    const isDisabled = !isCheckoutAvailable;

    return (
      <div block="CartPage" elem="CheckoutButtons">
        <button
          block="CartPage"
          elem="CheckoutButton"
          mods={{ isDisabled }}
          mix={{ block: "Button" }}
          onClick={(e)=>{onCheckoutButtonClick(e); this.handleProceedTockButton()}}
          id="ProceedToCheckoutButton"
        >
          <span />
          {__("Proceed to Checkout")}
        </button>
      </div>
    );
  }

  renderTotals() {
    return (
      <article block="CartPage" elem="Summary">
        {this.renderTabbyPromo()}
        {this.renderTotal()}
        {this.renderButtons()}
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
      totals: { currency_code, avail_free_shipping_amount },
    } = this.props;
    const { isArabic } = this.state;

    if (cart_cms) {
      return <CmsBlock identifier={cart_cms} />;
    }

    return (
      <figure block="CartPage" elem="PromoBlock">
        <figcaption block="CartPage" elem="PromoText" mods={{ isArabic }}>
          <Shipping />
          &nbsp;
          {__("Add")}
          &nbsp;
          <span>{`${currency_code} ${avail_free_shipping_amount.toFixed(
            3
          )} `}</span>
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
        extension_attributes: { club_apparel_estimated_pointsvalue },
      },
      clubApparel: { accountLinked },
      isSignedIn,
    } = this.props;
    const { isArabic } = this.state;

    if (cart_cms) {
      return <CmsBlock identifier={cart_cms} />;
    }

    if (!club_apparel_estimated_pointsvalue) {
      return null;
    }

    if (accountLinked && isSignedIn) {
      return (
        <div block="CartPage" elem="ClubApparelBlock" mods={{ isArabic }}>
          <Image lazyLoad={true} src={ClubApparel} alt="Club Apparel Logo" />

          <div block="CartPage" elem="ClubApparelText">
            {__("You may earn ")}
            <span>{`${currency_code} ${club_apparel_estimated_pointsvalue} `}</span>
            {__("worth of Club Apparel points for this purchase.")}
          </div>
        </div>
      );
    }

    if (!accountLinked && isSignedIn) {
      return (
        <div block="CartPage" elem="ClubApparelBlock">
          <Image lazyLoad={true} src={ClubApparel} alt="Club Apparel Logo" />

          <div block="CartPage" elem="ClubApparelText">
            {__("Link your Club Apparel account to earn ")}
            <span>{`${currency_code} ${club_apparel_estimated_pointsvalue} `}</span>
            {__("worth of points for this purchase. ")}
            <Link
              block="CartPage"
              elem="ClubApparelLink"
              to="/my-account/club-apparel"
            >
              {__("Link now")}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div block="CartPage" elem="ClubApparelBlock">
        <Image lazyLoad={true} src={ClubApparel} alt="Club Apparel Logo" />

        <div block="CartPage" elem="ClubApparelText">
          {__("Link your Club Apparel account to earn ")}
          <span>{`${currency_code} ${club_apparel_estimated_pointsvalue} `}</span>
          {__("worth of points for this purchase.")}
        </div>
      </div>
    );
  }

  renderPromo() {
    const {
      totals: { avail_free_shipping_amount },
    } = this.props;

    return !avail_free_shipping_amount ||
      avail_free_shipping_amount === 0 ? null : (
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
      const { club_apparel_estimated_pointsvalue } = extension_attributes;

      return club_apparel_estimated_pointsvalue !== 0 ? (
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
      <div>
        {this.renderBack()}
        <h1 block="CartPage" elem="Heading">
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
          heading={ __("Recently Viewed")}
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
  }

  
  showPopup = () => {
    this.setState({showPopup: true});
  }

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

  renderDynamicContent() {
    const {
      totals = {},
      totals: { total, items = [], extension_attributes, discount },
      isLoading,
      processingRequest,
      cartWidgetApiData = [],
      youMayAlsoLikeData = [],
    } = this.props;
    const { isArabic, isOOSProducts } = this.state;
    const { country } = JSON.parse(
      localStorage.getItem("APP_STATE_CACHE_KEY")
    ).data;


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
          <div
            style={{
              marginBottom: `${
                isMobile
                  ? this.dynamicHeight?.current?.clientHeight + additionalMargin
                  : 0
              }px`,
            }}
            block="CartPage"
            elem="Static"
            mods={{
              isArabic,
              showClubOverflowWithDic: finalOverlayCss === 1,
              showClubOverflow: finalOverlayCss === 2,
              showOverflow,
            }}
          >
            <div className="sidePadding">
              {this.renderHeading()}
            </div>
            <CartNudge />
            <div className="sidePadding">
              {this.renderCartItems()}
              {this.renderCrossSellProducts()}
              {this.renderDiscountCode()}
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
            {this.renderClubApparel()}
            {this.renderTotals()}
          </div>
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
