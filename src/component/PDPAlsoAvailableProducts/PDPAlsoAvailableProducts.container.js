import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Algolia from 'Util/API/provider/Algolia';

import PDPAlsoAvailableProducts from './PDPAlsoAvailableProducts.component';

export const mapStateToProps = (_state) => ({
});

export const mapDispatchToProps = (_dispatch) => ({
});

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

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    componentDidMount() {
        this.getAvailableProducts();
    }

    componentDidUpdate(prevProps) {
        const { productsAvailable } = this.props;

        console.log(prevProps.productsAvailable, productsAvailable);

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

    async getAvailableProduct(productID) {
        const product = await Algolia.getProductBySku({ id: productID });
        return product;
    }

    containerProps = () => {
    };

    render() {
        return (
            <PDPAlsoAvailableProducts
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PDPAlsoAvailableProductsContainer));
