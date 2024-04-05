/* eslint-disable react/prop-types */
import { CUSTOMER_ACCOUNT_PAGE } from "Component/Header/Header.config";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { MY_ACCOUNT_URL } from "Route/MyAccount/MyAccount.config";
import MyAccountContainer, {
  tabMap,
} from "Route/MyAccount/MyAccount.container";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import ClubApparelDispatcher from "Store/ClubApparel/ClubApparel.dispatcher";
import { updateMeta } from "Store/Meta/Meta.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
import { showNotification } from "Store/Notification/Notification.action";
import { toggleOverlayByKey } from "Store/Overlay/Overlay.action";
import { customerType } from "Type/Account";
import { TotalsType } from "Type/MiniCart";
import Algolia from "Util/API/provider/Algolia";
import { getUUID, getUUIDToken } from "Util/Auth";
import {
  sendOTP,
  sendOTPViaEmail,
} from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import Event, {
  EVENT_LOGIN,
  EVENT_OTP_VERIFY,
  EVENT_OTP_VERIFY_FAILED,
  EVENT_GTM_NEW_AUTHENTICATION,
} from "Util/Event";
import BrowserDatabase from "Util/BrowserDatabase";
import { ALGOLIA_PURCHASE_SUCCESS, VUE_BUY } from "Util/Event";
import history from "Util/History";
import isMobile from "Util/Mobile";
import CheckoutSuccess from "./CheckoutSuccess.component";
import { Config } from "Util/API/endpoint/Config/Config.type";
export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);
export const MyAccountDispatcher = import(
  "Store/MyAccount/MyAccount.dispatcher"
);

export const mapStateToProps = (state) => ({
  headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
  guest_checkout: state.ConfigReducer.guest_checkout,
  customer: state.MyAccountReducer.customer,
  totals: state.CartReducer.cartTotals,
  isSignedIn: state.MyAccountReducer.isSignedIn,
  config: state.AppConfig.config,
  eddResponse: state.MyAccountReducer.eddResponse,
  intlEddResponse: state.MyAccountReducer.intlEddResponse,
  edd_info: state.AppConfig.edd_info,
  newSignUpEnabled: state.AppConfig.newSigninSignupVersionEnabled,
  config: state.AppConfig.config,
  country: state.AppState.country,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
});

export const mapDispatchToProps = (dispatch) => ({
  changeHeaderState: (state) =>
    dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
  updateBreadcrumbs: (breadcrumbs) =>
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    ),
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  updateMeta: (meta) => dispatch(updateMeta(meta)),
  getMember: (id) => ClubApparelDispatcher.getMember(dispatch, id),
  sendVerificationCode: (phone) =>
    CheckoutDispatcher.sendVerificationCode(dispatch, phone),
  verifyUserPhone: (code) => CheckoutDispatcher.verifyUserPhone(dispatch, code),
  updateCustomer: (customer) =>
    MyAccountDispatcher.updateCustomerData(dispatch, customer),
  requestCustomerData: () =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.requestCustomerData(dispatch)
    ),
  loginAccount: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.loginAccount(options, dispatch)
    ),
  signInOTP: (options) =>
    MyAccountDispatcher.then(({ default: dispatcher }) =>
      dispatcher.signInOTP(options, dispatch)
    ),
  setCheckoutDetails: (checkoutDetails) =>
    CartDispatcher.setCheckoutStep(dispatch, checkoutDetails),
});

export class CheckoutSuccessContainer extends PureComponent {
  static propTypes = {
    orderID: PropTypes.number.isRequired,
    incrementID: PropTypes.number.isRequired,
    updateBreadcrumbs: PropTypes.func.isRequired,
    changeHeaderState: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    updateMeta: PropTypes.func.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    totals: TotalsType.isRequired,
    tabMap: PropTypes.isRequired,
    customer: customerType,
    getMember: PropTypes.func.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    requestCustomerData: PropTypes.func.isRequired,
    newSignUpEnabled: PropTypes.bool,
    config: Config.isRequired,
    country: PropTypes.string.isRequired,
  };

