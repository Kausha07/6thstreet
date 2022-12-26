/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';

import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { PHONE_CODES } from 'Component/MyAccountAddressFieldForm/MyAccountAddressFieldForm.config';
import { COUNTRY_CODES_FOR_PHONE_VALIDATION } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import MyAccountPasswordForm from 'Component/MyAccountPasswordForm';
import PhoneCountryCodeField from 'Component/PhoneCountryCodeField';
import {
    MyAccountCustomerForm as SourceMyAccountCustomerForm
} from 'SourceComponent/MyAccountCustomerForm/MyAccountCustomerForm.component';
import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import { isArabic } from 'Util/App';
import BrowserDatabase from 'Util/BrowserDatabase';
import { getCountryFromUrl } from 'Util/Url';
import Form from "Component/Form";
import { createRef } from "react";

import "./MyAccountCustomerForm.style";

export class MyAccountCustomerForm extends SourceMyAccountCustomerForm {
  static propTypes = {
    ...SourceMyAccountCustomerForm.propTypes,
    isShowPassword: PropTypes.bool.isRequired,
    customer: PropTypes.object.isRequired,
    showPasswordFrom: PropTypes.func.isRequired,
    hidePasswordFrom: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    setGender: PropTypes.func.isRequired,
    handleCountryChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    country: PropTypes.string.isRequired,
    updatePhoneNumber: PropTypes.func.isRequired,
    onVerifySuccess: PropTypes.func.isRequired,
    updatedCustomerDetails: PropTypes.func.isRequired,
    renderOTPField: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.phoneNumberField = createRef();
    this.focusPhoneInput = this.focusPhoneInput.bind(this);
    const {
      customer: { gender, phone },
    } = props;

    this.state = {
      gender,
      isArabic: isArabic(),
      customerCountry: phone
        ? Object.keys(PHONE_CODES).find(
            (key) => PHONE_CODES[key] === phone.substr("0", "4")
          )
        : getCountryFromUrl(),
    };
  }

  onFormSuccess = (fields) => {
    const {
      onSave,
      customer: { phone },
      customerUpdatedPhone = "",
      sendOTP,
      updatedCustomerDetails,
      renderOTPField,
    } = this.props;
    if (phone == customerUpdatedPhone) {
      renderOTPField(false);
      onSave(fields);
    } else {
      sendOTP();
      updatedCustomerDetails(fields);
    }
  };

  componentDidMount() {
    const {
      customer: { phone } = {},
      handleCountryChange,
      country,
    } = this.props;

    const phoneCode = phone ? phone.substr("0", "4") : PHONE_CODES[country];

    handleCountryChange(phoneCode);
  }

  componentDidUpdate() {
    const { gender } = this.state;
    const { gender: stateGender } = BrowserDatabase.getItem(CUSTOMER) || {};
    if (!gender) {
      this.setDefaultGender(stateGender);
    }
  }

  setDefaultGender(gender) {
    this.setState({ gender });
  }

  get fieldMap() {
    return {
      fullname: {
        render: this.renderFullName.bind(this),
      },
      gender: {
        render: this.renderGender.bind(this),
      },
      email: {
        isDisabled: false,
        validation: ["notEmpty", "email"],
      },
      password: {
        render: this.renderPassword.bind(this),
      },
      countryCode: {
        render: this.renderCountryCode.bind(this),
      },
      phone: {
        render: this.renderPhone.bind(this),
      },
      dob: {
        render: this.renderBirthDay.bind(this),
      },
    };
  }

  handleGenderChange = (e) => {
    const { setGender } = this.props;
    this.setState({ gender: Number(e.target.value) });
    setGender(Number(e.target.value));
  };

  getCustomerFullName() {
    const { customer: { firstname, lastname } = {} } = this.props;

    if (firstname || lastname) {
      return {
        firstName: firstname || "",
        lastName: lastname || "",
      };
    }

    return [];
  }

