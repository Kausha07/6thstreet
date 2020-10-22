import PropTypes from 'prop-types';

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayments from 'Component/CheckoutPayments';
import Field from 'Component/Field';
import {
    CheckoutBilling as SourceCheckoutBilling
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.component';

import './CheckoutBilling.extended.style';

export class CheckoutBilling extends SourceCheckoutBilling {
    static propTypes = {
        ...SourceCheckoutBilling.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired
    };

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            totals: { is_virtual }
        } = this.props;

        if (!isSameAsShipping && !is_virtual) {
            return null;
        }

        return (
            <CheckoutAddressBook
              onAddressSelect={ onAddressSelect }
              isBilling
            />
        );
    }

    renderDifferentBillingLabel = () => (
        <>
            { __('Add a different ') }
            <span>
                { __('Billing address') }
            </span>
        </>
    );

    renderSameAsShippingCheckbox() {
        const {
            isSameAsShipping,
            onSameAsShippingChange,
            totals: { is_virtual }
        } = this.props;

        if (is_virtual) {
            return null;
        }

        return (
            <Field
              id="sameAsShippingAddress"
              name="sameAsShippingAddress"
              type="toggle"
              label={ this.renderDifferentBillingLabel() }
              value="sameAsShippingAddress"
              mix={ { block: 'CheckoutBilling', elem: 'Checkbox' } }
              checked={ isSameAsShipping }
              onChange={ onSameAsShippingChange }
            />
        );
    }

    renderPayments() {
        const {
            paymentMethods,
            onPaymentMethodSelect,
            setLoading,
            setDetailsStep,
            shippingAddress,
            setTabbyWebUrl
        } = this.props;

        if (!paymentMethods.length) {
            return null;
        }

        return (
            <CheckoutPayments
              setLoading={ setLoading }
              setDetailsStep={ setDetailsStep }
              paymentMethods={ paymentMethods }
              onPaymentMethodSelect={ onPaymentMethodSelect }
              setOrderButtonVisibility={ this.setOrderButtonVisibility }
              billingAddress={ shippingAddress }
              setOrderButtonEnableStatus={ this.setOrderButtonEnableStatus }
              setTabbyWebUrl={ setTabbyWebUrl }
            />
        );
    }
}

export default CheckoutBilling;
