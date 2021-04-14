/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';

import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutFail from 'Component/CheckoutFail';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import {
    TABBY_ISTALLMENTS,
    TABBY_PAY_LATER,
    TABBY_PAYMENT_CODES
} from 'Component/CheckoutPayments/CheckoutPayments.config';
import CheckoutShipping from 'Component/CheckoutShipping';
import CheckoutSuccess from 'Component/CheckoutSuccess';
import ContentWrapper from 'Component/ContentWrapper';
import CreditCardPopup from 'Component/CreditCardPopup';
import HeaderLogo from 'Component/HeaderLogo';
import TabbyPopup from 'Component/TabbyPopup';
import { TABBY_POPUP_ID } from 'Component/TabbyPopup/TabbyPopup.config';
import Loader from 'SourceComponent/Loader';
import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import {
    AUTHORIZED_STATUS,
    BILLING_STEP,
    CAPTURED_STATUS
} from './Checkout.config';

import './Checkout.style';

export class Checkout extends SourceCheckout {
    static propTypes = {
        isSignedIn: PropTypes.bool.isRequired,
        processingRequest: PropTypes.bool,
        orderID: PropTypes.string.isRequired,
        incrementID: PropTypes.string.isRequired,
        shippingAddress: PropTypes.object.isRequired,
        setGender: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        threeDsUrl: PropTypes.string.isRequired,
        isFailed: PropTypes.bool.isRequired,
        processApplePay: PropTypes.bool.isRequired,
        initialTotals: TotalsType.isRequired
    };

    state = {
        cashOnDeliveryFee: null,
        processingRequest: false,
        isCustomAddressExpanded: false,
        continueAsGuest: false,
        isInvalidEmail: false,
        isArabic: isArabic(),
        tabbyInstallmentsUrl: '',
        tabbyPayLaterUrl: '',
        tabbyPaymentId: '',
        tabbyPaymentStatus: '',
        isTabbyPopupShown: false,
        paymentInformation: {},
        creditCardData: {},
        isSuccess: false,
        isMobile: isMobile.any() || isMobile.tablet()
    };

    savePaymentInformation = (paymentInformation) => {
        const { savePaymentInformation, showErrorNotification } = this.props;
        const { selectedPaymentMethod, tabbyInstallmentsUrl, tabbyPayLaterUrl } = this.state;
        this.setState({ paymentInformation });

        if (TABBY_PAYMENT_CODES.includes(selectedPaymentMethod)) {
            if (tabbyInstallmentsUrl || tabbyPayLaterUrl) {
                this.setState({ isTabbyPopupShown: true });

                // Need to get payment data from Tabby.
                // Could not get callback of Tabby another way because Tabby is iframe in iframe
                setTimeout(
                    () => this.processTabbyWithTimeout(3, paymentInformation),
                    10000
                );
            } else {
                showErrorNotification(__('Something went wrong with Tabby'));
            }
        } else {
            savePaymentInformation(paymentInformation);
        }

        return null;
    };

    processTabby(paymentInformation) {
        const { savePaymentInformation, verifyPayment, checkoutStep } = this.props;
        const { tabbyPaymentId } = this.state;

        if (checkoutStep !== BILLING_STEP) {
            return;
        }

        verifyPayment(tabbyPaymentId).then(
            ({ status }) => {
                if (status === AUTHORIZED_STATUS || status === CAPTURED_STATUS) {
                    const { tabbyPaymentId } = this.state;
                    console.log('tabbyPaymentId:'+tabbyPaymentId);
                    paymentInformation = {...paymentInformation,'tabbyPaymentId':tabbyPaymentId}
                    savePaymentInformation(paymentInformation);
                }

                this.setState({ tabbyPaymentStatus: status });
            }
        );
    }

