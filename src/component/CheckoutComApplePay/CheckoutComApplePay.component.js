import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CheckoutComApplePay.style';

export class CheckoutComApplePay extends PureComponent {
    /**
     * Props
     * @type {*}
     */
    static propTypes = {
        launchPaymentMethod: PropTypes.func.isRequired,
        handleApplePayButtonClick: PropTypes.func.isRequired,
        cartTotals: PropTypes.shape({
            grand_total: PropTypes.number,
            quote_currency_code: PropTypes.string
        }).isRequired,
        processApplePay: PropTypes.bool.isRequired
    };

    /**
     * Component did mount
     */
    componentDidMount() {
        const { launchPaymentMethod } = this.props;

        launchPaymentMethod();
    }

    componentDidUpdate() {
        const { processApplePay, handleApplePayButtonClick } = this.props;

        if (processApplePay) {
            handleApplePayButtonClick();
        }
    }

    /**
     * Render
     * @returns {null|*}
     */
    render() {
        return null;
    }
}

export default CheckoutComApplePay;
