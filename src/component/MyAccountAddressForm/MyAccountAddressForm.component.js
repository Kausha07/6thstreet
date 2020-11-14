import PropTypes from 'prop-types';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import {
    MyAccountAddressForm as SourceMyAccountAddressForm
} from 'SourceComponent/MyAccountAddressForm/MyAccountAddressForm.component';
import { addressType } from 'Type/Account';
import { countriesType } from 'Type/Config';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import {
    COUNTRY_CODES_FOR_PHONE_VALIDATION,
    PHONE_CODES
} from './MyAccountAddressForm.config';

export class MyAccountAddressForm extends SourceMyAccountAddressForm {
    static propTypes = {
        address: addressType.isRequired,
        countries: countriesType.isRequired,
        default_country: PropTypes.string,
        onSave: PropTypes.func,
        changeDefaultShipping: PropTypes.func.isRequired
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
            area: null,
            regionId,
            cities: [],
            isArabic: isArabic(),
            defaultChecked: false
        };
    }

    getCitiesBasedOnLanguage() {
        const { isArabic, cities } = this.state;

        if (isArabic) {
            return cities.map((item) => ({ id: item.city, label: item.city_ar, value: item.city }));
        }

        return cities.map((item) => ({ id: item.city, label: item.city, value: item.city }));
    }

    getRegionsBasedOnLanguage() {
        const { isArabic, cities, city } = this.state;

        const CurrentCity = city;

        if (isArabic) {
            const trueCity = cities.find(({ city }) => CurrentCity === city);

            if (trueCity) {
                const { areas_ar, areas } = trueCity;

                // eslint-disable-next-line arrow-body-style
                return areas_ar.map((area_ar, i) => {
                    return { id: areas[i], label: area_ar, value: areas[i] };
                });
            }
        }

        const trueCity = cities.find(({ city }) => CurrentCity === city);

        return trueCity ? trueCity.areas.map((area) => ({ id: area, label: area, value: area })) : null;
    }

    getRegionFields() {
        const {
            city, regionId
        } = this.state;

        if (!city) {
            return {
                region_string: {
                    validation: ['notEmpty'],
                    placeholder: __('Area'),
                    value: regionId
                }
            };
        }

        return {
            region_id: {
                validation: ['notEmpty'],
                type: 'select',
                selectOptions: this.getRegionsBasedOnLanguage(),
                onChange: (regionId) => this.setState({ regionId }),
                value: regionId,
                placeholder: __('Area')
            }
        };
    }

    async getCitiesAndRegionsData() {
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

    renderCurrentPhoneCode() {
        const { countryId } = this.state;

        return PHONE_CODES[countryId];
    }

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

    renderStreetPlaceholder() {
        return isMobile.any() || isMobile.tablet()
            ? __('Street address')
            : __('Type your address here');
    }

    renderContentType() {
        const { isSignedIn } = this.props;

        return isSignedIn ? 'toggle' : 'hide';
    }

    get fieldMap() {
        const {
            countryId,
            city,
            defaultChecked,
            regionId
        } = this.state;

        const {
            countries,
            address
        } = this.props;

        const { street = [] } = address;

        return {
            country_id: {
                type: 'select',
                label: <CountryMiniFlag label={ countryId } />,
                validation: ['notEmpty'],
                value: countryId,
                autocomplete: 'none',
                selectOptions: countries.map(({ id, label }) => ({ id, label, value: id }))
            },
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
                placeholder: __('First Name'),
                validation: ['notEmpty'],
                type: 'hidden',
                label: __('Delivering to')
            },
            lastname: {
                placeholder: __('Last Name'),
                validation: ['notEmpty'],
                type: 'hidden'
            },
            phonecode: {
                type: 'text',
                label: <CountryMiniFlag label={ countryId } />,
                validation: ['notEmpty'],
                value: this.renderCurrentPhoneCode(),
                autocomplete: 'none'
            },
            telephone: {
                validation: ['notEmpty', this.getValidationForTelephone()],
                maxLength: this.getPhoneNumberMaxLength(),
                placeholder: __('Phone Number')
            },
            city: {
                validation: ['notEmpty'],
                placeholder: __('City'),
                selectOptions: this.getCitiesBasedOnLanguage(),
                type: 'select',
                value: city,
                onChange: (city) => this.setState({ city })
            },
            ...this.getRegionFields(),
            postcode: {
                validation: ['notEmpty'],
                value: regionId
            },
            street: {
                value: street[0],
                validation: ['notEmpty'],
                placeholder: this.renderStreetPlaceholder()
            }
        };
    }
}

export default MyAccountAddressForm;
