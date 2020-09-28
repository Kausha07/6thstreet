/* eslint-disable fp/no-let */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import './PDPAddToCart.style';

class PDPAddToCart extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        onSizeTypeSelect: PropTypes.func.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        sizeObject: PropTypes.object.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        // selectedSize: PropTypes.string.isRequired,
        errorMessage: PropTypes.string.isRequired,
        validation: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderProductColor() {
        const { product } = this.props;
        return (
        <div>
            <span>{ __('Color:') }</span>
            <span>{ product.color }</span>
        </div>
        );
    }

    renderSizeTypeSelect() {
        const { sizeObject, onSizeTypeSelect, validation } = this.props;

        console.log(sizeObject);
        if (sizeObject.sizeTypes !== undefined) {
            if (validation) {
                console.log(sizeObject.sizeTypes);
                const listItems = sizeObject.sizeTypes.map((type) => <option value={ type }>{ type }</option>);
                return (
                <div>
                    <span>{ __('Size:') }</span>
                    <div block="PDPAddToCart" elem="SizeTypeSelector">
                        <select onChange={ onSizeTypeSelect }>
                            { listItems }
                        </select>
                    </div>
                </div>
                );
            }
        }

        return null;
    }

    renderSizeSelect() {
        const {
            product, selectedSizeType, onSizeSelect, errorMessage, sizeObject
        } = this.props;

        if (product.simple_products !== undefined) {
            console.log('*** Available sizes:', product[`size_${selectedSizeType}`]);
            if (product[`size_${selectedSizeType}`].length !== 0) {
                const sizes = product[`size_${selectedSizeType}`];
                const codes = sizeObject.sizeCodes;
                const listItems = [];

                for (let index = 0; index < sizes.length; index++) {
                    const { quantity } = product.simple_products[codes[index]];

                    listItems.push(
                        <option
                          value={ sizes[index] }
                          disabled={ quantity === '0' }
                        >
                            { sizes[index] }
                            { quantity === '0' ? '- Out of stock' : '' }
                            { quantity === '1' ? ' - 1 left in stock' : '' }
                        </option>
                    );
                }

                // TODO Low stock quantity and out of stock - disabled option with string out of stock
                // or dont add such option at all
                // if product is out of stock it will be not visible at plp or I habe o disable/ remove add to cart option for it
                return (
                    <div block="PDPAddToCart" elem="SizeSelector">
                        <select onChange={ onSizeSelect }>
                            <option selected disabled hidden>
                                { __('Please select size') }
                            </option>
                            { listItems }
                        </select>
                        <span>{ errorMessage }</span>
                    </div>
                );
            }
        }

        return null;
    }

    renderAddToCartButton() {
        const { addToCart, isLoading } = this.props;

        return (
            <button onClick={ addToCart } mods={ { isLoading } }>
                { isLoading ? 'Adding...' : 'Add to bag' }
            </button>
        );
    }

    render() {
        return (
            <div block="PDPAddToCart">
                { this.renderProductColor() }
                <div block="PDPAddToCart" elem="SizeSelect">
                    { this.renderSizeTypeSelect() }
                    { this.renderSizeSelect() }
                </div>
                { this.renderAddToCartButton() }
            </div>
        );
    }
}

export default PDPAddToCart;
