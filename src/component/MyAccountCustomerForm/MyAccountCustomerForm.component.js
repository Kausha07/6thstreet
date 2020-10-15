import PropTypes from 'prop-types';

import Field from 'Component/Field';
import Loader from 'Component/Loader';
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
        isArabic: isArabic(),
        gender: 'male'
    };

    get fieldMap() {
        return {
            firstname: {
                placeholder: __('First name'),
                validation: ['notEmpty']
            },
            lastname: {
                placeholder: __('Last name'),
                validation: ['notEmpty']
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
        // gender need to be added to customer API
        const gender = this.state;

        return (
            <fieldset block="MyAccountCustomerForm" elem="Gender">
                <div
                  block="MyAccountCustomerForm"
                  elem="Radio"
                  mods={ { isArabic } }
                >
                    <Field
                      type="radio"
                      id="male"
                      label={ __('Male') }
                      name="gender"
                      value={ gender }
                      onClick={ this.handleGenderChange }
                      defaultChecked={ gender }
                    />
                    <Field
                      type="radio"
                      id="female"
                      label={ __('Female') }
                      name="gender"
                      value={ gender }
                      onClick={ this.handleGenderChange }
                      defaultChecked={ gender }
                    />
                </div>
            </fieldset>
        );
    }

    getCustomerPhoneData() {
        const { customer } = this.props;

        if (Object.keys(customer).length !== 0) {
            const customerAdressesData = customer.addresses[0];
            const customerPhone = customerAdressesData.telephone;
            const customerCountry = customerAdressesData.country_id;

            return { customerPhone, customerCountry };
        }

        return [];
    }

    renderPhone() {
        const customerPhoneData = this.getCustomerPhoneData();

        return (
            <fieldset block="MyAccountCustomerForm" elem="Phone">
                <PhoneCountryCodeField label={ customerPhoneData.customerCountry } />
                <Field
                  block="MyAccountCustomerForm"
                  elem="PhoneField"
                  type="text"
                  id="phone"
                  placeholder="Phone number"
                  value={ customerPhoneData.customerPhone }
                />
            </fieldset>
        );
    }

    renderBirthDay() {
        // birthday need to be added to customer API

        return (
            <fieldset block="MyAccountCustomerForm" elem="BirthDay">
                <Field
                  type="text"
                  id="birthDay"
                  placeholder="your birthday"
                />
            </fieldset>
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
