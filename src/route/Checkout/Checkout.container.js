import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  CARD,
  CHECKOUT_APPLE_PAY,
  TABBY_ISTALLMENTS,
  TABBY_PAY_LATER,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import { CC_POPUP_ID } from "Component/CreditCardPopup/CreditCardPopup.config";
import {
  AUTHORIZED_STATUS,
  CAPTURED_STATUS,
  DETAILS_STEP,
  SHIPPING_STEP,
} from "Route/Checkout/Checkout.config";
import {
  BILLING_STEP,
  PAYMENT_TOTALS,
} from "SourceRoute/Checkout/Checkout.config";
import {
  CheckoutContainer as SourceCheckoutContainer,
  mapDispatchToProps as sourceMapDispatchToProps,
} from "SourceRoute/Checkout/Checkout.container";
import { setGender } from "Store/AppState/AppState.action";
import { resetCart } from "Store/Cart/Cart.action";
// eslint-disable-next-line no-unused-vars
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import { updateMeta } from "Store/Meta/Meta.action";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import StoreCreditDispatcher from "Store/StoreCredit/StoreCredit.dispatcher";
import BrowserDatabase from "Util/BrowserDatabase";
import { checkProducts } from "Util/Cart/Cart";
import Event, { EVENT_GTM_CHECKOUT, EVENT_GTM_PURCHASE } from "Util/Event";
import history from "Util/History";
import { ONE_MONTH_IN_SECONDS } from "Util/Request/QueryDispatcher";
import parseJson from "parse-json";
import { TABBY_POPUP_ID } from "Component/TabbyPopup/TabbyPopup.config";
import {
  CART_ID_CACHE_KEY,
  LAST_CART_ID_CACHE_KEY,
} from "../../store/MobileCart/MobileCart.reducer";
const PAYMENT_ABORTED = "payment_aborted";
const PAYMENT_FAILED = "payment_failed";
import CreditCardDispatcher from 'Store/CreditCard/CreditCard.dispatcher';

export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  estimateShipping: (address) =>
    CheckoutDispatcher.estimateShipping(dispatch, address),
  saveAddressInformation: (address) =>
    CheckoutDispatcher.saveAddressInformation(dispatch, address),
  createOrder: (code, additional_data) =>
    CheckoutDispatcher.createOrder(dispatch, code, additional_data),
  getBinPromotion: (bin) => CheckoutDispatcher.getBinPromotion(dispatch, bin),
  removeBinPromotion: () => CheckoutDispatcher.removeBinPromotion(dispatch),
  verifyPayment: (paymentId) =>
    CheckoutDispatcher.verifyPayment(dispatch, paymentId),
  updateTabbyPayment: (paymentId, orderId) =>
    CheckoutDispatcher.updateTabbyPayment(dispatch, paymentId, orderId),
  getPaymentMethods: () => CheckoutDispatcher.getPaymentMethods(),
  sendVerificationCode: (phone) =>
    CheckoutDispatcher.sendVerificationCode(dispatch, phone),
  getPaymentAuthorization: (paymentId) =>
    CheckoutDispatcher.getPaymentAuthorization(dispatch, paymentId),
  capturePayment: (paymentId, orderId) =>
    CheckoutDispatcher.capturePayment(dispatch, paymentId, orderId),
  cancelOrder: (orderId, cancelReason) =>
    CheckoutDispatcher.cancelOrder(dispatch, orderId, cancelReason),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
  updateStoreCredit: () => StoreCreditDispatcher.getStoreCredit(dispatch),
  setMeta: (meta) => dispatch(updateMeta(meta)),
  setGender: (gender) => dispatch(setGender(gender)),
  resetCart: () => dispatch(resetCart()),
  getCart: () => CartDispatcher.getCart(dispatch),
  updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
  saveCreditCard: (cardData) => CreditCardDispatcher.saveCreditCard(dispatch, cardData),
});
export const mapStateToProps = (state) => ({
  totals: state.CartReducer.cartTotals,
  processingRequest: state.CartReducer.processingRequest,
  customer: state.MyAccountReducer.customer,
  guest_checkout: state.ConfigReducer.guest_checkout,
  countries: state.ConfigReducer.countries,
  isSignedIn: state.MyAccountReducer.isSignedIn,
  showOverlay: PropTypes.func.isRequired,
  activeOverlay: state.OverlayReducer.activeOverlay,
  hideActiveOverlay: state.OverlayReducer.hideActiveOverlay,
  cartId: state.CartReducer.cartId,
  savedCards: state.CreditCardReducer.savedCards,
  newCardVisible: state.CreditCardReducer.newCardVisible,
});

