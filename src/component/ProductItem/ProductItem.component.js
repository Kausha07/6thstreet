// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Price from 'Component/Price';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import './ProductItem.style';

class ProductItem extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    renderImage() {
        const { product: { thumbnail_url } } = this.props;

        return (
            <Image src={ thumbnail_url } />
        );
    }

    renderTitle() {
        const { product: { name } } = this.props;

        return (
            <p>
                { name }
            </p>
        );
    }

    renderPrice() {
        const { product: { price } } = this.props;

        return (
            <Price price={ price } />
        );
    }

    renderLink() {
        const {
            product,
            product: { url }
        } = this.props;

        const { pathname } = new URL(url);

        const linkTo = {
            pathname,
            state: { product }
        };

        return (
            <Link to={ linkTo }>
                { this.renderImage() }
                { this.renderTitle() }
                { this.renderPrice() }
            </Link>
        );
    }

    render() {
        return (
            <li block="ProductItem">
                { this.renderLink() }
            </li>
        );
    }
}

export default ProductItem;
