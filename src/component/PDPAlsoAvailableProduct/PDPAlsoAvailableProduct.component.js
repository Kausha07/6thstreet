import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import WishlistIcon from 'Component/WishlistIcon';

import './PDPAlsoAvailableProduct.style';

class PDPAlsoAvailableProduct extends PureComponent {
    static propTypes = {
        product: PropTypes.object.isRequired,
        setIsLoading: PropTypes.func.isRequired
    };

    renderImage() {
        const { product: { thumbnail_url } } = this.props;

        return (
            <Image src={ thumbnail_url } elem="Image" />
        );
    }

    renderColor() {
        const { product: { color } } = this.props;

        return (
            <h5 block="ProductItem" elem="Title">
                { color }
            </h5>
        );
    }

    alsoAvailableClick = () => {
        const { setIsLoading } = this.props;

        setIsLoading(true);
    };

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
            <Link to={ linkTo } onClick={ this.alsoAvailableClick }>
                { this.renderImage() }
                { this.renderColor() }
            </Link>
        );
    }

    render() {
        const {
            product: { sku }
        } = this.props;

        return (     
            <li block="PDPAlsoAvailableProduct">
                <WishlistIcon sku={ sku } />
                { this.renderLink() }
            </li>
        );
    }
}

export default PDPAlsoAvailableProduct;
