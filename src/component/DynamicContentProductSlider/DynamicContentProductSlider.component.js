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
        products: Products.isRequired,
        language: PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.state = {
            currentPage: 0
        };
    }

    static getDerivedStateFromProps(nextProps) {
        const { language } = nextProps;
        return ({ isArabic: language !== 'en' });
    }

    renderProduct = (product) => {
        const { sku } = product;
        const { isArabic } = this.state;
        const newTag = (
        <div
          mix={ {
              block: 'DynamicContentProductSlider',
              elem: 'TagOverlay',
              mods: { isArabic }
          } }
        >
            New
        </div>
        );

        // TODO: remove if statement and add appropriate query for items with new
        return (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'ProductItem', mods: { isArabic } } }>
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
        const { isArabic } = this.state;
        return (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'FavoriteOverlay', mods: { isArabic } } } />
        );
    }

    renderButtonNext() {
        const {
            isLoading,
            products
        } = this.props;
        const { currentPage, isArabic } = this.state;

        if (isMobile.any()) {
            return null;
        }

        if (isLoading) {
            return null;
        }
        const lastPage = parseInt(Math.floor(products.length / ITEMS_PER_PAGE), 10); // first page is 0
        if (currentPage !== lastPage) {
            return (
                <button
                  onClick={ this.handleClickNext }
                  mix={ {
                      block: 'DynamicContentProductSlider',
                      elem: 'ButtonNext',
                      mods: { isArabic }
                  } }
                >
                    &gt;
                </button>
            );
        }

        return null;
    }

    renderButtonPrev() {
        const { isLoading } = this.props;
        const { currentPage, isArabic } = this.state;

        if (isMobile.any()) {
            return null;
        }

        if (isLoading) {
            return null;
        }
        if (currentPage !== 0) {
            return (
                <button
                  onClick={ this.handleClickPrev }
                  mix={ {
                      block: 'DynamicContentProductSlider',
                      elem: 'ButtonPrev',
                      mods: { isArabic }
                  } }
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
        const {
            currentPage,
            isArabic
        } = this.state;

        if (isLoading) {
            return 'loading...';
        }

        return (
            <Slider
              mix={ { block: 'DynamicContentProductSlider', elem: 'MobileSlider', mods: { isArabic } } }
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
        const { isArabic } = this.state;
        const { products: productArray } = this.props;
        if (productArray.length === 0) {
            return null;
        }
        const products = (
            <div mix={ { block: 'DynamicContentProductSlider', elem: 'ProductContainer', mods: { isArabic } } }>
                { this.renderButtonPrev() }
                { this.renderProductsDesktop() }
                { this.renderButtonNext() }
            </div>
        );

        return (
            <div mix={ { block: 'DynamicContentProductSlider', mods: { isArabic } } }>
                <hr />
                <div mix={ { block: 'DynamicContentProductSlider', elem: 'HeaderContainer', mods: { isArabic } } }>
                    { this.renderTitle() }
                    <span
                      mix={ { block: 'DynamicContentProductSlider', elem: 'SubHeader', mods: { isArabic } } }
                    >
                        Latest trends, new looks, must have... don&apos;t miss it
                    </span>
                </div>
                { isMobile.any() || isMobile.tablet() ? this.renderProductsMobile() : products }
            </div>
        );
    }
}

export default DynamicContentProductSlider;
