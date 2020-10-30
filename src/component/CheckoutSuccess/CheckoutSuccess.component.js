import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import Link from 'Component/Link';
import MyAccountTabList from 'Component/MyAccountTabList';
import SuccessCheckoutItem from 'Component/SuccessCheckoutItem';
import { tabMap } from 'Route/MyAccount/MyAccount.container';
import { TotalsType } from 'Type/MiniCart';
import { formatCurrency, roundPrice } from 'Util/Price';

import './CheckoutSuccess.style';

export class CheckoutSuccess extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        changeActiveTab: PropTypes.func.isRequired,
        shippingAddress: PropTypes.object.isRequired,
        billingAddress: PropTypes.object.isRequired,
        paymentMethod: PropTypes.object.isRequired,
        creditCardData: PropTypes.object.isRequired,
        orderID: PropTypes.number.isRequired
    };

    state = {
        subTotalPrice: 0,
        shippingPrice: 0
    };

    renderSuccessMessage = () => (
        <div block="SuccessMessage">
            <div block="SuccessMessage" elem="Graphic">
                <section block="svg" elem="container">
                    <svg block="circle" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <ellipse block="foreground" ry="30" rx="30" cy="62" cx="62" strokeWidth="3" />
                            <line block="line line2" x1="52" y1="62" x2="74" y2="62" />
                        </g>
                    </svg>
                    <div block="center" />
                </section>
            </div>
            <div block="SuccessMessage" elem="Text">
                <div block="SuccessMessage-Text" elem="Title">
                    { __('Order Placed') }
                </div>
                <div block="SuccessMessage-Text" elem="Message">
                    { __('Order confirmation has been sent to') }
                </div>
                <div block="SuccessMessage-Text" elem="Email">
                    mytest@email.com
                </div>
            </div>
        </div>
    );

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

    renderTotals = () => (
        <div block="PriceTotals">
            { this.renderSubTotalPrice() }
            { this.renderCashOnDeliveryFee() }
            { this.renderTotalPrice() }
        </div>
    );

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

    renderPaymentType = () => (
        <div block="PaymentType">
            <div block="PaymentType" elem="Title">
                { __('Payment Type') }
            </div>
            { this.renderPaymentTypeContent() }
        </div>
    );

    renderPaymentTypeContent = () => {
        const {
            creditCardData: {
                number,
                expDate,
                cvv
            },
            paymentMethod
        } = this.props;

        console.log(paymentMethod);

        if (number && expDate && cvv) {
            const displayNumberDigits = 4;
            const slicedNumber = number.slice(number.length - displayNumberDigits);

            return (
                <div block="Details">
                    <div block="Details" elem="TypeLogo">img</div>
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
                            EXP.
                        </span>
                        <div block="Details" elem="Exp-Date">
                            { expDate }
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div block="Details">
                <div block="Details" elem="TypeLogo">img</div>
                <div block="Details" elem="TypeTitle">paymentMethod</div>
            </div>
        );
    };

    renderTabList = () => {
        const { changeActiveTab } = this.props;

        return (
            <ContentWrapper
              label={ __('My Account page') }
              wrapperMix={ { block: 'MyAccount', elem: 'Wrapper' } }
            >
                <MyAccountTabList
                  tabMap={ tabMap }
                  activeTab="dashboard"
                  changeActiveTab={ changeActiveTab }
                />
            </ContentWrapper>
        );
    };

    renderButton() {
        return (
            <div block="CheckoutSuccess" elem="ButtonWrapper">
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

    render() {
        return (
            <div block="CheckoutSuccess">
                { this.renderTabList() }
                <div block="CheckoutSuccess" elem="Details">
                    { this.renderSuccessMessage() }
                    { this.renderTotalsItems() }
                    { this.renderTotals() }
                    { this.renderAddresses() }
                    { this.renderDeliveryOption() }
                    { this.renderPaymentType() }
                </div>
                { this.renderButton() }
            </div>
        );
    }
}

export default CheckoutSuccess;
