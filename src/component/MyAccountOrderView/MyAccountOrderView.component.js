import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import Accordion from 'Component/Accordion';
import Loader from 'Component/Loader';
import { STATUS_FAILED, STATUS_SUCCESS } from 'Component/MyAccountOrderListItem/MyAccountOrderListItem.config';
import MyAccountOrderViewItem from 'Component/MyAccountOrderViewItem';
import { OrderType } from 'Type/API';
import { appendOrdinalSuffix } from 'Util/Common';
import { formatDate } from 'Util/Date';

import './MyAccountOrderView.style';

class MyAccountOrderView extends PureComponent {
    static propTypes = {
        order: OrderType.isRequired,
        isLoading: PropTypes.bool.isRequired,
        getCountryNameById: PropTypes.func.isRequired
    };

    renderAddress = (title, address) => {
        const { getCountryNameById } = this.props;
        const {
            firstname,
            middlename,
            lastname,
            street,
            postcode,
            city,
            country_id,
            telephone
        } = address;

        return (
            <div block="MyAccountOrderView" elem="Address">
                <h3>{ title }</h3>
                <p>{ `${ firstname } ${ middlename || '' } ${ lastname }`.trim() }</p>
                <p>{ `${ street } ${ postcode }` }</p>
                <p>{ `${ city } - ${ getCountryNameById(country_id) }` }</p>
                <p>{ `${ telephone }` }</p>
            </div>
        );
    };

    renderItem(item) {
        return (
            <MyAccountOrderViewItem item={ item } />
        );
    }

    renderTitle() {
        const { order: { increment_id } } = this.props;

        return (
            <h3>{ __('Order #%s', increment_id) }</h3>
        );
    }

    renderStatus() {
        const { order: { status, created_at } } = this.props;

        if (STATUS_FAILED.includes(status)) {
            return (
                <p block="MyAccountOrderView" elem="StatusFailed">
                    { /* Some statuses are written with _ so they need to be splitted and joined */ }
                    { `${ status.split('_').join(' ') }` }
                </p>
            );
        }

        return (
            <div block="MyAccountOrderView" elem="Status">
                <p
                  block="MyAccountOrderView"
                  elem="StatusTitle"
                  mods={ { isSuccess: STATUS_SUCCESS.includes(status) } }
                >
                    { __('Status: ') }
                    <span>{ `${ status.split('_').join(' ') }` }</span>
                </p>
                <p block="MyAccountOrderView" elem="StatusDate">
                    { __('Order placed: ') }
                    <span>{ formatDate('DD MMM YYYY', new Date(created_at)) }</span>
                </p>
            </div>
        );
    }

    renderAccordions() {
        const { order: { shipped } } = this.props;
        const itemNumber = shipped.length;

        return (
            <div block="MyAccountOrderView" elem="Accordions">
                { shipped.map((item, index) => (
                    <Accordion
                      key={ item.shipment_number }
                      mix={ { block: 'MyAccountOrderView', elem: 'Accordion' } }
                      title={ __('%s Package', appendOrdinalSuffix(itemNumber - index)) }
                    >
                        { item.items.map(this.renderItem) }
                    </Accordion>
                )) }
            </div>
        );
    }

    renderFailedOrderDetails() {
        const { order: { status, unship } } = this.props;
        const itemsArray = unship.reduce((acc, { items }) => [...acc, ...items], []);

        if (!STATUS_FAILED.includes(status)) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="OrderDetails" mods={ { failed: true } }>
                <h3>{ __('Order detail') }</h3>
                { itemsArray.map(this.renderItem) }
            </div>
        );
    }

    renderSummary() {
        const {
            order: {
                status,
                subtotal,
                grand_total,
                currency_code,
                msp_cod_amount
            }
        } = this.props;

        if (!STATUS_FAILED.includes(status)) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="Summary">
                <p block="MyAccountOrderView" elem="SummaryItem">
                    <span>{ __('Subtotal') }</span>
                    <span>{ formatPrice(+subtotal, currency_code) }</span>
                </p>
                { !!msp_cod_amount && (
                    <p block="MyAccountOrderView" elem="SummaryItem">
                        <span>{ __('Cash on Delivery Fee') }</span>
                        <span>{ formatPrice(+msp_cod_amount, currency_code) }</span>
                    </p>
                ) }
                <p block="MyAccountOrderView" elem="SummaryItem" mods={ { grandTotal: true } }>
                    <span>{ __('Total') }</span>
                    <span>{ formatPrice(+grand_total, currency_code) }</span>
                </p>
            </div>
        );
    }

    renderPaymentType() {
        const {
            order: {
                payment: {
                    additional_information: { method_title }
                }
            }
        } = this.props;

        return (
            <div block="MyAccountOrderView" elem="PaymentType">
                <h3>{ __('Payment Type') }</h3>
                <p>{ method_title }</p>
            </div>
        );
    }

    render() {
        const { isLoading, order: { billing_address } } = this.props;

        if (isLoading) {
            return (
                <div block="MyAccountOrderView">
                    <Loader isLoading={ isLoading } />
                </div>
            );
        }

        return (
            <div block="MyAccountOrderView">
                <Loader isLoading={ isLoading } />
                { this.renderTitle() }
                { this.renderStatus() }
                { this.renderAccordions() }
                { this.renderFailedOrderDetails() }
                { this.renderSummary() }
                { this.renderAddress(__('Billing Address'), billing_address) }
                { this.renderPaymentType() }
            </div>
        );
    }
}

export default MyAccountOrderView;