    processTabbyWithTimeout(counter, paymentInformation) {
        const { tabbyPaymentStatus } = this.state;
        const { showErrorNotification, hideActiveOverlay, activeOverlay } = this.props;

        // Need to get payment data from Tabby.
        // Could not get callback of Tabby another way because Tabby is iframe in iframe
        if ((tabbyPaymentStatus !== AUTHORIZED_STATUS || tabbyPaymentStatus !== CAPTURED_STATUS) && counter < 60 && activeOverlay === TABBY_POPUP_ID) {
            setTimeout(
                () => {
                    this.processTabby(paymentInformation);
                    this.processTabbyWithTimeout(counter + 1, paymentInformation);
                },
                5000
            );
        }

        if (counter === 60) {
            showErrorNotification('Tabby session timeout');
            hideActiveOverlay();
        }

        if (counter === 60 || activeOverlay !== TABBY_POPUP_ID) {
            this.setState({ isTabbyPopupShown: false });
        }
    }

    setTabbyWebUrl = (url, paymentId, type) => {
        this.setState({ tabbyPaymentId: paymentId });
        switch (type) {
        case TABBY_ISTALLMENTS:
            this.setState({ tabbyInstallmentsUrl: url });

            break;
        case TABBY_PAY_LATER:
            this.setState({ tabbyPayLaterUrl: url });

            break;
        default:
            break;
        }
    };

    setPaymentCode = (code) => {
        this.setState({ selectedPaymentMethod: code });
    };

    setCashOnDeliveryFee = (fee) => {
        this.setState({ cashOnDeliveryFee: fee });
    };

    renderLoader() {
        const { isLoading, checkoutStep } = this.props;
        if (checkoutStep === BILLING_STEP && isLoading) {
            return (
                <div block="CheckoutSuccess">
                    <div block="LoadingOverlay" dir="ltr">
                        <p>
                            { __('Processing Your Order') }
                        </p>
                    </div>
                </div>
            );
        }

        return <Loader isLoading={ isLoading } />;
    }

    renderSummary() {
        const { cashOnDeliveryFee } = this.state;
        const {
            checkoutTotals,
            checkoutStep,
            paymentTotals,
            processingRequest
        } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible) {
            return null;
        }

