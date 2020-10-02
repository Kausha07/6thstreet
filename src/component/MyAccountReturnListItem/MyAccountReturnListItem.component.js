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
        const {
            linkTo,
            return: { return_increment_id }
        } = this.props;

        return (
            <Link to={ linkTo }>
                { return_increment_id }
            </Link>
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
        return (
            <div
              block="MyAccountReturnListItem"
            >
                { this.renderID() }
                { this.renderDate() }
                { this.renderOrder() }
                { this.renderStatus() }
            </div>
        );
    }
}

export default MyAccountReturnListItem;
