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

import { Shipping } from "Component/Icons";

import ClubApparel from "./icons/club-apparel.png";

import "./CartPage.style";

export class CartPage extends PureComponent {
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
  };

  static defaultProps = {
    clubApparel: {},
    processingRequest: false,
  };

  renderCartItems() {
    const {
      totals: { items = [], quote_currency_code },
    } = this.props;

    if (!items || items.length < 1) {
      return (
        <p block="CartPage" elem="Empty">
          {__("There are no products in cart.")}
        </p>
      );
    }
    return (
      <ul block="CartPage" elem="Items" aria-label="List of items in cart">
        {items.map((item) => (
          <CartPageItem
            key={item.item_id}
            item={item}
            currency_code={quote_currency_code}
            isEditing
            isCartPage
          />
        ))}
      </ul>
    );
  }

  renderDiscountCode() {
    const {
      totals: { coupon_code },
    } = this.props;
    const isOpen = false;

    return (
      <ExpandableContent
        isOpen={isOpen}
        heading={__("Have a discount code?")}
        mix={{ block: "CartPage", elem: "Discount" }}
      >
        <CartCoupon couponCode={coupon_code} />
      </ExpandableContent>
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
    return (
      <div block="CartPage" elem="OrderTotals">
        <ul>
          <div block="CartPage" elem="Subtotals">
                        { this.renderPriceLine(subTotal, __('Subtotal')) }
                        { this.renderPriceLine(shipping_fee, __('Shipping fee')) }
                        { this.renderPriceLine(
                            getDiscountFromTotals(totals, 'customerbalance'),
                            __('Store Credit')
                        ) }
                        { this.renderPriceLine(
                            getDiscountFromTotals(totals, 'clubapparel'),
                            __('Club Apparel Redemption')
                        ) }
                        { (couponCode || (discount && discount != 0)) ? this.renderPriceLine(
                            discount,
                            __('Discount')
                        ) : null}
                        { this.renderPriceLine(
                            getDiscountFromTotals(totals, 'tax'),
                            __('Tax')
                        ) }
                    </div>
        </ul>
      </div>
    );
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
          onClick={onCheckoutButtonClick}
        >
          <span />
          {__("Proceed to Checkout")}
        </button>
        {/* <Link
                  block="CartPage"
                  elem="ContinueShopping"
                  to="/"
                >
                    { __('Continue shopping') }
                </Link> */}
      </div>
    );
  }

  renderTotals() {
    return (
      <article block="CartPage" elem="Summary">
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
      console.log(self.shouldMobileBottomBarHidden);
      self.shouldMobileBottomBarHidden();
      history.push("/");
    }

    return (
      <div block="CartPage" elem="BackArrow">
        <button block="BackArrow-Button" onClick={goHome}>
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

  renderEmptyCartPage() {
    const { isArabic } = this.state;

    return (
      <div block="CartPage" elem="EmptyCart" mods={{ isArabic }}>
        <div block="CartPage" elem="EmptyCartIcon" />
        <p>{__("You have no items in your shopping cart.")}</p>
        <p>
          <Link to="/">
            <strong> {__("Click Here")} </strong>
          </Link>
          {__("to continue shopping.")}
        </p>
      </div>
    );
  }

  renderDynamicContent() {
    const {
      totals = {},
      totals: { items = [] },
      isLoading,
      processingRequest,
    } = this.props;
    const { isArabic } = this.state;

    if (isLoading) {
      return <Loader isLoading={isLoading} />;
    }

    if (Object.keys(totals).length === 0 || items.length === 0) {
      return (
        <div block="CartPage" elem="Static" mods={{ isArabic }}>
          {this.renderHeading()}
          {this.renderEmptyCartPage()}
        </div>
      );
    }

    return (
      <>
        {this.renderContent()}
        <ContentWrapper
          wrapperMix={{ block: "CartPage", elem: "Wrapper" }}
          label="Cart page details"
        >
          <Loader isLoading={processingRequest} />
          <div block="CartPage" elem="Static" mods={{ isArabic }}>
            {this.renderHeading()}
            {this.renderCartItems()}
            {this.renderCrossSellProducts()}
            {this.renderDiscountCode()}
            {this.renderPromo()}
          </div>
          <div block="CartPage" elem="Floating" mods={{ isArabic }}>
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
