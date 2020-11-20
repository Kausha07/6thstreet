import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    MyAccountReturnCreateListContainer as SourceComponent
} from 'Component/MyAccountReturnCreateList/MyAccountReturnCreateList.container';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';

import MyAccountOrderList from './MyAccountOrderList.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', error)),
    getOrders: (limit) => MyAccountDispatcher.getOrders(limit)
});

export class MyAccountOrderListContainer extends SourceComponent {
    static propTypes = {
        ...SourceComponent.propTypes,
        getOrders: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.setState({ isLoading: true });

        this.getOrderList('5');
    }

    containerProps = () => {
        const { orders, isLoading, requestInProgress } = this.state;

        return { orders, isLoading, requestInProgress };
    };

    getOrderList(limit = 0) {
        const { getOrders, showErrorNotification } = this.props;

        this.setState({ requestInProgress: true });

        const params = limit ? `?limit=${limit}` : '';
        getOrders(params).then(({ data }) => {
            this.setState({ orders: data, isLoading: false, requestInProgress: false });

            // First request have limit 5 orders to show something to user
            // After we do second request to get 100 other orders
            if (limit !== '100') {
                this.getOrderList('100');
            }
        }).catch(() => {
            showErrorNotification(__('Error appeared while fetching orders'));
            this.setState({ isLoading: false, requestInProgress: false });
        });
    }

    render() {
        return (
            <MyAccountOrderList
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderListContainer);
