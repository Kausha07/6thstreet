import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import Loader from 'Component/Loader';
import { Order } from 'Util/API/endpoint/Order/Order.type';

import './MyAccountOrderView.style';

class MyAccountOrderView extends PureComponent {
    static propTypes = {
        order: Order.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderReturnItem() {
        const { order: { entity_id } } = this.props;

        return (
            <Link
              block="MyAccountOrderView"
              elem="ButtonReturn"
              mix={ { block: 'Button' } }
              to={ `/my-account/return-item/create/${ entity_id }` }
            >
                { __('Return item') }
            </Link>
        );
    }

    renderCancelItem() {
        const { order: { entity_id } } = this.props;

        return (
            <Link
              block="MyAccountOrderView"
              elem="ButtonCancel"
              mix={ { block: 'Button' } }
              to={ `/my-account/return-item/cancel/${ entity_id }` }
            >
                { __('Cancel item') }
            </Link>
        );
    }

    renderTitle() {
        const { order: { increment_id } } = this.props;

        return (
            <p>{ __('Order #%s', increment_id) }</p>
        );
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

    renderItems() {
        // const { order: { } } = this.props;
        return <p>items</p>;
    }

    renderShippingAddress() {
        return <p>shipping address</p>;
        /* const { order: {  } } = this.props;

        return (
            <div />
        ); */
    }

    renderBillingAddress() {
        return <p>billing address</p>;
        /* const { order: { billing_address } } = this.props;

        return (
            <div />
        ); */
    }

    renderSection(title, children) {
        return (
            <div>
                <p>{ title }</p>
                { children }
            </div>
        );
    }

    renderShippingMethod() {
        return <p>shipping method</p>;
        /* const { order: { } } = this.props;

        return (
            <div />
        ); */
    }

    renderPaymentMethod() {
        return <p>payment method</p>;
        /* const { order: { } } = this.props;

        return (
            <div />
        ); */
    }

    renderOrderDetails() {
        const { isLoading, order } = this.props;

        if (isLoading) {
            return this.renderLoader();
        }

        if (!Object.keys(order).length) {
            return this.renderNoFound();
        }

        return (
            <>
                { this.renderReturnItem() }
                { this.renderCancelItem() }
                { this.renderTitle() }
                { this.renderDetails() }
                { this.renderItems() }
                { this.renderShippingAddress() }
                { this.renderBillingAddress() }
                { this.renderShippingMethod() }
                { this.renderPaymentMethod() }
            </>
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

    render() {
        return (
            <div block="MyAccountOrderView">
                { this.renderOrderDetails() }
            </div>
        );
    }
}

export default MyAccountOrderView;
