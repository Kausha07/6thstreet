/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { DEFAULT_MAX_PRODUCTS } from 'Component/ProductActions/ProductActions.config';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { CartItemType } from 'Type/MiniCart';
import { makeCancelable } from 'Util/Promise';

import CartItem from './CartItem.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const mapDispatchToProps = (dispatch) => ({
    addProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addProductToCart(dispatch, options)
    ),
    updateProductInCart: (
        item_id, quantity, color, optionValue, discount, brand_name, thumbnail_url, url, row_total
    ) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.updateProductInCart(
            dispatch,
            item_id,
            quantity,
            color,
            optionValue,
            discount,
            brand_name,
            thumbnail_url,
            url,
            row_total
        )
    ),
    removeProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeProductFromCart(dispatch, options)
    ),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class CartItemContainer extends PureComponent {
    static propTypes = {
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        brand_name: PropTypes.string.isRequired,
        updateProductInCart: PropTypes.func.isRequired,
        removeProduct: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired
    };

    state = { isLoading: false };

    handlers = [];

    setStateNotLoading = this.setStateNotLoading.bind(this);

    containerFunctions = {
        handleChangeQuantity: this.handleChangeQuantity.bind(this),
        handleRemoveItem: this.handleRemoveItem.bind(this),
        getCurrentProduct: this.getCurrentProduct.bind(this)
    };

    componentWillUnmount() {
        if (this.handlers.length) {
            [].forEach.call(this.handlers, (cancelablePromise) => cancelablePromise.cancel());
        }
    }

    /**
     * @returns {Product}
     */
    getCurrentProduct() {
        const { item: { product } } = this.props;
        return product;
    }

    getMinQuantity() {
        const { stock_item: { min_sale_qty } = {} } = this.getCurrentProduct() || {};
        return min_sale_qty || 1;
    }

    getMaxQuantity() {
        const { stock_item: { max_sale_qty } = {} } = this.getCurrentProduct() || {};
        return max_sale_qty || DEFAULT_MAX_PRODUCTS;
    }

    setStateNotLoading() {
        this.setState({ isLoading: false });
    }

    containerProps = () => ({
        thumbnail: this._getProductThumbnail(),
        minSaleQuantity: this.getMinQuantity(),
        maxSaleQuantity: this.getMaxQuantity()
    });

    /**
     * Handle item quantity change. Check that value is <1
     * @param {Number} value new quantity
     * @return {void}
     */
    handleChangeQuantity(quantity) {
        this.setState({ isLoading: true }, () => {
            const {
                updateProductInCart,
                item: {
                    item_id,
                    color,
                    optionValue,
                    product: { url, thumbnail },
                    brand_name,
                    basePrice,
                    row_total
                }
            } = this.props;

            this.hideLoaderAfterPromise(updateProductInCart(
                item_id,
                quantity,
                color,
                optionValue,
                basePrice,
                brand_name,
                thumbnail.url,
                url,
                row_total
            ));
        });
    }

    /**
     * @return {void}
     */
    handleRemoveItem() {
        this.setState({ isLoading: true }, () => {
            const { removeProduct, item: { item_id } } = this.props;
            this.hideLoaderAfterPromise(removeProduct(item_id));
        });
    }

    /**
     * @param {Promise}
     * @returns {cancelablePromise}
     */
    registerCancelablePromise(promise) {
        const cancelablePromise = makeCancelable(promise);
        this.handlers.push(cancelablePromise);
        return cancelablePromise;
    }

    /**
     * @param {Promise} promise
     * @returns {void}
     */
    hideLoaderAfterPromise(promise) {
        this.registerCancelablePromise(promise)
            .promise.then(this.setStateNotLoading, this.setStateNotLoading);
    }

    /**
     * @returns {Int}
     */
    _getVariantIndex() {
        const {
            item: {
                sku: itemSku,
                product: { variants = [] } = {}
            }
        } = this.props;

        return variants.findIndex(({ sku }) => sku === itemSku || itemSku.includes(sku));
    }

    /**
     * Get link to product page
     * @param url_key Url to product
     * @return {{pathname: String, state Object}} Pathname and product state
     */

    _getProductThumbnail() {
        const product = this.getCurrentProduct();
        const { thumbnail: { url: thumbnail } = {} } = product;
        return thumbnail || '';
    }

    render() {
        return (
            <CartItem
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(CartItemContainer);
