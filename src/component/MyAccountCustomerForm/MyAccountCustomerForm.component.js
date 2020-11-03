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

import './MyAccountCustomerForm.style';

export class MyAccountCustomerForm extends SourceMyAccountCustomerForm {
    static propTypes = {
        ...SourceMyAccountCustomerForm.propTypes,
        isShowPassword: PropTypes.bool.isRequired,
        customer: PropTypes.isRequired,
        showPasswordFrom: PropTypes.func.isRequired,
        hidePasswordFrom: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        setGender: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    constructor(props) {
        super(props);
        const { customer: { gender, phone } } = props;

        this.state = {
            gender,
            customerCountry: phone ? Object.keys(PHONE_CODES).find(
                (key) => PHONE_CODES[key] === phone.substr('0', '4')
            ) : getCountryFromUrl()
        };
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
                render: this.renderFullName.bind(this)
            },
            gender: {
                render: this.renderGender.bind(this)
            },
            email: {
                isDisabled: false
            },
            password: {
                render: this.renderPassword.bind(this)
            },
            phone: {
                render: this.renderPhone.bind(this)
            },
            dob: {
                render: this.renderBirthDay.bind(this)
            }
        };
    }

    handleGenderChange = (e) => {
        const { setGender } = this.props;
        this.setState({ gender: Number(e.target.value) });
        setGender(Number(e.target.value));
    };

    getCustomerFullName() {
        const { customer: { firstname, lastname } = {} } = this.props;

        if (firstname && lastname) {
            return { firstName: firstname, lastName: lastname };
        }

        return [];
    }

    renderFullName() {
        const fullName = this.getCustomerFullName();

        return (
            <div
              block="MyAccountCustomerForm"
              elem="FullNameField"
            >
                <Field
                  type="text"
                  name="fullname"
                  id="full-name"
                  placeholder={ __('fullname') }
                  value={ `${fullName.firstName } ${ fullName.lastName}` }
                />
            </div>
        );
    }

    renderPassword() {
        const { showPasswordFrom } = this.props;

        return (
            <div
              key="password"
              block="MyAccountCustomerForm"
              elem="PasswordField"
            >
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
                  onClick={ showPasswordFrom }
                >
                    { __('Change') }
                </button>
            </div>
        );
    }

    renderGender() {
        // gender need to be added to customer data
        const {
            isArabic,
            gender
        } = this.state;

        if (!gender) {
            return null;
        }

        const isMale = gender === 1;
        const isFemale = gender === 2;
        const isPreferNotToSay = gender === 3;

        return (
            <fieldset block="MyAccountCustomerForm" elem="Gender">
                <div
                  block="MyAccountCustomerForm"
                  elem="Gender-Radio"
                  mods={ { isArabic } }
                >
                    <Field
                      type="radio"
                      id="male"
                      label={ __('Male') }
                      name="gender"
                      value="1"
                      onClick={ this.handleGenderChange }
                      // eslint-disable-next-line
                      defaultChecked={ isMale }
                    />
                    <Field
                      type="radio"
                      id="female"
                      label={ __('Female') }
                      name="gender"
                      value="2"
                      onClick={ this.handleGenderChange }
                    // eslint-disable-next-line
                      defaultChecked={ isFemale }
                    />
                    <Field
                      type="radio"
                      id="preferNotToSay"
                      label={ __('Prefer Not To Say') }
                      name="gender"
                      value="3"
                      onClick={ this.handleGenderChange }
                      // eslint-disable-next-line
                      defaultChecked={ isPreferNotToSay }
                    />
                </div>
            </fieldset>
        );
    }

    getCustomerPhone() {
        const { customer, customer: { phone } = {} } = this.props;

        if (Object.keys(customer).length) {
            return {
                customerPhone: phone ? phone.substr('4') : '',
                customerCountry: phone ? Object.keys(PHONE_CODES).find(
                    (key) => PHONE_CODES[key] === phone.substr('0', '4')
                ) : getCountryFromUrl()
            };
        }

        return [];
    }

    getValidationForTelephone() {
        const { customerCountry } = this.state;

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
            ? 'telephoneAE' : 'telephone';
    }

    getPhoneNumberMaxLength() {
        const { customerCountry } = this.getCustomerPhone();

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
            ? '9' : '8';
    }

    renderPhone() {
        const { isArabic } = this.state;
        const customerPhoneData = this.getCustomerPhone();

        return (
            <div block="MyAccountCustomerForm" elem="Phone" mods={ { isArabic } }>
                <PhoneCountryCodeField label={ customerPhoneData.customerCountry } />
                <Field
                  block="MyAccountCustomerForm"
                  elem="PhoneField"
                  mods={ { isArabic } }
                  type="text"
                  name="phone"
                  id="phone"
                  maxLength={ this.getPhoneNumberMaxLength() }
                  placeholder={ __('Phone number') }
                  value={ customerPhoneData.customerPhone }
                  validation={ ['notEmpty', this.getValidationForTelephone()] }
                />
            </div>
        );
    }

    renderBirthDay() {
        // birthday need to be added to customer data
        const { isArabic } = this.state;
        const { customer: { dob } } = this.props;

        if (!dob) {
            return null;
        }

        return (
            <div block="MyAccountCustomerForm" elem="BirthDay" mods={ { isArabic } }>
                <Field
                  block="MyAccountCustomerForm"
                  elem="BirthDay"
                  type="date"
                  mods={ { isArabic } }
                  name="dob"
                  id="birth-day"
                  value={ dob }
                />
            </div>
        );
    }

    renderField = (fieldEntry) => {
        const [, { render }] = fieldEntry;

        if (render) {
            return render();
        }

        return (
            <Field { ...this.getDefaultValues(fieldEntry) } />
        );
    };

    renderPasswordForm() {
        const { isShowPassword } = this.props;
        const { hidePasswordFrom } = this.props;

        if (!isShowPassword) {
            return null;
        }

        return (
            <div block="MyAccountPasswordForm">
                <div
                  block="MyAccountPasswordForm"
                  elem="Title"
                >
                    <span>{ __('Change Password') }</span>
                    <button
                      type="button"
                      block="Cross"
                      onClick={ hidePasswordFrom }
                    >
                        <span />
                    </button>
                </div>
                <MyAccountPasswordForm />
            </div>
        );
    }

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    render() {
        const { isArabic } = this.state;

        return (
            <div
              mix={ { block: 'MyAccountCustomerForm', mods: { isArabic } } }
            >
                { super.render() }
                { this.renderPasswordForm() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default MyAccountCustomerForm;
