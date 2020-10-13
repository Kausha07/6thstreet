import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Algolia from 'Util/API/provider/Algolia';

import PDPAlsoAvailableProducts from './PDPAlsoAvailableProducts.component';

export const mapStateToProps = (_state) => ({
});

export const mapDispatchToProps = (_dispatch) => ({
});

export class PDPAlsoAvailableProductsContainer extends PureComponent {
    static propTypes = {
        productsAvailable: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        products: []
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    componentDidMount() {
        const {
            productsAvailable
        } = this.props;

        productsAvailable.map((productID) => this.getAvailableProduct(productID).then((productData) => {
            const { products } = this.state;
            this.setState({ products: [...products, productData.data] });
        }));
    }

    async getAvailableProduct(productID) {
        const product = await Algolia.getPDP({ id: productID });
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

export default connect(mapStateToProps, mapDispatchToProps)(PDPAlsoAvailableProductsContainer);
