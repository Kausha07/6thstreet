import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import Field from 'Component/Field';
import Form from 'Component/Form';
import { PHONE_CODES } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';

import './ChangePhonePopup.style.scss';

class ChangePhonePopup extends PureComponent {
    static propTypes = {
        isChangePhonePopupOpen: PropTypes.bool.isRequired,
        closeChangePhonePopup: PropTypes.func.isRequired,
        changePhone: PropTypes.func.isRequired,
        countryId: PropTypes.string.isRequired
    };

    state = {
        phoneValidation: ['telephone']
    };

    componentDidMount() {
        const { countryId } = this.props;
        console.log(countryId);
        if (countryId === 'AE') {
            this.setState({ phoneValidation: ['telephoneAE'] });
        }
    }

    renderCurrentPhoneCode() {
        const { countryId } = this.props;

        return PHONE_CODES[countryId];
    }

    renderCloseBtn() {
        const { closeChangePhonePopup } = this.props;
        const { isArabic } = this.state;

        const svg = (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 -1 26 26"
            >
                <path
                  d="M23.954 21.03l-9.184-9.095 9.092-9.174-1.832-1.807-9.09 9.179-9.176-9.088-1.81
                  1.81 9.186 9.105-9.095 9.184 1.81 1.81 9.112-9.192 9.18 9.1z"
                />
            </svg>
        );

        return (
            <button
              block="ChangePhonePopup"
              elem="Close"
              mods={ { isArabic } }
              onClick={ closeChangePhonePopup }
            >
                { svg }
            </button>
        );
    }

    render() {
        const {
            isChangePhonePopupOpen,
            changePhone,
            countryId
        } = this.props;
        const { phoneValidation } = this.state;

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
                    { this.renderCloseBtn() }
                    <div
                      block="ChangePhonePopup"
                      elem="Content-Title"
                    >
                        { __('Input new phone number and send Verification code again') }
                    </div>
                    <Form onSubmitSuccess={ changePhone }>
                        <div
                          block="ChangePhonePopup"
                          elem="Fields"
                        >
                            <Field
                              mix={ {
                                  block: 'ChangePhonePopup-Fields',
                                  elem: 'CountryCode'
                              } }
                              label={ <CountryMiniFlag label={ countryId } /> }
                              value={ this.renderCurrentPhoneCode() }
                              validation={ phoneValidation }
                            />
                            <Field
                              mix={ {
                                  block: 'ChangePhonePopup-Fields',
                                  elem: 'Phone'
                              } }
                              type="text"
                              name="newPhone"
                              id="newPhone"
                              validation={ ['telephone'] }
                            />
                        </div>
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
