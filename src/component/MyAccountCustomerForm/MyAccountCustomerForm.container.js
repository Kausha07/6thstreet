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

import MyAccountCustomerForm from "./MyAccountCustomerForm.component";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
  country: state.AppState.country,
});

export const mapDispatchToProps = (dispatch) => ({
  updateCustomer: (customer) =>
    MyAccountDispatcher.updateCustomerData(dispatch, customer),
  showSuccessNotification: (message) =>
    dispatch(showNotification("success", message)),
  showErrorNotification: (error) =>
    dispatch(showNotification("error", error[0].message)),
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
      isPhoneVerified: false,
    };
  }

  togglePasswordForm(isShowPassword) {
    this.setState({ isShowPassword });
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
    } = this.state;

    return {
      isShowPassword,
      customer,
      isLoading,
      country,
      phoneCountryCode,
      customerUpdatedPhone,
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
    sendVerificationCode({
      mobile: phoneNumber,
      countryCode: countryCode,
    }).then((response) => {
      if (response.success) {
        showSuccessNotification("OTP has been sent to " + customerUpdatedPhone);
      } else {
        console.log("response.error", response.error);
        showErrorNotification(response.error);
      }
    }, this._handleError);
  }

  onVerifySuccess(fields) {
    const { verifyUserPhone, showSuccessNotification, showErrorNotification } =
      this.props;
    const { customerUpdatedPhone } = this.state;
    if (customerUpdatedPhone) {
      const mobile = customerUpdatedPhone.slice("4");
      const countryCode = customerUpdatedPhone.slice(0, "4");
      const { otp } = fields;
      verifyUserPhone({ mobile, country_code: countryCode, otp }).then(
        (response) => {
          if (response.success) {
            this.setState({ isPhoneVerified: true });
            showSuccessNotification(__("Phone was successfully verified"));
            // this.saveCustomer(fields);
            console.log("Fields", fields);
          } else {
            showErrorNotification(
              __("Wrong Verification Code. Please re-enter")
            );
          }
        },
        this._handleError
      );
    }
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
      Moengage.track_event(EVENT_MOE_UPDATE_PROFILE, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        gender: GetGender || "",
        app6thstreet_platform: "Web",
      });
      showSuccessNotification(__("Your information was successfully updated!"));
    } catch (e) {
      showErrorNotification(e);
    }

    this.setState({ isLoading: false });

    if (elmnts && elmnts.length > 0) {
      elmnts[0].scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  render() {
    return (
      <MyAccountCustomerForm
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCustomerFormContainer);
