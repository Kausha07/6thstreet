import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';

import './CheckoutComApplePay.style';

export class CheckoutComApplePay extends PureComponent {
    /**
     * Props
     * @type {*}
     */
    static propTypes = {
        isLoading: PropTypes.bool,
        applePayDisabled: PropTypes.bool,
        launchPaymentMethod: PropTypes.func.isRequired,
        requestConfig: PropTypes.func.isRequired,
        handleApplePayButtonClick: PropTypes.func.isRequired,
        cartTotals: PropTypes.shape({
            grand_total: PropTypes.number,
            quote_currency_code: PropTypes.string
        }).isRequired,
        button_style: PropTypes.string
    };

    static defaultProps = {
        isLoading: false,
        applePayDisabled: true,
        button_style: ''
    };

    /**
     * Component did mount
     */
    componentDidMount() {
        const { requestConfig, launchPaymentMethod } = this.props;

        requestConfig().then(launchPaymentMethod);
    }

    /**
     * Render
     * @returns {null|*}
     */
    render() {
        const {
            isLoading,
            applePayDisabled,
            handleApplePayButtonClick,
            button_style
        } = this.props;

        return (
            <div block="CheckoutComApplePayPayment" elem="Wrapper">
                {/* <Loader isLoading={ isLoading } /> */}
                <button
                  type="button"
                  block="CheckoutComApplePayPayment"
                  elem="Button"
                  label="Pay with ApplePay"
                  onClick={ handleApplePayButtonClick }
                  disabled={ applePayDisabled }
                  mods={ { button_style } }
                >
                    { __('Pay with ApplePay') }
                </button>
            </div>
        );
    }
}

export default CheckoutComApplePay;
