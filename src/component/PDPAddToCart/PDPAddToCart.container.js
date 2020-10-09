import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPAddToCart from './PDPAddToCart.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product
});

export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    addProductToCart:
    (productData, color, optionValue, discount, brand_name, thumbnail_url) => CartDispatcher.addProductToCart(
        dispatch,
        productData,
        color,
        optionValue,
        discount,
        brand_name,
        thumbnail_url
    )
});

export class PDPAddToCartContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        addProductToCart: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    containerFunctions = {
        onSizeTypeSelect: this.onSizeTypeSelect.bind(this),
        onSizeSelect: this.onSizeSelect.bind(this),
        addToCart: this.addToCart.bind(this)
    };

    state = {
        sizeObject: {},
        selectedSizeType: 'eu',
        selectedSizeCode: '',
        errorMessage: '',
        insertedSizeStatus: true,
        isLoading: false,
        addedToCart: false,
        buttonRefreshTimeout: 1250
    };

    static getDerivedStateFromProps(props) {
        const { product } = props;

        if (product.simple_products !== undefined) {
            const filteredProductKeys = Object.keys(product.simple_products);

            if (filteredProductKeys.length <= 1) {
                return { insertedSizeStatus: false };
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
        this.setState({ errorMessage: '' });
        this.setState({ selectedSizeCode: size.target.value });
    }

    addToCart() {
        const {
            product, product: {
                simple_products,
                discount,
                thumbnail_url,
                color,
                brand_name
            }, addProductToCart, showNotification
        } = this.props;
        const {
            selectedSizeType, selectedSizeCode, insertedSizeStatus
        } = this.state;

        if (product.size_uk.length !== 0 && selectedSizeCode === '') {
            showNotification('error', __('Please select a size.'));
        }

        if (product.size_uk.length !== 0 && selectedSizeCode !== '') {
            this.setState({ isLoading: true });
            const { size } = simple_products[selectedSizeCode];
            const optionId = selectedSizeType.toLocaleUpperCase();
            const optionValue = size[selectedSizeType];

            addProductToCart({
                sku: selectedSizeCode,
                qty: 1,
                optionId,
                optionValue
            }, color, optionValue, discount, brand_name, thumbnail_url).then(
                () => this.afterAddToCart()
            );
        }

        if (insertedSizeStatus === false) {
            this.setState({ isLoading: true });
            const code = Object.keys(simple_products);

            addProductToCart({
                sku: code[0],
                qty: 1,
                optionId: '',
                optionValue: ''
            }, color, null, discount, brand_name, thumbnail_url).then(
                () => this.afterAddToCart()
            );
        }
    }

    afterAddToCart() {
        const { buttonRefreshTimeout } = this.state;

        this.setState({ isLoading: false });
        // TODO props for addedToCart
        this.setState({ addedToCart: true });
        const timer = setTimeout(
            () => this.setState({ addedToCart: false }), buttonRefreshTimeout
        );

        return () => clearTimeout(timer);
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
