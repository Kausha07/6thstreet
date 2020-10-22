import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { paymentMethodType } from 'Type/Checkout';

import apple from './icons/apple.png';
import card from './icons/card.png';
import cash from './icons/cash.png';
import tabby from './icons/tabby.png';

import './CheckoutPayment.style';

export class CheckoutPayment extends PureComponent {
    static propTypes = {
        method: paymentMethodType.isRequired,
        onClick: PropTypes.func.isRequired,
        setCashOnDeliveryFee: PropTypes.func.isRequired,
        isSelected: PropTypes.bool
    };

    static defaultProps = {
        isSelected: false
    };

    onClick = () => {
        const {
            setCashOnDeliveryFee,
            onClick,
            method,
            method: { amount }
        } = this.props;

        setCashOnDeliveryFee(amount);
        onClick(method);
    };

    renderContent() {
        const {
            method: { m_code }
        } = this.props;

        switch (m_code) {
        case 'checkoutcom_card_payment':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { card: true } }>
                    <img src={ card } alt="card" />
                    <p>card</p>
                </div>
            );
        case 'checkout':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { card: true } }>
                    <img src={ card } alt="card" />
                    <p>checkout</p>
                </div>
            );
        case 'apple_pay':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { apple: true } }>
                    <img src={ apple } alt="apple" />
                </div>
            );
        case 'checkout_apple_pay':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { apple: true } }>
                    <img src={ apple } alt="apple" />
                    <p>checkout</p>
                </div>
            );
        case 'tabby_checkout':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { tabby: true } }>
                    <img src={ tabby } alt="tabby" />
                    <p>checkout</p>
                </div>
            );
        case 'tabby_installments':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { tabby: true } }>
                    <img src={ tabby } alt="tabby" />
                </div>
            );
        case 'msp_cashondelivery':
            return (
                <div block="CheckoutPayment" elem="Method" mods={ { cash: true } }>
                    <img src={ cash } alt="cash" />
                    <p>cash</p>
                </div>
            );
        default:
            return (
                <div block="CheckoutPayment" elem="Method">
                    <p>{ m_code }</p>
                </div>
            );
        }
    }

    render() {
        const {
            isSelected
        } = this.props;

        return (
            <li block="CheckoutPayment">
                <button
                  block="CheckoutPayment"
                  mods={ { isSelected } }
                  elem="Button"
                  onClick={ this.onClick }
                  type="button"
                >
                    { this.renderContent() }
                </button>
            </li>
        );
    }
}

export default CheckoutPayment;
