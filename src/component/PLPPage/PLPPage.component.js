// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ProductItem from 'Component/ProductItem';
import { Products } from 'Util/API/endpoint/Product/Product.type';

import './PLPPage.style';

class PLPPage extends PureComponent {
    static propTypes = {
        page: Products.isRequired
    };

    renderProduct = (product) => {
        const { sku } = product;

        return (
            <ProductItem
              product={ product }
              key={ sku }
            />
        );
    };

    renderPage() {
        const { page } = this.props;
        return page.map(this.renderProduct);
    }

    render() {
        return (
            <div block="PLPPage">
                { this.renderPage() }
            </div>
        );
    }
}

export default PLPPage;
