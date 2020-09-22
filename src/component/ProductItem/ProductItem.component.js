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

    renderBrand() {
        const { product: { brand_name } } = this.props;

        return <h2 block="ProductItem" elem="Brand">{ brand_name }</h2>;
    }

    renderTitle() {
        const { product: { name } } = this.props;

        return (
            <p block="ProductItem" elem="Title">
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
                { this.renderBrand() }
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