  static defaultProps = {
    customer: null,
  };

  state = {
    isEditing: false,
    clubApparelMember: null,
    phone: null,
    isPhoneVerified: false,
    isChangePhonePopupOpen: false,
    isMobileVerification: false,
    isLoading: false,
    email: null,
    otpError: "",
  };

  containerFunctions = {
    onSignIn: this.onSignIn.bind(this),
    changeActiveTab: this.changeActiveTab.bind(this),
    onVerifySuccess: this.onVerifySuccess.bind(this),
    onResendCode: this.onResendCode.bind(this),
    changePhone: this.changePhone.bind(this),
    toggleChangePhonePopup: this.toggleChangePhonePopup.bind(this),
    onGuestAutoSignIn: this.onGuestAutoSignIn.bind(this),
    sendOTPOnMailOrPhone: this.sendOTPOnMailOrPhone.bind(this),
    OtpErrorClear: this.OtpErrorClear.bind(this),
    sendEvents: this.sendEvents.bind(this),
  };

  constructor(props) {
    super(props);

    const { updateMeta, totals } = this.props;

    this.state = {
      initialTotals: totals,
      isEditing: false,
      clubApparelMember: null,
      phone: null,
      isPhoneVerified: BrowserDatabase.getItem("customer")?.isVerified  === "1" ? true :  false,
      isChangePhonePopupOpen: false,
      isMobileVerification: false,
      ...MyAccountContainer.navigateToSelectedTab(this.props),
    };

    /*
        if (!isSignedIn) {
            toggleOverlayByKey(CUSTOMER_ACCOUNT);
        }
        */

    updateMeta({ title: __("My account") });

    this.onSignIn();
  }

  static getDerivedStateFromProps(props, state) {
    return MyAccountContainer.navigateToSelectedTab(props, state);
  }

  componentDidMount() {
    const {
      updateMeta,
      customer: { phone },
      customer,
      shippingAddress: { phone: guestPhone },
      isSignedIn,
      totals,
      setCheckoutDetails,
      orderID,
    } = this.props;
    setCheckoutDetails(true);

    var data = localStorage.getItem("customer");
    let userData = JSON.parse(data);
    let userToken = userData?.data?.id
      ? `user-${userData.data.id}`
      : getUUIDToken();

    const customerData = BrowserDatabase.getItem("customer");
    const userID = customerData && customerData.id ? customerData.id : null;
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    totals?.items?.map((item) => {
      var queryID = item?.full_item_info?.search_query_id
        ? item?.full_item_info?.search_query_id
        : null;
      let productObjectID = item?.full_item_info?.parent_id.toString();
      if (queryID && userToken && productObjectID) {
        new Algolia().logAlgoliaAnalytics(
          "conversion",
          ALGOLIA_PURCHASE_SUCCESS,
          [],
          {
            objectIDs: [productObjectID],
            queryID: queryID,
            userToken: userToken,
            getRankingInfo: true,
          }
        );
      }
      VueIntegrationQueries.vueAnalayticsLogger({
        event_name: VUE_BUY,
        params: {
          event: VUE_BUY,
          order_id: orderID,
          pageType: "checkout_payment",
          currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
          clicked: Date.now(),
          sourceProdID: item?.full_item_info?.config_sku,
          sourceCatgID: item?.full_item_info?.category,
          prodQty: item?.full_item_info?.qty,
          prodPrice: item?.full_item_info?.price,
          uuid: getUUID(),
          referrer: window.location.href,
          url: window.location.href,
          userID: userID,
        },
      });
    });

    if (isSignedIn) {
      this.setPhone(phone);
    } else {
      this.setPhone(guestPhone);
    }

    const testCustomerVerified = "0";

    if (
      !(isSignedIn && customer.isVerified === testCustomerVerified) &&
      isMobile.any()
    ) {
      this.setState({ isMobileVerification: true });
    }
  }

