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
import ProductLinks from 'Component/ProductLinks';
import { tabMap } from 'Route/MyAccount/MyAccount.container';
import { CROSS_SELL } from 'Store/LinkedProducts/LinkedProducts.reducer';
import {
    activeTabType
} from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import { formatCurrency, roundPrice } from 'Util/Price';

import Delivery from './icons/delivery-truck.png';

import './CartPage.style';

export class CartPage extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        onCheckoutButtonClick: PropTypes.func.isRequired,
        activeTab: activeTabType.isRequired,
        changeActiveTab: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic()
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
        const { totals: { quote_currency_code } } = this.props;
        return `${formatCurrency(quote_currency_code)}${roundPrice(price)}`;
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
                    <span>AED 200 </span>
                    { __('more to your cart for ') }
                    <span>{ __('Free delivery') }</span>
                </figcaption>
            </figure>
        );
    }

    renderPromo() {
        return (
            <div
              block="CartPage"
              elem="Promo"
            >
                { this.renderPromoContent() }
            </div>
        );
    }

    renderHeading() {
        return (
            <div>
            <h1 block="CartPage" elem="Heading">
                { __('My bag') }
                <span> (# items)</span>
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
                        { this.renderTotals() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default CartPage;
