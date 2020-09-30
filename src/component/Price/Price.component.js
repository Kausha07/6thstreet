/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './Price.style';

class Price extends PureComponent {
    static propTypes = {
        basePrice: PropTypes.number.isRequired,
        specialPrice: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
    };

    state = {
        isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
    };

    haveDiscount() {
        const { basePrice, specialPrice } = this.props;

        return specialPrice !== 'undefined' && basePrice !== specialPrice;
    }

    renderBasePrice() {
        const { basePrice } = this.props;

        return (
            <span block="Price" elem="Base" mods={ { discount: this.haveDiscount() } }>
                { this.renderCurrency() }
                <span> </span>
                { basePrice }
            </span>
        );
    }

    renderSpecialPrice() {
        const { specialPrice } = this.props;

        return (
            <span block="Price" elem="Special" mods={ { discount: this.haveDiscount() } }>
                { this.renderCurrency() }
                <span> </span>
                { specialPrice }
            </span>
        );
    }

    discountPercentage() {
        const {
            basePrice,
            specialPrice
        } = this.props;
        const { isArabic } = this.state;

        let discountPercentage = Math.round(100 * (1 - (specialPrice / basePrice)));
        if (discountPercentage === 0) {
            discountPercentage = 1;
        }

        if (isArabic) {
            return (
                <span block="Price" elem="Discount" mods={ { discount: this.haveDiscount() } }>
                { discountPercentage }
                %-
                </span>
            );
        }

        return (
            <span block="Price" elem="Discount" mods={ { discount: this.haveDiscount() } }>
            -
            { discountPercentage }
            %
            <span> </span>
            </span>
        );
    }

    renderPrice() {
        const {
            basePrice,
            specialPrice
        } = this.props;

        if (basePrice === specialPrice) {
            return this.renderBasePrice();
        }

        return (
            <>
                <del block="Price" elem="Del">{ this.renderBasePrice() }</del>
                <span block="Price" elem="Wrapper">
                    { this.discountPercentage() }
                    { this.renderSpecialPrice() }
                </span>
            </>
        );
    }

    renderCurrency() {
        const { currency } = this.props;
        return <span block="Price" elem="Currency">{ currency }</span>;
    }

    render() {
        return (
            <p block="Price">
                { this.renderPrice() }
            </p>
        );
    }
}

export default Price;