  containerProps = () => {
    const {
      clubApparelMember,
      isPhoneVerified,
      isChangePhonePopupOpen,
      phone,
      isMobileVerification,
    } = this.state;
    const { isFailed, country } = this.props;
    return {
      clubApparelMember,
      isPhoneVerified,
      isChangePhonePopupOpen,
      phone,
      isFailed,
      isMobileVerification,
      country
    };
  };

  toggleChangePhonePopup() {
    const { isChangePhonePopupOpen } = this.state;
    this.setState({ isChangePhonePopupOpen: !isChangePhonePopupOpen });
  }

  changePhone(fields) {
    const {
      isSignedIn,
      updateCustomer,
      customer: oldCustomerData,
    } = this.props;
    const { newPhone, countryPhoneCode } = fields;

    if (isSignedIn) {
      updateCustomer({
        ...oldCustomerData,
        phone: countryPhoneCode + newPhone,
      }).then((response) => {
        if (!response.error) {
          this.onResendCode();
          this.toggleChangePhonePopup();
          this.setPhone(newPhone, countryPhoneCode);
        } else {
          showNotification("error", __("Please enter valid phone number"));
        }
      }, this._handleError);
    } else {
      this.setPhone(newPhone, countryPhoneCode);
      this.onResendCode();
      this.toggleChangePhonePopup();
    }
  }

  setPhone(phone, phonecode = "") {
    this.setState({ phone: phonecode + phone });
  }

  sendEvents(name, data = {}) {
    const {newSignUpEnabled} = this.props;
    const eventData = {
      name: name,
      screen: "checkout",
      prevScreen: "checkout",
      ...(data.failed_reason && { failed_reason: data?.failed_reason }),
      ...(data?.mode && { login_mode: data?.mode }),
    };
    if (newSignUpEnabled){
      Event.dispatch(EVENT_GTM_NEW_AUTHENTICATION, eventData);
    }
  }

  onVerifySuccess(fields) {
    const {
      verifyUserPhone,
      isSignedIn,
      orderID,
      showNotification,
      newSignUpEnabled,
    } = this.props;

    const { phone } = this.state;
    if (phone) {
      const countryCodeLastChar = 4;
      const countryCode = phone.slice(1, countryCodeLastChar);
      const mobile = phone.slice(countryCodeLastChar);
      const { otp } = fields;
      if (isSignedIn) {
        verifyUserPhone({ mobile: phone, country_code: countryCode, otp }).then(
          (response) => {
            if (response.success) {
              this.setState({ isPhoneVerified: true });
              showNotification(
                "success",
                __("Phone was successfully verified")
              );
              if (newSignUpEnabled) {
                this.sendEvents(EVENT_OTP_VERIFY);
              }
              this.setState({ isMobileVerification: false });
            } else {
              if (newSignUpEnabled) {
                const eventAdditionalData = {
                  failed_reason: "Wrong Verification Code. Please re-enter",
                };
                this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
              }
              showNotification(
                "error",
                __("Wrong Verification Code. Please re-enter")
              );
            }
          },
          this._handleError
        );
      } else {
        verifyUserPhone({
          mobile,
          country_code: countryCode,
          otp,
          order_id: orderID,
        }).then((response) => {
          if (response.success) {
            if (newSignUpEnabled) {
              this.sendEvents(EVENT_OTP_VERIFY);
            }
            this.setState({ isPhoneVerified: true });
            this.setState({ isMobileVerification: false });
          } else {
            if (newSignUpEnabled) {
              const eventAdditionalData = {
                failed_reason:
                  "Verification failed. Please enter valid verification code",
              };
              this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
            }
            showNotification(
              "error",
              __("Verification failed. Please enter valid verification code")
            );
          }
        }, this._handleError);
      }
    }
  }

