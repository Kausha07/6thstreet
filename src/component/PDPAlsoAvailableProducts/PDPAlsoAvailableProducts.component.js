import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAlsoAvailableProduct from 'Component/PDPAlsoAvailableProduct';

import './PDPAlsoAvailableProducts.style';

class PDPAlsoAvailableProducts extends PureComponent {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isAlsoAvailable: PropTypes.bool.isRequired
    };

    renderAvailableProduct = (product) => {
        const { sku } = product;

        return (
            <PDPAlsoAvailableProduct
              product={ product }
              key={ sku }
            />
        );
    };

    renderAvailableProducts() {
        const { products } = this.props;

        return products.map(this.renderAvailableProduct);
    }

    render() {
        const { isAlsoAvailable } = this.props;
        return (
            <div block="PDPAlsoAvailableProducts" mods={ { isAlsoAvailable } }>
                <h1 block="PDPAlsoAvailableProducts" elem="Title">{ __('Also available in:') }</h1>
                <div block="PDPAlsoAvailableProducts" elem="List">
                    { this.renderAvailableProducts() }
                </div>
            </div>
        );
    }
}

export default PDPAlsoAvailableProducts;
