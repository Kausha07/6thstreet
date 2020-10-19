import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import Loader from 'Component/Loader';
import { STATUS_FAILED } from 'Component/MyAccountOrderListItem/MyAccountOrderListItem.config';
import { OrderType } from 'Type/API';

import './MyAccountOrderView.style';

class MyAccountOrderView extends PureComponent {
    static propTypes = {
        order: OrderType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderTitle() {
        const { order: { increment_id } } = this.props;

        return (
            <p>{ __('Order #%s', increment_id) }</p>
        );
    }

    renderStatus() {
        const { order: { status } } = this.props;

        if (STATUS_FAILED.includes(status)) {
            return (
                <p block="MyAccountOrderView" elem="Status" mods={ { failed: true } }>
                    { /* Some statuses are written with _ so they need to be splitted and joined */ }
                    { `${ status.split('_').join(' ') }` }
                </p>
            );
        }

        return null;
    }

    renderDetails() {
        const { order: { status, created_at } } = this.props;

        return (
            <dl>
                <dt>{ __('Status') }</dt>
                <dd>{ status }</dd>
                <dt>{ __('Order placed') }</dt>
                <dd>{ created_at }</dd>
            </dl>
        );
    }

    renderSection(title, children) {
        return (
            <div>
                <p>{ title }</p>
                { children }
            </div>
        );
    }

    renderNoFound() {
        return 'order not found';
    }

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
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

    render() {
        return (
            <div block="MyAccountOrderView">
                { this.renderTitle() }
                { this.renderStatus() }
                { this.renderSummary() }
            </div>
        );
    }
}

export default MyAccountOrderView;
