import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  CARD,
  TABBY_ISTALLMENTS,
  TABBY_PAY_LATER,
} from "Component/CheckoutPayments/CheckoutPayments.config";
import {
  ADD_ADDRESS,
  ADDRESS_POPUP_ID,
} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.config";
import {
  CheckoutBillingContainer as SourceCheckoutBillingContainer,
  mapDispatchToProps as sourceMapDispatchToProps,
  mapStateToProps as sourceMapStateToProps,
} from "SourceComponent/CheckoutBilling/CheckoutBilling.container";
import CreditCardDispatcher from "Store/CreditCard/CreditCard.dispatcher";
import { showNotification } from "Store/Notification/Notification.action";
import { showPopup } from "Store/Popup/Popup.action";
import BrowserDatabase from "Util/BrowserDatabase";
import { FIVE_MINUTES_IN_SECONDS } from "Util/Request/QueryDispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
export const mapStateToProps = (state) => ({
  ...sourceMapStateToProps(state),
  processingRequest: state.CartReducer.processingRequest,
  processingPaymentSelectRequest:
    state.CartReducer.processingPaymentSelectRequest,
  totals: state.CartReducer.cartTotals,
  cartId: state.CartReducer.cartId,
  savedCards: state.CreditCardReducer.savedCards,
  newCardVisible: state.CreditCardReducer.newCardVisible,
});

export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  addNewCreditCard: (cardData) =>
    CreditCardDispatcher.addNewCreditCard(dispatch, cardData),
  getCardType: (bin) => CreditCardDispatcher.getCardType(dispatch, bin),
  showSuccessMessage: (message) =>
    dispatch(showNotification("success", message)),
  showPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload)),
  createTabbySession: (code) =>
    CheckoutDispatcher.createTabbySession(dispatch, code),
  removeBinPromotion: () => CheckoutDispatcher.removeBinPromotion(dispatch),
});

export class CheckoutBillingContainer extends SourceCheckoutBillingContainer {
  static propTypes = {
    ...SourceCheckoutBillingContainer.propTypes,
    setTabbyWebUrl: PropTypes.func.isRequired,
    setPaymentCode: PropTypes.func.isRequired,
    showPopup: PropTypes.func.isRequired,
    setCheckoutCreditCardData: PropTypes.func.isRequired,
    processingRequest: PropTypes.bool.isRequired,
    processingPaymentSelectRequest: PropTypes.bool,
  };

  static defaultProps = {
    ...SourceCheckoutBillingContainer.defaultProps,
    processingPaymentSelectRequest: false,
  };

  containerFunctions = {
    onBillingSuccess: this.onBillingSuccess.bind(this),
    onBillingError: this.onBillingError.bind(this),
    onAddressSelect: this.onAddressSelect.bind(this),
    onSameAsShippingChange: this.onSameAsShippingChange.bind(this),
    onPaymentMethodSelect: this.onPaymentMethodSelect.bind(this),
    showPopup: this.showPopup.bind(this),
    showCreateNewPopup: this.showCreateNewPopup.bind(this),
    setCreditCardData: this.setCreditCardData.bind(this),
    setOrderButtonDisabled: this.setOrderButtonDisabled.bind(this),
    setOrderButtonEnabled: this.setOrderButtonEnabled.bind(this),
    resetBinApply: this.resetBinApply.bind(this),
    setOrderButtonEnableStatus: this.setOrderButtonEnableStatus.bind(this),
    applyPromotionSavedCard: this.applyPromotionSavedCard.bind(this),
    removePromotionSavedCard: this.removePromotionSavedCard.bind(this),
  };

  conatinerProps = () => {
    const { binModal } = this.props;
    const {
      isOrderButtonEnabled,
      isOrderButtonVisible,
      binApplied,
    } = this.state;
    return { binModal, isOrderButtonEnabled, isOrderButtonVisible, binApplied };
  };

  componentDidMount() {
    this.setState({ isOrderButtonVisible: true });
    this.setState({ isOrderButtonEnabled: true });
    this.setState({ binApplied: false });
  }

  setOrderButtonDisabled() {
    this.setState({ isOrderButtonEnabled: false });
  }

  setOrderButtonEnabled() {
    this.setState({ isOrderButtonEnabled: true });
  }
  setOrderButtonEnableStatus(isOrderButtonEnabled) {
    this.setState({ isOrderButtonEnabled });
  }

  resetBinApply() {
    this.setState({ binApplied: false });
  }

  onBillingError(fields, invalidFields, error) {
    const { showErrorNotification } = this.props;

    if (error) {
      const { message = __("Something went wrong!") } = error;
      showErrorNotification(message);
    }
  }

  removeBinPromotion = async () => {
    const { updateTotals, removeBinPromotion } = this.props;
    this.resetBinApply();
    await removeBinPromotion();
    await updateTotals();
  };

  setCreditCardData(data) {
    const { number, expMonth, expYear, cvv, saveCard } = data;
    const { binApplied } = this.state;
    const {
      newCardVisible,
      totals: { discount },
    } = this.props;

    if (number) {
      this.setState({ number });
    }

    if (expMonth) {
      this.setState({ expMonth });
    }

    if (expYear) {
      this.setState({ expYear });
    }

    if (cvv) {
      this.setState({ cvv });
    }
    if (newCardVisible && discount !== 0) {
      this.removeBinPromotion();
    }
    if (binApplied) {
      this.setState({ binApplied: false });
    }
    if (saveCard !== undefined && saveCard !== null) {
      this.setState({ saveCard });
    }
  }

