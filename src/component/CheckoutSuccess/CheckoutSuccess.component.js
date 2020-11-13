import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ChangePhonePopup from 'Component/ChangePhonePopUp';
import ContentWrapper from 'Component/ContentWrapper';
import Field from 'Component/Field';
import Form from 'Component/Form';
import Link from 'Component/Link';
import MyAccountOverlay from 'Component/MyAccountOverlay';
import MyAccountTabList from 'Component/MyAccountTabList';
import SuccessCheckoutItem from 'Component/SuccessCheckoutItem';
import { tabMap } from 'Route/MyAccount/MyAccount.container';
import { activeTabType } from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import { formatCurrency, roundPrice } from 'Util/Price';

import Apple from './icons/apple.png';
import Cash from './icons/cash.png';
import Confirm from './icons/confirm.png';
import SuccessCircle from './icons/success-circle.png';
import TabbyAR from './icons/tabby-ar.png';
import Tabby from './icons/tabby.png';
import Visa from './icons/visa.png';

import './CheckoutSuccess.style';

export class CheckoutSuccess extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        shippingAddress: PropTypes.object.isRequired,
        billingAddress: PropTypes.object.isRequired,
        paymentMethod: PropTypes.object.isRequired,
        creditCardData: PropTypes.object.isRequired,
        orderID: PropTypes.number.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        requestCustomerData: PropTypes.func.isRequired,
        customer: PropTypes.isRequired,
        activeTab: activeTabType.isRequired,
        changeActiveTab: PropTypes.func.isRequired,
        onVerifySuccess: PropTypes.func.isRequired,
        onResendCode: PropTypes.func.isRequired,
        isPhoneVerified: PropTypes.bool.isRequired,
        changePhone: PropTypes.func.isRequired,
        isChangePhonePopupOpen: PropTypes.bool.isRequired,
        toggleChangePhonePopup: PropTypes.func.isRequired,
        phone: PropTypes.string.isRequired,
        isMobileVerification: PropTypes.bool.isRequired
    };

    state = {
        subTotalPrice: 0,
        shippingPrice: 0,
        paymentTitle: '',
        isArabic: isArabic(),
        isPhoneVerification: true,
        delay: 1000,
        successHidden: false,
        wasLoaded: false
    };

    componentDidMount() {
        const { delay } = this.state;
        this.timer = setInterval(this.tick, delay);
    }

    componentDidUpdate(prevState) {
        const { delay } = this.state;
        if (prevState !== delay) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, delay);
        }
    }

    componentWillUnmount() {
        this.timer = null;
    }

    tick = () => {
        const { wasLoaded, successHidden } = this.state;
        if (!successHidden) {
            this.setState({ successHidden: true });
        }
        if (!wasLoaded && successHidden) {
            this.setState({ wasLoaded: true });
        }
    };

    renderTabList = () => {
        const { activeTab, changeActiveTab, isSignedIn } = this.props;

        if (!isSignedIn) {
            return null;
        }

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
            </ContentWrapper>
        );
    };

    renderSuccessMessage = (email) => {
        const { isArabic } = this.state;

        return (
            <div block="SuccessMessage" mods={ { isArabic } }>
                <div block="SuccessMessage" elem="Icon">
                    <img src={ SuccessCircle } alt="success circle" />
                </div>
                <div block="SuccessMessage" elem="Text">
                    <div block="SuccessMessage-Text" elem="Title">
                        { __('Order Placed') }
                    </div>
                    <div block="SuccessMessage-Text" elem="Message">
                        { __('Order confirmation has been sent to') }
                    </div>
                    <div block="SuccessMessage-Text" elem="Email">
                        { email }
                    </div>
                </div>
            </div>
        );
    };

    renderPhoneVerified() {
        const { isPhoneVerified } = this.props;

        if (!isPhoneVerified) {
            return null;
        }

        return (
            <div
              block="PhoneVerified"
            >
                <div
                  block="PhoneVerified"
                  elem="Content"
                >
                    <div
                      block="PhoneVerified"
                      elem="Image"
                    >
                        <img src={ Confirm } alt="Verified" />
                    </div>
                    <div
                      block="PhoneVerified"
                      elem="Text"
                    >
                        { __('Phone Verified') }
                    </div>
                </div>
            </div>
        );
    }

    renderTrackOrder() {
        const {
            isSignedIn,
            orderID,
            onVerifySuccess,
            onResendCode,
            isPhoneVerified,
            toggleChangePhonePopup,
            phone
        } = this.props;
        const { isArabic, isPhoneVerification } = this.state;

        if (!isPhoneVerified) {
            return (
                <div mix={ { block: 'TrackOrder', mods: { isArabic, isPhoneVerification } } }>
                    <div block="TrackOrder" elem="Text">
                        <div block="TrackOrder-Text" elem="Title">
                            { __('Please Verify your Number') }
                        </div>
                        <div block="TrackOrder-Text" elem="Message">
                            { __('Verification code has been sent to') }
                        </div>
                        <div block="TrackOrder-Text" elem="Phone">
                            <button onClick={ toggleChangePhonePopup }>
                                { phone }
                            </button>
                        </div>
                    </div>
                    <Form
                      onSubmitSuccess={ onVerifySuccess }
                    >
                        <div block="TrackOrder" elem="Code">
                            <Field
                              maxlength="5"
                              type="text"
                              placeholder="_____"
                              name="otp"
                              id="otp"
                            />
                        </div>
                        <button block="primary" type="submit">
                            { __('Verify phone number') }
                        </button>
                    </Form>
                    <div block="TrackOrder" elem="ResendCode">
                        <button onClick={ onResendCode }>
                            { __('Resend Verification Code') }
                        </button>
                    </div>
                </div>
            );
        }

        if (isPhoneVerified && isSignedIn) {
            return (
                <div mix={ { block: 'TrackOrder', mods: { isArabic, isSignedIn } } }>
                    <Link to={ `/sales/order/view/order_id/${orderID}/` }>
                        <button block="primary">
                            { __('track your order') }
                        </button>
                    </Link>
                </div>
            );
        }

        return (
            <div mix={ { block: 'TrackOrder', mods: { isArabic } } }>
                <div block="TrackOrder" elem="Text">
                    <span
                      block="TrackOrder"
                      elem="Text-Title"
                    >
                        { __('track your order') }
                    </span>
                    <span
                      block="TrackOrder"
                      elem="Text-SubTitle"
                    >
                        { __('sign in to access to your account and tract your order') }
                    </span>
                </div>
                <button block="secondary" onClick={ this.showMyAccountPopup }>
                    { __('sign in') }
                </button>
            </div>
        );
    }

    renderChangePhonePopUp = () => {
        const {
            changePhone,
            shippingAddress,
            toggleChangePhonePopup,
            isChangePhonePopupOpen
        } = this.props;

        return (
            <ChangePhonePopup
              isChangePhonePopupOpen={ isChangePhonePopupOpen }
              closeChangePhonePopup={ toggleChangePhonePopup }
              changePhone={ changePhone }
              countryId={ shippingAddress.country_id }
            />
        );
    };

    renderMyAccountPopup() {
        const { showPopup } = this.state;

        if (!showPopup) {
            return null;
        }

        return <MyAccountOverlay closePopup={ this.closePopup } onSignIn={ this.onSignIn } isPopup />;
    }

    onSignIn = () => {
        const { requestCustomerData } = this.props;

        requestCustomerData();
        this.closePopup();
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };

    renderTotalsItems() {
        const { totals: { items, quote_currency_code }, orderID } = this.props;

        if (!items || items.length < 1) {
            return (
                <p>{ __('There are no products in totals.') }</p>
            );
        }

        return (
            <div block="TotalItems">
                <div block="TotalItems" elem="OrderId">
                    { `${__('Order')} #${ orderID }` }
                </div>
                <ul block="TotalItems" elem="Items">
                    { items.map((item) => (
                        <SuccessCheckoutItem
                          key={ item.item_id }
                          item={ item }
                          currency_code={ quote_currency_code }
                          isEditing
                          isLikeTable
                        />
                    )) }
                </ul>
            </div>
        );
    }

    renderSubTotalPrice = () => {
        const {
            totals: {
                subtotal_incl_tax = 0
            }
        } = this.props;

        if (subtotal_incl_tax !== 0) {
            this.setState({ subTotalPrice: subtotal_incl_tax });
        }
        const { subTotalPrice } = this.state;

        return (
            <div block="Totals">
                <div block="Totals" elem="Title">
                    <span>{ __('Subtotal') }</span>
                </div>
                <div block="Totals" elem="Price">
                    <div>{ this.renderPriceLine(subTotalPrice) }</div>
                </div>
            </div>
        );
    };

    renderCashOnDeliveryFee = () => {
        const {
            totals: {
                shipping_fee = 0
            }
        } = this.props;

        if (shipping_fee !== 0) {
            this.setState({ shippingPrice: shipping_fee });
        }
        const { shippingPrice } = this.state;

        return (
            <div block="Totals">
                <div block="Totals" elem="Title">
                    <span>{ __('Cash on Delivery Fee') }</span>
                </div>
                <div block="Totals" elem="Price">
                    <div>{ this.renderPriceLine(shippingPrice) }</div>
                </div>
            </div>
        );
    };

    renderTotalPrice() {
        const { subTotalPrice, shippingPrice } = this.state;
        const totalPrice = subTotalPrice + shippingPrice;

        return (
            <div block="Totals">
                <div block="Totals" elem="TotalTitles">
                    <span block="Title">{ __('Subtotal') }</span>
                    <span block="SubTitle">{ __('(Taxes included)') }</span>
                </div>
                <div block="Totals" elem="TotalPrice">
                    <div>{ this.renderPriceLine(totalPrice) }</div>
                </div>
            </div>
        );
    }

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;
        return `${formatCurrency(quote_currency_code)}${roundPrice(price)}`;
    }

    renderTotals = () => {
        const { isArabic } = this.state;
        return (
            <div block="PriceTotals" mods={ { isArabic } }>
                { this.renderSubTotalPrice() }
                { this.renderCashOnDeliveryFee() }
                { this.renderTotalPrice() }
            </div>
        );
    };

    renderDeliveringAddress() {
        const {
            shippingAddress: {
                firstname,
                lastname,
                street,
                postcode,
                phone
            }
        } = this.props;

        return (
            <div block="Address">
                <div block="Address" elem="Title">
                    { __('Delivering to') }
                </div>
                <div block="Address" elem="FullName">
                    { `${firstname} ${lastname}` }
                </div>
                <div block="Address" elem="Street">
                    { street }
                </div>
                <div block="Address" elem="PostCode">
                    { postcode }
                </div>
                <div block="Address" elem="Phone">
                    { phone }
                </div>
            </div>
        );
    }

    renderBillingAddress() {
        const {
            billingAddress: {
                firstname,
                lastname,
                street,
                postcode,
                phone
            }
        } = this.props;

        return (
            <div block="Address">
                <div block="Address" elem="Title">
                    { __('Billing Address') }
                </div>
                <div block="Address" elem="FullName">
                    { `${firstname} ${lastname}` }
                </div>
                <div block="Address" elem="Street">
                    { street }
                </div>
                <div block="Address" elem="PostCode">
                    { postcode }
                </div>
                <div block="Address" elem="Phone">
                    { phone }
                </div>
            </div>
        );
    }

    renderAddresses = () => (
        <div block="Addresses">
            { this.renderDeliveringAddress() }
            { this.renderBillingAddress() }
        </div>
    );

    renderDeliveryOption = () => (
        <div block="DeliveryOptions">
            <div block="DeliveryOptions" elem="Title">
                { __('Delivery Options') }
            </div>
            <div block="DeliveryOptions" elem="Option">
                { __('FREE (Standard Delivery)') }
            </div>
        </div>
    );

    renderPaymentType = () => {
        const { isArabic } = this.state;
        return (
            <div block="PaymentType" mods={ { isArabic } }>
                <div block="PaymentType" elem="Title">
                    { __('Payment Type') }
                </div>
                { this.renderPaymentTypeContent() }
            </div>
        );
    };

    renderPaymentTypeContent = () => {
        const {
            creditCardData: {
                number,
                expDate,
                cvv
            },
            paymentMethod
        } = this.props;

        if (number && expDate && cvv) {
            const displayNumberDigits = 4;
            const slicedNumber = number.slice(number.length - displayNumberDigits);

            return (
                <div block="Details">
                    <div block="Details" elem="TypeLogo">
                        <img src={ Visa } alt="visa icon" />
                    </div>
                    <div block="Details" elem="Number">
                        <div block="Details" elem="Number-Dots">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                        <div block="Details" elem="Number-Value">
                            { slicedNumber }
                        </div>
                    </div>
                    <div block="Details" elem="Exp">
                        <span block="Details" elem="Exp-Title">
                            { __('EXP.') }
                        </span>
                        <div block="Details" elem="Exp-Date">
                            { expDate }
                        </div>
                    </div>
                </div>
            );
        }

        if (paymentMethod.code.match(/tabby/)) {
            this.setState({ paymentTitle: 'Tabby' });
        } else if (paymentMethod.code.match(/apple/)) {
            this.setState({ paymentTitle: 'Apple' });
        } else if (paymentMethod.code.match(/cash/)) {
            this.setState({ paymentTitle: 'Cash' });
        }

        const { paymentTitle } = this.state;
        return (
            <div block="Details">
                <div block="Details" elem="TypeLogo">
                    { this.renderPaymentMethodIcon(paymentTitle) }
                </div>
                <div block="Details" elem="TypeTitle">{ __(paymentTitle) }</div>
            </div>
        );
    };

    renderPaymentMethodIcon(paymentTitle) {
        const { isArabic } = this.state;

        switch (paymentTitle) {
        case 'Tabby':
            if (!isArabic) {
                return <img src={ Tabby } alt={ paymentTitle } />;
            }

            return <img src={ TabbyAR } alt={ paymentTitle } />;
        case 'Apple':
            return <img src={ Apple } alt={ paymentTitle } />;
        case 'Cash':
            return <img src={ Cash } alt={ paymentTitle } />;

        default:
            return '';
        }
    }

    renderButton() {
        const { isArabic } = this.state;

        return (
            <div block="CheckoutSuccess" elem="ButtonWrapper" mods={ { isArabic } }>
                <Link
                  block="CheckoutSuccess"
                  elem="ContinueButton"
                  to="/"
                >
                    <button block="primary">
                        { __('Continue shopping') }
                    </button>
                </Link>
            </div>
        );
    }

    renderSuccess() {
        const { successHidden } = this.state;
        return (
            <div block={ `SuccessOverlay ${successHidden ? 'hidden' : ''}` } dir="ltr">
                <div block="OrderPlacedTextWrapper">
                    <div block="confirmSimbol" />
                    <p>
                        { __('Order Placed') }
                    </p>
                </div>
            </div>
        );
    }

    render() {
        const { customer, isMobileVerification } = this.props;
        if (isMobileVerification) {
            return (
                <div block="CheckoutSuccess">
                    { this.renderChangePhonePopUp() }
                    <div block="CheckoutSuccess" elem="Details">
                        { this.renderTrackOrder() }
                    </div>
                </div>
            );
        }

        return (
            <div block="CheckoutSuccess">
                { this.renderChangePhonePopUp() }
                { this.renderTabList() }
                <div block="CheckoutSuccess" elem="Details">
                    { this.renderSuccessMessage(customer.email) }
                    { this.renderPhoneVerified() }
                    { this.renderTrackOrder() }
                    { this.renderTotalsItems() }
                    { this.renderTotals() }
                    { this.renderAddresses() }
                    { this.renderDeliveryOption() }
                    { this.renderPaymentType() }
                </div>
                { this.renderButton() }
                { this.renderMyAccountPopup() }
            </div>
        );
    }
}

export default CheckoutSuccess;
