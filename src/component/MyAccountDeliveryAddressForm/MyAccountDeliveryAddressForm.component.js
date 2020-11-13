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
import { COUNTRY_CODES_FOR_PHONE_VALIDATION } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import { addressType } from 'Type/Account';
import { countriesType } from 'Type/Config';
import { isArabic } from 'Util/App';

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
            address: {
                city = null,
                country_id,
                region: { region_id } = {}
            }
        } = props;

        const countryId = country_id || default_country;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: availableRegions } = country || {};
        const regions = availableRegions || [{}];
        const regionId = region_id || regions[0].id;

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
        const {
            address: {
                city: prevCity,
                region: { region: prevRegion } = {}
            }
        } = prevProps;
        const { address: { city, region: { region } = {} } } = this.props;

        if (prevCity !== city) {
            this.onCityChange(city);
        }

        if (prevRegion !== region) {
            this.setPostCode();
        }
    }

    copyValue = (text) => {
        this.setState({ postCodeValue: text });
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
        const {
            region_id,
            region_string: region,
            telephone,
            ...newAddress
        } = fields;

        newAddress.region = { region_id, region };
        newAddress.telephone = this.addPhoneCode() + telephone;
        onSave(newAddress);
    };

    getRegionFields() {
        const { newForm, address: { city, region: { region } = {} } } = this.props;
        const { availableAreas, cities } = this.state;
        const clearValue = newForm ? { value: '' } : null;

        if (cities.length && city && !availableAreas.length) {
            this.setArea(city);
        }

        if (!availableAreas.length) {
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

        return {
            region_id: {
                validation: ['notEmpty'],
                type: 'select',
                selectOptions: availableAreas.map(({ key, label }) => ({ id: key, label, value: key })),
                value: region,
                placeholder: __('City area'),
                ...clearValue,
                onChange: this.copyValue
            }
        };
    }

    async getCitiesData() {
        const { cities } = this.state;
        const { getCities } = this.props;

        if (cities.length === 0) {
            getCities().then(
                (response) => {
                    if (response && response.data) {
                        this.setState({ cities: response.data });
                    }
                }
            );
        }
    }

    setArea = (cityFromProps) => {
        const { cities } = this.state;

        if (isArabic()) {
            const trueArabicCity = cities.find(({ city }) => cityFromProps === city);
            if (trueArabicCity) {
                const { areas_ar, areas } = trueArabicCity;

                // eslint-disable-next-line arrow-body-style
                const result = areas_ar.map((area_ar, i) => {
                    return { label: area_ar, key: areas[i] };
                });

                this.setState({
                    availableAreas: result || []
                });
            }

            return;
        }
        const trueCity = cities.find(({ city }) => cityFromProps === city);

        if (trueCity) {
            const { areas } = trueCity;

            // eslint-disable-next-line arrow-body-style
            const result = areas.map((area) => {
                return { label: area, key: area };
            });

            this.setState({
                availableAreas: result || []
            });
        }
    };

    onCityChange = (selectedCity) => {
        const { cities } = this.state;

        if (isArabic()) {
            const trueArabicCity = cities.find(({ city }) => selectedCity === city);

            if (trueArabicCity) {
                const { areas_ar, areas } = trueArabicCity;

                // eslint-disable-next-line arrow-body-style
                const result = areas_ar.map((area_ar, i) => {
                    return { label: area_ar, key: areas[i] };
                });

                this.setState({
                    city: trueArabicCity,
                    availableAreas: result || []
                });
            }

            return;
        }
        const trueCity = cities.find(({ city }) => selectedCity === city);

        if (trueCity) {
            const { areas } = trueCity;

            // eslint-disable-next-line arrow-body-style
            const result = areas.map((area) => {
                return { label: area, key: area };
            });

            this.setState({
                city: trueCity,
                availableAreas: result || []
            });
        }
    };

    closeField = (e) => {
        e.preventDefault();

        const { closeForm } = this.props;
        closeForm();
    };

    addPhoneCode = () => {
        const { default_country } = this.props;
        const code = this.renderCurrentPhoneCode(default_country);
        return code;
    };

    cutPhoneCode(phone) {
        if (phone) {
            // eslint-disable-next-line no-magic-numbers
            return phone.slice(4);
        }

        return phone;
    }

    getCitiesSelectOptions = () => {
        const { cities } = this.state;

        if (isArabic()) {
            return cities.map((item) => ({ id: item.city, label: item.city_ar, value: item.city }));
        }

        return cities.map((item) => ({ id: item.city, label: item.city, value: item.city }));
    };

    getAreasSelectOptions = () => {
        const { availableAreas } = this.state;

        if (isArabic()) {
            return availableAreas.map((area) => ({ id: area, label: area, value: area }));
        }

        return availableAreas.map((area) => ({ id: area, label: area, value: area }));
    };

    getValidationForTelephone() {
        const { default_country } = this.props;

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[default_country]
            ? 'telephoneAE' : 'telephone';
    }

    getPhoneNumberMaxLength() {
        const { default_country } = this.props;

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[default_country]
            ? '9' : '8';
    }

    get fieldMap() {
        const {
            defaultChecked,
            changeDefaultShipping,
            address,
            newForm,
            default_country,
            customer: {
                firstname,
                lastname
            }
        } = this.props;

        const { telephone, street = [] } = address;

        const clearValue = newForm ? { value: '' } : null;

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
            phoneCode: {

            },
            telephone: {
                validation: ['notEmpty', this.getValidationForTelephone()],
                maxLength: this.getPhoneNumberMaxLength(),
                placeholder: __('Phone Number'),
                value: this.cutPhoneCode(telephone),
                ...clearValue
            },
            city: {
                validation: ['notEmpty'],
                placeholder: __('City'),
                ...clearValue,
                selectOptions: this.getCitiesSelectOptions(),
                type: 'select',
                onChange: this.onCityChange
            },
            country_id: {
                validation: ['notEmpty'],
                value: default_country
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
                { __('Cancel') }
            </button>
        );
    }
}

export default MyAccountDeliveryAddressForm;