  renderFullName() {
    const fullName = this.getCustomerFullName();

    return (
      <div block="MyAccountCustomerForm" elem="FullNameField" key="fullname">
        <Field
          type="text"
          name="fullname"
          id="full-name"
          placeholder={__("fullname")}
          value={`${fullName.firstName} ${fullName.lastName}`}
        />
      </div>
    );
  }

  renderPassword() {
    const { showPasswordFrom } = this.props;

    return (
      <div key="password" block="MyAccountCustomerForm" elem="PasswordField">
        <Field
          type="password"
          name="password"
          id="fake-password-field"
          value="************"
          isDisabled
          skipValue
        />
        <button
          type="button"
          block="MyAccountCustomerForm"
          elem="Change"
          id="change-password-button"
          onClick={showPasswordFrom}
        >
          {__("Change")}
        </button>
      </div>
    );
  }

  renderGender() {
    // gender need to be added to customer data
    const { isArabic, gender } = this.state;

    const isMale = gender === 1;
    const isFemale = gender === 2;
    const isPreferNotToSay = gender === 3;

    return (
      <fieldset block="MyAccountCustomerForm" elem="Gender" key="gender">
        <div
          block="MyAccountCustomerForm"
          elem="Gender-Radio"
          mods={{ isArabic }}
        >
          <Field
            type="radio"
            id="male"
            label={__("Male")}
            name="gender"
            value="1"
            onClick={this.handleGenderChange}
            // eslint-disable-next-line
            defaultChecked={isMale}
          />
          <Field
            type="radio"
            id="female"
            label={__("Female")}
            name="gender"
            value="2"
            onClick={this.handleGenderChange}
            // eslint-disable-next-line
            defaultChecked={isFemale}
          />
          <Field
            type="radio"
            id="preferNotToSay"
            label={__("Prefer Not To Say")}
            name="gender"
            value="3"
            onClick={this.handleGenderChange}
            // eslint-disable-next-line
            defaultChecked={isPreferNotToSay}
          />
        </div>
      </fieldset>
    );
  }

  getCustomerPhone() {
    const { customer = {}, customer: { phone } = {} } = this.props;

    if (Object.keys(customer).length) {
      return {
        customerPhone: phone ? phone.substr("4") : "",
        customerCountry: phone
          ? Object.keys(PHONE_CODES).find(
              (key) => PHONE_CODES[key] === phone.substr("0", "4")
            )
          : getCountryFromUrl(),
      };
    }

    return [];
  }

  getValidationForTelephone() {
    const { customerCountry } = this.state;

    return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
      ? "telephoneAE"
      : "telephone";
  }

