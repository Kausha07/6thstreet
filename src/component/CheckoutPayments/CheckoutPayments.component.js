import CheckoutPayment from 'Component/CheckoutPayment';
import CreditCard from 'Component/CreditCard';
import Slider from 'Component/Slider';
import StoreCredit from 'Component/StoreCredit';
import SourceCheckoutPayments from 'SourceComponent/CheckoutPayments/CheckoutPayments.component';

import { CARD, CASH_ON_DELIVERY } from './CheckoutPayments.config';

import './CheckoutPayments.extended.style';

export class CheckoutPayments extends SourceCheckoutPayments {
    paymentRenderMap = {
        ...SourceCheckoutPayments.paymentRenderMap,
        [CARD]: this.renderCreditCard.bind(this),
        [CASH_ON_DELIVERY]: this.renderCashOnDelivery.bind(this)
    };

    state = {
        activeSliderImage: 0
    };

    handleChange = (activeImage) => {
        this.setState({ activeSliderImage: activeImage });
    };

    renderPayment = (method) => {
        const {
            selectPaymentMethod,
            selectedPaymentCode,
            setCashOnDeliveryFee
        } = this.props;

        const { m_code } = method;
        const isSelected = selectedPaymentCode === m_code;

        return (
            <CheckoutPayment
              key={ m_code }
              isSelected={ isSelected }
              method={ method }
              onClick={ selectPaymentMethod }
              setCashOnDeliveryFee={ setCashOnDeliveryFee }
            />
        );
    };

    getSelectedMethodData = () => {
        const { paymentMethods, selectedPaymentCode } = this.props;
        const selectedMethod = paymentMethods.find((method) => method.m_code === selectedPaymentCode);

        return selectedMethod;
    };

    renderCashOnDelivery() {
        const { options: { method_description, method_title } } = this.getSelectedMethodData();

        return (
            <div block="CheckoutPayments" elem="SelectedInfo">
                <h2 block="CheckoutPayments" elem="MethodTitle">
                    { method_title }
                </h2>
                <p block="CheckoutPayments" elem="MethodDiscription">
                    { method_description }
                </p>
            </div>
        );
    }

    renderHeading() {
        return (
            <h2 block="CheckoutPayments" elem="Heading">
                { __('Payment type') }
            </h2>
        );
    }

    renderSelectedPayment() {
        const { selectedPaymentCode } = this.props;

        const render = this.paymentRenderMap[selectedPaymentCode];
        if (!render) {
            return null;
        }

        return render();
    }

    renderCreditCard() {
        const { setCreditCardData } = this.props;

        return (
            <CreditCard
              setCreditCardData={ setCreditCardData }
            />
        );
    }

    renderToggleableDiscountOptions() {
        return (
            <div block="CheckoutPayments" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
            </div>
        );
    }

    renderContent() {
        const { hasError, activeSliderImage } = this.state;

        if (hasError) {
            return (
                <p>{ __('The error occurred during initializing payment methods. Please try again later!') }</p>
            );
        }

        return (
            <>
                { this.renderHeading() }
                <ul block="CheckoutPayments" elem="Methods">
                    <Slider
                      activeImage={ activeSliderImage }
                      onActiveImageChange={ this.handleChange }
                    >
                        { this.renderPayments() }
                    </Slider>
                </ul>
                { this.renderSelectedPayment() }
                { this.renderPayPal() }
                { this.renderToggleableDiscountOptions() }
            </>
        );
    }

    render() {
        return (
            <div block="CheckoutPayments">
                { this.renderContent() }
            </div>
        );
    }
}

export default CheckoutPayments;
