/* eslint jsx-a11y/label-has-associated-control: 0 */
// Disabled due bug in `renderCheckboxInput` function

import SourceField from 'SourceComponent/Field/Field.component';
import FieldInput from 'SourceComponent/FieldInput';

import {
    CHECKBOX_TYPE,
    DATE_TYPE,
    EMAIL_TYPE,
    PHONE_TYPE,
    RADIO_TYPE,
    TOGGLE_TYPE
} from './Field.config';

import './Field.extended.style';

/**
 * Input fields component
 * @class Field
 */
export class Field extends SourceField {
    renderRadioButton() {
        const {
            id,
            label,
            onClick
        } = this.props;

        return (
            <label htmlFor={ id }>
                <FieldInput
                  { ...this.props }
                  type="radio"
                  onChange={ onClick }
                />
                <label htmlFor={ id } />
                <span>{ label }</span>
            </label>
        );
    }

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
                    <label block="Field" elem="FakeLabel" htmlFor={ id } />
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

    renderTypeEmail() {
        return (
            <FieldInput
              { ...this.props }
              type="email"
            />
        );
    }

    renderPhone() {
        return (
            <FieldInput
              { ...this.props }
              type="number"
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

        if (type === EMAIL_TYPE) {
            return this.renderTypeEmail();
        }

        if (type === PHONE_TYPE) {
            return this.renderPhone();
        }

        return super.renderInputOfType(type);
    }
}

export default Field;
