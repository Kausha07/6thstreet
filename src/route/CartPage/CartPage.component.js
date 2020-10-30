/* eslint-disable no-magic-numbers */
/**
 * @category  6thstreet
 * @author    Alona Zvereva <alona.zvereva@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartCoupon from 'Component/CartCoupon';
import CartItem from 'Component/CartItem';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import Link from 'Component/Link';
import MyAccountTabList from 'Component/MyAccountTabList';
import { FIXED_CURRENCIES } from 'Component/Price/Price.config';
import ProductLinks from 'Component/ProductLinks';
import { tabMap } from 'Route/MyAccount/MyAccount.container';
import { CROSS_SELL } from 'Store/LinkedProducts/LinkedProducts.reducer';
import {
    activeTabType
} from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import { ClubApparelMember } from 'Util/API/endpoint/ClubApparel/ClubApparel.type';
import { isArabic } from 'Util/App';
import { roundPrice } from 'Util/Price';

import ClubApparel from './icons/club-apparel.png';
import Delivery from './icons/delivery-truck.png';

import './CartPage.style';

export class CartPage extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        onCheckoutButtonClick: PropTypes.func.isRequired,
        activeTab: activeTabType.isRequired,
        changeActiveTab: PropTypes.func.isRequired,
        clubApparel: ClubApparelMember,
        isSignedIn: PropTypes.bool.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    static defaultProps = {
        clubApparel: {}
    };

    renderCartItems() {
        const { totals: { items, quote_currency_code } } = this.props;

        if (!items || items.length < 1) {
            return (
                <p block="CartPage" elem="Empty">{ __('There are no products in cart.') }</p>
            );
        }

        return (
            <ul block="CartPage" elem="Items" aria-label="List of items in cart">
                { items.map((item) => (
                    <CartItem
                      key={ item.item_id }
                      item={ item }
                      currency_code={ quote_currency_code }
                      isEditing
                      isLikeTable
                    />
                )) }
            </ul>
        );
    }

    renderDiscountCode() {
        const {
            totals: { coupon_code }
        } = this.props;
        const isOpen = false;

        return (
            <ExpandableContent
              isOpen={ isOpen }
              heading={ __('Have a discount code?') }
              mix={ { block: 'CartPage', elem: 'Discount' } }
            >
                <CartCoupon couponCode={ coupon_code } />
            </ExpandableContent>
        );
    }

    renderPriceLine(price) {
        const { totals: { currency_code } } = this.props;
        const fixedPrice = FIXED_CURRENCIES.includes(currency_code);

        return `${currency_code}${fixedPrice ? price.toFixed(3) : roundPrice(price)}`;
    }

    renderTotalDetails(isMobile = false) {
        return (
            <dl
              block="CartPage"
              elem="TotalDetails"
              aria-label={ __('Order total details') }
              mods={ { isMobile } }
            >
                <dt>{ __('Subtotal') }</dt>
                <dt>{ __('(Taxes included)') }</dt>
            </dl>
        );
    }

    renderTotal() {
        const {
            totals: {
                subtotal_incl_tax = 0
            }
        } = this.props;

        return (
            <dl block="CartPage" elem="Total" aria-label="Complete order total">
                <dd>{ this.renderPriceLine(subtotal_incl_tax) }</dd>
            </dl>
        );
    }

    renderButtons() {
        const { onCheckoutButtonClick } = this.props;

        return (
            <div block="CartPage" elem="CheckoutButtons">
                <button
                  block="CartPage"
                  elem="CheckoutButton"
                  mix={ { block: 'Button' } }
                  onClick={ onCheckoutButtonClick }
                >
                    <span />
                    { __('Checkout') }
                </button>
                <Link
                  block="CartPage"
                  elem="ContinueShopping"
                  to="/"
                >
                    { __('Continue shopping') }
                </Link>
            </div>
        );
    }

    renderTotals() {
        return (
            <article block="CartPage" elem="Summary">
                { this.renderTotalDetails() }
                { this.renderTotal() }
                { this.renderButtons() }
            </article>
        );
    }

    renderDiscount() {
        const {
            totals: {
                coupon_code,
                discount_amount = 0
            }
        } = this.props;

        if (!coupon_code) {
            return null;
        }

        return (
            <>
                <dt>
                    { __('Coupon?') }
                    <strong block="CartPage" elem="DiscountCoupon">{ coupon_code.toUpperCase() }</strong>
                </dt>
                <dd>{ `-${this.renderPriceLine(Math.abs(discount_amount))}` }</dd>
            </>
        );
    }

    renderCrossSellProducts() {
        return (
            <ProductLinks
              linkType={ CROSS_SELL }
              title={ __('Frequently bought together') }
            />
        );
    }

    renderPromoContent() {
        const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
        const { totals: { currency_code, avail_free_shipping_amount } } = this.props;

        if (cart_cms) {
            return <CmsBlock identifier={ cart_cms } />;
        }

        return (
            <figure
              block="CartPage"
              elem="PromoBlock"
            >
                <figcaption block="CartPage" elem="PromoText">
                    <img src={ Delivery } alt="Delivery icon" />
                    { __('Add ') }
                    <span>{ `${currency_code } ${avail_free_shipping_amount}` }</span>
                    { __('more to your cart for ') }
                    <span>{ __('Free delivery') }</span>
                </figcaption>
            </figure>
        );
    }

    renderClubApparelContent() {
        const { cart_content: { cart_cms } = {} } = window.contentConfiguration;
        const {
            totals: {
                currency_code,
                extension_attributes: {
                    club_apparel_estimated_pointsvalue
                }
            },
            clubApparel: {
                accountLinked
            },
            isSignedIn
        } = this.props;
        const { isArabic } = this.state;

        if (cart_cms) {
            return <CmsBlock identifier={ cart_cms } />;
        }

        if (accountLinked && isSignedIn) {
            return (
                <div
                  block="CartPage"
                  elem="ClubApparelBlock"
                  mods={ { isArabic } }
                >
                    <img src={ ClubApparel } alt="Delivery icon" />
                    <div block="CartPage" elem="ClubApparelText">
                        { __('You may earn ') }
                        <span>{ `${currency_code } ${club_apparel_estimated_pointsvalue} ` }</span>
                        { __('worth of Club Apparel points for this purchase.') }
                    </div>
                </div>
            );
        }

        if (!accountLinked && isSignedIn) {
            return (
                <div
                  block="CartPage"
                  elem="ClubApparelBlock"
                >
                    <img src={ ClubApparel } alt="Delivery icon" />
                    <div block="CartPage" elem="ClubApparelText">
                        { __('Link your Club Apparel account to earn ') }
                        <span>{ `${currency_code } ${club_apparel_estimated_pointsvalue} ` }</span>
                        { __('worth of points for this purchase. ') }
                        <Link
                          block="CartPage"
                          elem="ClubApparelLink"
                          to="/clubapparel/account"
                        >
                            { __('Link now') }
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div
              block="CartPage"
              elem="ClubApparelBlock"
            >
                <img src={ ClubApparel } alt="Delivery icon" />
                <div block="CartPage" elem="ClubApparelText">
                    { __('Link your Club Apparel account to earn ') }
                    <span>{ `${currency_code } ${club_apparel_estimated_pointsvalue} ` }</span>
                    { __('worth of points for this purchase.') }
                </div>
            </div>
        );
    }

    renderPromo() {
        const { totals: { avail_free_shipping_amount } } = this.props;

        return !avail_free_shipping_amount || avail_free_shipping_amount === 0 ? null : (
            <div
              block="CartPage"
              elem="Promo"
            >
                { this.renderPromoContent() }
            </div>
        );
    }

    renderClubApparel() {
        const { totals: { extension_attributes } } = this.props;

        if (extension_attributes) {
            const { club_apparel_estimated_pointsvalue } = extension_attributes;

            return club_apparel_estimated_pointsvalue !== 0 ? (
                <div
                  block="CartPage"
                  elem="ClubApparel"
                >
                    { this.renderClubApparelContent() }
                </div>
            ) : null;
        }

        return null;
    }

    renderItemSuffix() {
        const { totals: { items = [] } } = this.props;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        return (totalQuantity === 1)
            ? __(' Item')
            : __(' Items');
    }

    renderHeading() {
        const { totals: { items = [] } } = this.props;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        return (
            <div>
            <h1 block="CartPage" elem="Heading">
                { __('My bag ') }
                <span>
                    (
                    { totalQuantity }
                    { this.renderItemSuffix() }
                    )
                </span>
            </h1>
            </div>
        );
    }

    renderContent() {
        const { activeTab, changeActiveTab } = this.props;
        const { name } = tabMap[activeTab];

        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <MyAccountTabList
                  tabMap={ tabMap }
                  activeTab={ activeTab }
                  changeActiveTab={ changeActiveTab }
                />
                <div block="MyAccount" elem="TabContent">
                    <h1 block="MyAccount" elem="Heading">{ name }</h1>
                </div>
            </ContentWrapper>
        );
    }

    render() {
        const {
            isArabic
        } = this.state;

        return (
            <main block="CartPage" aria-label="Cart Page" mods={ { isArabic } }>
                { this.renderContent() }
                <ContentWrapper
                  wrapperMix={ { block: 'CartPage', elem: 'Wrapper' } }
                  label="Cart page details"
                >
                    <div block="CartPage" elem="Static" mods={ { isArabic } }>
                        { this.renderHeading() }
                        { this.renderCartItems() }
                        { this.renderTotalDetails(true) }
                        { this.renderCrossSellProducts() }
                    </div>
                    <div block="CartPage" elem="Floating" mods={ { isArabic } }>
                        { this.renderDiscountCode() }
                        { this.renderPromo() }
                        { this.renderClubApparel() }
                        { this.renderTotals() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default CartPage;
