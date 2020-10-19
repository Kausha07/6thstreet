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

import CartItem from 'Component/CartItem';
import CmsBlock from 'Component/CmsBlock';
import { CART_OVERLAY } from 'Component/Header/Header.config';
import Link from 'Component/Link';
import Overlay from 'SourceComponent/Overlay';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './CartOverlay.style';

export class CartOverlay extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        onVisible: PropTypes.func.isRequired,
        handleCheckoutClick: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired,
        isHidden: PropTypes.bool.isRequired
    };

    state = {
        isArabic: isArabic(),
        isPopup: false
    };

    componentDidMount() {
        const { showOverlay } = this.props;
        if (!isMobile.any()) {
            showOverlay(CART_OVERLAY);
        }
    }

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;
        return `${quote_currency_code} ${parseFloat(price).toFixed(2)}`;
    }

    renderCartItems() {
        const { totals: { items, quote_currency_code }, closePopup } = this.props;

        if (!items || items.length < 1) {
            return this.renderNoCartItems();
        }

        return (
            <ul block="CartOverlay" elem="Items" aria-label="List of items in cart">
                { items.map((item) => (
                    <CartItem
                      key={ item.item_id }
                      item={ item }
                      currency_code={ quote_currency_code }
                      brand_name={ item.brand_name }
                      isEditing
                      closePopup={ closePopup }
                    />
                )) }
            </ul>
        );
    }

    renderNoCartItems() {
        return (
            <p block="CartOverlay" elem="Empty">
                { __('You have no items in your shopping cart.') }
            </p>
        );
    }

    renderTotals() {
        const { totals: { items, subtotal_incl_tax = 0 } } = this.props;
        const { isArabic } = this.state;

        if (!items || items.length < 1) {
            return null;
        }

        return (
            <dl
              block="CartOverlay"
              elem="Total"
              mods={ { isArabic } }
            >
                <dt>
                    { __('Subtotal ') }
                    <span>{ __('(Taxes Included) ') }</span>
                </dt>
                <dd>{ this.renderPriceLine(subtotal_incl_tax) }</dd>
            </dl>
        );
    }

    renderDiscount() {
        const { totals: { coupon_code, discount_amount = 0 } } = this.props;

        if (!coupon_code) {
            return null;
        }

        return (
            <dl
              block="CartOverlay"
              elem="Discount"
            >
                <dt>
                    { __('Coupon ') }
                    <strong block="CartOverlay" elem="DiscountCoupon">{ coupon_code.toUpperCase() }</strong>
                </dt>
                <dd>{ `-${this.renderPriceLine(Math.abs(discount_amount))}` }</dd>
            </dl>
        );
    }

    renderActions() {
        const { totals: { items }, handleCheckoutClick } = this.props;

        if (!items || items.length < 1) {
            return null;
        }

        return (
            <div block="CartOverlay" elem="Actions">
                <Link
                  block="CartOverlay"
                  elem="CartButton"
                  to="/cart"
                >
                    { __('View bag') }
                </Link>
                <button
                  block="CartOverlay"
                  elem="CheckoutButton"
                  onClick={ handleCheckoutClick }
                >
                    { __('Checkout') }
                </button>
            </div>
        );
    }

    renderPromo() {
        const { minicart_content: { minicart_cms } = {} } = window.contentConfiguration;
        const { totals: { items } } = this.props;

        if (!items || items.length < 1) {
            return null;
        }

        if (minicart_cms) {
            return <CmsBlock identifier={ minicart_cms } />;
        }

        return (
            <p
              block="CartOverlay"
              elem="Promo"
            >
                { __('Free shipping on order 49$ and more.') }
            </p>
        );
    }

    onCloseClick = () => {
        this.setState({ isPopup: true });
    };

    renderItemCount() {
        const { hideActiveOverlay, closePopup, totals: { items = [] } } = this.props;
        const svg = (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
            >
                <path
                  d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
                />
            </svg>
        );

        return (
            <div block="CartOverlay" elem="ItemCount">
                <div>
                    { __('My Bag') }
                    <div>
                        { items.length }
                        { __(' item(s)') }
                    </div>
                </div>
                <button onClick={ hideActiveOverlay && closePopup }>
                    { svg }
                </button>
            </div>
        );
    }

    render() {
        const {
            onVisible,
            isHidden,
            hideActiveOverlay,
            closePopup
        } = this.props;
        const { isArabic, isPopup } = this.state;

        return (
            <>
                <button
                  block="HeaderCart"
                  elem="PopUp"
                  mods={ { isHidden } }
                  onClick={ hideActiveOverlay && closePopup }
                >
                    closes popup
                </button>
                <Overlay
                  id={ CART_OVERLAY }
                  onVisible={ onVisible }
                  mix={ { block: 'CartOverlay', mods: { isArabic, isPopup } } }
                >
                    { this.renderItemCount() }
                    { this.renderCartItems() }
                    { this.renderDiscount() }
                    { this.renderTotals() }
                    { this.renderActions() }
                    { this.renderPromo() }
                </Overlay>
            </>
        );
    }
}

export default CartOverlay;
