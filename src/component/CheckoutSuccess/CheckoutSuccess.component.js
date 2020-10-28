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
        paymentMethod: PropTypes.object.isRequired
    };

    state = {
        subTotalPrice: 0,
        shippingPrice: 0
    };

    renderButton() {
        return (
            <div block="CheckoutSuccess" elem="ButtonWrapper">
                <Link
                  block="Button"
                  mix={ { block: 'CheckoutSuccess', elem: 'ContinueButton' } }
                  to="/"
                >
                    { __('Continue shopping') }
                </Link>
            </div>
        );
    }

    renderTotalsItems() {
        const { totals: { items, quote_currency_code } } = this.props;

        if (!items || items.length < 1) {
            return (
                <p>{ __('There are no products in totals.') }</p>
            );
        }

        return (
            <div>
                <div>
                    a
                </div>
                <ul block="CartPage" elem="Items" aria-label="List of items in cart">
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

    renderPriceLine(price) {
        const { totals: { quote_currency_code } } = this.props;
        return `${formatCurrency(quote_currency_code)}${roundPrice(price)}`;
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
            <div>
                <div>
                    <div
                      block="CartPage"
                      elem="TotalDetails"
                    >
                        <span>{ __('Subtotal') }</span>
                    </div>
                </div>
                <div>
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
            <div>
                <div>
                    <div
                      block="CartPage"
                      elem="TotalDetails"
                    >
                        <span>{ __('Cash on Delivery Fee') }</span>
                    </div>
                </div>
                <div>
                    <div>{ this.renderPriceLine(shippingPrice) }</div>
                </div>
            </div>
        );
    };

    renderTotalPrice() {
        const { subTotalPrice, shippingPrice } = this.state;
        const totalPrice = subTotalPrice + shippingPrice;

        return (
            <div>
                <div>
                    <div
                      block="CartPage"
                      elem="TotalDetails"
                    >
                        <span>{ __('Subtotal') }</span>
                        <span>{ __('(Taxes included)') }</span>
                    </div>
                </div>
                <div>
                    <div>{ this.renderPriceLine(totalPrice) }</div>
                </div>
            </div>
        );
    }

    renderTotals = () => (
        <article block="CartPage" elem="Summary">
            { this.renderSubTotalPrice() }
            { this.renderCashOnDeliveryFee() }
            { this.renderTotalPrice() }
        </article>
    );

    renderAddresses = () => (
        <div>
            { this.renderDeliveringAddress() }
            { this.renderBillingAddress() }
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
          <div>
              <div>
                  { `${firstname} ${lastname}` }
              </div>
              <div>
                  { street }
              </div>
              <div>
                  { postcode }
              </div>
              <div>
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
            <div>
                <div>
                    { `${firstname} ${lastname}` }
                </div>
                <div>
                    { street }
                </div>
                <div>
                    { postcode }
                </div>
                <div>
                    { phone }
                </div>
            </div>
        );
    }

    renderPaymentMethod() {
        const { paymentMethod } = this.props;
        console.log(paymentMethod);
    }

    renderContent = () => {
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

    render() {
        return (
            <div block="CheckoutSuccess">
                { this.renderContent() }
                { this.renderTotalsItems() }
                { this.renderTotals() }
                { this.renderAddresses() }
                { this.renderPaymentMethod() }
                { this.renderButton() }
            </div>
        );
    }
}

export default CheckoutSuccess;
