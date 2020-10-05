// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Order } from 'Util/API/endpoint/Order/Order.type';

import MyAccountOrderListItem from './MyAccountOrderListItem.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MyAccountOrderListItemContainer extends PureComponent {
    static propTypes = {
        order: Order.isRequired
    };

    containerFunctions = {
    };

    containerProps = () => {
        const { order } = this.props;

        return {
            linkTo: this.getLinkTo(),
            order
        };
    };

    getLinkTo() {
        const { order: { id } } = this.props;
        return `/my-account/my-orders/${ id }`;
    }

    render() {
        return (
            <MyAccountOrderListItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderListItemContainer);
