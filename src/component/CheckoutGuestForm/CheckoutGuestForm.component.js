import {
    CheckoutGuestForm as SourceCheckoutGuestForm
} from 'SourceComponent/CheckoutGuestForm/CheckoutGuestForm.component';
import isMobile from 'Util/Mobile';

import './CheckoutGuestForm.style';

export class CheckoutGuestForm extends SourceCheckoutGuestForm {
    renderHeading() {
        if (isMobile.any() || isMobile.tablet()) {
            return (
                <span block="Checkout" elem="Heading">
                    { __('Where can we send your order?') }
                </span>
            );
        }

        return null;
    }

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
}

export default CheckoutGuestForm;
