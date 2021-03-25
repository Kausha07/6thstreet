import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountQuery from 'Query/MyAccount.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { fetchMutation } from 'Util/Request';

import MyAccountPasswordForm from './MyAccountPasswordForm.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (dispatch) => ({
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    showErrorNotification: (error) => dispatch(showNotification('error', error[0].message))
});

export class MyAccountPasswordFormContainer extends PureComponent {
    static propTypes = {
        showSuccessNotification: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired
    };

    state = {
        isLoading: false
    };

    containerFunctions = {
        onPasswordChange: this.onPasswordChange.bind(this)
    };

    async onPasswordChange(passwords) {
        const { showSuccessNotification, showErrorNotification } = this.props;

        const mutation = MyAccountQuery.getChangeCustomerPasswordMutation(passwords);
        this.setState({ isLoading: true });

        try {
            await fetchMutation(mutation);
            showSuccessNotification(__('Your password was successfully updated!'));
        } catch (e) {
            showErrorNotification(e);
        }

        this.setState({ isLoading: false });
    }

    containerProps = () => {
        const { isLoading } = this.state;
        return { isLoading };
    };

    render() {
        return (
            <MyAccountPasswordForm
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountPasswordFormContainer);
