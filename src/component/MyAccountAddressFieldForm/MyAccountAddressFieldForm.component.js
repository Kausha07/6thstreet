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

import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';

import './MyAccountAddressFieldForm.style';

export class MyAccountAddressFieldForm extends PureComponent {
    onFormSuccess() {
        // TODO: implement
    }

    get fieldMap() {
        return {
            // email: {
            //     label: __('Email'),
            //     validation: ['notEmpty']
            // }
        };
    }

    getDefaultValues([key, props]) {
        const {
            type = 'text',
            onChange = () => {},
            ...otherProps
        } = props;

        return {
            ...otherProps,
            key,
            name: key,
            id: key,
            type,
            onChange
        };
    }

    renderField = (fieldEntry) => (
        <Field { ...this.getDefaultValues(fieldEntry) } />
    );

    renderFields() {
        const {
            default_billing,
            default_shipping,
            firstname,
            lastname,
            country_id,
            telephone,
            street,
            city,
            postcode,
            default_common
        } = this.fieldMap;

        return (
            <div
              block="MyAccountAddressFieldForm"
              elem="Fields"
            >
                <h2>{ __('New Address') }</h2>
                <div
                  block="MyAccountAddressFieldForm"
                  elem="FieldWrapper"
                  mods={ { hidden: true } }
                >
                    { this.renderField(['default_billing', default_billing]) }
                    { this.renderField(['default_shipping', default_shipping]) }
                    { this.renderField(['firstname', firstname]) }
                    { this.renderField(['lastname', lastname]) }
                    { this.renderField(['country_id', country_id]) }
                </div>

                <div
                  block="MyAccountAddressFieldForm"
                  elem="FieldWrapper"
                  mods={ { street: true } }
                >
                    { this.renderField(['street', street]) }
                </div>

                <div
                  block="MyAccountAddressFieldForm"
                  elem="FieldWrapper"
                  mods={ { twoFields: true } }
                >
                    { this.renderField(['postcode', postcode]) }
                    { this.renderField(['city', city]) }
                </div>

                <div
                  block="MyAccountAddressFieldForm"
                  elem="FieldWrapper"
                  mods={ { phone: true } }
                >
                    { this.renderField(['telephone', telephone]) }
                </div>

                <div
                  block="MyAccountAddressFieldForm"
                  elem="FieldWrapper"
                  mods={ { toggle: true } }
                >
                    { this.renderField(['default_common', default_common]) }
                    <span>{ __('Make default') }</span>
                </div>
            </div>
        );
    }

    renderActions() {
        return null;
    }

    render() {
        return (
            <Form
              onSubmitSuccess={ this.onFormSuccess }
              mix={ { block: 'MyAccountAddressFieldForm' } }
            >
                { this.renderFields() }
                { this.renderActions() }
            </Form>
        );
    }
}

export default MyAccountAddressFieldForm;
