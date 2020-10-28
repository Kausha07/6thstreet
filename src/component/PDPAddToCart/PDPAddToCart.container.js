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
    addProductToCart: (
        productData, color, optionValue, basePrice, brand_name, thumbnail_url, url, itemPrice
    ) => CartDispatcher.addProductToCart(
        dispatch,
        productData,
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail_url,
        url,
        itemPrice
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
        insertedSizeStatus: true,
        isLoading: false,
        addedToCart: false,
        buttonRefreshTimeout: 1250
    };

    static getDerivedStateFromProps(props) {
        const { product } = props;

        if (product.simple_products !== undefined) {
            const filteredProductKeys = Object.keys(product.simple_products);

            const filteredProductSizeKeys = Object.keys(product.simple_products[filteredProductKeys[0]].size);

            const object = {
                sizeCodes: filteredProductKeys,
                sizeTypes: filteredProductSizeKeys
            };

            if (filteredProductKeys.length <= 1 && filteredProductSizeKeys.length === 0) {
                return { insertedSizeStatus: false, sizeObject: object };
            }

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
        this.setState({ selectedSizeCode: size.target.value });
    }

    addToCart() {
        const {
            product, product: {
                simple_products,
                thumbnail_url,
                url,
                color,
                brand_name,
                price
            }, addProductToCart, showNotification
        } = this.props;
        const {
            selectedSizeType, selectedSizeCode, insertedSizeStatus
        } = this.state;
        const itemPrice = price[0][Object.keys(price[0])[0]]['6s_special_price'];
        const basePrice = price[0][Object.keys(price[0])[0]]['6s_base_price'];

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
            }, color, optionValue, basePrice, brand_name, thumbnail_url, url, itemPrice).then(
                () => this.afterAddToCart()
            );
        }

        if (!insertedSizeStatus) {
            this.setState({ isLoading: true });
            const code = Object.keys(simple_products);

            addProductToCart({
                sku: code[0],
                qty: 1,
                optionId: '',
                optionValue: ''
            }, color, null, basePrice, brand_name, thumbnail_url, url, itemPrice).then(
                () => this.afterAddToCart()
            );
        }
    }

    afterAddToCart() {
        // eslint-disable-next-line no-unused-vars
        const { buttonRefreshTimeout } = this.state;

        this.setState({ isLoading: false });
        // TODO props for addedToCart
        const timeout = 1250;
        this.setState({ addedToCart: true });
        const timer = setTimeout(() => this.setState({ addedToCart: false }), timeout);

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
