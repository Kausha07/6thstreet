// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { MatchType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountOrderView from './MyAccountOrderView.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
});

export class MyAccountOrderViewContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        isLoading: true,
        order: {}
    };

    constructor(props) {
        super(props);

        this.getOrder();
    }

    containerProps = () => {
        const {
            isLoading,
            order
        } = this.state;

        return {
            isLoading,
            order
        };
    };

    getOrderId() {
        const {
            match: {
                params: {
                    order
                } = {}
            } = {}
        } = this.props;

        return order;
    }

    async getOrder() {
        try {
            const orderId = this.getOrderId();
            const { data: order } = await MagentoAPI.get(`/orders/${ orderId }`);
            this.setState({ order, isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <MyAccountOrderView
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderViewContainer);
