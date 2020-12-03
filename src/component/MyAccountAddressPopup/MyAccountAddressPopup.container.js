/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountQuery from 'Query/MyAccount.query';
import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';
import { goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { addressType } from 'Type/Account';
import { capitalize } from 'Util/App';
import { fetchMutation } from 'Util/Request';

import MyAccountAddressPopup from './MyAccountAddressPopup.component';
import { ADDRESS_POPUP_ID } from './MyAccountAddressPopup.config';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapStateToProps = (state) => ({
    payload: state.PopupReducer.popupPayload[ADDRESS_POPUP_ID] || {}
});

export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    showErrorNotification: (error) => dispatch(showNotification('error', error[0].message)),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    updateCustomerDetails: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    // eslint-disable-next-line max-len
    validateAddress: (address) => CheckoutDispatcher.validateAddress(dispatch, address),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class MyAccountAddressPopupContainer extends PureComponent {
    static propTypes = {
        showErrorNotification: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        updateCustomerDetails: PropTypes.func.isRequired,
        showCards: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        closeForm: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            address: addressType
        }),
        validateAddress: PropTypes.func.isRequired
    };

    static defaultProps = {
        payload: {}
    };

    state = {
        isLoading: false
    };

    containerFunctions = {
        handleAddress: this.handleAddress.bind(this),
        handleDeleteAddress: this.handleDeleteAddress.bind(this)
    };

    handleAfterAction = () => {
        const {
            hideActiveOverlay,
            updateCustomerDetails,
            showErrorNotification,
            goToPreviousHeaderState,
            closeForm
        } = this.props;

        updateCustomerDetails().then(() => {
            this.setState({ isLoading: false }, () => {
                hideActiveOverlay();
                goToPreviousHeaderState();
                closeForm();
            });
        }, showErrorNotification);
    };

    handleError = (error) => {
        const { showErrorNotification } = this.props;
        showErrorNotification(error);
        this.setState({ isLoading: false });
    };

    validateAddress(address) {
        const {
            country_id,
            region: {
                region,
                region_id
            },
            city,
            telephone = '',
            street,
            phonecode = ''
        } = address;
        const { validateAddress } = this.props;

        return validateAddress({
            area: region ?? region_id,
            city,
            country_code: country_id,
            phone: phonecode + telephone,
            postcode: region ?? region_id,
            region: region ?? region_id,
            street: Array.isArray(street) ? street[0] : street
        });
    }

    handleValidationError(response) {
        const { showNotification } = this.props;

        const { parameters, message = '' } = response;
        const formattedParams = parameters ? capitalize(parameters[0]) : 'Address';

        showNotification('error', `${ formattedParams } ${ __('is not valid') }. ${ message }`);
    }

    handleAddress(address) {
        const { payload: { address: { id } } } = this.props;
        const { showNotification } = this.props;

        const validationResult = this.validateAddress(address);

        if (!validationResult) {
            showNotification('error', __('Something went wrong.'));
        }

        validationResult.then((response) => {
            const { success } = response;

            if (success) {
                if (id) {
                    return this.handleEditAddress(address);
                }

                return this.handleCreateAddress(address);
            }

            return this.handleValidationError(response);
        });
    }

    handleEditAddress(address) {
        const { showCards, payload: { address: { id } } } = this.props;
        const query = MyAccountQuery.getUpdateAddressMutation(id, address);
        fetchMutation(query).then(this.handleAfterAction, this.handleError).then(showCards);
    }

    handleDeleteAddress() {
        const { showCards, payload: { address: { id } } } = this.props;

        this.setState({ isLoading: true });
        const query = MyAccountQuery.getDeleteAddressMutation(id);
        fetchMutation(query).then(this.handleAfterAction, this.handleError).then(showCards);
    }

    handleCreateAddress(address) {
        const { showCards } = this.props;
        const query = MyAccountQuery.getCreateAddressMutation(address);
        fetchMutation(query).then(this.handleAfterAction, this.handleError).then(showCards);
    }

    render() {
        return (
            <MyAccountAddressPopup
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressPopupContainer);
