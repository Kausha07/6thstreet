/* eslint-disable */
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
        sizeTypes: PropTypes.array.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        selectedSize: PropTypes.string.isRequired,
        errorMessage: PropTypes.string.isRequired,
        validation: PropTypes.bool.isRequired
    };

    renderSizeTypeSelect() {
        const { sizeTypes, onSizeTypeSelect, product, validation } = this.props;

        
        console.log(validation);
        
        if (product[`size_uk`] !== undefined ){

        if(validation) {
            const listItems = sizeTypes.map((type) =>   <option value={type}>{type}</option>  );
            return (
                <div>
                    <select onChange={onSizeTypeSelect}>
                    { listItems }
                    </select>
                </div>
            );
        }
    }
        return null;
    }

    renderSizeSelect() {
        const {
            product, selectedSizeType, onSizeSelect, errorMessage
        } = this.props;

        if (product[`size_${selectedSizeType}`] !== undefined ){
        const sizes = product[`size_${selectedSizeType}`];
        const quantity = Object.keys(product.simple_products);
        console.log(quantity);

        const listItems = sizes.map((size) => <option value={size}>{size}</option>  );

        console.log('*** Available sizes:', product[`size_${selectedSizeType}`].length);
        if(product[`size_${selectedSizeType}`].length !== 0) {
        return (
            <>
            <select onChange={onSizeSelect}>
                <option selected disabled hidden>{ __('Please select size') }</option>
                { listItems }
            </select>
            <span>{ errorMessage }</span>
            </>
        );
        }
    }
        return null;
    }

    renderAddToCartButton() {
        const { addToCart } = this.props;

        return (
            <button onClick={ addToCart }>
                { __('Add to bag') }
            </button>
        );
    }

    render() {
        return (
            <div block="PDPAddToCart">
                { this.renderSizeTypeSelect() }
                { this.renderSizeSelect() }
                { this.renderAddToCartButton() }
            </div>
        );
    }
}

export default PDPAddToCart;
