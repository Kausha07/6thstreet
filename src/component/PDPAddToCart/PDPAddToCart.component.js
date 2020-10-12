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

    renderSizeAndOnQunatityBasedMessage(code) {
        const {
            product: { simple_products }, selectedSizeType
        } = this.props;

        const size = simple_products[code].size[selectedSizeType];

        switch (simple_products[code].quantity) {
        case '0':
            return (`${size} - Out of stock`);
        case '1':
            return (`${size} - 1 left in stock`);
        case '2' || '3':
            return (`${size} - low stock`);
        default:
            return size;
        }
    }

    getSizeSelect() {
        const {
            product: { simple_products }, product, selectedSizeType, sizeObject
        } = this.props;

        if (sizeObject.sizeCodes !== undefined
            && simple_products !== undefined
            && product[`size_${selectedSizeType}`].length !== 0) {
            const listItems = sizeObject.sizeCodes.map((code) => (
                <option
                  key={ code }
                  block="PDPAddToCart"
                  elem="SizeOption"
                  value={ code }
                  disabled={ simple_products[code].quantity === '0' }
                >
                    { this.renderSizeAndOnQunatityBasedMessage(code) }
                </option>
            ));

            return listItems;
        }

        return null;
    }

    renderSizeInfo() {
        const { sizeObject } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
            return (
                <div block="PDPAddToCart" elem="SizeInfo">
                    <span block="PDPAddToCart" elem="SizeLabel">{ __('Size:') }</span>
                    <PDPSizeGuide />
                </div>
            );
        }

        return null;
    }

    renderSizeTypeSelect() {
        const {
            onSizeTypeSelect, sizeObject
        } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
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

        return null;
    }

    renderSizeSelect() {
        const {
            onSizeSelect, sizeObject
        } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
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

    checkStateForButtonDisabling() {
        const {
            isLoading,
            addedToCart,
            product: { stock_qty, highlighted_attributes },
            product
        } = this.props;

        if (isLoading
            || addedToCart
            || stock_qty === 0
            || highlighted_attributes === null
            || (Object.keys(product).length === 0
            && product.constructor === Object)) {
            return true;
        }

        return false;
    }

    renderAddToCartButton() {
        const {
            addToCart, isLoading, addedToCart
        } = this.props;

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
              disabled={ this.checkStateForButtonDisabling() }
            >
                <span>{ __('Add to bag') }</span>
                <span>{ __('Adding...') }</span>
                <span>{ __('Added to bag') }</span>
            </button>
        );
    }

    renderPickUpButton() {
        return (
            <button
              block="PDPAddToCart"
              elem="PickUpButton"
              mix={ { block: 'button secondary' } }
            >
                <span>{ __('pick up in store') }</span>
                <div block="PDPSummary" elem="shopSvg" />
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
                <div block="PDPAddToCart" elem="Bottom">
                    { this.renderAddToCartButton() }
                    { this.renderPickUpButton() }
                </div>
            </div>
        );
    }
}

export default PDPAddToCart;
