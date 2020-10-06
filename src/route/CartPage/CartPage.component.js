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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartCoupon from 'Component/CartCoupon';
import CartItem from 'Component/CartItem';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import Link from 'Component/Link';
import ProductLinks from 'Component/ProductLinks';
import { CROSS_SELL } from 'Store/LinkedProducts/LinkedProducts.reducer';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import { formatCurrency, roundPrice } from 'Util/Price';

import Delivery from './icons/delivery-icon.png';

import './CartPage.style';

export class CartPage extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        onCheckoutButtonClick: PropTypes.func.isRequired
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

        return (
            <ExpandableContent
              header={ __('Coupon?') }
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
                { this.renderDiscount() }
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

    render() {
        const {
            isArabic
        } = this.state;

        return (
            <main block="CartPage" aria-label="Cart Page" mods={ { isArabic } }>
                <placeholder block="LeftMenu">Menu placeholder</placeholder>
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
