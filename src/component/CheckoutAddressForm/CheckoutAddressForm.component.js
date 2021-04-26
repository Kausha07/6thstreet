/* eslint-disable no-magic-numbers */
import FormPortal from 'Component/FormPortal';
import {
    CheckoutAddressForm as SourceCheckoutAddressForm
} from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.component';

import './CheckoutAddressForm.style';

const objTabIndex = 
{
    "city" : "6",
    "telephone" : "9",
    "street" : "5",
    "postcode" : "11",
    "phonecode" : "8",
    "firstname" : "2",
    "guest_email" : "4",
    "lastname" : "3",
    "country_id" : "10",
    "region_string" : "7"
};
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

        const fFieldMap = isSignedIn ? fieldMap : {
            guest_email: {
                placeholder: __('Email'),
                validation: ['notEmpty', 'email'],
                type: 'email',
                value: guest_email || ''
            },
            ...fieldMap
        };
        if(this.props.isSignedIn === false) {
            let result = {};
            for (const [key, value] of Object.entries(fFieldMap)) {
                if(!fFieldMap[key].tabIndex) {
                    let o = Object.assign({}, value);
                    o.tabIndex= objTabIndex[key];
                    result[key] = o;
                }
            }
            //console.info("result",result);
            return result;
        }
        return fFieldMap;
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
            telephone :  this.renderCurrentPhoneCode() + telephone
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
