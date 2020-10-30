import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Price from 'Component/Price';
import ProductLabel from 'Component/ProductLabel/ProductLabel.component';
import WishlistIcon from 'Component/WishlistIcon';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './ProductItem.style';

class ProductItem extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        page: PropTypes.string
    };

    static defaultProps = {
        page: ''
    };

    state = {
        isArabic: isArabic()
    };

    renderWishlistIcon() {
        const { product: { sku } } = this.props;

        return <WishlistIcon sku={ sku } />;
    }

    renderLabel() {
        const { product } = this.props;
        return <ProductLabel product={ product } />;
    }

    renderExclusive() {
        const { product: { promotion } } = this.props;

        if (promotion !== undefined) {
            return promotion !== null
                ? <span block="PLPSummary" elem="Exclusive">{ promotion }</span>
                : null;
        }

        return null;
    }

    renderImage() {
        const { product: { thumbnail_url } } = this.props;

        return (
            <div>
                <Image src={ thumbnail_url } />
                { this.renderExclusive() }
            </div>
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
        const { product: { price }, page } = this.props;

        return (
            <Price price={ price } page={ page } />
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
        const {
            isArabic
        } = this.state;

        return (
            <li block="ProductItem" mods={ { isArabic } }>
                { this.renderLabel() }
                { this.renderWishlistIcon() }
                { this.renderLink() }
            </li>
        );
    }
}

export default ProductItem;
