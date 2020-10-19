import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';

import './PDPAlsoAvailableProduct.style';

class PDPAlsoAvailableProduct extends PureComponent {
    static propTypes = {
        product: PropTypes.object.isRequired,
        setIsLoading: PropTypes.func.isRequired
    };

    renderImage() {
        const { product: { thumbnail_url } } = this.props;

        return (
            <Image src={ thumbnail_url } />
        );
    }

    renderColor() {
        const { product: { color } } = this.props;

        return (
            <p block="ProductItem" elem="Title">
                { color }
            </p>
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
        return (
            <li block="PDPAlsoAvailableProduct">
                { this.renderLink() }
            </li>
        );
    }
}

export default PDPAlsoAvailableProduct;
