import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCountryFromUrl } from 'Util/Url/Url';

import {
  TABBY_ISTALLMENTS,
  TABBY_PAY_LATER,
  HIDDEN_PAYMENTS
} from "Component/CheckoutPayments/CheckoutPayments.config";
import { BILLING_STEP } from "Route/Checkout/Checkout.config";
import {
  CheckoutPaymentsContainer as SourceCheckoutPaymentsContainer,
  mapDispatchToProps as SourceMapDispatchToProps,
} from "SourceComponent/CheckoutPayments/CheckoutPayments.container";
import { getStore } from "Store";
import { processingPaymentSelectRequest } from "Store/Cart/Cart.action";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import { TotalsType } from "Type/MiniCart";

import { CARD, FREE , CHECKOUT_APPLE_PAY} from "./CheckoutPayments.config";

export const mapStateToProps = (state) => ({
  totals: state.CartReducer.cartTotals,
});

export const mapDispatchToProps = (dispatch) => ({
  ...SourceMapDispatchToProps,
  selectPaymentMethod: (code) =>
    CheckoutDispatcher.selectPaymentMethod(dispatch, code),
  removeBinPromotion: () => CheckoutDispatcher.removeBinPromotion(dispatch),
  createTabbySession: (code) =>
    CheckoutDispatcher.createTabbySession(dispatch, code),
  updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  showError: (message) => dispatch(showNotification("error", message)),
  finishPaymentRequest: (status) =>
    dispatch(processingPaymentSelectRequest(status)),
});

export class CheckoutPaymentsContainer extends SourceCheckoutPaymentsContainer {
  static propTypes = {
    ...SourceCheckoutPaymentsContainer.propTypes,
    setTabbyWebUrl: PropTypes.func.isRequired,
    setCreditCardData: PropTypes.func.isRequired,
    totals: TotalsType.isRequired,
    isClickAndCollect: PropTypes.string.isRequired
  };

  state = {
    isTabbyInstallmentAvailable: false,
    isTabbyPayLaterAvailable: false,
  };

  componentDidMount() {
    const { createTabbySession } = this.props;
    const {
      billingAddress,
      setTabbyWebUrl,
      totals: { total },
      isTabbyInstallmentAvailable,
      isTabbyPayLaterAvailable
    } = this.props;
    const countryCode = ['AE', 'SA'].includes(getCountryFromUrl()) 
    const isApplePayAvailable = HIDDEN_PAYMENTS.includes(CHECKOUT_APPLE_PAY) || !window.ApplePaySession
    this.selectPaymentMethod({ m_code: total ? countryCode && !isApplePayAvailable ? CHECKOUT_APPLE_PAY : CARD : FREE });

    if (window.formPortalCollector) {
      window.formPortalCollector.subscribe(
        BILLING_STEP,
        this.collectAdditionalData,
        "CheckoutPaymentsContainer"
      );
    }

    this.setState({ isTabbyInstallmentAvailable:isTabbyInstallmentAvailable });    
    this.setState({ isTabbyPayLaterAvailable: isTabbyPayLaterAvailable });

  }

  componentDidUpdate(prevProps) {
    const {
      totals: { total },
      isTabbyInstallmentAvailable,
      isTabbyPayLaterAvailable
    } = this.props;
    const { selectedPaymentCode } = this.state;
    const countryCode = ['AE', 'SA'].includes(getCountryFromUrl()) 
    const isApplePayAvailable = HIDDEN_PAYMENTS.includes(CHECKOUT_APPLE_PAY) || !window.ApplePaySession

    if (
      (selectedPaymentCode === FREE && total > 0) ||
      (selectedPaymentCode !== FREE && total === 0)
    ) {
      this.selectPaymentMethod({ m_code: total ?countryCode && !isApplePayAvailable ? CHECKOUT_APPLE_PAY : CARD : FREE  });
    }
    if(prevProps?.totals?.total !== total || prevProps?.isTabbyInstallmentAvailable !== isTabbyInstallmentAvailable ||prevProps?.isTabbyPayLaterAvailable !== isTabbyPayLaterAvailable ){
      this.setState({ isTabbyInstallmentAvailable: isTabbyInstallmentAvailable });
      this.setState({ isTabbyPayLaterAvailable: isTabbyPayLaterAvailable });
    }
  }

  selectPaymentMethod(item) {
    const { m_code: code } = item;
    const {
      Cart: { cartId },
    } = getStore().getState();

    const {
      finishPaymentRequest,
      onPaymentMethodSelect,
      setOrderButtonEnableStatus,
      selectPaymentMethod,
      updateTotals,
      removeBinPromotion,
      resetBinApply,
    } = this.props;

    this.setState({
      selectedPaymentCode: code,
    });

    onPaymentMethodSelect(code);
    setOrderButtonEnableStatus(true);
    selectPaymentMethod(code)
      .then(() => {
        updateTotals(cartId);
        finishPaymentRequest();
        removeBinPromotion();
        resetBinApply();
      })
      .catch(() => {
        const { showError } = this.props;

        showError(__("Something went wrong"));
      });
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutPaymentsContainer);
