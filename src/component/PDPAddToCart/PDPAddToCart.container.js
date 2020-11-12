import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import Event, { EVENT_GTM_PRODUCT_ADD_TO_CART } from 'Util/Event';
import history from 'Util/History';

import PDPAddToCart from './PDPAddToCart.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product
});

var fullCheckoutHide;
var startCheckoutHide;

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
        addToCart: this.addToCart.bind(this),
        routeChangeToCart: this.routeChangeToCart.bind(this)
    };

    state = {
        sizeObject: {},
        selectedSizeType: 'eu',
        selectedSizeCode: '',
        insertedSizeStatus: true,
        isLoading: false,
        addedToCart: false,
        buttonRefreshTimeout: 1250,
        showProceedToCheckout: false,
        hideCheckoutBlock: false,
        clearTime: false
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

    componentDidUpdate(_, prevState) {
        const { addedToCart } = this.state;
        const { addedToCart: prevAddedToCart } = prevState;

        if (addedToCart && (prevAddedToCart !== addedToCart)) {
            this.clearTimeAll();
        }
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
            product: {
                simple_products,
                thumbnail_url,
                url,
                color,
                brand_name,
                price,
                size_uk,
                size_eu,
                size_us,
                name
            }, addProductToCart, showNotification
        } = this.props;

        const {
            selectedSizeType, selectedSizeCode, insertedSizeStatus
        } = this.state;
        const itemPrice = price[0][Object.keys(price[0])[0]]['6s_special_price'];
        const basePrice = price[0][Object.keys(price[0])[0]]['6s_base_price'];

        if ((size_uk.length !== 0 || size_eu.length !== 0 || size_us.length !== 0)
            && selectedSizeCode === '') {
            showNotification('error', __('Please select a size.'));
        }

        if ((size_uk.length !== 0 || size_eu.length !== 0 || size_us.length !== 0)
            && selectedSizeCode !== '') {
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
            ).then(
                () => this.proceedToCheckout()
            );

            Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                product: {
                    brand: brand_name,
                    category: '',
                    id: selectedSizeCode,
                    name,
                    price: itemPrice,
                    quantity: 1,
                    size: optionValue,
                    variant: color
                }
            });
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
            ).then(
                () => this.proceedToCheckout()
            );

            Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                product: {
                    brand: brand_name,
                    category: '',
                    id: code[0],
                    name,
                    price: itemPrice,
                    quantity: 1,
                    size: '',
                    variant: ''
                }
            });
        }
    }

    afterAddToCart() {
        // eslint-disable-next-line no-unused-vars
        const { buttonRefreshTimeout } = this.state;
        this.setState({ isLoading: false });
        // TODO props for addedToCart
        const timeout = 1250;
        this.setState({ addedToCart: true });
        setTimeout(() => this.setState({ addedToCart: false }), timeout);
    }

    clearTimeAll() {
        this.setState({ hideCheckoutBlock: false });

        clearTimeout(fullCheckoutHide);
        clearTimeout(startCheckoutHide);
    }

    proceedToCheckout() {
        this.setState({ showProceedToCheckout: true });

        startCheckoutHide = setTimeout(() => this.setState({ hideCheckoutBlock: true }), 5000);
        fullCheckoutHide = setTimeout(() => this.setState({
            showProceedToCheckout: false,
            hideCheckoutBlock: false
        }), 7000);
    }

    routeChangeToCart() {
        history.push('/cart');
    };

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
