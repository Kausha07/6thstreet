import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { Config } from "Util/API/endpoint/Config/Config.type";
import { Price as PriceType } from "Util/API/endpoint/Product/Product.type";

import Price from "./Price.component";
import { FIXED_CURRENCIES } from "./Price.config";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  totals: state.CartReducer.cartTotals,
  vwoData: state.AppConfig.vwoData,
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PriceContainer extends PureComponent {
  static propTypes = {
    price: PriceType.isRequired,
    config: Config.isRequired,
    country: PropTypes.string.isRequired,
    page: PropTypes.string,
  };

  static defaultProps = {
    page: "",
  };

  containerProps = () => {
    const {
      price,
      page,
      country,
      renderSpecialPrice,
      cart,
      config,
      pageType,
      itemType,
      totals,
      checkoutPageSiteWide,
      checkoutPageCouponCode,
      vwoData,
    } = this.props;
    const priceObj = Array.isArray(price) ? price[0] : price;
    const [currency, priceData] = Object.entries(priceObj)[0];
    const basePrice = priceData?.["6s_base_price"] || priceData?.default
    const specialPrice = priceData?.["6s_special_price"] || priceData?.default
    const finalPrice = priceData?.["finalPrice"] || priceData?.default;
    const discount_amount = priceData?.["discount_amount"] || 0;
    const newFinalPrice = priceData?.["newFinalPrice"] || 0;
    const showDiscountPercentage = config?.countries[country]?.price_show_discount_percent ?? true;
    const fixedPrice = FIXED_CURRENCIES.includes(currency) && page !== "plp";
    const isSidewideCouponEnabled = vwoData?.SiteWideCoupon?.isFeatureEnabled || false;
    return {
      price,
      basePrice,
      specialPrice,
      currency,
      country,
      fixedPrice,
      cart,
      renderSpecialPrice,
      config,
      showDiscountPercentage,
      pageType,
      itemType,
      isSidewideCouponEnabled,
      totals,
      finalPrice,
      checkoutPageSiteWide,
      checkoutPageCouponCode,
      discount_amount,
      newFinalPrice,
    };
  };

  // TODO: use these to get if we need to display 0 or not
  getIsStripZeros() {
    const {
      country,
      config: {
        countries: {
          [country]: { price_strip_insignificant_zeros },
        },
      },
    } = this.props;

    return price_strip_insignificant_zeros;
  }

  render() {
    const props = this.containerProps();
    const { currency, basePrice } = props;
    if (!currency || !basePrice) {
      return null;
    }

    return <Price {...this.containerFunctions} {...props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceContainer);
