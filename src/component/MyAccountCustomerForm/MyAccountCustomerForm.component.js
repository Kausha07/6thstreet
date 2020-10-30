import PropTypes from 'prop-types';

import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { COUNTRY_CODES_FOR_PHONE_VALIDATION } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import MyAccountPasswordForm from 'Component/MyAccountPasswordForm';
import PhoneCountryCodeField from 'Component/PhoneCountryCodeField';
import {
    MyAccountCustomerForm as SourceMyAccountCustomerForm
} from 'SourceComponent/MyAccountCustomerForm/MyAccountCustomerForm.component';
import { isArabic } from 'Util/App';

import './MyAccountCustomerForm.style';

export class MyAccountCustomerForm extends SourceMyAccountCustomerForm {
    static propTypes = {
        ...SourceMyAccountCustomerForm.propTypes,
        isShowPassword: PropTypes.bool.isRequired,
        customer: PropTypes.isRequired,
        showPasswordFrom: PropTypes.func.isRequired,
        hidePasswordFrom: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    state = {
        isArabic: isArabic()
    };

    get fieldMap() {
        return {
            fullname: {
                render: this.renderFullName.bind(this)
            },
            gender: {
                render: this.renderGernder.bind(this)
            },
            email: {
                isDisabled: true
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

    renderGernder() {
        // gender need to be added to customer data
        const { isArabic } = this.state;
        const { customer: { gender } } = this.props;
        const isMale = gender === 1;

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
                      checked={ isMale }
                    />
                    <Field
                      type="radio"
                      id="female"
                      label={ __('Female') }
                      name="gender"
                      value="2"
                      onClick={ this.handleGenderChange }
                    // eslint-disable-next-line
                      checked={ !isMale }
                    />
                </div>
            </fieldset>
        );
    }

    getCustomerPhone() {
        const { customer } = this.props;

        if (Object.keys(customer).length) {
            if (!customer.addresses.length) {
                return [];
            }

            const { phone: customerPhone } = customer;
            const customerAddressesData = customer.addresses[0];
            const customerAddressPhone = customerAddressesData.telephone.substr('4');
            const customerCountry = customerAddressesData.country_id;

            return {
                customerPhone: customerPhone
                    ? customerPhone.substr('4')
                    : customerAddressPhone,
                customerCountry
            };
        }

        return [];
    }

    getValidationForTelephone() {
        const { customerCountry } = this.props;

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
            <div>
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
