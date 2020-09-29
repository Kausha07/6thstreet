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
        const svgHanger = <svg id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><path id="XMLID_1906_" d="m485.119 345.819-214.119-124.081v-9.232c0-10.528 6.008-20.321 15.68-25.557 21.791-11.795 34.743-34.514 33.803-59.29-1.272-33.491-28.499-60.723-61.983-61.994-17.718-.68-34.497 5.716-47.247 17.989-12.758 12.282-19.784 28.798-19.784 46.504 0 8.284 6.716 15 15 15s15-6.716 15-15c0-9.478 3.761-18.317 10.59-24.892 6.821-6.566 15.796-9.993 25.302-9.623 17.905.68 32.463 15.243 33.144 33.154.504 13.277-6.434 25.45-18.105 31.769-19.368 10.484-31.4 30.386-31.4 51.94v9.232l-214.119 124.081c-16.581 9.609-26.881 27.485-26.881 46.651 0 29.729 24.182 53.914 53.906 53.914h404.188c29.724 0 53.906-24.187 53.906-53.915 0-19.166-10.3-37.041-26.881-46.65zm-27.025 70.565h-404.188c-13.182 0-23.906-10.729-23.906-23.915 0-8.502 4.568-16.431 11.923-20.692l214.077-124.057 214.077 124.057c7.354 4.262 11.923 12.19 11.923 20.693 0 13.186-10.724 23.914-23.906 23.914z" /></svg>;

        return (
            <div block="PDPSummary" elem="Header">
                <div block="PDPSummary" elem="HeaderNew">
                    { this.renderNew() }
                    <button
                      block="PDPSummary"
                      elem="HeaderWardrobeBtn"
                      mix={ { block: 'button secondary thin' } }
                    >
                        <span block="PDPSummary" elem="HangerSvg">
                            { svgHanger }
                        </span>
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
        return (
        <div block="PDPSummary" elem="CreditBlock">
            Credit info
        </div>
        );
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
