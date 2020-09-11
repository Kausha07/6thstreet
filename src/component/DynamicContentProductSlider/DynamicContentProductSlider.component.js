import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import ProductItem from 'Component/ProductItem';
import { Products } from 'Util/API/endpoint/Product/Product.type';

import './DynamicContentProductSlider.style';

class DynamicContentProductSlider extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        data_url: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        products: Products.isRequired
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

    renderProducts() {
        const {
            isLoading,
            products
        } = this.props;

        if (isLoading) {
            return 'loading...';
        }

        return products.map(this.renderProduct);
    }

    renderTitle() {
        const { title } = this.props;

        return (
            <h4>{ title }</h4>
        );
    }

    renderCTA() {
        const { data_url } = this.props;

        return (
            <Link to={ data_url }>
                See All
            </Link>
        );
    }

    render() {
        return (
            <div block="DynamicContentProductSlider">
                { this.renderTitle() }
                { this.renderProducts() }
                { this.renderCTA() }
            </div>
        );
    }
}

export default DynamicContentProductSlider;
