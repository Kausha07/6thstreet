// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import ProductItem from './ProductItem.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class ProductItemContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        const { product } = this.props;
        return { product };
    };

    render() {
        return (
            <ProductItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItemContainer);
