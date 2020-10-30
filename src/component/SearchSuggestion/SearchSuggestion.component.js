import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import Loader from 'Component/Loader';
import { Products } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './SearchSuggestion.style';

class SearchSuggestion extends PureComponent {
    static propTypes = {
        inNothingFound: PropTypes.bool.isRequired,
        isEmpty: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        products: Products.isRequired,
        brands: PropTypes.array.isRequired,
        trendingBrands: PropTypes.array.isRequired,
        trendingTags: PropTypes.array.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    renderBrand = (brand) => {
        const { brand_name, count } = brand;

        return (
            <li>
                <Link to={ `/brands/${ brand_name }` }>
                    { brand_name }
                    <span>{ count }</span>
                </Link>
            </li>
        );
    };

    renderBrands() {
        const { brands } = this.props;

        return (
            <div>
                <h2>{ __('Brands') }</h2>
                <ul>
                    { brands.map(this.renderBrand) }
                </ul>
            </div>
        );
    }

    renderProduct = (product) => {
        const { url, name } = product;

        return (
            <li>
                <Link to={ url }>
                    { name }
                </Link>
            </li>
        );
    };

    renderProducts() {
        const { products } = this.props;

        return (
            <div>
                <h2>{ __('Recommended') }</h2>
                <ul>
                    { products.map(this.renderProduct) }
                </ul>
            </div>
        );
    }

    renderSuggestions() {
        return (
            <>
                { this.renderBrands() }
                { this.renderProducts() }
            </>
        );
    }

    renderNothingFound() {
        return 'Nothing found';
    }

    renderTrendingBrand = ({ label, image_url }) => (
        <li>
            <Link to={ `/brands/${ label }` }>
                <div block="SearchSuggestion" elem="TrandingImg">
                    <img src={ image_url } alt="Trending" />
                    { label }
                </div>
            </Link>
        </li>
    );

    renderTrendingBrands() {
        const { trendingBrands } = this.props;

        return (
            <div block="TrandingBrands">
            <h2>{ __('Tranding brands') }</h2>
            <ul>
                { trendingBrands.map(this.renderTrendingBrand) }
            </ul>
            </div>
        );
    }

    renderTrendingTag = ({ link, label }) => (
        <li>
            <Link to={ { pathname: link } }>
                <div block="SearchSuggestion" elem="TrandingTag">
                { label }
                </div>
            </Link>
        </li>
    );

    renderTrendingTags() {
        const { trendingTags } = this.props;

        return (
            <div block="TrandingTags">
                <h2>{ __('Tranding tags') }</h2>
            <ul>
                { trendingTags.map(this.renderTrendingTag) }
            </ul>
            </div>
        );
    }

    renderEmptySearch() {
        return (
            <>
                { this.renderTrendingBrands() }
                { this.renderTrendingTags() }
            </>
        );
    }

    renderContent() {
        const {
            isActive,
            isEmpty,
            inNothingFound
        } = this.props;

        if (!isActive) {
            return null;
        }

        if (isEmpty && isActive) {
            return this.renderEmptySearch();
        }

        if (inNothingFound) {
            return this.renderNothingFound();
        }

        return this.renderSuggestions();
    }

    render() {
        const { isArabic } = this.state;
        return (
            <div block="SearchSuggestion" mods={ { isArabic } }>
                { this.renderLoader() }
                aaa
            </div>
        );
    }
}

export default SearchSuggestion;
