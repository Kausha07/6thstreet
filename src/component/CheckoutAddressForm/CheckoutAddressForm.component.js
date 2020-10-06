import {
    CheckoutAddressForm as SourceCheckoutAddressForm
} from 'SourceComponent/CheckoutAddressForm/CheckoutAddressForm.component';

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
            countryId !== prevCountryId
            || regionId !== prevRegionId
            || city !== prevCity
            || region !== prevRegion
            || postcode !== prevpostcode
            || street !== prevStreet
            || telephone !== prevTelephone
        ) {
            this.estimateShipping();
        }
    }

    get fieldMap() {
        // telephone, street country_id, region, region_id, city - are used for shipping estimation

        const {
            telephone,
            street,
            ...fieldMap
        } = super.fieldMap;

        fieldMap.telephone = {
            ...telephone,
            onChange: (value) => this.onChange('telephone', value)
        };

        fieldMap.street = {
            ...street,
            onChange: (value) => this.onChange('street', value)
        };

        return fieldMap;
    }

    estimateShipping() {
        const { onShippingEstimationFieldsChange } = this.props;

        const {
            countryId,
            regionId,
            region,
            city,
            postcode,
            telephone,
            street
        } = this.state;

        onShippingEstimationFieldsChange({
            country_code: countryId,
            region_id: regionId,
            region,
            area: region,
            city,
            postcode,
            phone: telephone,
            street,
            telephone: telephone.substring('4')
        });
    }
}

export default CheckoutAddressForm;
