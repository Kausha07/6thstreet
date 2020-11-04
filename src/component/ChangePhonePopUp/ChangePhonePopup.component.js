import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';

import './ChangePhonePopup.style.scss';

class ChangePhonePopup extends PureComponent {
    static propTypes = {
        isChangePhonePopupOpen: PropTypes.bool.isRequired
    };

    render() {
        const { isChangePhonePopupOpen } = this.props;
        console.log(isChangePhonePopupOpen);

        return (
            <div
              block="ChangePhonePopup"
              mods={ { isChangePhonePopupOpen } }
            >
                <div
                  block="ChangePhonePopup"
                  elem="Background"
                />
                <div
                  block="ChangePhonePopup"
                  elem="Content"
                >
                    <div
                      block="ChangePhonePopup"
                      elem="Content-Title"
                    >
                        { __('Input new phone number and send Verification code again') }
                    </div>
                    <Form>
                        <Field
                          type="text"
                        />
                        <button
                          block="primary"
                          type="submit"
                        >
                            { __('change phone') }
                        </button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ChangePhonePopup;
