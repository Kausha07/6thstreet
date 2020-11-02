// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ProductItem from 'Component/ProductItem';
import { Products } from 'Util/API/endpoint/Product/Product.type';

import './PLPPage.style';

class PLPPage extends PureComponent {
    static propTypes = {
        products: Products.isRequired
    };

    renderProduct = (product) => {
        const { sku } = product;

        return (
            <ProductItem
              product={ product }
              key={ sku }
              page="plp"
            />
        );
    };

    renderProducts() {
        const { products } = this.props;
        return products.map(this.renderProduct);
    }

    render() {
        return (
            <div block="PLPPage">
                { this.renderProducts() }
            </div>
        );
    }
}

export default PLPPage;
