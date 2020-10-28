import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';

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
        isLoading: false
    };

    containerFunctions = {
        onSave: this.saveCustomer.bind(this),
        showPasswordFrom: this.togglePasswordForm.bind(this, true),
        hidePasswordFrom: this.togglePasswordForm.bind(this, false)
    };

    togglePasswordForm(isShowPassword) {
        this.setState({ isShowPassword });
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

        try {
            updateCustomer({ ...oldCustomerData, ...customer });
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
