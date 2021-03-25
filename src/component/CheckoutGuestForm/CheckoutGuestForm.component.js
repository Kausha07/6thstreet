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

import FieldForm from 'Component/FieldForm/FieldForm.component';
import MyAccountOverlay from 'Component/MyAccountOverlay';
import { isArabic } from 'Util/App';

import lock from './icons/lock.png';

import './CheckoutGuestForm.style';

export class CheckoutGuestForm extends FieldForm {
    static propTypes = {
        requestCustomerData: PropTypes.func.isRequired,
        formId: PropTypes.string.isRequired,
        handleEmailInput: PropTypes.func.isRequired,
        handleCreateUser: PropTypes.func.isRequired,
        isEmailAdded: PropTypes.bool.isRequired
    };

    state = {
        showPopup: false,
        isArabic: isArabic()
    };

    get fieldMap() {
        const {
            handleEmailInput,
            handlePasswordInput,
            formId,
            isCreateUser
        } = this.props;

        const fields = {
            guest_email: {
                label: __('Email'),
                form: formId,
                placeholder: __('Email'),
                validation: ['notEmpty', 'email'],
                onChange: handleEmailInput,
                skipValue: true
            }
        };

        if (isCreateUser) {
            fields.guest_password = {
                form: formId,
                label: __('Create Password'),
                onChange: handlePasswordInput,
                validation: ['notEmpty', 'password'],
                type: 'password',
                skipValue: true
            };
        }

        return fields;
    }

    renderHeading(text) {
        const { isEmailAdded } = this.props;
        return (
            <h2
              block="Checkout"
              elem="Heading"
              mods={ { isEmailAdded } }
            >
                { __(text) }
            </h2>
        );
    }

    renderMyAccountPopup() {
        const { showPopup } = this.state;

        if (!showPopup) {
            return null;
        }

        return <MyAccountOverlay closePopup={ this.closePopup } onSignIn={ this.onSignIn } isPopup />;
    }

    onSignIn = () => {
        const { requestCustomerData } = this.props;

        requestCustomerData();
        this.closePopup();
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };

    showMyAccountPopup = () => {
        this.setState({ showPopup: true });
    };

    render() {
        const { isEmailAdded } = this.props;
        const { isArabic } = this.state;

        return (
            <div
              block="CheckoutGuestForm"
              mods={ { isEmailAdded } }
              mix={ { block: 'FieldForm' } }
            >
                <div
                  block="CheckoutGuestForm"
                  elem="FieldAndSignIn"
                  mods={ { isArabic } }
                >
                    <button onClick={ this.showMyAccountPopup }>
                        { __('Sign In') }
                        <img src={ lock } alt="" />
                    </button>
                </div>
                { this.renderMyAccountPopup() }
            </div>
        );
    }
}

export default CheckoutGuestForm;