  getPhoneNumberMaxLength() {
    const { customerCountry } = this.state;

    return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry] ? "9" : "8";
  }

  setCountryCode = (code) => {
    const { handleCountryChange } = this.props;

    handleCountryChange(code);

    this.setState({
      customerCountry: Object.keys(PHONE_CODES).find(
        (key) => PHONE_CODES[key] === code
      ),
    });
  };

  focusPhoneInput() {
    const { renderOTPField } = this.props;
    const inputRef = this.phoneNumberField?.current?.props?.formRef?.current;
    renderOTPField(false);
    if (inputRef) {
      setTimeout(() => {
        inputRef.focus();
      }, 200);
    }
  }

  renderOTPSection() {
    const { customerUpdatedPhone, onVerifySuccess, showOTPField, resendOTP } =
      this.props;
    //console.log("HEY", this.phoneNumberField);
    if (showOTPField) {
      return (
        <div
          mix={{
            block: "OTPVerifyContainer",
            mods: { isArabic },
          }}
        >
          <div block="OTPVerify" elem="Text">
            <div block="OTPVerify-Text" elem="Title">
              {__("Please Verify your Number")}
            </div>
            <div block="OTPVerify-Text" elem="Message">
              {__("Verification code has been sent to")}
            </div>
            <div block="OTPVerify-Text" elem="Phone">
              <button onClick={this.focusPhoneInput}>
                {customerUpdatedPhone}
              </button>
            </div>
          </div>
          <Form onSubmitSuccess={onVerifySuccess}>
            <div block="OTPVerify" elem="Code" mods={{ isArabic }}>
              <Field
                maxlength="5"
                type="text"
                placeholder="_____"
                name="otp"
                id="otp"
              />
            </div>
            <button block="primary" type="submit">
              {__("Verify phone number")}
            </button>
          </Form>
          <div block="OTPVerify" elem="ResendCode">
            <button onClick={resendOTP}>
              {__("Resend Verification Code")}
            </button>
          </div>
        </div>
      );
    }
  }

  renderCountryCode() {
    const { isArabic } = this.state;
    const customerPhoneData = this.getCustomerPhone();

    return (
      <div
        block="MyAccountCustomerForm"
        elem="CountryCode"
        mods={{ isArabic }}
        key="countryCode"
      >
        <PhoneCountryCodeField
          label={customerPhoneData.customerCountry}
          onSelect={this.setCountryCode}
        />
      </div>
    );
  }

  renderPhone() {
    const { isArabic } = this.state;
    const { updatePhoneNumber, phoneCountryCode, showOTPField } = this.props;
    const customerPhoneData = this.getCustomerPhone();
    return (
      <div
        block="MyAccountCustomerForm"
        elem="Phone"
        mods={{ isArabic }}
        key="phone"
      >
        <Field
          block="MyAccountCustomerForm"
          elem="PhoneField"
          mods={{ isArabic }}
          type="text"
          name="phone"
          id="phone"
          maxLength={this.getPhoneNumberMaxLength()}
          placeholder={__("Phone number")}
          value={customerPhoneData.customerPhone}
          validation={["notEmpty", this.getValidationForTelephone()]}
          ref={this.phoneNumberField}
          onChange={(val) => updatePhoneNumber(phoneCountryCode, val)}
          disabled={showOTPField}
        />
      </div>
    );
  }

  renderBirthDay() {
    // birthday need to be added to customer data
    const { isArabic } = this.state;
    const {
      customer: { dob },
    } = this.props;

    if (!dob) {
      return null;
    }

    return (
      <div block="MyAccountCustomerForm" elem="BirthDay" mods={{ isArabic }}>
        <Field
          block="MyAccountCustomerForm"
          elem="BirthDay"
          type="date"
          mods={{ isArabic }}
          name="dob"
          id="birth-day"
          value={dob}
        />
      </div>
    );
  }

  renderField = (fieldEntry) => {
    const [, { render }] = fieldEntry;

    if (render) {
      return render();
    }
    return <Field {...this.getDefaultValues(fieldEntry)} />;
  };

  renderPasswordForm() {
    const { isShowPassword } = this.props;
    const { hidePasswordFrom } = this.props;

    if (!isShowPassword) {
      return null;
    }

    return (
      <div block="MyAccountPasswordForm">
        <div block="MyAccountPasswordForm" elem="Title">
          <span>{__("Change Password")}</span>
          <button type="button" block="Cross" onClick={hidePasswordFrom}>
            <span />
          </button>
        </div>
        <MyAccountPasswordForm />
      </div>
    );
  }

  renderLoader() {
    const { isLoading } = this.props;

    return <Loader isLoading={isLoading} />;
  }

  renderActions() {
    const { showOTPField } = this.props;
    if (!showOTPField) {
      return (
        <button
          type="submit"
          block="Button"
          mix={{ block: "MyAccount", elem: "Button" }}
        >
          {__("Save customer")}
        </button>
      );
    }
  }

  render() {
    const { isArabic } = this.state;

    return (
      <div mix={{ block: "MyAccountCustomerForm", mods: { isArabic } }}>
        {super.render()}
        {this.renderPasswordForm()}
        {this.renderLoader()}
        {this.renderOTPSection()}
      </div>
    );
  }
}

export default MyAccountCustomerForm;
