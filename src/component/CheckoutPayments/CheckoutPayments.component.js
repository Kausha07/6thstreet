/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types';

import CheckoutPayment from 'Component/CheckoutPayment';
import { PAYMENTS_DATA } from 'Component/CheckoutPayment/CheckoutPayment.config';
import tabbyAr from 'Component/CheckoutPayment/icons/tabby-logo-black-ar@2x.png';
import ClubApparel from 'Component/ClubApparel';
import CreditCard from 'Component/CreditCard';
import Slider from 'Component/Slider';
import StoreCredit from 'Component/StoreCredit';
import TabbyMiniPopup from 'Component/TabbyMiniPopup';
import {
    TABBY_TOOLTIP_INSTALLMENTS,
    TABBY_TOOLTIP_PAY_LATER
} from 'Component/TabbyMiniPopup/TabbyMiniPopup.config';
import SourceCheckoutPayments from 'SourceComponent/CheckoutPayments/CheckoutPayments.component';
import { isArabic } from 'Util/App';
import { isSignedIn } from 'Util/Auth';

import {
    CARD,
    CASH_ON_DELIVERY,
    TABBY_ISTALLMENTS,
    TABBY_PAY_LATER,
    TABBY_PAYMENT_CODES
} from './CheckoutPayments.config';
import info from './icons/info.png';

import './CheckoutPayments.extended.style';

export class CheckoutPayments extends SourceCheckoutPayments {
    static propTypes = {
        ...SourceCheckoutPayments.propTypes,
        selectedPaymentCode: PropTypes.string
    };

    static defaultProps = {
        ...SourceCheckoutPayments.defaultProps,
        selectedPaymentCode: ''
    };

    paymentRenderMap = {
        ...SourceCheckoutPayments.paymentRenderMap,
        [CARD]: this.renderCreditCard.bind(this),
        [CASH_ON_DELIVERY]: this.renderCashOnDelivery.bind(this),
        [TABBY_ISTALLMENTS]: this.renderTabbyPaymentMethods.bind(this),
        [TABBY_PAY_LATER]: this.renderTabbyPaymentMethods.bind(this)
    };

    state = {
        activeSliderImage: 0,
        tabbyPaymentMethods: [],
        tabbyIsRendered: false,
        tooltipContent: null,
        isArabic: isArabic()
    };

    handleChange = (activeImage) => {
        this.setState({ activeSliderImage: activeImage });
    };

