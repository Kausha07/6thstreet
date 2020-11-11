// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ProductItem from 'Component/ProductItem';
import { Products } from 'Util/API/endpoint/Product/Product.type';
import BrowserDatabase from 'Util/BrowserDatabase';
import Event, { EVENT_GTM_IMPRESSIONS_PLP } from 'Util/Event';

import './PLPPage.style';

class PLPPage extends PureComponent {
    static propTypes = {
        products: Products.isRequired,
        impressions: Products.isRequired
    };

    componentDidMount() {
        const { impressions } = this.props;
        const category = this.getCategory();

        Event.dispatch(EVENT_GTM_IMPRESSIONS_PLP, { impressions, category });
    }

    getCategory() {
        return BrowserDatabase.getItem('CATEGORY_NAME') || '';
    }

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
