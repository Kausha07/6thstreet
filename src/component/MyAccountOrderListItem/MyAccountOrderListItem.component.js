import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import { Order } from 'Util/API/endpoint/Order/Order.type';

import './MyAccountOrderListItem.style';

class MyAccountOrderListItem extends PureComponent {
    static propTypes = {
        linkTo: PropTypes.string.isRequired,
        order: Order.isRequired
    };

    renderTitle() {
        const { order: { increment_id, status } } = this.props;

        return (
            <p block="MyAccountOrderListItem" elem="Title">
                { __('Order #%s', increment_id) }
                <span block="MyAccountOrderListItem" elem="Status">
                    { status }
                </span>
            </p>
        );
    }

    renderTotal() {
        const { order: { grand_total, currency_code } } = this.props;

        const total = parseFloat(grand_total)
            .toFixed(2)
            .replace(/\.0+$/, '');

        return (
            <p block="MyAccountOrderListItem" elem="Total">
                { __('Total: %s', `${ currency_code } ${ total }`) }
            </p>
        );
    }

    renderItems() {
        const { order: { items_count } } = this.props;

        return (
            <p block="MyAccountOrderListItem" elem="Items">
                { items_count }
                <span>
                    { items_count === 1 ? __('Item') : __('Items') }
                </span>
            </p>
        );
    }

    renderPlacedAt() {
        const { order: { created_at } } = this.props;

        return (
            <p block="MyAccountOrderListItem" elem="Items">
                { __('Order placed: ') }
                <span>
                    { created_at }
                </span>
            </p>
        );
    }

    renderImage() {
        const { order: { thumbnail } } = this.props;

        return (
            <img alt="Order products" src={ thumbnail } />
        );
    }

    render() {
        const { linkTo } = this.props;

        return (
            <Link
              block="MyAccountOrderListItem"
              to={ linkTo }
            >
                { this.renderTitle() }
                { this.renderImage() }
                <div block="MyAccountOrderListItem" elem="Content">
                    { this.renderTotal() }
                    { this.renderItems() }
                    { this.renderPlacedAt() }
                </div>
            </Link>
        );
    }
}

export default MyAccountOrderListItem;
