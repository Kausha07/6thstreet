// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAddToCart from 'Component/PDPAddToCart/PDPAddToCart.container';
import Price from 'Component/Price';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';

import './PDPSummary.style';

class PDPSummary extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

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

    renderSummaryHeader() {
        return (
            <div block="PDPSummary" elem="Header">
                <div block="PDPSummary" elem="HeaderNew">
                    { this.renderNew() }
                    <button
                      block="PDPSummary"
                      elem="HeaderWardrobeBtn"
                      mix={ { block: 'button secondary thin' } }
                    >
                        <div block="PDPSummary" elem="hangerSvg" />
                        <span block="PDPSummary" elem="WardrobeTxt">in my wardrobe</span>
                    </button>
                </div>
                <div block="PDPSummary" elem="HeaderShare">
                    <button
                      block="PDPSummary"
                      elem="HeaderShare"
                      mix={ { block: 'button secondary thin' } }
                    >
                        <div block="PDPSummary" elem="shareSvg" />
                        <span block="PDPSummary" elem="ShareTxt">Share</span>
                    </button>
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
        // data unavailable at this moment
        return null;
    }

    render() {
        return (
            <div block="PDPSummary">
                { this.renderSummaryHeader() }
                { this.renderBrand() }
                { this.renderName() }
                { this.renderPrice() }
                { this.renderColor() }
                { this.renderAddToCartSection() }
                { this.renderAvailableItemsSection() }
            </div>
        );
    }
}

export default PDPSummary;
