import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPSizeGuide from '../PDPSizeGuide';

import './PDPAddToCart.style';
import './NotificationList.extended.style.scss';

class PDPAddToCart extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        onSizeTypeSelect: PropTypes.func.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        sizeObject: PropTypes.object.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        errorMessage: PropTypes.string.isRequired,
        insertedSizeStatus: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        addedToCart: PropTypes.bool.isRequired
    };

    renderSizeTypeSelect() {
        const { sizeObject, onSizeTypeSelect, insertedSizeStatus } = this.props;

        if (sizeObject.sizeTypes !== undefined) {
            if (insertedSizeStatus) {
                const listItems = sizeObject.sizeTypes.map((type) => (
                    <option
                      block="PDPAddToCart"
                      elem="SizeTypeOption"
                      value={ type }
                    >
                        { type.toUpperCase() }
                    </option>
                ));

                return (
                <div>
                    <span block="PDPAddToCart" elem="SizeLabel">{ __('Size:') }</span>
                    <div block="PDPAddToCart" elem="SizeTypeSelector">
                        <select block="PDPAddToCart" elem="SizeTypeSelectElement" onChange={ onSizeTypeSelect }>
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
            if (product[`size_${selectedSizeType}`].length !== 0) {
                const sizes = product[`size_${selectedSizeType}`];
                const codes = sizeObject.sizeCodes;
                const listItems = [];

                // eslint-disable-next-line fp/no-let
                for (let index = 0; index < sizes.length; index++) {
                    const { quantity } = product.simple_products[codes[index]];

                    listItems.push(
                        <option
                          block="PDPAddToCart"
                          elem="SizeOption"
                          value={ codes[index] }
                          disabled={ quantity === '0' }
                        >
                            { product.simple_products[codes[index]].size[selectedSizeType] }
                            { quantity === '0' ? '- Out of stock' : '' }
                            { quantity === '1' ? ' - 1 left in stock' : '' }
                        </option>
                    );
                }

                return (
                    <div block="PDPAddToCart" elem="SizeSelector">
                        <select block="PDPAddToCart" elem="SizeSelectElement" onChange={ onSizeSelect }>
                            <option selected disabled hidden>
                                { __('Please select size') }
                            </option>
                            { listItems }
                        </select>
                        <span block="PDPAddToCart" elem="EmptySizeError">{ errorMessage }</span>
                    </div>
                );
            }
        }

        return null;
    }

    renderAddToCartButton() {
        const { addToCart, isLoading, addedToCart } = this.props;

        return (
            <button
              onClick={ addToCart }
              block="PDPAddToCart"
              elem="AddToCartButton"
              mods={ { isLoading } }
              mix={ {
                  block: 'PDPAddToCart',
                  elem: 'AddToCartButton',
                  mods: { addedToCart }
              } }
              disabled={ isLoading }
            >
                <span>{ __('Add to bag') }</span>
                <span>{ __('Adding...') }</span>
                <span>{ __('Added to bag') }</span>
            </button>
        );
    }

    renderSizeGuide() {
        return <PDPSizeGuide />;
    }

    render() {
        return (
            <div block="PDPAddToCart">
                <div block="PDPAddToCart" elem="SizeSelect">
                    { this.renderSizeTypeSelect() }
                    { this.renderSizeSelect() }
                    { this.renderSizeGuide() }
                </div>
                { this.renderAddToCartButton() }
            </div>
        );
    }
}

export default PDPAddToCart;
