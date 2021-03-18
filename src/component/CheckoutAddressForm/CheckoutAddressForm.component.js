/* eslint-disable no-magic-numbers */
import FormPortal from 'Component/FormPortal';
import {
    CheckoutAddressForm as SourceCheckoutAddressForm
} from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.component';

import './CheckoutAddressForm.style';

export class CheckoutAddressForm extends SourceCheckoutAddressForm {
    componentDidUpdate(_, prevState) {
        const {
            countryId,
            regionId,
            region,
            city,
            postcode,
            street,
            telephone
        } = this.state;

        const {
            countryId: prevCountryId,
            regionId: prevRegionId,
            region: prevRegion,
            city: prevCity,
            postcode: prevpostcode,
            street: prevStreet,
            telephone: prevTelephone
        } = prevState;

        if (
            (countryId !== prevCountryId
            || regionId !== prevRegionId
            || city !== prevCity
            || region !== prevRegion
            || postcode !== prevpostcode
            || street !== prevStreet
            || telephone !== prevTelephone)
            && (city, regionId, telephone) && (telephone.length > 7)
        ) {
            this.estimateShipping();
        }
    }

    get fieldMap() {
        this.getCitiesAndRegionsData();

        const { isSignedIn, shippingAddress: { guest_email } } = this.props;

        const {
            telephone,
            street,
            ...fieldMap
        } = super.fieldMap;

        fieldMap.street = {
            ...street,
            onChange: (value) => this.onChange('street', value)
        };
        fieldMap.telephone = {
            ...telephone,
            onChange: (value) => this.onChange('telephone', value),
            type: 'phone'
        };

        return isSignedIn ? fieldMap : {
            guest_email: {
                placeholder: __('Email'),
                validation: ['notEmpty', 'email'],
                type: 'email',
                value: guest_email || ''
            },
            ...fieldMap
        };
    }

    estimateShipping() {
        const { onShippingEstimationFieldsChange } = this.props;

        const {
            countryId,
            regionId,
            city,
            telephone = '',
            street
        } = this.state;

        onShippingEstimationFieldsChange({
            country_code: countryId,
            street,
            region: regionId,
            area: regionId,
            city,
            postcode: regionId,
            phone: this.renderCurrentPhoneCode() + telephone,
            telephone
        });
    }

    render() {
        const { id, isSignedIn } = this.props;
        const { isArabic } = this.state;

        const isGuestForm = !isSignedIn;

        return (
            <FormPortal
              id={ id }
              name="CheckoutAddressForm"
            >
                    <div
                      block="FieldForm"
                      mix={ { block: 'CheckoutAddressForm', mods: { isGuestForm } } }
                      mods={ { isArabic } }
                    >
                        { this.renderFields() }
                    </div>
            </FormPortal>
        );
    }
}

export default CheckoutAddressForm;
