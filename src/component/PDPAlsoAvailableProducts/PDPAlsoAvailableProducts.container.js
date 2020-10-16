import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import Algolia from 'Util/API/provider/Algolia';

import PDPAlsoAvailableProducts from './PDPAlsoAvailableProducts.component';

export class PDPAlsoAvailableProductsContainer extends PureComponent {
    static propTypes = {
        productsAvailable: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        productSku: PropTypes.string.isRequired
    };

    state = {
        products: [],
        isAlsoAvailable: true,
        prevProductsAvailable: []
    };

    // static getDerivedStateFromProps(props, state) {
    //     const { productsAvailable } = props;
    //     const { prevProductsAvailable } = state;

    //     if (prevProductsAvailable !== productsAvailable) {
    //         console.log('here-----------', productsAvailable);
    //         // eslint-disable-next-line react/no-did-update-set-state
    //         // this.getAvailableProducts();
    //         return {
    //             prevProductsAvailable: productsAvailable
    //         };
    //     }
    //     console.log(productsAvailable, prevProductsAvailable);

    //     return null;
    // }

    componentDidMount() {
        this.setState({ products: [] }, this.getAvailableProducts());
    }

    // componentDidUpdate(prevProps) {
    //     const { productsAvailable } = this.props;

    //     // console.log(productsAvailable);
    //     // console.log(prevProps.productsAvailable);

    //     if (prevProps.productsAvailable !== productsAvailable) {
    //         this.setState({ products: [] }, () => this.getAvailableProducts());
    //         // eslint-disable-next-line react/no-did-update-set-state
    //     }
    // }

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
        console.log(this.state);
        return (
            <PDPAlsoAvailableProducts
              { ...this.state }
            />
        );
    }
}

export default withRouter(PDPAlsoAvailableProductsContainer);