    renderPayment = (method) => {
        const {
            selectPaymentMethod,
            selectedPaymentCode,
            setCashOnDeliveryFee,
            isTabbyInstallmentAvailable,
            isTabbyPayLaterAvailable
        } = this.props;
        const { m_code } = method;
        const isSelected = selectedPaymentCode === m_code;
        const { tabbyPaymentMethods } = this.state;
        const isTabbySelected = TABBY_PAYMENT_CODES.includes(selectedPaymentCode);

        if (TABBY_PAYMENT_CODES.includes(m_code) && tabbyPaymentMethods.length > 0) {
            if (!isTabbyInstallmentAvailable && !isTabbyPayLaterAvailable) {
                return null;
            }

            return (
                <CheckoutPayment
                  key={ m_code }
                  isSelected={ isTabbySelected }
                  method={ method }
                  onClick={ selectPaymentMethod }
                  setCashOnDeliveryFee={ setCashOnDeliveryFee }
                />
            );
        }

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

    renderTabbyPaymentMethods() {
        const { tabbyPaymentMethods } = this.state;

        return (
            <div block="CheckoutPayments" elem="TabbyPayments">
                <div block="CheckoutPayments" elem="TabbyPaymentsHeader">
                    <h2>{ __('Tabby') }</h2>
                </div>
                <div block="CheckoutPayments" elem="TabbyPaymentsPromo">
                    { __('Buy now and pay later in 2, 3 or 6 months.') }
                </div>
                <div block="CheckoutPayments" elem="TabbyPaymentsContent">
                    { tabbyPaymentMethods.map((method) => this.renderTabbyPaymentMethod(method)) }
                </div>
            </div>
        );
    }

    renderTabbyPaymentMethod(method) {
        const { title, m_code } = method;
        const {
            selectPaymentMethod,
            selectedPaymentCode,
            isTabbyInstallmentAvailable,
            isTabbyPayLaterAvailable,
            setCashOnDeliveryFee
        } = this.props;
        const { img } = PAYMENTS_DATA[m_code];
        const { isArabic } = this.state;

        const isSelected = m_code === selectedPaymentCode;

        if (
            (m_code === TABBY_ISTALLMENTS && !isTabbyInstallmentAvailable)
            || (m_code === TABBY_PAY_LATER && !isTabbyPayLaterAvailable)
        ) {
            return null;
        }

        return (
            <div block="CheckoutPayments" elem="TabbyPayment" key={ m_code }>
                <div block="CheckoutPayments" elem="TabbyPaymentSelect">
                    <CheckoutPayment
                      key={ m_code }
                      isSelected={ isSelected }
                      method={ method }
                      onClick={ selectPaymentMethod }
                      setCashOnDeliveryFee={ setCashOnDeliveryFee }
                    />
                    <img src={ isArabic ? tabbyAr : img } alt={ m_code } />
                </div>
                <div block="CheckoutPayments" elem="TabbyPaymentContent">
                    <div block="CheckoutPayments" elem="TabbyPaymentContentTitle">
                        { title }
                        { m_code === TABBY_ISTALLMENTS
                            ? (
                            <button onClick={ this.openTabbyInstallmentsTooltip }>
                                <img src={ info } alt="info" />
                            </button>
                            )
                            : (
                            <button onClick={ this.openTabbyPayLaterTooltip }>
                                <img src={ info } alt="info" />
                            </button>
                            ) }
                    </div>
                    <div block="CheckoutPayments" elem="TabbyPaymentContentDescription">
                        { m_code === TABBY_ISTALLMENTS
                            ? __('2,3 or 6 months')
                            : __('14 days after product delivery') }
                    </div>
                </div>
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
        const {
            paymentMethods,
            setCreditCardData,
            setOrderButtonDisabled,
            setOrderButtonEnabled
        } = this.props;

        const cardData = paymentMethods.find(({ m_code }) => m_code === CARD);

        return (
            <CreditCard
              cardData={ cardData }
              setCreditCardData={ setCreditCardData }
              setOrderButtonDisabled={ setOrderButtonDisabled }
              setOrderButtonEnabled={ setOrderButtonEnabled }
            />
        );
    }

    renderToggleableDiscountOptions() {
        if (!isSignedIn()) {
            return null;
        }

        return (
            <div block="CheckoutPayments" elem="DiscountOptionWrapper">
                <StoreCredit canApply hideIfZero />
                <ClubApparel hideIfZero />
            </div>
        );
    }

    renderPayments() {
        const { paymentMethods } = this.props;
        const { tabbyPaymentMethods } = this.state;

        const hasTabby = paymentMethods.some(({ code }) => TABBY_PAYMENT_CODES.includes(code));

        if (hasTabby && tabbyPaymentMethods.length === 0) {
            const tabbyPaymentMethods = paymentMethods.reduce((acc, method) => {
                const { code } = method;

                if (TABBY_PAYMENT_CODES.includes(code)) {
                    acc.push(method);
                }

                return acc;
            }, []);

            this.setState({ tabbyPaymentMethods });
        }

        return paymentMethods.map(this.renderPayment);
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

    openTabbyPayLaterTooltip = (e) => {
        e.preventDefault();
        this.setState({ tooltipContent: TABBY_TOOLTIP_PAY_LATER });
    };

    openTabbyInstallmentsTooltip = (e) => {
        e.preventDefault();
        this.setState({ tooltipContent: TABBY_TOOLTIP_INSTALLMENTS });
    };

    closeTabbyPopup = (e) => {
        e.preventDefault();
        this.setState({ tooltipContent: null });
    };

    renderTabbyPopup = () => {
        const { tooltipContent } = this.state;

        if (tooltipContent === TABBY_TOOLTIP_PAY_LATER) {
            return <TabbyMiniPopup content={ TABBY_TOOLTIP_PAY_LATER } closeTabbyPopup={ this.closeTabbyPopup } />;
        }

        if (tooltipContent === TABBY_TOOLTIP_INSTALLMENTS) {
            return <TabbyMiniPopup content={ TABBY_TOOLTIP_INSTALLMENTS } closeTabbyPopup={ this.closeTabbyPopup } />;
        }

        return null;
    };

    render() {
        return (
            <div block="CheckoutPayments">
                { this.renderContent() }
                { this.renderTabbyPopup() }
            </div>
        );
    }
}

export default CheckoutPayments;
