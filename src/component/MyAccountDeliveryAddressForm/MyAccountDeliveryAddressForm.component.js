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

import MyAccountAddressFieldForm from 'Component/MyAccountAddressFieldForm';
import { addressType } from 'Type/Account';
import { countriesType } from 'Type/Config';

export class MyAccountDeliveryAddressForm extends MyAccountAddressFieldForm {
    static propTypes = {
        address: addressType.isRequired,
        countries: countriesType.isRequired,
        default_country: PropTypes.string,
        onSave: PropTypes.func
    };

    static defaultProps = {
        default_country: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.country,
        onSave: () => {}
    };

    constructor(props) {
        super(props);

        const {
            countries,
            default_country,
            address: { city = null, country_id, region: { region_id } = {} }
        } = props;

        const countryId = country_id || default_country;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: availableRegions } = country || {};
        const regions = availableRegions || [{}];
        const regionId = region_id || regions[0].id;
        // console.log(props);

        this.state = {
            countryId,
            city,
            availableAreas: [],
            availableRegions,
            area: null,
            regionId,
            cities: [],
            postCodeValue: null
        };
    }

    componentDidUpdate(prevProps, _) {
        const { address: { region: { region: prevRegion } = {} } } = prevProps;
        const { address: { city }, address: { region: { region } = {} } } = this.props;
        const { cities, city: cityFromState } = this.state;

        // console.log('cityFromState', cityFromState);
        // console.log('cities', cities);
        // console.log('city', city);
        if (city && cities && cityFromState) {
            this.onCityChange(city);
        }

        if (prevRegion !== region) {
            this.setPostCode();
        }
    }

    copyValue = (text) => {
        this.setState({ initRegion: null, postCodeValue: text });
    };

    setPostCode() {
        const { address: { region: { region } = {} } } = this.props;
        this.setState({ postCodeValue: region });
    }

    getPostCodeValue() {
        const { postCodeValue } = this.state;
        const { address: { region: { region } = {} } } = this.props;
        if (postCodeValue == null) {
            return region;
        }

        return postCodeValue;
    }

    onFormSuccess = (fields) => {
        const { onSave } = this.props;
        const { region_id, region_string: region, ...newAddress } = fields;
        newAddress.region = { region_id, region };
        onSave(newAddress);
    };

    getRegionFields() {
        const { newForm } = this.props;
        const { address: { region: { region } = {} } } = this.props;
        // const { availableRegions, regionId } = this.state;
        const { availableAreas } = this.state;
        const clearValue = newForm ? { value: '' } : null;

        if (!availableAreas.length) {
            // console.log(availableAreas);
            return {
                region_string: {
                    validation: ['notEmpty'],
                    value: region,
                    placeholder: __('City area'),
                    ...clearValue,
                    onChange: this.copyValue
                }
            };
        }
        console.log('enter');
        return {
            region_id: {
                validation: ['notEmpty'],
                type: 'select',
                selectOptions: availableAreas.map((area) => ({ id: area, label: area, value: area })),
                onChange: this.copyValue,
                value: region,
                placeholder: __('City area'),
                ...clearValue
            }
        };
    }

    async getCitiesData() {
        const { cities } = this.state;
        if (cities.length === 0) {
            const test = await fetch('https://mobileapi.6thstreet.com/v2/cities?locale=en-ae');
            const json = await test.json();
            this.setState({ cities: json.data });
        }
    }

    // onCountryChange = (countryId) => {
    //     const { countries } = this.props;
    //     const country = countries.find(({ id }) => id === countryId);
    //     const { available_regions } = country;

    //     this.setState({
    //         countryId,
    //         availableRegions: available_regions || []
    //     });
    // };

    onCityChange = (selectedCity) => {
        const { cities } = this.state;
        const trueCity = cities.find(({ city }) => selectedCity === city);
        const { areas } = trueCity;

        this.setState({
            city: trueCity,
            availableAreas: areas || []
        });
    };

    closeField = (e) => {
        e.preventDefault();

        const { closeForm } = this.props;
        closeForm();
    };

    get fieldMap() {
        const { countryId, cities } = this.state;
        const {
            defaultChecked,
            changeDefaultShipping,
            countries,
            address,
            newForm,
            customer: {
                firstname,
                lastname
            }
        } = this.props;

        const { street = [] } = address;

        const clearValue = newForm ? { value: '' } : null;

        // console.log(countries);
        // console.log(cities);
        // const testCities = [{ id: 't1', label: 'l1' }];

        return {
            default_billing: {
                type: 'checkbox',
                value: 'default_billing',
                checked: defaultChecked
            },
            default_shipping: {
                type: 'checkbox',
                value: 'default_shipping',
                checked: defaultChecked
            },
            firstname: {
                validation: ['notEmpty'],
                value: firstname
            },
            lastname: {
                validation: ['notEmpty'],
                value: lastname
            },
            telephone: {
                validation: ['notEmpty'],
                placeholder: __('Phone Number'),
                ...clearValue

            },
            city: {
                validation: ['notEmpty'],
                placeholder: __('City'),
                ...clearValue,
                selectOptions: cities.map((item) => ({ id: item.city, label: item.city, value: item.city })),
                type: 'select',
                onChange: this.onCityChange
            },
            country_id: {
                type: 'select',
                validation: ['notEmpty'],
                value: countryId,
                selectOptions: countries.map(({ id, label }) => ({ id, label, value: id }))
                // onChange: this.onCountryChange
            },
            ...this.getRegionFields(),
            postcode: {
                placeholder: __('Post code'),
                value: this.getPostCodeValue()
            },
            street: {
                value: street[0],
                validation: ['notEmpty'],
                placeholder: __('Street Address'),
                ...clearValue
            },
            default_common: {
                type: 'toggle',
                label: __('Make default'),
                onChange: changeDefaultShipping,
                checked: defaultChecked
            }
        };
    }

    getDefaultValues(fieldEntry) {
        const [key, { value }] = fieldEntry;
        const { address: { [key]: addressValue } } = this.props;

        return {
            ...super.getDefaultValues(fieldEntry),
            value: value !== undefined ? value : addressValue
        };
    }

    renderActions() {
        return (
            <button
              type="submit"
              block="MyAccountBtn"
              mix={ { block: 'button primary' } }
            >
                { __('Save address') }
            </button>
        );
    }

    renderDiscart() {
        return (
            <button
              block="MyAccountBtn"
              elem="Discart"
              onClick={ this.closeField }
            >
                { __('Discart') }
            </button>
        );
    }
}

export default MyAccountDeliveryAddressForm;
