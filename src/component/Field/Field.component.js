/* eslint jsx-a11y/label-has-associated-control: 0 */
// Disabled due bug in `renderCheckboxInput` function

import SourceField from 'SourceComponent/Field/Field.component';
import FieldInput from 'SourceComponent/FieldInput';

import {
    CHECKBOX_TYPE,
    NUMBER_TYPE,
    PASSWORD_TYPE,
    RADIO_TYPE,
    SELECT_TYPE,
    TEXTAREA_TYPE,
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

    renderInputOfType(type) {
        switch (type) {
        case CHECKBOX_TYPE:
            return this.renderCheckbox();
        case RADIO_TYPE:
            return this.renderRadioButton();
        case NUMBER_TYPE:
            return this.renderTypeNumber();
        case TEXTAREA_TYPE:
            return this.renderTextarea();
        case PASSWORD_TYPE:
            return this.renderTypePassword();
        case SELECT_TYPE:
            return this.renderSelectWithOptions();
        case TOGGLE_TYPE:
            return this.renderToggle();
        default:
            return this.renderTypeText();
        }
    }
}

export default Field;
