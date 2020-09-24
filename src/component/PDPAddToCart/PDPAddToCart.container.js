import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MobileCartDispatcher from 'Store/MobileCart/MobileCart.dispatcher';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPAddToCart from './PDPAddToCart.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product
});

export const mapDispatchToProps = (_dispatch) => ({
    addProductToCart: (productData) => MobileCartDispatcher.addProductToCart(_dispatch, productData)
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
        console.log('*** Selecting size type - eu/uk/us...');
    }

    onSizeSelect() {
        const { product } = this.props;
        const { selectedSizeType } = this.state;

        console.log('*** Selecting size in selected size type...', product[`size_${selectedSizeType}`][0]);

        // TODO Select proper size, currently will select first available
        this.setState({ selectedSize: product[`size_${selectedSizeType}`][0] });
    }

    addToCart() {
        const { product: { sku }, addProductToCart } = this.props;
        const { selectedSizeType, selectedSize } = this.state;
        // TODO Validate if size has been selected

        console.log('*** Adding to cart:', sku, selectedSizeType, selectedSize);

        addProductToCart({
            sku,
            qty: 1,
            optionId: selectedSizeType.toLocaleUpperCase(),
            optionValue: selectedSize
        });
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
