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
        insertedSizeStatus: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        addedToCart: PropTypes.bool.isRequired
    };

    getSizeTypeSelect() {
        const { sizeObject } = this.props;

        if (sizeObject.sizeTypes !== undefined) {
            const listItems = sizeObject.sizeTypes.map((type) => (
                    <option
                      key={ type }
                      block="PDPAddToCart"
                      elem="SizeTypeOption"
                      value={ type }
                    >
                        { type.toUpperCase() }
                    </option>
            ));

            return listItems;
        }

        return null;
    }

    getSizeSelect() {
        const {
            product, selectedSizeType, sizeObject
        } = this.props;

        if (product.simple_products !== undefined && product[`size_${selectedSizeType}`].length !== 0) {
            const listItems = sizeObject.sizeCodes.map((code) => (
                <option
                  key={ code }
                  block="PDPAddToCart"
                  elem="SizeOption"
                  value={ code }
                  disabled={ product.simple_products[code].quantity === '0' }
                >
                    { product.simple_products[code].size[selectedSizeType] }
                    { product.simple_products[code].quantity === '0' ? '- Out of stock' : '' }
                    { product.simple_products[code].quantity === '1' ? ' - 1 left in stock' : '' }
                </option>
            ));

            return listItems;
        }

        return null;
    }

    renderSizeInfo() {
        const { sizeObject, insertedSizeStatus } = this.props;

        if (sizeObject.sizeTypes === undefined && !insertedSizeStatus) {
            return null;
        }

        return (
            <div block="PDPAddToCart" elem="SizeInfo">
                <span block="PDPAddToCart" elem="SizeLabel">{ __('Size:') }</span>
                <PDPSizeGuide />
            </div>
        );
    }

    renderSizeTypeSelect() {
        const { onSizeTypeSelect, sizeObject, insertedSizeStatus } = this.props;

        if (sizeObject.sizeTypes === undefined && !insertedSizeStatus) {
            return null;
        }

        return (
            <div block="PDPAddToCart" elem="SizeTypeSelector">
                <select
                  key="SizeTypeSelect"
                  block="PDPAddToCart"
                  elem="SizeTypeSelectElement"
                  onChange={ onSizeTypeSelect }
                >
                    { this.getSizeTypeSelect() }
                </select>
            </div>
        );
    }

    renderSizeSelect() {
        const {
            product, selectedSizeType, onSizeSelect
        } = this.props;

        if (product.simple_products !== undefined && product[`size_${selectedSizeType}`].length !== 0) {
            return (
                    <div block="PDPAddToCart" elem="SizeSelector">
                        <select
                          key="SizeSelect"
                          block="PDPAddToCart"
                          elem="SizeSelectElement"
                          onChange={ onSizeSelect }
                          defaultValue="default"
                        >
                            <option value="default" disabled hidden>
                                { __('Please select size') }
                            </option>
                            { this.getSizeSelect() }
                        </select>
                    </div>
            );
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
              disabled={ isLoading || addedToCart }
            >
                <span>{ __('Add to bag') }</span>
                <span>{ __('Adding...') }</span>
                <span>{ __('Added to bag') }</span>
            </button>
        );
    }

    render() {
        return (
            <div block="PDPAddToCart">
                { this.renderSizeInfo() }
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
