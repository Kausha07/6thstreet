import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import { Return } from 'Util/API/endpoint/Return/Return.type';

import './MyAccountReturnView.style';

class MyAccountReturnView extends PureComponent {
    static propTypes = {
        return: Return.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderTitle() {
        const { return: { order_increment_id } } = this.props;

        return (
            <p>{ __('Return #%s', order_increment_id) }</p>
        );
    }

    renderDate() {
        const { return: { date } } = this.props;

        return (
            <p>
                { __('Date requested') }
                { date }
            </p>
        );
    }

    renderDetails() {
        const { return: { status, order_id } } = this.props;

        return (
            <dl>
                <dt>{ __('Status') }</dt>
                <dd>{ status }</dd>
                <dt>{ __('Order ID') }</dt>
                <dd>{ order_id }</dd>
            </dl>
        );
    }

    renderItems() {
        return (
            <p>items</p>
        );
    }

    renderNoFound() {
        return 'return not found';
    }

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    renderReturnDetails() {
        const { isLoading, return: returnItem } = this.props;

        if (isLoading) {
            return this.renderLoader();
        }

        if (!Object.keys(returnItem).length) {
            return this.renderNoFound();
        }

        return (
            <>
                { this.renderTitle() }
                { this.renderDate() }
                { this.renderDetails() }
                { this.renderItems() }
            </>
        );
    }

    render() {
        return (
            <div block="MyAccountReturnView">
                { this.renderReturnDetails() }
            </div>
        );
    }
}

export default MyAccountReturnView;
