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

import {
    Form as SourceForm
} from 'SourceComponent/Form/Form.component';
import { ChildrenType, MixType } from 'Type/Common';

export class Form extends SourceForm {
    static propTypes = {
        onSubmitSuccess: PropTypes.func,
        onSubmitError: PropTypes.func,
        onSubmit: PropTypes.func,
        children: ChildrenType.isRequired,
        id: PropTypes.string,
        mix: MixType,
        isValidateOnChange: PropTypes.bool,
        parentCallback: PropTypes.func
    };

    static defaultProps = {
        onSubmitSuccess: () => {},
        onSubmitError: () => {},
        onSubmit: () => {},
        parentCallback: () => {},
        mix: {},
        id: '',
        isValidateOnChange: false
    };

    onChange = async () => {
        const {
            id,
            isValidateOnChange,
            parentCallback
        } = this.props;

        if (isValidateOnChange) {
            const portalData = id ? await window.formPortalCollector.collect(id) : [];

            const {
                invalidFields
            } = portalData.reduce((acc, portalData) => {
                const {
                    invalidFields = [],
                    inputValues = {}
                } = portalData;

                const {
                    invalidFields: initialInvalidFields,
                    inputValues: initialInputValues
                } = acc;

                return ({
                    invalidFields: [...initialInvalidFields, ...invalidFields],
                    inputValues: { ...initialInputValues, ...inputValues }
                });
            }, this.collectFieldsInformation());

            const asyncData = Promise.all(portalData.reduce((acc, { asyncData }) => {
                if (!asyncData) {
                    return acc;
                }

                return [...acc, asyncData];
            }, []));

            asyncData.then(
                () => {
                    parentCallback(invalidFields);
                }
            );
        }
    };

    render() {
        const { mix, id } = this.props;
        const { children, fieldsAreValid } = this.state;

        return (
            <form
              block="Form"
              mix={ mix }
              mods={ { isInvalid: !fieldsAreValid } }
              ref={ (ref) => {
                  this.form = ref;
              } }
              id={ id }
              onSubmit={ this.handleFormSubmit }
              onChange={ this.onChange }
            >
                { children }
            </form>
        );
    }
}

export default Form;