export class CheckoutContainer extends SourceCheckoutContainer {
  static propTypes = {
    updateStoreCredit: PropTypes.func.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    setMeta: PropTypes.func.isRequired,
    setGender: PropTypes.func.isRequired,
    removeCartItems: PropTypes.func.isRequired,
    cartId: PropTypes.number.isRequired,
    updateTotals: PropTypes.func.isRequired,
    binModal: PropTypes.func.isRequired,
  };

  containerFunctions = {
    setLoading: this.setLoading.bind(this),
    setDetailsStep: this.setDetailsStep.bind(this),
    savePaymentInformation: this.savePaymentInformation.bind(this),
    getBinPromotion: this.getBinPromotion.bind(this),
    saveAddressInformation: this.saveAddressInformation.bind(this),
    onShippingEstimationFieldsChange:
      this.onShippingEstimationFieldsChange.bind(this),
    onEmailChange: this.onEmailChange.bind(this),
    onCreateUserChange: this.onCreateUserChange.bind(this),
    onPasswordChange: this.onPasswordChange.bind(this),
    goBack: this.goBack.bind(this),
    resetCart: this.resetCart.bind(this),
    placeOrder: this.placeOrder.bind(this),
    showOverlay: this.props.showOverlay.bind(this),
    hideActiveOverlay: this.props.hideActiveOverlay.bind(this),
    updateTotals: this.updateTotals.bind(this),
    updateCreditCardData: this.updateCreditCardData.bind(this),
  };

  //   showOverlay() {
  //     return this.props.showOverlay;
  //   }

  //   hideActiveOverlay() {
  //     return this.props.hideActiveOverlay;
  //   }

  constructor(props) {
    super(props);

    const {
      toggleBreadcrumbs,
      totals: { is_virtual },
      totals,
    } = props;

    toggleBreadcrumbs(false);

    this.state = {
      isLoading: false,
      isDeliveryOptionsLoading: false,
      requestsSent: 0,
      paymentMethods: [],
      shippingMethods: [],
      shippingAddress: {},
      checkoutStep: is_virtual ? BILLING_STEP : SHIPPING_STEP,
      orderID: "",
      incrementID: "",
      threeDsUrl: "",
      paymentTotals: BrowserDatabase.getItem(PAYMENT_TOTALS) || {},
      email: "",
      isCreateUser: false,
      isGuestEmailSaved: false,
      isVerificationCodeSent: false,
      lastOrder: {},
      initialTotals: totals,
      processApplePay: true,
      initialGTMSent: false,
      tabbyPaymentId: null,
      isTabbyPopupShown: false,
      tabbyPaymentStatus: "",
    };
  }

  refreshCart = async () => {
    const { updateTotals, cartId, removeBinPromotion } = this.props;
    await removeBinPromotion();
    await updateTotals(cartId);
  };
  componentDidMount() {
    const { setMeta } = this.props;

    this.refreshCart();
    setMeta({ title: __("Checkout") });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      history,
      showInfoNotification,
      showErrorNotification,
      guest_checkout = true,
      totals = {},
      totals: { items = [], total, total_segments = [] },
      updateStoreCredit,
      isSignedIn,
    } = this.props;

