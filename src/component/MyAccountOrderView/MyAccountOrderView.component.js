import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import Accordion from 'Component/Accordion';
import Image from 'Component/Image';
import Loader from 'Component/Loader';
import {
    STATUS_CANCELED,
    STATUS_COMPLETE,
    STATUS_FAILED,
    STATUS_PAYMENT_ABORTED,
    STATUS_SUCCESS
} from 'Component/MyAccountOrderListItem/MyAccountOrderListItem.config';
import MyAccountOrderViewItem from 'Component/MyAccountOrderViewItem';
import { ExtendedOrderType } from 'Type/API';
import { isArabic } from 'Util/App';
import { appendOrdinalSuffix } from 'Util/Common';
import { formatDate } from 'Util/Date';

import CancelledImage from './icons/cancelled.png';
import CloseImage from './icons/close.png';
import PackageImage from './icons/package.png';
import TimerImage from './icons/timer.png';
import TruckImage from './icons/truck.png';
import WarningImage from './icons/warning.png';
import { STATUS_DELIVERED, STATUS_LABEL_MAP, STATUS_SENT } from './MyAccountOrderView.config';

import './MyAccountOrderView.style';

class MyAccountOrderView extends PureComponent {
    static propTypes = {
        order: ExtendedOrderType,
        isLoading: PropTypes.bool.isRequired,
        getCountryNameById: PropTypes.func.isRequired,
        openOrderCancelation: PropTypes.func.isRequired
    };

    static defaultProps = {
        order: null
    };

    state = {
        isArabic: isArabic()
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
        const { openOrderCancelation, order: { status, increment_id } } = this.props;
        const buttonText = status === STATUS_COMPLETE ? __('Return an Item') : __('Cancel an Item');

        return (
            <div block="MyAccountOrderView" elem="Heading">
                <h3>{ __('Order #%s', increment_id) }</h3>
                { !STATUS_FAILED.includes(status) && (
                    <button onClick={ openOrderCancelation }>{ buttonText }</button>
                ) }
            </div>
        );
    }

    renderStatus() {
        const { order: { status, created_at } } = this.props;

        if (STATUS_FAILED.includes(status)) {
            const title = status === STATUS_PAYMENT_ABORTED ? __('Payment Failed') : __('Order Cancelled');
            const StatusImage = status === STATUS_PAYMENT_ABORTED ? WarningImage : CloseImage;

            return (
                <div block="MyAccountOrderView" elem="StatusFailed">
                    <Image
                      src={ StatusImage }
                      mix={ { block: 'MyAccountOrderView', elem: 'WarningImage' } }
                    />
                    <p>
                        { title }
                    </p>
                </div>
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

    renderPackagesMessage() {
        const { order: { status, shipped } } = this.props;
        const { isArabic } = this.state;

        if (STATUS_FAILED.includes(status)) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="PackagesMessage" mods={ { isArabic } }>
                <Image
                  src={ TruckImage }
                  mix={ { block: 'MyAccountOrderView', elem: 'TruckImage' } }
                />
                <p>
                    { shipped.length <= 1
                        ? __('Your order has been shipped in a single package, please find the package details below.')
                        : __('Your order has been shipped in multiple packages, please find the package details below.')
                        // eslint-disable-next-line
                    }
                </p>
            </div>
        );
    }

    renderAccordionTitle(title, image, status = null) {
        const { [status]: statusTitle = null } = STATUS_LABEL_MAP;

        return (
            <div block="MyAccountOrderView" elem="AccordionTitle">
                <Image
                  src={ image }
                  mix={ { block: 'MyAccountOrderView', elem: 'AccordionTitleImage' } }
                />
                <h3>
                    { title }
                    { !!statusTitle && <span>{ ` - ${ statusTitle }` }</span> }
                </h3>
            </div>
        );
    }

    renderAccordionProgress(status) {
        if (STATUS_DELIVERED === status) {
            return null;
        }

        return (
            <div
              block="MyAccountOrderView"
              elem="AccordionStatus"
              mix={ { block: 'MyAccountOrderListItem', elem: 'Status' } }
            >
                <div block="MyAccountOrderListItem" elem="ProgressBar">
                    <div
                      block="MyAccountOrderListItem"
                      elem="ProgressCurrent"
                      mods={ { isProcessing: status === STATUS_SENT } }
                    />
                    <div
                      block="MyAccountOrderListItem"
                      elem="ProgressCheckbox"
                      mods={ { isProcessing: status === STATUS_SENT } }
                    />
                </div>
                <div block="MyAccountOrderListItem" elem="StatusList">
                    { Object.values(STATUS_LABEL_MAP).map((label) => (
                        <p block="MyAccountOrderListItem" elem="StatusTitle">
                            { label }
                        </p>
                    )) }
                </div>
            </div>
        );
    }

    renderProcessingItems() {
        const { order: { status, unship } } = this.props;

        if (STATUS_FAILED.includes(status) || !unship.length) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="AccordionWrapper">
                <Accordion
                  mix={ { block: 'MyAccountOrderView', elem: 'Accordion' } }
                  title={ this.renderAccordionTitle(__('Items under processing'), TimerImage) }
                >
                    { unship.reduce((acc, { items }) => [...acc, ...items], [])
                        .filter(({ qty_canceled, qty_ordered }) => +qty_canceled < +qty_ordered)
                        .map(this.renderItem) }
                </Accordion>
            </div>
        );
    }

    renderCanceledAccordion() {
        const { order: { status, shipped, unship } } = this.props;
        const allItems = [
            ...shipped.reduce((acc, { items }) => [...acc, ...items], []),
            ...unship.reduce((acc, { items }) => [...acc, ...items], [])
        ];

        if (STATUS_CANCELED === status) {
            return (
                <div block="MyAccountOrderView" elem="AccordionWrapper">
                    <Accordion
                      mix={ { block: 'MyAccountOrderView', elem: 'Accordion' } }
                      title={ this.renderAccordionTitle(__('Cancelled items'), CancelledImage) }
                    >
                        { allItems.map(this.renderItem) }
                    </Accordion>
                </div>
            );
        }

        const canceledItems = allItems.filter(({ qty_partial_canceled }) => +qty_partial_canceled > 0);

        if (!canceledItems.length) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="AccordionWrapper">
                <Accordion
                  mix={ { block: 'MyAccountOrderView', elem: 'Accordion' } }
                  title={ this.renderAccordionTitle(__('Cancelled items'), CancelledImage) }
                >
                    { allItems.filter(({ qty_partial_canceled }) => +qty_partial_canceled > 0).map(this.renderItem) }
                </Accordion>
            </div>
        );
    }

