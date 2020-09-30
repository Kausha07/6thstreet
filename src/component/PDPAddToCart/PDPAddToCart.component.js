import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPSizeGuide from '../PDPSizeGuide';

import './PDPAddToCart.style';

class PDPAddToCart extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        onSizeTypeSelect: PropTypes.func.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        selectedSize: PropTypes.string.isRequired
    };

    renderSizeTypeSelect() {
        const { onSizeTypeSelect, selectedSizeType } = this.props;

        // TODO Get available size types from product, render list
        return (
            <button onClick={ onSizeTypeSelect }>
                { `Size type selector: ${selectedSizeType}` }
            </button>
        );
    }

    renderSizeSelect() {
        const {
            product, selectedSizeType, selectedSize, onSizeSelect
        } = this.props;

        console.log('*** Available sizes:', product[`size_${selectedSizeType}`]);

        // TODO Get available sizes from product, for type, render list
        return (
            <button onClick={ onSizeSelect }>
                { `Size selector: ${selectedSize}` }
            </button>
        );
    }

    renderAddToCartButton() {
        const { addToCart } = this.props;

        return (
            <button onClick={ addToCart }>
                { __('Add to cart') }
            </button>
        );
    }

    renderSizeGuide() {
        return <PDPSizeGuide />;
    }

    render() {
        return (
            <div block="PDPAddToCart">
                { this.renderSizeTypeSelect() }
                { this.renderSizeSelect() }
                { this.renderSizeGuide() }
                { this.renderAddToCartButton() }
            </div>
        );
    }
}

export default PDPAddToCart;
