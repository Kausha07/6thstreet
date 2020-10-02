import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import { Return } from 'Util/API/endpoint/Return/Return.type';

import './MyAccountReturnListItem.style';

class MyAccountReturnListItem extends PureComponent {
    static propTypes = {
        return: Return.isRequired,
        linkTo: PropTypes.string.isRequired
    };

    renderDate() {
        const { return: { date } } = this.props;

        return (
            <p>{ date }</p>
        );
    }

    renderID() {
        const { return: { return_increment_id } } = this.props;

        return (
            <p>{ return_increment_id }</p>
        );
    }

    renderStatus() {
        const { return: { status } } = this.props;

        return (
            <p>{ status }</p>
        );
    }

    renderOrder() {
        const { return: { order_id } } = this.props;

        return (
            <Link
              block="MyAccountReturnListItem"
              elem="Order"
              to={ `/my-account/my-orders/${ order_id }` }
            >
                { order_id }
            </Link>
        );
    }

    render() {
        const { linkTo } = this.props;

        return (
            <Link
              block="MyAccountReturnListItem"
              to={ linkTo }
            >
                { this.renderID() }
                { this.renderDate() }
                { this.renderOrder() }
                { this.renderStatus() }
            </Link>
        );
    }
}

export default MyAccountReturnListItem;
