/* eslint-disable fp/no-let */
/* eslint-disable no-magic-numbers */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { isArabic } from 'Util/App';

class Price extends PureComponent {
    static propTypes = {
        basePrice: PropTypes.number.isRequired,
        specialPrice: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        fixedPrice: PropTypes.bool,
    };

    static defaultProps = {
        fixedPrice: false,
    };

    state = {
        isArabic: isArabic()
    };

    haveDiscount() {
        const { basePrice, specialPrice } = this.props;

        return specialPrice !== 'undefined' && specialPrice && basePrice !== specialPrice;
    }

    renderBasePrice() {
        const { basePrice, fixedPrice } = this.props;

        return (
            <span block="Price" elem="Base" mods={ { discount: this.haveDiscount() } }>
                { this.renderCurrency() }
                &nbsp;
                { fixedPrice ? (1 * basePrice).toFixed(3) : basePrice }
            </span>
        );
    }

    renderSpecialPrice() {
        const { specialPrice, fixedPrice } = this.props;

        return (
            <span block="Price" elem="Special" mods={ { discount: this.haveDiscount() } }>
                { this.renderCurrency() }
                &nbsp;
                { fixedPrice ? (1 * specialPrice).toFixed(3) : specialPrice }
            </span>
        );
    }

    discountPercentage() {
        const {
            basePrice,
            specialPrice,
        } = this.props;

        const { isArabic } = this.state;

        let discountPercentage = Math.round(100 * (1 - (specialPrice / basePrice)));
        if (discountPercentage === 0) {
            discountPercentage = 1;
        }

        return `-${discountPercentage}%`;
    }

    renderPrice() {
        const {
            basePrice,
            specialPrice
        } = this.props;

        if(!parseFloat(basePrice)){
            return null;
        }

        if (basePrice === specialPrice || !specialPrice) {
            return this.renderBasePrice();
        }

        return (
            <>
                <span block="Price" elem="Wrapper">
                    { this.renderSpecialPrice() }
                    &nbsp;
                    <del block="Price" elem="Del">{ this.renderBasePrice() }</del>
                </span>
                <span block="Price" elem="Discount" mods={ { discount: this.haveDiscount() } }>
                    { `On Sale ${ this.discountPercentage() } Off`}
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
