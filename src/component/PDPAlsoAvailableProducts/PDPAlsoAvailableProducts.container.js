import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Algolia from 'Util/API/provider/Algolia';

import PDPAlsoAvailableProducts from './PDPAlsoAvailableProducts.component';

export class PDPAlsoAvailableProductsContainer extends PureComponent {
    static propTypes = {
        productsAvailable: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        products: [],
        isAlsoAvailable: true,
        firstLoad: true
    };

    componentDidMount() {
        const { firstLoad, products = [] } = this.state;

        if (firstLoad && !products.length) {
            this.getAvailableProducts();
        }
    }

    getAvailableProducts() {
        const {
            productsAvailable = []
        } = this.props;

        productsAvailable.map((productID) => this.getAvailableProduct(productID).then((productData) => {
            const { products = [] } = this.state;

            if (productData.nbHits === 1) {
                this.setState({ products: [...products, productData.data] });
            }

            this.setState({ isAlsoAvailable: products.length === 0 });
        }));
    }

    async getAvailableProduct(sku) {
        const product = await new Algolia().getProductBySku({ sku });

        return product;
    }

    render() {
        return (
            <PDPAlsoAvailableProducts
              { ...this.state }
            />
        );
    }
}

export default PDPAlsoAvailableProductsContainer;