    const { checkoutStep, initialGTMSent } = this.state;

    const { checkoutStep: prevCheckoutStep } = prevState;

    if (Object.keys(totals).length !== 0) {
      this.updateInitTotals();
    }

    if (
      checkoutStep === SHIPPING_STEP &&
      !initialGTMSent &&
      Object.keys(totals).length
    ) {
      this.handleCheckoutGTM(true);
    }

    if (checkoutStep !== prevCheckoutStep) {
      updateStoreCredit();
      this.handleCheckoutGTM();
    }

    if (items.length !== 0) {
      const mappedItems = checkProducts(items) || [];

      if (mappedItems.length !== 0) {
        history.push("/cart");
      }
    }

    if (
      Object.keys(totals).length &&
      !items.length &&
      checkoutStep !== DETAILS_STEP
    ) {
      showInfoNotification(__("Please add at least one product to cart!"));
      history.push("/cart");
      return;
    }

    if (
      Object.keys(totals).length &&
      total === 0 &&
      checkoutStep !== DETAILS_STEP
    ) {
      const totalSum = total_segments.reduce(
        (acc, item) => acc + item.value,
        0
      );

      if (totalSum !== 0) {
        showErrorNotification(__("Your cart is invalid"));
        history.push("/");
      }
    }

    // if guest checkout is disabled and user is not logged in => throw him to homepage
    if (!guest_checkout && !isSignedIn()) {
      history.push("/");
    }
  }

  removeBinPromotion() {
    const { removeBinPromotion } = this.props;
    removeBinPromotion().then(() => {
      this.updateTotals();
    });
  }

  componentWillUnmount() {
    this.removeBinPromotion();
  }

  handleCheckoutGTM(isInitial = false) {
    const { totals } = this.props;
    const { checkoutStep, incrementID, initialTotals } = this.state;

    if (checkoutStep !== DETAILS_STEP) {
      Event.dispatch(EVENT_GTM_CHECKOUT, {
        totals,
        step: this.getCheckoutStepNumber(),
      });
    } else {
      Event.dispatch(EVENT_GTM_PURCHASE, {
        orderID: incrementID,
        totals: initialTotals,
      });
    }

    if (isInitial) {
      this.setState({ initialGTMSent: true });
    }
  }

  /* eslint-disable no-magic-numbers */
  getCheckoutStepNumber() {
    const { checkoutStep } = this.state;

    switch (checkoutStep) {
      case SHIPPING_STEP:
        return 1;
      case BILLING_STEP:
        return 2;
      case DETAILS_STEP:
        return 3;
      default:
        return 0;
    }
  }

  updateInitTotals() {
    const { totals } = this.props;
    this.setState({ initialTotals: totals });
  }

  saveLastOrder(totals) {
    this.setState({ lastOrder: totals });
  }

  onShippingEstimationFieldsChange(address = {}) {
    const canEstimate = !Object.values(address).some(
      (item) => item === undefined
    );

    if (!canEstimate) {
      return;
    }

    const { estimateShipping } = this.props;
    const Checkout = this;

    /* eslint-disable */
    delete address.region_id;
    Checkout.setState({ isLoading: true });
    estimateShipping({
      ...address,
      default_shipping: true,
    }).then((response) => {
      if (typeof response !== "undefined") {
        Checkout.setState({
          shippingMethods: response.data,
          isLoading: false,
        });
      }
      Checkout.setState({ isLoading: false });
    }, this._handleError);
  }

  goBack() {
    const { checkoutStep } = this.state;

    if (checkoutStep === BILLING_STEP) {
      this.setState({
        isLoading: false,
        checkoutStep: SHIPPING_STEP,
      });

      BrowserDatabase.deleteItem(PAYMENT_TOTALS);
    }

    history.goBack();
  }

  async saveAddressInformation(addressInformation) {
    const { saveAddressInformation } = this.props;
    const { shipping_address } = addressInformation;

    this.setState({
      isLoading: true,
      shippingAddress: shipping_address,
    });

    saveAddressInformation(addressInformation).then(({ data }) => {
      const { totals } = data;

      BrowserDatabase.setItem(totals, PAYMENT_TOTALS, ONE_MONTH_IN_SECONDS);

      this.setState({
        paymentTotals: totals,
      });

      this.getPaymentMethods();
    }, this._handleError);
  }

  updateTotals() {
    const { updateTotals, cartId } = this.props;
    updateTotals(cartId);
  }

  getBinPromotion(bin) {
    const { getBinPromotion } = this.props;
    return getBinPromotion(bin);
  }

  updateCreditCardData(creditCardData) {
    this.setState({ creditCardData });
  }

  /*async*/ savePaymentInformation(paymentInformation) {
    this.setState({ isLoading: true });

    /*await*/ this.savePaymentMethodAndPlaceOrder(paymentInformation);
  }

  /*async*/ savePaymentMethodAndPlaceOrder(paymentInformation) {
    //console.log('Tabby123:');
    console.table(paymentInformation);
    const {
      paymentMethod: { code, additional_data },
      tabbyPaymentId,
    } = paymentInformation;
    const {
      savedCards,
      newCardVisible,
      customer: { email: customerEmail },
    } = this.props;
    const {
      shippingAddress: { email },
    } = this.state;
    //console.log("here1"+tabbyPaymentId)
    let data = {};
    if (code === CARD) {
      data = {
        ...additional_data,
        customer: {
          email: customerEmail ? customerEmail : email,
        },
        "3ds": {
          enabled: newCardVisible ? BrowserDatabase.getItem("CREDIT_CART_3DS") : true,
        },
        metadata: {
          udf1:
            typeof BrowserDatabase.getItem("CREDIT_CART_TYPE") === "string"
              ? BrowserDatabase.getItem("CREDIT_CART_TYPE")
              : null,
        },
      }
      if (newCardVisible) {
        data['source'] = {
          type: "token",
          token: BrowserDatabase.getItem("CREDIT_CART_TOKEN"),
        }
      } else {
        const { selectedCard: { cvv, gateway_token } } = paymentInformation;
        data['source'] = {
          cvv,
          type: "id",
          id: gateway_token,
        }
      }
    } else {
      data = additional_data;
    }

    if (code === CHECKOUT_APPLE_PAY) {
      this.setState({ processApplePay: true });
    } else if (code === TABBY_ISTALLMENTS || code === TABBY_PAY_LATER) {
      this.placeOrder(code, data, paymentInformation);
    } else {
      this.placeOrder(code, data, null);
    }
  }

  placeOrder(code, data, paymentInformation) {
    //console.log("here2"+tabbyPaymentId)
    const { createOrder, showErrorNotification } = this.props;
    const ONE_YEAR_IN_SECONDS = 31536000;
    const cart_id = BrowserDatabase.getItem(CART_ID_CACHE_KEY);
    BrowserDatabase.setItem(
      cart_id,
      LAST_CART_ID_CACHE_KEY,
      ONE_YEAR_IN_SECONDS // TODO Get info from Backend developers on cart expire time
    );
    this.setState({ isLoading: true });
    try {
      createOrder(code, data)
        .then((response) => {
          if (response && response.data) {
            const { data } = response;

            if (typeof data === "object") {
              const {
                order_id,
                success,
                response_code,
                increment_id,
                id = "",
                _links: { redirect: { href = "" } = {} } = {},
              } = data;

              if (success || response_code === 200) {
                this.setState({ isLoading: false });
                if (code === CARD && href) {
                  this.setState({
                    threeDsUrl: href,
                    order_id,
                    increment_id,
                    id,
                  });
                  setTimeout(() => this.processThreeDSWithTimeout(3), 10000);
                } else if (
                  code === TABBY_ISTALLMENTS ||
                  code === TABBY_PAY_LATER
                ) {
                  //console.log("here3"+tabbyPaymentId)
                  this.setState({
                    isTabbyPopupShown: true,
                    order_id,
                    increment_id,
                  });
                  setTimeout(
                    () => this.processTabbyWithTimeout(3, paymentInformation),
                    10000
                  );

                  //return true;
                } else {
                  BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
                  this.setDetailsStep(order_id, increment_id);
                  this.resetCart();

                  return true;
                }
              } else {
                const { error } = data;

                if (error && typeof error === "string") {
                  showErrorNotification(__(error));
                  this.setState({ isLoading: false });
                  this.resetCart();
                }
              }
            }

            if (typeof data === "string") {
              showErrorNotification(__(data));
              this.setState({ isLoading: false });
              this.resetCart();
            }
          }

          if (response && typeof response === "string") {
            showErrorNotification(__(response));
            this.setState({ isLoading: false });
            this.resetCart();
          }
        }, this._handleError)
        .catch(() => {
          const { showErrorNotification } = this.props;
          this.setState({ isLoading: false });

          showErrorNotification(__("Something went wrong."));
          this.resetCart();
        });
    } catch (e) {
      this._handleError(e);
    }
  }

  setDetailsStep(orderID, incrementID) {
    const { setNavigationState, sendVerificationCode, isSignedIn, customer } =
      this.props;

    const { shippingAddress } = this.state;

    if (isSignedIn) {
      if (customer.isVerified !== "0") {
        const { phone = "" } = customer;
        const code = phone.slice(1, 4);
        const mobile = phone.slice(4);

        sendVerificationCode({ mobile, code }).then((response) => {
          this.setState({ isVerificationCodeSent: response.success });
        }, this._handleError);
      }
    } else {
      const { phone = "", phonecode = "" } = shippingAddress;
      sendVerificationCode({ mobile: phone, countryCode: phonecode }).then(
        (response) => {
          this.setState({ isVerificationCodeSent: response.success });
        },
        this._handleError
      );
    }

    BrowserDatabase.deleteItem(PAYMENT_TOTALS);

    this.setState({
      isLoading: false,
      checkoutStep: DETAILS_STEP,
      orderID,
      incrementID,
    });

    setNavigationState({
      name: DETAILS_STEP,
    });
  }

  getPaymentMethods() {
    const { getPaymentMethods } = this.props;

    getPaymentMethods().then(({ data = [] }) => {
      const availablePaymentMethods = data.reduce((acc, paymentMethod) => {
        const { is_enabled } = paymentMethod;

        if (is_enabled) {
          acc.push(paymentMethod);
        }

        return acc;
      }, []);

      if (data) {
        this.setState({
          isLoading: false,
          paymentMethods: availablePaymentMethods,
          checkoutStep: BILLING_STEP,
        });
      }
    }, this._handleError);
  }

  processThreeDS() {
    const { getPaymentAuthorization, capturePayment, cancelOrder, saveCreditCard, newCardVisible } = this.props;
    const { order_id, increment_id, id = "", creditCardData } = this.state;

    getPaymentAuthorization(id).then((response) => {
      if (response) {
        const { status, id: paymentId = "" } = response;

        if (status === "Authorized") {
          BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
          this.setDetailsStep(order_id, increment_id);
          this.resetCart();
          this.setState({ CreditCardPaymentStatus: AUTHORIZED_STATUS });
          capturePayment(paymentId, order_id);
          if (newCardVisible && creditCardData.saveCard) {
            saveCreditCard({ email: creditCardData.email, paymentId })
              .then(() => {
                // console.log("saveCreditCard resp", response);
              })
              .catch(() => {
                // console.log("saveCreditCard err", err);
                showErrorNotification(__("Something went wrong! Please, try again!"));
              })
          }
        }

        if (status === "Declined") {
          cancelOrder(order_id, PAYMENT_FAILED);
          this.setState({ isLoading: false, isFailed: true });
          this.setDetailsStep(order_id, increment_id);
          this.resetCart();
        }
      }
    });
  }

  processThreeDSWithTimeout(counter) {
    const { CreditCardPaymentStatus, order_id, increment_id } = this.state;
    const {
      showErrorNotification,
      hideActiveOverlay,
      activeOverlay,
      cancelOrder,
    } = this.props;

    // Need to get payment data from CreditCard.
    // Could not get callback of CreditCard another way because CreditCard is iframe in iframe
    if (
      CreditCardPaymentStatus !== AUTHORIZED_STATUS &&
      counter < 100 &&
      activeOverlay === CC_POPUP_ID
    ) {
      setTimeout(() => {
        this.processThreeDS();
        this.processThreeDSWithTimeout(counter + 1);
      }, 5000);
    }

    if (counter === 100) {
      showErrorNotification("Credit Card session timeout");
      hideActiveOverlay();
    }

    if (
      (counter === 100 || activeOverlay !== CC_POPUP_ID) &&
      CreditCardPaymentStatus !== AUTHORIZED_STATUS
    ) {
      cancelOrder(order_id, PAYMENT_ABORTED);
      this.setState({ isLoading: false, isFailed: true });
      this.setDetailsStep(order_id, increment_id);
      this.resetCart();
    }
  }

  processTabby(paymentInformation) {
    const { verifyPayment, updateTabbyPayment } = this.props;
    const { checkoutStep } = this.state;
    const { tabbyPaymentId } = paymentInformation;
    const { order_id, increment_id } = this.state;

    if (checkoutStep !== BILLING_STEP) {
      return;
    }

    verifyPayment(tabbyPaymentId).then(({ status }) => {
      if (status === AUTHORIZED_STATUS || status === CAPTURED_STATUS) {
        BrowserDatabase.deleteItem(LAST_CART_ID_CACHE_KEY);
        this.setState({ tabbyPaymentStatus: status });
        updateTabbyPayment(tabbyPaymentId, order_id);
        this.setDetailsStep(order_id, increment_id);
        this.resetCart();
      }
      //this.setState({ tabbyPaymentStatus: status });
    });
  }

  processTabbyWithTimeout(counter, paymentInformation) {
    const { tabbyPaymentStatus } = this.state;
    const {
      showErrorNotification,
      hideActiveOverlay,
      activeOverlay,
      cancelOrder,
    } = this.props;
    const { order_id, increment_id } = this.state;

    // Need to get payment data from Tabby.
    // Could not get callback of Tabby another way because Tabby is iframe in iframe
    if (
      tabbyPaymentStatus !== AUTHORIZED_STATUS &&
      tabbyPaymentStatus !== CAPTURED_STATUS &&
      counter < 100 &&
      activeOverlay === TABBY_POPUP_ID
    ) {
      setTimeout(() => {
        this.processTabby(paymentInformation);
        this.processTabbyWithTimeout(counter + 1, paymentInformation);
      }, 5000);
    }

    if (counter === 100) {
      showErrorNotification("Tabby session timeout");
      hideActiveOverlay();
    }

    if (
      (counter === 100 || activeOverlay !== TABBY_POPUP_ID) &&
      tabbyPaymentStatus !== AUTHORIZED_STATUS &&
      tabbyPaymentStatus !== CAPTURED_STATUS
    ) {
      cancelOrder(order_id, PAYMENT_ABORTED);
      this.setState({
        isTabbyPopupShown: false,
        isLoading: false,
        isFailed: true,
      });
      this.setDetailsStep(order_id, increment_id);
      this.resetCart();
    }
  }

  resetCart() {
    const { updateStoreCredit, resetCart, getCart } = this.props;

    resetCart();
    getCart();
    updateStoreCredit();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
