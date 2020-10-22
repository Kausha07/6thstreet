import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { paymentMethodType } from 'Type/Checkout';

import { PAYMENTS_DATA } from './CheckoutPayment.config';

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

        const {
            name,
            mod,
            paragraph,
            img
        } = PAYMENTS_DATA[m_code];

        if (PAYMENTS_DATA[m_code]) {
            return (
                <div block="CheckoutPayment" elem="Method" mods={ mod }>
                    <img src={ img } alt={ name } />
                    <p>{ paragraph }</p>
                </div>
            );
        }

        return (
            <div block="CheckoutPayment" elem="Method">
                <p>{ m_code }</p>
            </div>
        );
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
