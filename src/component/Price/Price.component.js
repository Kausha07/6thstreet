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

    haveDiscount() {
        const { basePrice, specialPrice } = this.props;

        if (specialPrice !== 'undefined' && basePrice !== specialPrice) {
            return true;
        }

        return false;
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

        const discountPercentage = Math.floor(100 * (1 - (specialPrice / basePrice)));

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
                <del>{ this.renderBasePrice() }</del>
                <span>
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
