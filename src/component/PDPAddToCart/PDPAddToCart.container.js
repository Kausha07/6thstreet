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
        sizeTypes: [],
        selectedSizeType: 'eu',
        selectedSize: '',
        errorMessage: '',
        validation: true
    };

    static getDerivedStateFromProps(props) {
        const { product } = props;
        console.log(product);
        const filteredKeys = [];

        // const { validation } = this.state;
        // eslint-disable-next-line quotes
        if (product.size_uk !== undefined) {
            if (product.size_uk.length === 0) {
                return { validation: false };
            }
        }

        Object.keys(product).forEach((item) => {
            if (item.includes('size_')) {
                filteredKeys.push(item.replace('size_', ''));
            }
        });
        // eslint-disable-next-line dot-notation

        return { sizeTypes: filteredKeys };
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
