import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import noProduct from './icons/no_product.png';

import './EmptySearch.style';

class EmptySearch extends PureComponent {
    static propTypes = {
        query: PropTypes.string.isRequired
    };

    renderSearchQuery() {
        const { query } = this.props;

        return (
        <div block="EmptySearch" elem="SearchQuery">
            { __('You search for: ') }
            <span>{ query }</span>
        </div>
        );
    }

    renderStaticContent() {
        return (
        <div block="EmptySearch" elem="StaticContent">
            <img src={ noProduct } alt="no product" />
            <p block="EmptySearch" elem="Sorry">
                { __("Sorry, we couldn't find any Product!") }
            </p>
            <p block="EmptySearch" elem="Check">
                { __('Please check the spelling or try searching something else') }
            </p>
        </div>
        );
    }

    render() {
        return (
            <div block="EmptySearch">
                { this.renderSearchQuery() }
                { this.renderStaticContent() }
            </div>
        );
    }
}

export default EmptySearch;
