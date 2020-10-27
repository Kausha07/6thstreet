import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAddToCart from 'Component/PDPAddToCart/PDPAddToCart.container';
import PDPAlsoAvailableProducts from 'Component/PDPAlsoAvailableProducts';
import Price from 'Component/Price';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './PDPSummary.style';

class PDPSummary extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        alsoAvailable: [],
        prevAlsoAvailable: []
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

    renderNew() {
        const { product: { in_new_in } } = this.props;
        if (!in_new_in) {
            return (
                <>
                    <span block="PDPSummary" elem="New">NEW</span>
                    { ' ' }
                    <span block="PDPSummary" elem="Exclusive"> - Exclusive</span>
                </>
            );
        }

        return <p block="PDPSummary" elem="New" />;
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
            <p>{ name }</p>
        );
    }

    renderPrice() {
        const { product: { price } } = this.props;

        if (!price) {
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

            console.log('currency', currency);
            console.log('pricedata', priceData);
            console.log('country', country);

            return (
                <div
                  block="PDPSummary"
                  elem="Tabby"
                >
                    { __('From ') }
                 <span block="PDPSummary" elem="Tabby">{ `${defPrice} ${currency}` }</span>
                </div>
            );
        }

        return null;
    }

    renderColor() {
        const { product: { color } } = this.props;

        return (
            <div
              block="PDPSummary"
              elem="ProductColorBlock"
            >
                <strong>Color:</strong>
                <span
                  block="PDPSummary"
                  elem="ProductColor"
                  style={ { backgroundColor: color } }
                />
                { color }
            </div>
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
                { this.renderBrand() }
                { this.renderName() }
                { this.renderPrice() }
                { this.renderTabby() }
                { this.renderColor() }
                { this.renderAddToCartSection() }
                { this.renderAvailableItemsSection() }
            </div>
        );
    }
}

export default PDPSummary;
