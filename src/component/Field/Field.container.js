/* eslint jsx-a11y/label-has-associated-control: 0 */
// Disabled due bug in `renderCheckboxInput` function

import SourceField from 'SourceComponent/Field/Field.container';

import './Field.extended.style';

/**
 * Input fields component
 * @class Field
 */
export class FieldContainer extends SourceField {
    containerProps = () => {
        const {
            checked: propsChecked
        } = this.props;

        const {
            value
        } = this.state;

        return {
            checked: propsChecked,
            value
        };
    };
}

export default FieldContainer;
