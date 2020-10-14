import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Algolia from 'Util/API/provider/Algolia';

import PDPAlsoAvailableProducts from './PDPAlsoAvailableProducts.component';

export class PDPAlsoAvailableProductsContainer extends PureComponent {
    static propTypes = {
        productsAvailable: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired
    };

    state = {
        products: [],
        isAlsoAvailable: true
    };

    componentDidMount() {
        this.getAvailableProducts();
    }

    componentDidUpdate(prevProps) {
        const { productsAvailable } = this.props;

        if (prevProps.productsAvailable !== productsAvailable) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.getAvailableProducts();
        }
    }

    getAvailableProducts() {
        this.setState({ products: [] }, () => {
            const {
                productsAvailable
            } = this.props;

            productsAvailable.map((productID) => this.getAvailableProduct(productID).then((productData) => {
                const { products } = this.state;
                if (productData.nbHits !== 0) {
                    this.setState({ products: [...products, productData.data] });
                }
                this.setState({ isAlsoAvailable: products.length === 0 });
            }));
        });
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

export default withRouter(PDPAlsoAvailableProductsContainer);
