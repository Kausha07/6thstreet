// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAddToCart from 'Component/PDPAddToCart/PDPAddToCart.container';
import Price from 'Component/Price';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import './PDPSummary.style';

class PDPSummary extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    renderName() {
        const { product: { name } } = this.props;

        return (
            <h1>{ name }</h1>
        );
    }

    renderPrice() {
        const { product: { price } } = this.props;

        if (!price) {
            return null;
        }

        return (
            <Price price={ price } />
        );
    }

    renderAddToCartSection() {
        return (
            <PDPAddToCart />
        );
    }

    render() {
        return (
            <div block="PDPSummary">
                { this.renderName() }
                { this.renderPrice() }
                { this.renderAddToCartSection() }
            </div>
        );
    }
}

export default PDPSummary;
