import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './Price.style';

class Price extends PureComponent {
    static propTypes = {
        basePrice: PropTypes.number.isRequired,
        specialPrice: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
    };

    renderBasePrice() {
        const { basePrice } = this.props;

        return (
            <span>
                { basePrice }
            </span>
        );
    }

    renderSpecialPrice() {
        const { specialPrice } = this.props;

        return (
            <span>
                { specialPrice }
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
                { this.renderSpecialPrice() }
            </>
        );
    }

    renderCurrency() {
        const { currency } = this.props;
        return currency;
    }

    render() {
        return (
            <p block="Price">
                { this.renderPrice() }
                { this.renderCurrency() }
            </p>
        );
    }
}

export default Price;
