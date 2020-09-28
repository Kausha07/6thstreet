// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAddToCart from 'Component/PDPAddToCart/PDPAddToCart.container';
import Price from 'Component/Price';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import './PDPSummary.style';

class PDPSummary extends PureComponent {
    static propTypes = {
        product: Product.isRequired
    };

    state = {
        isArabic: false
    };

    static getDerivedStateFromProps() {
        return {
            isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
        };
    }

    renderNew() {
        const { product: { in_new_in } } = this.props;
        if (!in_new_in) {
            return (
                <>
                    <span block="PDPSummary" elem="New">NEW</span>
                    { ' ' }
                    <span block="PDPSummary" elem="Exclusive">- Exclusive</span>
                </>
            );
        }

        return <p block="PDPSummary" elem="New" />;
    }

    renderSummaryHeader() {
        const svgShare = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" /></svg>;
        return (
            <div block="PDPSummary" elem="Header">
                <div block="PDPSummary" elem="HeaderNew">
                    { this.renderNew() }
                    <button
                      block="PDPSummary"
                      elem="HeaderWardrobeBtn"
                      mix={ { block: 'button secondary thin' } }
                    >
                        in my wardrobe
                    </button>
                </div>
                <div block="PDPSummary" elem="HeaderShare">
                    <button
                      block="PDPSummary"
                      elem="HeaderShare"
                      mix={ { block: 'button secondary thin' } }
                    >
                        <span block="PDPSummary" elem="ShareSvg">
                            { svgShare }
                        </span>
                        Share
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
        const { isArabic } = this.state;

        if (isArabic) {
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

    renderCreditSection() {
        return <div block="PDPSummary" elem="CreditBlock" />;
    }

    renderAvailableItemsSection() {
        // const items = availableProducts.map((item) => <span>{ item }</span>);

        return (
            <div block="PDPSummary" elem="AvailableItems">
                <strong>Also Available in:</strong>
            </div>

        );
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
                { this.renderCreditSection() }
                { this.renderAvailableItemsSection() }
            </div>
        );
    }
}

export default PDPSummary;
