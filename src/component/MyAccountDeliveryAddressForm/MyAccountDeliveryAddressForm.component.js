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
            address: { country_id, region: { region_id } = {} }
        } = props;

        const countryId = country_id || default_country;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: availableRegions } = country || {};
        const regions = availableRegions || [{}];
        const regionId = region_id || regions[0].id;

        this.state = {
            countryId,
            availableRegions,
            regionId
        };
    }

    onFormSuccess = (fields) => {
        const { onSave } = this.props;
        const { region_id, region_string: region, ...newAddress } = fields;
        newAddress.region = { region_id, region };
        onSave(newAddress);
    };

    getRegionFields() {
        const { address: { region: { region } = {} } } = this.props;
        const { availableRegions, regionId } = this.state;

        if (!availableRegions || !availableRegions.length) {
            return {
                region_string: {
                    label: __('State/Province'),
                    value: region
                }
            };
        }

        return {
            region_id: {
                label: __('State/Province'),
                type: 'select',
                selectOptions: availableRegions.map(({ id, name }) => ({ id, label: name, value: id })),
                onChange: (regionId) => this.setState({ regionId }),
                value: regionId
            }
        };
    }

    onCountryChange = (countryId) => {
        const { countries } = this.props;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions } = country;

        this.setState({
            countryId,
            availableRegions: available_regions || []
        });
    };

    closeField = (e) => {
        e.preventDefault();

        const { closeForm } = this.props;
        closeForm();
    };

    get fieldMap() {
        const { countryId } = this.state;
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

        if (newForm) {
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
                    value: firstname,
                    type: 'hidden'
                },
                lastname: {
                    validation: ['notEmpty'],
                    value: lastname,
                    type: 'hidden'
                },
                telephone: {
                    validation: ['notEmpty'],
                    placeholder: __('Phone Number'),
                    value: ''
                },
                city: {
                    validation: ['notEmpty'],
                    placeholder: __('City'),
                    value: ''
                },
                country_id: {
                    type: 'select',
                    validation: ['notEmpty'],
                    value: countryId,
                    selectOptions: countries.map(({ id, label }) => ({ id, label, value: id })),
                    onChange: this.onCountryChange
                },
                ...this.getRegionFields(),
                postcode: {
                    placeholder: __('Post code'),
                    value: ''
                },
                street: {
                    value: '',
                    validation: ['notEmpty'],
                    placeholder: __('Street Address')
                },
                default_common: {
                    type: 'toggle',
                    label: __('Make default'),
                    onChange: changeDefaultShipping,
                    checked: defaultChecked
                }
            };
        }

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
                value: firstname,
                type: 'hidden'
            },
            lastname: {
                validation: ['notEmpty'],
                value: lastname,
                type: 'hidden'
            },
            telephone: {
                validation: ['notEmpty'],
                placeholder: __('Phone Number')
            },
            city: {
                validation: ['notEmpty'],
                placeholder: __('City')
            },
            country_id: {
                type: 'select',
                validation: ['notEmpty'],
                value: countryId,
                selectOptions: countries.map(({ id, label }) => ({ id, label, value: id })),
                onChange: this.onCountryChange
            },
            ...this.getRegionFields(),
            postcode: {
                placeholder: __('Post code')
            },
            street: {
                value: street[0],
                validation: ['notEmpty'],
                placeholder: __('Street Address')
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