        return (
          <CheckoutOrderSummary
            checkoutStep={ checkoutStep }
            totals={ checkoutTotals }
            paymentTotals={ paymentTotals }
            cashOnDeliveryFee={ cashOnDeliveryFee }
            processingRequest={ processingRequest }
          />
        );
    }

    renderTitle() {
        const { checkoutStep, isSignedIn } = this.props;
        const { isCustomAddressExpanded, continueAsGuest } = this.state;
        const isBilling = checkoutStep === BILLING_STEP;

        return ((isSignedIn || continueAsGuest)
          && (
            <div block="CheckoutNavigation" mods={ { isCustomAddressExpanded } }>
                <div
                  block="CheckoutNavigation"
                  elem="FirstColumn"
                  mods={ { checkoutStep } }
                >
                    <button onClick={ isBilling ? this.redirectURL : null }>
                        <div
                          block="CheckoutNavigation"
                          elem="Delivery"
                          mods={ { checkoutStep } }
                        />
                        <span
                          block="CheckoutNavigation"
                          elem="DeliveryLabel"
                          mods={ { checkoutStep } }
                        >
                            { __('Delivery') }
                        </span>
                    </button>
                </div>
                <hr />
                <div block="CheckoutNavigation" elem="SecondColumn">
                    <div
                      block="CheckoutNavigation"
                      elem="Payment"
                      mods={ { checkoutStep } }
                    />
                    <span
                      block="CheckoutNavigation"
                      elem="PaymentLabel"
                      mods={ { checkoutStep } }
                    >
                        { __('Payment') }
                    </span>
                </div>
            </div>
          )
        );
    }

    goBackLogin = () => {
        const { goBack } = this.props;
        this.setState({ continueAsGuest: false });
        goBack();
    };

    renderBillingStep() {
        const {
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = [],
            goBack,
            isSignedIn,
            processApplePay,
            placeOrder
        } = this.props;
        const { isArabic } = this.state;

        return (
            <>
                <div block="Checkout" elem="BackButtons" mods={ { isArabic } }>
                    { isSignedIn ? null : (
                        <button onClick={ this.goBackLogin }>
                            { this.renderHeading('Login / Sign Up', true) }
                            <span>{ __('Edit') }</span>
                        </button>
                    ) }
                    <button onClick={ goBack }>
                        { this.renderHeading(__('Delivery Options'), true) }
                        <span>{ __('Edit') }</span>
                    </button>
                </div>
                <CheckoutBilling
                  setLoading={ setLoading }
                  paymentMethods={ paymentMethods }
                  setDetailsStep={ setDetailsStep }
                  shippingAddress={ shippingAddress }
                  setCashOnDeliveryFee={ this.setCashOnDeliveryFee }
                  savePaymentInformation={ this.savePaymentInformation }
                  setTabbyWebUrl={ this.setTabbyWebUrl }
                  setPaymentCode={ this.setPaymentCode }
                  setCheckoutCreditCardData={ this.setCheckoutCreditCardData }
                  processApplePay={ processApplePay }
                  placeOrder={ placeOrder }
                />
            </>
        );
    }

    setCheckoutCreditCardData = (number, expDate, cvv) => {
        this.setState({
            creditCardData: {
                number,
                expDate,
                cvv
            }
        });
    };

    continueAsGuest = () => {
        this.setState({ continueAsGuest: true });
    };

    changeEmail = () => {
        this.setState({ continueAsGuest: false });
    };

    renderHeading(text, isDisabled) {
        const { isSignedIn } = this.props;

        return (
        <h2 block="Checkout" elem="Heading" mods={ { isDisabled, isSignedIn } }>
            { __(text) }
        </h2>
        );
    }

    renderGuestForm() {
        const {
            checkoutStep,
            isCreateUser,
            onEmailChange,
            onCreateUserChange,
            onPasswordChange,
            isGuestEmailSaved,
            isLoading
        } = this.props;
        const { continueAsGuest, isInvalidEmail } = this.state;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm
              isLoading={ isLoading }
              isBilling={ isBilling }
              isCreateUser={ isCreateUser }
              onEmailChange={ onEmailChange }
              onCreateUserChange={ onCreateUserChange }
              onPasswordChange={ onPasswordChange }
              isGuestEmailSaved={ isGuestEmailSaved }
              isEmailAdded={ continueAsGuest }
              isInvalidEmail={ isInvalidEmail }
            />
        );
    }

    renderCreditCardIframe() {
        const { threeDsUrl } = this.props;

        if (!threeDsUrl) {
            return null;
        }

        return (
            <CreditCardPopup threeDsUrl={ threeDsUrl } />
        );
    }

    renderTabbyIframe() {
        const {
            isTabbyPopupShown,
            tabbyInstallmentsUrl,
            tabbyPayLaterUrl,
            selectedPaymentMethod
        } = this.state;

        if (!isTabbyPopupShown) {
            return null;
        }

        return (
          <TabbyPopup
            tabbyWebUrl={ selectedPaymentMethod === TABBY_ISTALLMENTS ? tabbyInstallmentsUrl : tabbyPayLaterUrl }
          />
        );
    }

    renderDetailsStep() {
        const {
            orderID,
            shippingAddress,
            incrementID,
            isFailed,
            initialTotals,
            isVerificationCodeSent
        } = this.props;
        const { cashOnDeliveryFee } = this.state;
        const {
            paymentInformation: {
                billing_address,
                paymentMethod
            },
            creditCardData
        } = this.state;

        this.setState({ isSuccess: true });

        if (isFailed) {
            return (
                <CheckoutFail
                  orderID={ orderID }
                  incrementID={ incrementID }
                  shippingAddress={ shippingAddress }
                  billingAddress={ billing_address }
                  paymentMethod={ paymentMethod }
                  creditCardData={ creditCardData }
                  totals={ initialTotals }
                  isVerificationCodeSent={ isVerificationCodeSent }
                />
            );
        }

        return (
          <CheckoutSuccess
            orderID={ orderID }
            incrementID={ incrementID }
            shippingAddress={ shippingAddress }
            billingAddress={ billing_address }
            paymentMethod={ paymentMethod }
            creditCardData={ creditCardData }
            totals={ initialTotals }
            cashOnDeliveryFee={ cashOnDeliveryFee }
            isVerificationCodeSent={ isVerificationCodeSent }
          />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            email,
            checkoutTotals,
            isSignedIn,
            shippingAddress,
            setLoading
        } = this.props;

        const { continueAsGuest, isArabic } = this.state;
        const renderCheckoutShipping = (
            <div
              block="Checkout"
              elem="Shipping"
              mods={ isSignedIn }
            >
                { continueAsGuest ? this.renderHeading('Login / Sign Up', true) : null }
                <CheckoutShipping
                  isLoading={ isDeliveryOptionsLoading }
                  shippingMethods={ shippingMethods }
                  saveAddressInformation={ saveAddressInformation }
                  onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
                  guestEmail={ email }
                  totals={ checkoutTotals }
                  shippingAddress={ shippingAddress }
                  setLoading={ setLoading }
                />
            </div>
        );

        return (
            <>
                { continueAsGuest || isSignedIn ? null : this.renderHeading(__('Login / Sign Up'), false) }
                <div block="Checkout" elem="GuestCheckout" mods={ { continueAsGuest } }>
                    { this.renderGuestForm() }
                    <div
                      block="Checkout"
                      elem="GuestButton"
                      mods={ { continueAsGuest, isSignedIn, isArabic } }
                    >
                        <button onClick={ continueAsGuest ? this.changeEmail : this.continueAsGuest }>
                        { continueAsGuest ? <span>{ __('Edit') }</span> : <span>{ __('Continue as guest') }</span> }
                        </button>
                    </div>
                    { continueAsGuest ? renderCheckoutShipping : null }
                </div>
              { isSignedIn ? renderCheckoutShipping : null }
              { continueAsGuest || isSignedIn ? null : this.renderHeading(__('Shipping Options'), true) }
              { continueAsGuest || isSignedIn ? null : this.renderHeading(__('Delivery Options'), true) }
              { continueAsGuest || isSignedIn ? null : this.renderHeading(__('Payment Options'), true) }
            </>
        );
    }

    redirectURL = () => {
        const { isMobile, continueAsGuest } = this.state;
        const { history, goBack, setGender } = this.props;

        if (isMobile) {
            const path = location.pathname.match(/checkout\/shipping/);

            if (path) {
                if (continueAsGuest) {
                    this.changeEmail();
                } else {
                    history.push('/cart');
                }
            } else {
                goBack();
            }
        } else {
            setGender('women');
            history.push('/women.html');
        }
    };

    renderSecureShippingLabel() {
        const { isArabic } = this.state;

        return (
            <div
              block="CheckoutHeader"
              elem="SecureShipping"
              mods={ { isArabic } }
            >
                <span
                  block="CheckoutHeader"
                  elem="SecureShippingLabel"
                >
                    { __('Secure checkout') }
                </span>
            </div>
        );
    }

    renderBackToShoppingButton() {
        const { isArabic, isMobile } = this.state;

        return (
            <div
              block="CheckoutHeader"
              elem={ isMobile ? 'BackToShoppingMobile' : 'BackToShoppingDesktop' }
              mods={ { isArabic } }
            >
                <button
                  block={ isMobile ? 'BackMobileButton' : 'button secondary medium' }
                  onClick={ this.redirectURL }
                >
                    { isMobile ? ' ' : __('Back to shopping') }
                </button>
            </div>
        );
    }

    renderCheckoutHeder() {
        const { isMobile } = this.state;
        if (isMobile) {
            return this.renderBackToShoppingButton();
        }

        return (
            <div block="CheckoutHeader">
                { this.renderBackToShoppingButton() }
                <HeaderLogo
                  key="logo"
                />
                { this.renderSecureShippingLabel() }
            </div>
        );
    }

    render() {
        const { isSuccess } = this.state;

        return (
            <>
                { isSuccess ? null : this.renderCheckoutHeder() }
                <main block="Checkout" mods={ { isSuccess } }>
                    <ContentWrapper
                      wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                      label={ __('Checkout page') }
                    >
                        <div block="Checkout" elem="Step">
                        { isSuccess ? null : this.renderTitle() }
                        { this.renderStep() }
                        { this.renderLoader() }
                        </div>
                        <div block="Checkout" elem="Additional">
                            { this.renderSummary() }
                            { this.renderPromo() }
                            { this.renderTabbyIframe() }
                            { this.renderCreditCardIframe() }
                        </div>
                    </ContentWrapper>
                </main>
            </>
        );
    }
}

export default Checkout;