  async onGuestAutoSignIn(otp, shouldLoginWithOtpOnEmail) {
    const { phone, email } = this.state;
    try {
      if (otp.length === 5) {
        const { loginAccount, showNotification, newSignUpEnabled } = this.props;
        this.setState({ isLoading: true });
        let payload;
        if (shouldLoginWithOtpOnEmail) {
          payload = {
            password: otp,
            email_otp: true,
            username: email,
          };
        } else {
          payload = {
            password: otp,
            is_phone: true,
            username: phone,
          };
        }
        const response = await loginAccount(payload);
        if (response.success) {
          const { signInOTP } = this.props;
          if (newSignUpEnabled) {
            this.sendEvents(EVENT_OTP_VERIFY);
            const eventAdditionalData = shouldLoginWithOtpOnEmail
              ? { mode: "Email", }
              : { mode: "Phone", };
            this.sendEvents(EVENT_LOGIN, eventAdditionalData);
          }          
          try {
            await signInOTP(response);
            history.push("/my-account/my-orders");
          } catch (e) {
            this.setState({ isLoading: false });
            showNotification("error", e.message);
          }
          this.setState({
            isLoading: false,
          });
        }
        if (response && typeof response === "string") {
          this.setState({
            otpError: response,
          });
          showNotification("error", response);
          if (newSignUpEnabled) {
            const eventAdditionalData = {
              failed_reason: response,
            };
            this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
          }
        }
        this.setState({ isLoading: false });
      }
    } catch (err) {
      const {newSignUpEnabled} = this.props;
      this.setState({ isLoading: false });
      console.error("Error while creating customer", err);
      if (newSignUpEnabled) {
        const eventAdditionalData = {
          failed_reason: err ? err : "Error while creating customer",
        };
        this.sendEvents(EVENT_OTP_VERIFY_FAILED, eventAdditionalData);
      }
    }
  }

  async sendOTPOnMailOrPhone(shouldLoginWithOtpOnEmail) {
    const { phone } = this.state;
    const { showNotification } = this.props;
    try {
      let response;
      this.setState({ isLoading: true });
      if (shouldLoginWithOtpOnEmail) {
        response = await sendOTPViaEmail({
          mobile: phone,
          flag: "login",
        });
        if (response && response.email_id) {
          this.setState({
            email: response.email_id,
          });
        }
      } else {
        response = await sendOTP({
          phone: phone,
          flag: "login",
        });
      }
      if (response && response.error) {
        const { error } = response;
        if (typeof error === "string") {
          showNotification("error", response.error);
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.error("error while sending OTP", error);
    }
  }

  async onResendCode(isVerifyEmailViewState) {
    const { sendVerificationCode, showNotification } = this.props;
    const { phone = "" } = this.state;
    const countryCodeLastChar = 4;
    const countryCode = phone.slice(1, countryCodeLastChar);
    const mobile = phone.slice(countryCodeLastChar);
    try {
      if (isVerifyEmailViewState) {
        const response = await sendOTPViaEmail({
          mobile: phone,
          flag: "login",
        });
        if (!response.error) {
          showNotification(
            "success",
            __("Verification code was successfully re-sent")
          );
        }
      } else {
        sendVerificationCode({ mobile: phone, countryCode }).then(
          (response) => {
            if (!response.error) {
              showNotification(
                "success",
                __("Verification code was successfully re-sent")
              );
            } else {
              showNotification("error", response.error);
            }
          },
          this._handleError
        );
      }
    } catch (error) {
      console.error("error while sending OTP", error);
    }
  }

  changeActiveTab(activeTab) {
    const {
      [activeTab]: { url },
    } = tabMap;
    history.push(`${MY_ACCOUNT_URL}${url}`);
  }

  _updateBreadcrumbs() {
    const { updateBreadcrumbs } = this.props;

    updateBreadcrumbs([
      { url: "", name: __("Account") },
      { name: __("Home"), url: "/" },
    ]);
  }

  onSignIn() {
    const { changeHeaderState, history } = this.props;

    changeHeaderState({
      title: "My account",
      name: CUSTOMER_ACCOUNT_PAGE,
      onBackClick: () => history.push("/"),
    });
  }

  OtpErrorClear() {
    this.setState({ otpError: "" });
  }

  render() {
    return (
      <CheckoutSuccess
        {...this.props}
        {...this.state}
        {...this.containerFunctions}
        {...this.containerProps()}
        tabMap={tabMap}
      />
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutSuccessContainer);
