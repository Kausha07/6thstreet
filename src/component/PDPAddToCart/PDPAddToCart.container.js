import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPAddToCart from './PDPAddToCart.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product
});

export const mapDispatchToProps = (_dispatch) => ({
    addProductToCart:
     (productData, thumbnail_url) => CartDispatcher.addProductToCart(_dispatch, productData, thumbnail_url)
});

export class PDPAddToCartContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        addProductToCart: PropTypes.func.isRequired
    };

    containerFunctions = {
        onSizeTypeSelect: this.onSizeTypeSelect.bind(this),
        onSizeSelect: this.onSizeSelect.bind(this),
        addToCart: this.addToCart.bind(this)
    };

    state = {
        selectedSizeType: 'eu',
        selectedSize: ''
    };

    containerProps = () => {
        const { product } = this.props;
        return { ...this.state, product };
    };

    onSizeTypeSelect() {
    }

    onSizeSelect() {
        const { product } = this.props;
        const { selectedSizeType } = this.state;

        // TODO Select proper size, currently will select first available
        this.setState({ selectedSize: product[`size_${selectedSizeType}`][0] });
    }

    addToCart() {
        const { product: { simple_products, thumbnail_url }, addProductToCart } = this.props;
        const { selectedSizeType, selectedSizeCode = '191755128603' } = this.state;
        const { size } = simple_products[selectedSizeCode];

        addProductToCart({
            sku: selectedSizeCode,
            qty: 1,
            optionId: selectedSizeType.toLocaleUpperCase(),
            optionValue: size[selectedSizeType]
        }, thumbnail_url);
    }

    render() {
        return (
            <PDPAddToCart
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPAddToCartContainer);
