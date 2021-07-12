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
import { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import CountrySwitcher from 'Component/CountrySwitcher';
import LanguageSwitcher from 'Component/LanguageSwitcher';
import Field from 'SourceComponent/Field';
import Form from 'SourceComponent/Form';
import Loader from 'SourceComponent/Loader';
import Overlay from 'SourceComponent/Overlay';
import PhoneCountryCodeField from 'Component/PhoneCountryCodeField';
import { PHONE_CODES } from 'Component/MyAccountAddressFieldForm/MyAccountAddressFieldForm.config';
import { COUNTRY_CODES_FOR_PHONE_VALIDATION } from 'Component/MyAccountAddressForm/MyAccountAddressForm.config';
import { Close } from 'Component/Icons';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CONFIRM_EMAIL,
    STATE_CREATE_ACCOUNT,
    STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_LOGGED_IN,
    STATE_SIGN_IN,
    ENABLE_OTP_LOGIN,
    SSO_LOGIN_PROVIDERS
} from './MyAccountOverlay.config';

import './MyAccountOverlay.style';

export class MyAccountOverlay extends PureComponent {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        isOverlayVisible: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        state: PropTypes.oneOf([
            STATE_SIGN_IN,
            STATE_FORGOT_PASSWORD,
            STATE_FORGOT_PASSWORD_SUCCESS,
            STATE_CREATE_ACCOUNT,
            STATE_LOGGED_IN,
            STATE_CONFIRM_EMAIL
        ]).isRequired,
        onVisible: PropTypes.func.isRequired,
        onSignInSuccess: PropTypes.func.isRequired,
        onSignInAttempt: PropTypes.func.isRequired,
        onCreateAccountAttempt: PropTypes.func.isRequired,
        onCreateAccountSuccess: PropTypes.func.isRequired,
        onForgotPasswordSuccess: PropTypes.func.isRequired,
        onForgotPasswordAttempt: PropTypes.func.isRequired,
        onFormError: PropTypes.func.isRequired,
        handleForgotPassword: PropTypes.func.isRequired,
        handleSignIn: PropTypes.func.isRequired,
        handleCreateAccount: PropTypes.func.isRequired,
        onCreateAccountClick: PropTypes.func.isRequired,
        setRegisterFieldFalse: PropTypes.func,
        isCheckout: PropTypes.bool,
        registerField: PropTypes.bool,
        closePopup: PropTypes.func.isRequired,
        isHidden: PropTypes.bool,
        email: PropTypes.string
    };

    static defaultProps = {
        isCheckout: false,
        registerField: false,
        setRegisterFieldFalse: null,
        isHidden: false,
        email: ''
    };

    state = {
        isPopup: false,
        gender: 3,
        isChecked: false,
        isArabic: isArabic(),
        isSignInValidated: false,
        isCreateValidated: false,
        isForgotValidated: false,
        isOTP: ENABLE_OTP_LOGIN,
        countryCode: ''
    };

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: __('Welcome Back')
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword(),
            title: __('FORGOT PASSWORD')
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount()
        },
        [STATE_LOGGED_IN]: {
            render: () => {}
        },
        [STATE_CONFIRM_EMAIL]: {
            render: () => this.renderConfirmEmail(),
            title: __('Confirm the email')
        }
    };

    renderMyAccount() {
        const {
            state,
            handleSignIn,
            handleCreateAccount,
            onCreateAccountClick,
            setRegisterFieldFalse,
            registerField
        } = this.props;
        const { render, title } = this.renderMap[state];
        const isSignIn = state === STATE_SIGN_IN;
        const isCreateAccount = state === STATE_CREATE_ACCOUNT;

        if (registerField) {
            onCreateAccountClick();
            setRegisterFieldFalse();
        }

        // if (state === STATE_FORGOT_PASSWORD) {
        //     return (
        //         <div
        //             block="MyAccountOverlay"
        //             elem="Action"
        //             mods={ { state } }
        //         >
        //             <p block="MyAccountOverlay" elem="Heading">{ title }</p>
        //             { render() }
        //             { this.renderCloseBtn() }
        //         </div>
        //     );
        // }
    
        return (
            <div
              block="MyAccountOverlay"
              elem="Action"
              mods={ { state } }
            >
                <div
                  block="MyAccountOverlay"
                  elem="Image"
                  src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/6street-login-banner.png"
                  alt=""
                >
                    <span>6</span>
                    TH
                    <span>S</span>
                    TREET
                </div>
                <div block="MyAccountOverlay" elem="Buttons">
                    <button block="Button" mods={ { isSignIn } } onClick={ handleSignIn }>{ __('Sign in') }</button>
                    <button
                      block="Button"
                      mods={ { isCreateAccount } }
                      onClick={ handleCreateAccount }
                    >
                        { __('Create account') }
                    </button>
                </div>
                <p block="MyAccountOverlay" elem="Heading">{ title }</p>
                { render() }
                { this.renderCloseBtn() }
            </div>
        );
    }

    onCloseClick = () => {
        this.setState({ isPopup: true });
    };

    renderCloseBtn() {
        const { closePopup } = this.props;
        const { isArabic } = this.state

        return (
            <button
              block="MyAccountOverlay"
              elem="Close"
              mods={ { isArabic } }
              onClick={ closePopup }
            >
                <Close />
            </button>
        );
    }

    renderConfirmEmail() {
        const { state, handleSignIn } = this.props;

        return (
            <article
              aria-labelledby="confirm-email-notice"
              block="MyAccountOverlay"
              elem="Additional"
              mods={ { state } }
            >
                <p id="confirm-email-notice">
                    { /* eslint-disable-next-line max-len */ }
                    { __('The email confirmation link has been sent to your email. Please confirm your account to proceed.') }
                </p>
                <button
                  block="Button"
                  onClick={ handleSignIn }
                >
                    { __('Got it') }
                </button>
            </article>
        );
    }

    onForgotChange = (invalidFields = []) => {
        this.setState({ isForgotValidated: invalidFields.length === 0 });
    };

    renderForgotPassword() {
        const {
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            onFormError
        } = this.props;
        const { isForgotValidated } = this.state;

        return (
            <Form
              key="forgot-password"
              onSubmit={ onForgotPasswordAttempt }
              onSubmitSuccess={ onForgotPasswordSuccess }
              onSubmitError={ onFormError }
              parentCallback={ this.onForgotChange }
              isValidateOnChange
            >
                <img
                  block="MyAccountOverlay"
                  elem="LockImg"
                  src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/forgot_pass.png"
                  alt=""
                />
                <p
                  block="MyAccountOverlay"
                  elem="Heading"
                >
                    { __('Forgot your Password?') }
                </p>
                <p
                  block="MyAccountOverlay"
                  elem="ForgotPasswordSubheading"
                >
                    { __('Please enter your email and we will send you a link to reset your password') }
                </p>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder={ __('EMAIL') }
                  autocomplete="email"
                  validation={ ['notEmpty', 'email'] }
                />
                <div block="MyAccountOverlay" elem="Button" mods={ { isMargin: true, isForgotValidated } }>
                    <button block="Button" type="submit" disabled={ !isForgotValidated }>
                        { __('RESET YOUR PASSWORD') }
                    </button>
                </div>
            </Form>
        );
    }

    renderForgotPasswordSuccess() {
        const { state, handleSignIn } = this.props;

        return (
            <article
              aria-labelledby="forgot-password-success"
              block="MyAccountOverlay"
              elem="Additional"
              mods={ { state } }
            >
                <p id="forgot-password-success">
                    { /* eslint-disable-next-line max-len */ }
                    { __('If there is an account associated with the provided address you will receive an email with a link to reset your password') }
                </p>
                <button
                  block="Button"
                  onClick={ handleSignIn }
                >
                    { __('Got it') }
                </button>
            </article>
        );
    }

    handleGenderChange = (e) => {
        this.setState({ gender: e.target.id });
    };

    handleCheckboxChange = () => {
        this.setState(({ isChecked }) => ({ isChecked: !isChecked }));
    };

    onCreateChange = (invalidFields = []) => {
        this.setState({ isCreateValidated: invalidFields.length === 0 });
    };

    renderCreateAccount() {
        const {
            onCreateAccountAttempt,
            onCreateAccountSuccess
        } = this.props;

        const {
            gender,
            isChecked,
            isArabic,
            isCreateValidated
        } = this.state;

        return (
            <Form
              key="create-account"
              onSubmit={ onCreateAccountAttempt }
              onSubmitSuccess={ onCreateAccountSuccess }
              onSubmitError={ onCreateAccountAttempt }
              isValidateOnChange
              parentCallback={ this.onCreateChange }
            >
                {/* <fieldset block="MyAccountOverlay" elem="PhoneNumber">
                    <PhoneCountryCodeField
                        onSelect={(value) => this.setState({
                            countryCode: value
                        })}
                    />
                    <Field
                        type="text"
                        placeholder={ ('PHONE NUMBER*') }
                        id="email"
                        name="email"
                        autocomplete="email"
                        maxLength={ this.getUserIdentifierMaxLength() }
                        validation={ ['notEmpty', this.getValidationForUserIdentifier()] }
                        onChange={ this.setUserIdentifierType.bind(this) }
                    />
                </fieldset> */}
                <fieldset block="MyAccountOverlay" elem="FullName">
                    <Field
                      type="text"
                      placeholder={ __('TYPE YOUR FULL NAME*') }
                      id="fullname"
                      name="fullname"
                      autocomplete="fullname"
                      validation={ ['notEmpty'] }
                    />
                </fieldset>
                <fieldset block="MyAccountOverlay" elem="Gender">
                    <div
                      block="MyAccountOverlay"
                      elem="Radio"
                      mods={ { isArabic } }
                    >
                        <Field
                          type="radio"
                          id="1"
                          label={ __('Male') }
                          name="gender"
                          value={ gender }
                          onClick={ this.handleGenderChange }
                          defaultChecked={ gender }
                        />
                        <Field
                          type="radio"
                          id="2"
                          label={ __('Female') }
                          name="gender"
                          value={ gender }
                          onClick={ this.handleGenderChange }
                          defaultChecked={ gender }
                        />
                        <Field
                          type="radio"
                          id="3"
                          label={ __('Prefer not to say') }
                          name="gender"
                          value={ gender }
                          onClick={ this.handleGenderChange }
                          defaultChecked={ gender }
                        />
                    </div>
                </fieldset>
                <fieldset block="MyAccountOverlay" elem="Legend">
                    <Field
                      type="text"
                      placeholder={ __('EMAIL*') }
                      id="email"
                      name="email"
                      autocomplete="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="password"
                      placeholder={ __('PASSWORD*') }
                      id="password"
                      name="password"
                      autocomplete="new-password"
                      validation={ ['notEmpty', 'password', 'containNumber', 'containCapitalize'] }
                    />
                </fieldset>
                <div
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { isCreateAccountButton: true, isCreateValidated } }
                >
                    <button
                      block="Button"
                      type="submit"
                      disabled={ !isCreateValidated }
                    >
                        { __('Create Account') }
                    </button>
                </div>
            </Form>
        );
    }

    onSignInChange = (invalidFields = []) => {
        this.setState({ isSignInValidated: invalidFields.length === 0 });
    };

    setUserIdentifierType(value) {
        if(!ENABLE_OTP_LOGIN){
            return;
        }

        const regex = /[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

        if (!!!value.length) {
            this.setState({
                isOTP: true
            });
            return;
        }

        if (regex.test(value)) {
            this.setState({
                isOTP: false
            });
        }
        else {
            this.setState({
                isOTP: true
            });
        }
    }

    getValidationForUserIdentifier() {
        const { isOTP } = this.state;
        if (!ENABLE_OTP_LOGIN || !isOTP) {
            return 'email';
        }

        const { countryCode } = this.state;
        const customerCountry = Object.keys(PHONE_CODES).find((key) => PHONE_CODES[key] === countryCode);

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
            ? 'telephoneAE' : 'telephone';
    }

    getValidationForPassword() {
        const { isOTP } = this.state;
        if (!ENABLE_OTP_LOGIN || !isOTP ) {
            return ['noempty', 'password'];
        }

        return [];
    }

    getUserIdentifierMaxLength() {
        const { countryCode, isOTP } = this.state;
        if (!ENABLE_OTP_LOGIN || !isOTP ) {
            return null;
        }
        const customerCountry = Object.keys(PHONE_CODES).find((key) => PHONE_CODES[key] === countryCode);

        return COUNTRY_CODES_FOR_PHONE_VALIDATION[customerCountry]
            ? '9' : '8';
    }

    renderSignIn() {
        const {
            email,
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword
        } = this.props;

        const { isArabic, isSignInValidated, isOTP } = this.state;
        return (
            <Form
              key="sign-in"
              onSubmit={ onSignInAttempt }
              onSubmitSuccess={ onSignInSuccess }
              onSubmitError={ onFormError }
              isValidateOnChange
              parentCallback={ this.onSignInChange }
            >
                <fieldset block="MyAccountOverlay" elem="Legend">
                    <div
                        block="UserIdentifierFieldsContainer"
                        mods={{
                            isOTP: isOTP && ENABLE_OTP_LOGIN
                        }}
                    >
                        { isOTP && ENABLE_OTP_LOGIN &&
                            <PhoneCountryCodeField
                                onSelect={(value) => this.setState({
                                    countryCode: value
                                })}
                            />
                        }
                        <Field
                            type={ ENABLE_OTP_LOGIN && isOTP ? "text" : "email" }
                            placeholder={ ENABLE_OTP_LOGIN ? __('EMAIL OR PHONE*') : __('EMAIL*') }
                            id="email"
                            name="email"
                            value={ email }
                            autocomplete="email"
                            maxLength={ this.getUserIdentifierMaxLength() }
                            validation={ ['notEmpty', this.getValidationForUserIdentifier()] }
                            onChange={ this.setUserIdentifierType.bind(this) }
                        />
                    </div>
                    { ( !isOTP || !ENABLE_OTP_LOGIN ) &&
                        <Field
                            type="password"
                            placeholder={ __('PASSWORD*') }
                            id="password"
                            name="password"
                            autocomplete="current-password"
                            validation={ this.getValidationForPassword() }
                            mix={{
                                block: "Password",
                                mods: {
                                    isOTP
                                }
                            }}
                        />
                    }
                </fieldset>
                <button
                  type="button"
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { likeLink: true } }
                  mix={ { block: 'MyAccountOverlay', elem: 'Button', mods: { isArabic } } }
                  onClick={ handleForgotPassword }
                >
                    { __('Forgot Password?') }
                </button>
                <div
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { isSignIn: true, isSignInValidated } }
                >
                    <button block="Button" disabled={ !isSignInValidated }>{ __('Sign in') }</button>
                </div>
                <div
                    block="MyAccountOverlay"
                    elem="SSO"
                    mods={{ disabled: !!!SSO_LOGIN_PROVIDERS?.length }}
                >
                    <div block="MyAccountOverlay-SSO" elem="title">
                        { __('OR SIGN IN WITH') }
                    </div>
                    <div
                        block="MyAccountOverlay-SSO"
                        elem="Buttons"
                    >
                        <button
                            block="MyAccountOverlay-SSO-Buttons"
                            elem="Facebook"
                            mods={{disabled: !!!SSO_LOGIN_PROVIDERS?.includes('Facebook')}}
                        >
                            { __('FACEBOOK') }
                        </button>
                        <button
                            block="MyAccountOverlay-SSO-Buttons"
                            elem="Google"
                            mods={{disabled: !!!SSO_LOGIN_PROVIDERS?.includes('Google')}}
                        >
                            { __('GOOGLE') }
                        </button>
                    </div>
                </div>
            </Form>
        );
    }

    renderChangeStore() {
        if (isMobile.any()) {
            return (
                <div block="MyAccountOverlay" elem="StoreSwitcher">
                    <LanguageSwitcher />
                    <CountrySwitcher />
                </div>
            );
        }

        return null;
    }

    render() {
        const {
            isLoading,
            onVisible,
            isCheckout,
            isHidden
        } = this.props;
        const {
            isPopup,
            isArabic
        } = this.state;

        return (
            <div
              block="HeaderAccount"
              elem="PopUp"
              mods={ { isHidden } }
            >
                <Overlay
                  id={ CUSTOMER_ACCOUNT_OVERLAY_KEY }
                  mix={ {
                      block: 'MyAccountOverlay',
                      mods: { isPopup, isArabic }
                  } }
                  onVisible={ onVisible }
                  isStatic={ !isCheckout && !!isMobile.any() }
                >
                    <Loader isLoading={ isLoading } />
                    { this.renderMyAccount() }
                </Overlay>
            </div>
        );
    }
}

export default withRouter(MyAccountOverlay);
