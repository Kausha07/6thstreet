import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountOrderList from './MyAccountOrderList.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (error) => dispatch(showNotification('error', error))
});

export class MyAccountOrderListContainer extends PureComponent {
    static propTypes = {
        showErrorNotification: PropTypes.func.isRequired
    };

    state = {
        isLoading: true,
        orders: []
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.getOrders();
    }

    containerProps = () => {
        const {
            isLoading,
            orders
        } = this.state;

        return {
            isLoading,
            orders
        };
    };

    async getOrders() {
        const { showErrorNotification } = this.props;

        try {
            const { data: { orders } } = await MagentoAPI.get('/orders/list');
            this.setState({ orders, isLoading: false });
        } catch (e) {
            showErrorNotification(__('No orders were found'));
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <MyAccountOrderList
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderListContainer);
