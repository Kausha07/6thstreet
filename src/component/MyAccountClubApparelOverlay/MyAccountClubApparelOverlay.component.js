/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CountryMiniFlag from 'Component/CountryMiniFlag';
import Field from 'Component/Field';
import Form from 'Component/Form';
import { PHONE_CODES } from 'Component/MyAccountAddressFieldForm/MyAccountAddressFieldForm.config';
import ClubApparelLogoAR from 'Component/MyAccountClubApparel/images/ca-trans-ar-logo.png';
import ClubApparelLogoEN from 'Component/MyAccountClubApparel/images/ca-trans-logo.png';
import Popup from 'SourceComponent/Popup';
import { isArabic } from 'Util/App';

import {
    STATE_LINK,
    STATE_NOT_SUCCESS,
    STATE_SUCCESS,
    STATE_VERIFY
} from './MyAccountClubApparelOverlay.config';

import './MyAccountClubApparelOverlay.style';

class MyAccountClubApparelOverlay extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired,
        handleLink: PropTypes.func.isRequired,
        handleVerify: PropTypes.func.isRequired,
        handleSuccess: PropTypes.func.isRequired,
        handleNotSucces: PropTypes.func.isRequired,
        state: PropTypes.string.isRequired,
        verifyOtp: PropTypes.func.isRequired,
        phone: PropTypes.string.isRequired,
        renderAbout: PropTypes.func.isRequired,
        renderEarn: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic(),
        isButtonDisabled: true
    };

    renderMap = {
        [STATE_LINK]: {
            render: () => this.renderLink()
        },
        [STATE_VERIFY]: {
            render: () => this.renderVerify()
        },
        [STATE_SUCCESS]: {
            render: () => this.renderSuccess()
        },
        [STATE_NOT_SUCCESS]: {
            render: () => this.renderNotSuccess()
        }
    };

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

    handleVerifyChange = (e) => {
        console.log(e.length);
        // eslint-disable-next-line no-magic-numbers
        this.setState({ isButtonDisabled: e.length !== 5 });
    };

    renderEarn = () => {
        const { renderEarn } = this.props;

        return (
            <div block="MyAccountClubApparelOverlay" elem="Earn">
                { renderEarn() }
            </div>
        );
    };

    renderField = (fieldEntry) => (
        <Field { ...this.getDefaultValues(fieldEntry) } />
    );

    renderCurrentPhoneCode(country_id) {
        return PHONE_CODES[country_id];
    }

    renderPhone() {
        const {
            country
        } = this.props;

        const phone = {
            block: 'MyAccountClubApparelOverlay',
            elem: 'LinkAccountPhoneField',
            validation: ['notEmpty'],
            placeholder: 'Phone Number',
            value: '',
            id: 'phone',
            name: 'phone'
        };

        return (
            <div
              block="MyAccountClubApparelOverlay"
              elem="LinkAccountPhone"
            >
                    { this.renderField(['phone', phone]) }
                    <div
                      block="MyAccountClubApparelOverlay"
                      elem="PhoneCode"
                    >
                        <CountryMiniFlag label={ country } />
                        { this.renderCurrentPhoneCode(country) }
                    </div>
            </div>
        );
    }

    renderSuccess() {
        const { hideActiveOverlay } = this.props;

        return (
            <div block="MyAccountClubApparelOverlay" elem="Success">
                <p>
                    { __('You have successfully linked your 6thstreet.com Account with your ') }
                    <span>{ __('Club Apparel') }</span>
                    { __(' Account.') }
                </p>
                <p>{ __('Now, start earning Points on every purchase!') }</p>
                <button
                  block="MyAccountClubApparelOverlay"
                  elem="LinkAccountButton"
                  onClick={ hideActiveOverlay }
                >
                    { __('continue') }
                </button>
            </div>
        );
    }

    renderNotSuccess() {
        const { hideActiveOverlay } = this.props;

        return (
            <div block="MyAccountClubApparelOverlay" elem="NotSuccess">
                <h3>{ __('Linking Unsuccesful!') }</h3>
                <p block="MyAccountClubApparelOverlay" elem="NotSuccessParagraphRed">
                    { __('Sorry! We were unable to find a ') }
                    <span>{ __('Club Apparel') }</span>
                    { __(' Account with this number.') }
                </p>
                <p block="MyAccountClubApparelOverlay" elem="NotSuccessParagraph">
                    { __('If you are not already a ') }
                    <span>{ __('Club Apparel') }</span>
                    { __(' member, download the ') }
                    <span>{ __('Club Apparel App') }</span>
                    { __(' and Register prior to linking accounts.') }
                </p>
                <button
                  block="MyAccountClubApparelOverlay"
                  elem="LinkAccountButton"
                  onClick={ hideActiveOverlay }
                >
                    { __('close') }
                </button>
            </div>
        );
    }

    renderLink() {
        const { handleVerify } = this.props;

        return (
            <>
                <p>{ __('Link Your Account by entering your mobile number') }</p>
                <Form
                  onSubmitSuccess={ handleVerify }
                >
                    { this.renderPhone() }
                    <button
                      block="MyAccountClubApparelOverlay"
                      elem="LinkAccountButton"
                      type="submit"
                    >
                        { __('Link Account') }
                    </button>
                </Form>
            </>
        );
    }

    renderVerify() {
        const { verifyOtp, country, phone } = this.props;
        const { isButtonDisabled } = this.state;

        return (
            <div block="MyAccountClubApparelOverlay" elem="Verify">
                <p>
                    { __(`Enter the verification code we sent to ${this.renderCurrentPhoneCode(country)} ${phone}`) }
                </p>
                <Form
                  onSubmitSuccess={ verifyOtp }
                >
                    <Field
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="•••••"
                      pattern="[0-9]*"
                      onChange={ this.handleVerifyChange }
                      validation={ ['notEmpty'] }
                      maxlength="5"
                    />
                    <button
                      block="MyAccountClubApparelOverlay"
                      elem="VerifyButton"
                      type="submit"
                      disabled={ isButtonDisabled }
                    >
                        { __('Verify number') }
                    </button>
                    <button
                      block="MyAccountClubApparelOverlay"
                      elem="VerifyResend"
                    >
                        { __('Resend Verification Code') }
                    </button>
                </Form>
            </div>
        );
    }

    renderOverlay() {
        const { isArabic } = this.state;
        const {
            state
        } = this.props;
        const { render } = this.renderMap[state];

        return (
            <Popup
              mix={ { block: 'MyAccountClubApparelOverlay', mods: { isArabic } } }
              id="LinkAccount"
              title="Link"
            >
                <div block="MyAccountClubApparelOverlay" elem="LinkAccountBanner">
                    <img
                      block="MyAccountClubApparelOverlay"
                      elem="LinkAccountLogo"
                      src={ isArabic ? ClubApparelLogoAR : ClubApparelLogoEN }
                      alt="Logo icon"
                    />
                </div>
                { render() }
            </Popup>
        );
    }

    render() {
        return (
            <div block="MyAccountClubApparelOverlay">
                { this.renderOverlay() }
            </div>
        );
    }
}

export default MyAccountClubApparelOverlay;
