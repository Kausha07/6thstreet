import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { PHONE_CODES } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { getCountryFromUrl } from 'Util/Url';

import MyAccountCustomerForm from './MyAccountCustomerForm.component';

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => MyAccountDispatcher.updateCustomerData(dispatch, customer),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    showErrorNotification: (error) => dispatch(showNotification('error', error[0].message))
});

export class MyAccountCustomerFormContainer extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired,
        updateCustomer: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired
    };

    state = {
        isShowPassword: false,
        isLoading: false,
        countryCode: getCountryFromUrl(),
        gender: '0'
    };

    containerFunctions = {
        onSave: this.saveCustomer.bind(this),
        showPasswordFrom: this.togglePasswordForm.bind(this, true),
        hidePasswordFrom: this.togglePasswordForm.bind(this, false),
        setGender: this.setGender.bind(this)
    };

    togglePasswordForm(isShowPassword) {
        this.setState({ isShowPassword });
    }

    setGender(gender) {
        this.setState({ gender });
    }

    containerProps = () => {
        const { customer } = this.props;

        const {
            isShowPassword,
            isLoading
        } = this.state;

        return {
            isShowPassword,
            customer,
            isLoading
        };
    };

    async saveCustomer(customer) {
        this.setState({ isLoading: true });

        const {
            updateCustomer,
            showErrorNotification,
            showSuccessNotification,
            customer: oldCustomerData
        } = this.props;
        const { countryCode, gender } = this.state;
        const { phone } = customer;

        try {
            updateCustomer({
                ...oldCustomerData,
                ...customer,
                gender,
                phone: PHONE_CODES[countryCode] + phone
            });
            showSuccessNotification(__('Your information was successfully updated!'));
        } catch (e) {
            showErrorNotification(e);
        }

        this.setState({ isLoading: false });
    }

    render() {
        return (
            <MyAccountCustomerForm
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCustomerFormContainer);
