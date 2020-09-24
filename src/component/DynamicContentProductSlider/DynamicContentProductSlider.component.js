import Slider from '@scandipwa/scandipwa/src/component/Slider';
import isMobile from '@scandipwa/scandipwa/src/util/Mobile/isMobile';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ProductItem from 'Component/ProductItem';
import { Products } from 'Util/API/endpoint/Product/Product.type';

import { ITEMS_PER_PAGE } from './DynamicContentProductSlider.config';

import './DynamicContentProductSlider.style';

class DynamicContentProductSlider extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        products: Products.isRequired
    };

    constructor() {
        super();
        this.state = { currentPage: 0 };
    }

    renderProduct = (product) => {
        const { sku } = product;
        const newTag = <div mix={ { block: 'DynamicContentProductSlider', elem: 'TagOverlay' } }>New</div>;

        // TODO: remove if statement and add appropriate query for items with new
        return (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'ProductItem' } }>
                <ProductItem
                  product={ product }
                  key={ sku }
                />
                { 1 ? newTag : null }
                { this.renderCTA() }
            </div>
        );
    };

    renderProductsDesktop() {
        const {
            isLoading,
            products
        } = this.props;
        const { currentPage } = this.state;

        if (isLoading) {
            return 'loading...';
        }
        const productArray = products.map(this.renderProduct);
        const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
        const lastPageItemCount = products.length % ITEMS_PER_PAGE; // number of products on last page'
        console.log(productArray.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE));
        if (currentPage !== lastPage) {
            return productArray.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
        }

        return productArray.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + lastPageItemCount);
    }

    renderTitle() {
        const { title } = this.props;

        return (
            <h2 mix={ { block: 'DynamicContentProductSlider', elem: 'Header' } }>{ title }</h2>
        );
    }

    renderCTA() {
        return (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'FavoriteOverlay' } } />
        );
    }

    renderButtonNext() {
        const {
            isLoading,
            products
        } = this.props;
        const { currentPage } = this.state;

        if (isLoading) {
            return null;
        }
        const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
        if (currentPage !== lastPage) {
            return (
                <button
                  onClick={ this.handleClickNext }
                  block="DynamicContentProductSlider"
                  elem="ButtonNext primary"
                >
                    &gt;
                </button>
            );
        }

        return null;
    }

    renderButtonPrev() {
        const { isLoading } = this.props;
        const { currentPage } = this.state;

        if (isLoading) {
            return null;
        }
        if (currentPage !== 0) {
            return (
                <button
                  onClick={ this.handleClickPrev }
                  block="DynamicContentProductSlider"
                  elem="ButtonPrev primary"
                >
                    &lt;
                </button>
            );
        }

        return null;
    }

    handleClickNext = () => {
        const { currentPage } = this.state;
        this.setState({ currentPage: currentPage + 1 });
    };

    handleClickPrev = () => {
        const { currentPage } = this.state;
        this.setState({ currentPage: currentPage - 1 });
    };

    renderProductsMobile() {
        const {
            isLoading,
            products
        } = this.props;
        const { currentPage } = this.state;

        if (isLoading) {
            return 'loading...';
        }

        return (
            <Slider
              mix={ { block: 'DynamicContentProductSlider', elem: 'MobileSlider' } }
              activeImage={ currentPage }
              onActiveImageChange={ this.mobileSliderCallback }
            >
                { products.map(this.renderProduct) }
            </Slider>
        );
    }

    mobileSliderCallback = (newPage) => {
        this.setState({ currentPage: newPage });
    };

    render() {
        const products = (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'ProductContainer' } }>
                { this.renderButtonPrev() }
                { this.renderProductsDesktop() }
                { this.renderButtonNext() }
            </div>
        );

        return (
            <div block="DynamicContentProductSlider">
                <hr />
                <div mix={ { block: 'DynamicContentProductSlider', elem: 'HeaderContainer' } }>
                    { this.renderTitle() }
                    <span
                      mix={ { block: 'DynamicContentProductSlider', elem: 'SubHeader' } }
                    >
                        Latest trends, new looks, must have... don&apos;t miss it
                    </span>
                </div>
                { isMobile.any() ? this.renderProductsMobile() : products }
            </div>
        );
    }
}

export default DynamicContentProductSlider;
