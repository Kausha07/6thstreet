import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountQuery from 'Query/MyAccount.query';
import { updateCustomerDetails } from 'Store/MyAccount/MyAccount.action';
import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import BrowserDatabase from 'Util/BrowserDatabase';
import { fetchMutation } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import MyAccountCustomerForm from './MyAccountCustomerForm.component';

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
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
            showSuccessNotification
        } = this.props;

        const mutation = MyAccountQuery.getUpdateInformationMutation(customer);

        try {
            const { updateCustomer: { customer } } = await fetchMutation(mutation);
            BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
            updateCustomer(customer);
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
