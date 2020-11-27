/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAddToCart from 'Component/PDPAddToCart/PDPAddToCart.container';
import PDPAlsoAvailableProducts from 'Component/PDPAlsoAvailableProducts';
import Price from 'Component/Price';
import ProductLabel from 'Component/ProductLabel/ProductLabel.component';
import TabbyMiniPopup from 'Component/TabbyMiniPopup';
import { TABBY_TOOLTIP_PDP } from 'Component/TabbyMiniPopup/TabbyMiniPopup.config';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';
import { SPECIAL_COLORS, translateArabicColor } from 'Util/Common';

import tabby from './icons/tabby.svg';

import './PDPSummary.style';

class PDPSummary extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        alsoAvailable: [],
        prevAlsoAvailable: [],
        showPopup: false
    };

    static getDerivedStateFromProps(props, state) {
        const { product } = props;

        const { alsoAvailable, prevAlsoAvailable } = state;

        if (prevAlsoAvailable !== product['6s_also_available']) {
            return {
                alsoAvailable: product['6s_also_available'],
                prevAlsoAvailable: alsoAvailable !== undefined ? alsoAvailable : null
            };
        }

        return null;
    }

    renderSummaryHeader() {
        const { product } = this.props;

        return (
            <div block="PDPSummary" elem="Header">
                <div block="PDPSummary" elem="HeaderNew">
                    <ProductLabel
                      product={ product }
                    />
                </div>
            </div>
        );
    }

    renderBrand() {
        const { product: { brand_name } } = this.props;

        return (
            <h1>{ brand_name }</h1>
        );
    }

    renderName() {
        const { product: { name, alternate_name } } = this.props;

        if (isArabic()) {
            return <p>{ alternate_name }</p>;
        }

        return (
            <p block="PDPSummary" elem="Name">{ name }</p>
        );
    }

    renderPrice() {
        const { product: { price, stock_qty } } = this.props;

        if (!price || stock_qty === 0) {
            return null;
        }

        return (
            <Price price={ price } />
        );
    }

    renderTabby() {
        const { product: { price } } = this.props;
        if (price) {
            const priceObj = Array.isArray(price) ? price[0] : price;
            const [currency, priceData] = Object.entries(priceObj)[0];
            const { country } = JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data;
            const { default: defPrice } = priceData;

            if (country === 'AE' && defPrice >= 150) {
                const monthPrice = (defPrice / 4).toFixed(2);
                return (
                    <button
                      block="PDPSummary"
                      elem="Tabby"
                      onClick={ this.openTabbyPopup }
                    >
                        { __('From') }
                        <strong block="PDPSummary" elem="TabbyPrice">{ `${monthPrice} ${currency}` }</strong>
                        { __(' a month with ') }
                        <img src={ tabby } alt="tabby" />
                        <span block="PDPSummary" elem="LearnMore">{ __('Learn more') }</span>
                    </button>
                );
            }

            return null;
        }

        return null;
    }

    openTabbyPopup = () => {
        this.setState({ showPopup: true });
    };

    closeTabbyPopup = () => {
        this.setState({ showPopup: false });
    };

    renderTabbyPopup = () => {
        const { showPopup } = this.state;

        if (!showPopup) {
            return null;
        }

        return <TabbyMiniPopup content={ TABBY_TOOLTIP_PDP } closeTabbyPopup={ this.closeTabbyPopup } />;
    };

    renderColors() {
        const { product: { color = '', stock_qty } } = this.props;

        if (stock_qty === 0) {
            return null;
        }

        if (!color) {
            return <div block="PDPSummary" elem="ProductColorBlock" />;
        }

        if (Array.isArray(color)) {
            return (
            <div
              block="PDPSummary"
              elem="ProductColorBlock"
            >
                <strong>{ __('Color:') }</strong>
                { color.map((col) => this.renderColor(col)) }
            </div>
            );
        }

        return (
            <div
              block="PDPSummary"
              elem="ProductColorBlock"
            >
                <strong>{ __('Color:') }</strong>
                { this.renderColor(color) }
            </div>
        );
    }

    renderColor(color) {
        const engColor = isArabic() ? translateArabicColor(color) : color;
        const fixedColor = engColor.toLowerCase().replace(/ /g, '_');
        const prodColor = SPECIAL_COLORS[fixedColor] ? SPECIAL_COLORS[fixedColor] : fixedColor;

        return (
            <>
                <span
                  block="PDPSummary"
                  elem="ProductColor"
                  style={ { backgroundColor: prodColor } }
                />
                { color }
            </>
        );
    }

    renderAddToCartSection() {
        return (
            <PDPAddToCart />
        );
    }

    renderAvailableItemsSection() {
        const { product: { sku }, isLoading } = this.props;
        const { alsoAvailable } = this.state;

        if (alsoAvailable) {
            if (alsoAvailable.length > 0 && !isLoading) {
                return (
                    <PDPAlsoAvailableProducts productsAvailable={ alsoAvailable } productSku={ sku } />
                );
            }
        }

        return null;
    }

    render() {
        return (
            <div block="PDPSummary">
                { this.renderSummaryHeader() }
                { this.renderBrand() }
                { this.renderName() }
                { this.renderPrice() }
                { this.renderTabby() }
                { this.renderColors() }
                { this.renderAddToCartSection() }
                { this.renderAvailableItemsSection() }
                { this.renderTabbyPopup() }
            </div>
        );
    }
}

export default PDPSummary;