    renderAccordions() {
        const { order: { status, shipped } } = this.props;
        const { isArabic } = this.state;
        const itemNumber = shipped.length;

        if (STATUS_FAILED.includes(status)) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="Accordions">
                { shipped.map((item, index) => (
                    <div
                      key={ item.shipment_number }
                      block="MyAccountOrderView"
                      elem="AccordionWrapper"
                      mods={ { isArabic } }
                    >
                        <Accordion
                          mix={ { block: 'MyAccountOrderView', elem: 'Accordion' } }
                          shortDescription={ this.renderAccordionProgress(item.courier_status_code) }
                          title={ this.renderAccordionTitle(
                              __('%s Package', appendOrdinalSuffix(itemNumber - index)),
                              PackageImage,
                              item.courier_status_code
                          ) }
                        >
                            <p>
                                { __(
                                    'Package contains %s %s',
                                    item.items.length,
                                    item.items.length === 1 ? __('item') : __('items')
                                ) }
                            </p>
                            { item.items.map(this.renderItem) }
                        </Accordion>
                    </div>
                )) }
                { this.renderProcessingItems() }
                { this.renderCanceledAccordion() }
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
                order_currency_code,
                msp_cod_amount
            }
        } = this.props;

        if (status !== STATUS_PAYMENT_ABORTED) {
            return null;
        }

        return (
            <div block="MyAccountOrderView" elem="Summary">
                <p block="MyAccountOrderView" elem="SummaryItem">
                    <span>{ __('Subtotal') }</span>
                    <span>{ formatPrice(+subtotal, order_currency_code) }</span>
                </p>
                { !!msp_cod_amount && (
                    <p block="MyAccountOrderView" elem="SummaryItem">
                        <span>{ __('Cash on Delivery Fee') }</span>
                        <span>{ formatPrice(+msp_cod_amount, order_currency_code) }</span>
                    </p>
                ) }
                <p block="MyAccountOrderView" elem="SummaryItem" mods={ { grandTotal: true } }>
                    <span>{ __('Total') }</span>
                    <span>{ formatPrice(+grand_total, order_currency_code) }</span>
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
        const { isLoading, order } = this.props;

        if (isLoading || !order) {
            return (
                <div block="MyAccountOrderView">
                    <Loader isLoading={ isLoading } />
                </div>
            );
        }

        const { billing_address } = order;

        return (
            <div block="MyAccountOrderView">
                <Loader isLoading={ isLoading } />
                { this.renderTitle() }
                { this.renderStatus() }
                { this.renderPackagesMessage() }
                { this.renderAccordions() }
                { this.renderFailedOrderDetails() }
                { this.renderSummary() }
                { this.renderAddress(__('Delivering to'), billing_address) }
                { this.renderAddress(__('Billing Address'), billing_address) }
                { this.renderPaymentType() }
            </div>
        );
    }
}

export default MyAccountOrderView;
