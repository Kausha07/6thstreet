import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAlsoAvailableProduct from 'Component/PDPAlsoAvailableProduct';

import './PDPAlsoAvailable.style';

class PDPAlsoAvailable extends PureComponent {
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
        const { products = [] } = this.props;

        return products.map(this.renderAvailableProduct);
    }

    render() {
        const { isAlsoAvailable } = this.props;
        return (
            <div block="PDPAlsoAvailable" mods={ { isAlsoAvailable } }>
                <h1 block="PDPAlsoAvailable" elem="Title">{ __('Also available in') }</h1>
                <ul block="PDPAlsoAvailable" elem="List">
                    { this.renderAvailableProducts() }
                </ul>
            </div>
        );
    }
}

export default PDPAlsoAvailable;
