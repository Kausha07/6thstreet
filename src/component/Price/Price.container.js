import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Config } from 'Util/API/endpoint/Config/Config.type';
import { Price as PriceType } from 'Util/API/endpoint/Product/Product.type';

import Price from './Price.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    country: state.AppState.country
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PriceContainer extends PureComponent {
    static propTypes = {
        price: PriceType.isRequired,
        config: Config.isRequired,
        country: PropTypes.string.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        const { price } = this.props;
        const priceObj = Array.isArray(price) ? price[0] : price;
        const [currency, priceData] = Object.entries(priceObj)[0];
        const {
            default: defaultPrice,
            '6s_base_price': basePrice = defaultPrice,
            '6s_special_price': specialPrice = defaultPrice
        } = priceData;

        return {
            basePrice,
            specialPrice,
            currency
        };
    };

    // TODO: use these to get if we need to display 0 or not
    getIsStripZeros() {
        const {
            country,
            config: {
                countries: {
                    [country]: {
                        price_strip_insignificant_zeros
                    }
                }
            }
        } = this.props;

        return price_strip_insignificant_zeros;
    }

    render() {
        const props = this.containerProps();
        const { currency, basePrice } = props;

        if (!currency || !basePrice) {
            return null;
        }

        return (
            <Price
              { ...this.containerFunctions }
              { ...props }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceContainer);
