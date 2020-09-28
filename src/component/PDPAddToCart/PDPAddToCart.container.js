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
        sizeObject: {},
        selectedSizeType: 'eu',
        selectedSize: '',
        errorMessage: '',
        validation: true,
        isLoading: false
    };

    static getDerivedStateFromProps(props) {
        const { product } = props;
        console.log(product);

        if (product.simple_products !== undefined) {
            const filteredProductKeys = Object.keys(product.simple_products);

            if (filteredProductKeys.length <= 1) {
                return { validation: false };
            }

            const filteredProductSizeKeys = Object.keys(product.simple_products[filteredProductKeys[0]].size);

            const object = {
                sizeCodes: filteredProductKeys,
                sizeTypes: filteredProductSizeKeys
            };

            return { sizeObject: object };
        }

        return null;
    }

    containerProps = () => {
        const { product } = this.props;
        return { ...this.state, product };
    };

    onSizeTypeSelect(type) {
        this.setState({ selectedSizeType: type.target.value });
    }

    onSizeSelect(size) {
        console.log('*** Selecting size in selected size type...', size.target.value);
        this.setState({ errorMessage: '' });
        this.setState({ selectedSize: size.target.value });
    }

    addToCart() {
        const { product, product: { sku }, addProductToCart } = this.props;
        const {
            selectedSizeType, selectedSize, errorMessage, validation
        } = this.state;

        console.log(selectedSize);
        if (product.size_uk.length !== 0 && selectedSize === '') {
            this.setState({ errorMessage: 'Please, select a size.' });
            console.log(errorMessage);
        }

        if ((product.size_uk.length !== 0 && selectedSize !== '') || (validation === false)) {
            this.setState({ isLoading: true });
            console.log('*** Adding to cart:', sku, selectedSizeType, selectedSize);

            addProductToCart({
                sku,
                qty: 1,
                optionId: selectedSizeType.toLocaleUpperCase(),
                optionValue: selectedSize
            });
        }
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
