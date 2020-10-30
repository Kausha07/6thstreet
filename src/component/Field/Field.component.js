/* eslint jsx-a11y/label-has-associated-control: 0 */
// Disabled due bug in `renderCheckboxInput` function

import SourceField from 'SourceComponent/Field/Field.component';
import FieldInput from 'SourceComponent/FieldInput';

import {
    CHECKBOX_TYPE, DATE_TYPE,
    RADIO_TYPE,
    TOGGLE_TYPE
} from './Field.config';

import './Field.extended.style';

/**
 * Input fields component
 * @class Field
 */
export class Field extends SourceField {
    renderToggle() {
        const {
            id,
            onChangeCheckbox
        } = this.props;

        return (
            <div block="Field" elem="Toggle">
                <FieldInput
                  { ...this.props }
                  type="checkbox"
                  onChange={ onChangeCheckbox }
                />
                <div>
                    <label htmlFor={ id } />
                </div>
            </div>
        );
    }

    renderLabel() {
        const { type } = this.props;

        if (
            type === RADIO_TYPE
            || type === CHECKBOX_TYPE
        ) {
            return null;
        }

        return super.renderLabel();
    }

    renderDate() {
        return (
            <FieldInput
              { ...this.props }
              type="date"
            />
        );
    }

    renderInputOfType(type) {
        if (type === TOGGLE_TYPE) {
            return this.renderToggle();
        }

        if (type === DATE_TYPE) {
            return this.renderDate();
        }

        return super.renderInputOfType(type);
    }
}

export default Field;