  showCreateNewPopup() {
    const { showPopup } = this.props;

    showPopup({
      action: ADD_ADDRESS,
      title: __("Add new address"),
      address: {},
    });
  }

  async applyBinPromotion() {
    const { number = "" } = this.state;
    const { getBinPromotion, updateTotals, binModal } = this.props;
    const response = await getBinPromotion(number.substr("0", "6"));
    binModal(response);
    await updateTotals();
    this.setState({ binApplied: true });
    this.setOrderButtonEnabled();
  }

  async applyBinPromotionOnSavedCard() {
    const { getBinPromotion, updateTotals, binModal, savedCards } = this.props;
    let selectedCard = savedCards.find(a => a.selected === true);
    if (selectedCard && selectedCard.details) {//if saved card is selected
      const { details: { bin } } = selectedCard;
      const response = await getBinPromotion(bin);
      binModal(response);
      await updateTotals();
      this.setState({ binApplied: true });
    }
  }

  async applyPromotionSavedCard() {
    if (this.state.binApplied) {
      //if promotion already applied
      await this.removeBinPromotion();
      await this.applyBinPromotionOnSavedCard();
    } else {
      await this.applyBinPromotionOnSavedCard();
    }
  }

  async removePromotionSavedCard() {
    await this.removeBinPromotion();
    this.resetBinApply();
  }

  async onBillingSuccess(fields, asyncData) {
    const paymentMethod = this._getPaymentData(asyncData);
    const { savePaymentInformation, savedCards, newCardVisible ,showErrorNotification} = this.props;
    const address = this._getAddress(fields);
    const { code } = paymentMethod;

    if (code === CARD) {
      if (newCardVisible) {
        //if payment is via new card.
        const {
          addNewCreditCard,
          getCardType,
          showErrorNotification,
          showSuccessMessage,
          setCheckoutCreditCardData,
        } = this.props;

        const { number = "", expYear, expMonth, cvv, binApplied, saveCard } = this.state;
        if (!binApplied) {
          await this.applyBinPromotion();
          return;
        }

        setCheckoutCreditCardData(number, expMonth, expYear, cvv, saveCard, address.email);

        getCardType(number.substr("0", "6")).then((response) => {
          if (response) {
            const { requires_3ds, type } = response;

            BrowserDatabase.setItem(
              type,
              "CREDIT_CART_TYPE",
              FIVE_MINUTES_IN_SECONDS
            );
            BrowserDatabase.setItem(
              requires_3ds,
              "CREDIT_CART_3DS",
              FIVE_MINUTES_IN_SECONDS
            );
          }
        });

        addNewCreditCard({ number, expMonth, expYear, cvv })
          .then((response) => {
            const { id, token } = response;

            if (id || token) {
              BrowserDatabase.setItem(
                id ?? token,
                "CREDIT_CART_TOKEN",
                FIVE_MINUTES_IN_SECONDS
              );
              showSuccessMessage(__("Credit card successfully added"));

              savePaymentInformation({
                billing_address: address,
                paymentMethod,
              });
            } else if (Array.isArray(response)) {
              const message = response[0];

              if (typeof message === "string") {
                showErrorNotification(this.getCartError(message));
              } else {
                showErrorNotification(__("Something went wrong"));
              }
            } else if (typeof response === "string") {
              showErrorNotification(response);
            }
          }, this._handleError)
          .catch(() => {
            const { showErrorNotification } = this.props;

            showErrorNotification(__("Something went wrong"));
          });
      } else {
        //if payment is via saved card.
        let selectedCard = savedCards.find((a) => a.selected === true);
        if (selectedCard) {
          //if card is selected
          selectedCard["cvv"] = this.state.cvv;
          savePaymentInformation({
            billing_address: address,
            paymentMethod,
            selectedCard,
          });
        } else {
          //if saved card is not selected
          showErrorNotification("Please select an card first.");
        }
      }
    } else if (code === TABBY_PAY_LATER || code === TABBY_ISTALLMENTS) {
      this.createTabbySessionAndSavePaymentInformation(asyncData, fields);
    } else {
      savePaymentInformation({
        billing_address: address,
        paymentMethod,
      });
    }
  }

  createTabbySessionAndSavePaymentInformation(asyncData, fields) {
    const paymentMethod = this._getPaymentData(asyncData);
    const address = this._getAddress(fields);
    const {
      savePaymentInformation,
      createTabbySession,
      shippingAddress,
      setTabbyWebUrl,
    } = this.props;
    createTabbySession(shippingAddress)
      .then((response) => {
        if (response && response.configuration) {
          const {
            configuration: {
              available_products: { installments, pay_later },
            },
            payment: { id },
          } = response;
          if (installments || pay_later) {
            if (installments) {
              setTabbyWebUrl(installments[0].web_url, id, TABBY_ISTALLMENTS);
            }

            if (pay_later) {
              setTabbyWebUrl(pay_later[0].web_url, id, TABBY_PAY_LATER);
            }
            savePaymentInformation({
              billing_address: address,
              paymentMethod,
            });
          }
        }
      }, this._handleError)
      .catch(() => {});
  }

  getCartError(message) {
    switch (message) {
      case "card_number_invalid":
        return __("Card number is not valid");
      case "card_expiry_month_invalid":
        return __("Card exp month is not valid");
      case "card_expiry_year_invalid":
        return __("Card exp year is not valid");
      case "cvv_invalid":
        return __("Card cvv is not valid");
      default:
        return __("Something went wrong");
    }
  }

  onPaymentMethodSelect(code) {
    const { setPaymentCode } = this.props;

    this.setState({ paymentMethod: code });
    setPaymentCode(code);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutBillingContainer);
