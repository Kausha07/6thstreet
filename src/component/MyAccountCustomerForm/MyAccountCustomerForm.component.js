import PropTypes from 'prop-types';

import Field from 'Component/Field';
import Loader from 'Component/Loader';
import MyAccountPasswordForm from 'Component/MyAccountPasswordForm';
import {
    MyAccountCustomerForm as SourceMyAccountCustomerForm
} from 'SourceComponent/MyAccountCustomerForm/MyAccountCustomerForm.component';

import './MyAccountCustomerForm.style';

export class MyAccountCustomerForm extends SourceMyAccountCustomerForm {
    static propTypes = {
        ...SourceMyAccountCustomerForm.propTypes,
        isShowPassword: PropTypes.bool.isRequired,
        showPasswordFrom: PropTypes.func.isRequired,
        hidePasswordFrom: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
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
            email: {
                isDisabled: true
            },
            password: {
                render: this.renderPassword.bind(this)
            },
            dob: {
                label: __('Date of Birth'),
                placeholder: __('Your birthday')
            }
        };
    }

    renderPassword() {
        const { showPasswordFrom } = this.props;

        return (
            <div
              key="password"
              block="MyAccountCusomerForm"
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
                  onClick={ showPasswordFrom }
                >
                    { __('Change') }
                </button>
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

        if (!isShowPassword) {
            return null;
        }

        return (
            <MyAccountPasswordForm />
        );
    }

    renderLoader() {
        const { isLoading } = this.props;

        return (
            <Loader isLoading={ isLoading } />
        );
    }

    render() {
        return (
            <div block="MyAccountCustomerForm">
                { super.render() }
                { this.renderPasswordForm() }
                { this.renderLoader() }
            </div>
        );
    }
}

export default MyAccountCustomerForm;
