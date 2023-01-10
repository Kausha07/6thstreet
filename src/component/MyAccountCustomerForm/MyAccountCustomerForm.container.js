import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PHONE_CODES } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { EVENT_MOE_UPDATE_PROFILE } from "Util/Event";
import { getCountryFromUrl,getLanguageFromUrl } from 'Util/Url';
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import isMobile from "Util/Mobile";
import MyAccountCustomerForm from "./MyAccountCustomerForm.component";
import { setCrossSubdomainCookie } from "Util/Url/Url";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  country: state.AppState.country,
  currentTabActive: state.MyAccountReducer.currentTabActive,
});

export const mapDispatchToProps = (dispatch) => ({
  updateCustomer: (customer) =>
    MyAccountDispatcher.updateCustomerData(dispatch, customer),
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  showErrorNotification: (error) => dispatch(showNotification("error", error)),
  sendVerificationCode: (phone) =>
    CheckoutDispatcher.sendVerificationCode(dispatch, phone),
  verifyUserPhone: (code) => CheckoutDispatcher.verifyUserPhone(dispatch, code),
});

export class MyAccountCustomerFormContainer extends PureComponent {
  static propTypes = {
    customer: customerType.isRequired,
    updateCustomer: PropTypes.func.isRequired,
    showErrorNotification: PropTypes.func.isRequired,
    showSuccessNotification: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    currentTabActive: PropTypes.bool.isRequired,
  };

  containerFunctions = {
    onSave: this.saveCustomer.bind(this),
    showPasswordFrom: this.togglePasswordForm.bind(this, true),
    hidePasswordFrom: this.togglePasswordForm.bind(this, false),
    setGender: this.setGender.bind(this),
    handleCountryChange: this.handleCountryChange.bind(this),
    updatePhoneNumber: this.updatePhoneNumber.bind(this),
    onVerifySuccess: this.onVerifySuccess.bind(this),
    sendOTP: this.sendOTP.bind(this),
    updatedCustomerDetails: this.updatedCustomerDetails.bind(this),
    renderOTPField: this.renderOTPField.bind(this),
  };

  constructor(props) {
    super(props);
    const {
      customer: { gender, phone },
    } = props;
    this.state = {
      isShowPassword: false,
      isLoading: false,
      countryCode: getCountryFromUrl(),
      gender,
      phoneCountryCode: "",
      customerUpdatedPhone: phone,
      showOTPField: false,
      updatedCustomerDetails: {},
      OTPSentNumber: "",
      OTPTimeOutBreak: false,
      isMobile: isMobile.any(),
    };
  }
  timer = null;

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  togglePasswordForm(isShowPassword) {
    this.setState({ isShowPassword });
  }

  renderOTPField(value) {
    this.setState({ showOTPField: value });
  }

  setGender(gender) {
    this.setState({ gender });
  }

  updatePhoneNumber(code, phoneNumber) {
    const { phoneCountryCode } = this.state;
    const currentPhoneNumber = document.getElementById("phone").value;
    const updatedPhoneNumber = `${code ? code : phoneCountryCode}${
      phoneNumber ? phoneNumber : currentPhoneNumber
    }`;
    this.setState({ customerUpdatedPhone: updatedPhoneNumber });
  }

  handleCountryChange(phoneCountryCode) {
    this.updatePhoneNumber(phoneCountryCode, null);
    this.setState({ phoneCountryCode });
  }

  containerProps = () => {
    const { customer, country } = this.props;
    const {
      isShowPassword,
      isLoading,
      phoneCountryCode,
      customerUpdatedPhone,
      showOTPField,
      OTPSentNumber,
      OTPTimeOutBreak,
    } = this.state;

    return {
      isShowPassword,
      customer,
      isLoading,
      country,
      phoneCountryCode,
      customerUpdatedPhone,
      showOTPField,
      OTPSentNumber,
      OTPTimeOutBreak,
    };
  };

  sendOTP() {
    const {
      sendVerificationCode,
      showSuccessNotification,
      showErrorNotification,
    } = this.props;
    const { customerUpdatedPhone } = this.state;
    const countryCode = customerUpdatedPhone
      ? customerUpdatedPhone.slice(0, "4")
      : null;
    const phoneNumber = customerUpdatedPhone
      ? customerUpdatedPhone.slice("4")
      : null;
    this.setState({ isLoading: true });
    sendVerificationCode({
      mobile: phoneNumber,
      countryCode: countryCode,
    }).then((response) => {
      if (response.success) {
        const sentNumber = `${countryCode}${phoneNumber}`;
        this.setState({ OTPSentNumber: sentNumber, OTPTimeOutBreak: true });
        this.timer = setTimeout(() => {
          this.setState({ OTPTimeOutBreak: false });
        }, 15000);
        showSuccessNotification(__("OTP sent successfully"));
        this.setState({ isLoading: false, showOTPField: true });
      } else {
        this.setState({ isLoading: false });
        showErrorNotification(response.error);
      }
    }, this._handleError);
  }

  onVerifySuccess(fields) {
    const { verifyUserPhone, showSuccessNotification, showErrorNotification } =
      this.props;
    const { customerUpdatedPhone, updatedCustomerDetails } = this.state;
    this.setState({ isLoading: true });
    if (customerUpdatedPhone) {
      const mobile = customerUpdatedPhone.slice("4");
      const countryCode = customerUpdatedPhone.slice(0, "4");
      const { otp } = fields;
      verifyUserPhone({ mobile, country_code: countryCode, otp }).then(
        (response) => {
          if (response.success) {
            showSuccessNotification(__("Phone was successfully verified"));
            if (
              updatedCustomerDetails &&
              Object.keys(updatedCustomerDetails).length > 0
            ) {
              this.saveCustomer(updatedCustomerDetails);
            }
          } else {
            this.setState({ isLoading: false });
            showErrorNotification(
              __("Wrong Verification Code. Please re-enter")
            );
          }
        },
        this._handleError
      );
    }
  }

  updatedCustomerDetails(fields) {
    this.setState({ updatedCustomerDetails: fields });
  }

  async saveCustomer(customer) {
    this.setState({ isLoading: true });
    const {
      updateCustomer,
      showErrorNotification,
      showSuccessNotification,
      customer: oldCustomerData,
    } = this.props;
    const {
      countryCode,
      gender,
      phoneCountryCode = PHONE_CODES[countryCode],
    } = this.state;
    const { phone } = customer;
    const elmnts = document.getElementsByClassName("MyAccount-Heading");
    const GetGender =
      gender == "1" ? "Male" : gender == "2" ? "Female" : "Prefer Not To Say";
    try {
      updateCustomer({
        ...oldCustomerData,
        ...customer,
        gender,
        phone: phoneCountryCode + phone,
      });
      setCrossSubdomainCookie(
        "customerPrimaryPhone",
        phoneCountryCode + phone,
        "30",
      );
      Moengage.track_event(EVENT_MOE_UPDATE_PROFILE, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        gender: GetGender || "",
        app6thstreet_platform: "Web",
      });
      this.setState({ showOTPField: false, isLoading: false });
      showSuccessNotification(__("Your information was successfully updated!"));
    } catch (e) {
      this.setState({ isLoading: false });
      showErrorNotification(e[0].message ? e[0].message : e);
    }

    this.setState({ isLoading: false });

    if (elmnts && elmnts.length > 0) {
      elmnts[0].scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  render() {
    const { currentTabActive } = this.props;
    const { isMobile } = this.state;
    if (isMobile && !currentTabActive) {
      this.setState({ showOTPField: false });
    }
    return (
      <MyAccountCustomerForm
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCustomerFormContainer);
