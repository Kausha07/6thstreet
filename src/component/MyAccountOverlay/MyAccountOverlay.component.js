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
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CONFIRM_EMAIL,
    STATE_CREATE_ACCOUNT,
    STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_LOGGED_IN,
    STATE_SIGN_IN
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
        isHidden: PropTypes.bool
    };

    static defaultProps = {
        isCheckout: false,
        registerField: false,
        setRegisterFieldFalse: null,
        isHidden: false
    };

    state = {
        isPopup: false,
        gender: '0',
        isChecked: false,
        isArabic: isArabic(),
        maleId: 0,
        femaleId: 1,
        preferNotToSayId: 2,
        isSignInValidated: false,
        isCreateValidated: false,
        isForgotValidated: false
    };

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: __('Welcome Back')
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword()
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount(),
            title: __('Let\'s get personal!')
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

        return (
            <div
              block="MyAccountOverlay"
              elem="Action"
              mods={ { state } }
            >
                <img
                  block="MyAccountOverlay"
                  elem="Image"
                  src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/6street-login-banner.png"
                  alt=""
                />
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
              block="MyAccountOverlay"
              elem="Close"
              mods={ { isArabic } }
              onClick={ closePopup }
            >
                { svg }
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

    onForgotChange = (invalidFields) => {
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
                  type="text"
                  id="email"
                  name="email"
                  placeholder={ __('EMAIL OR PHONE*') }
                  autocomplete="email"
                  validation={ ['notEmpty', 'email'] }
                />
                <div block="MyAccountOverlay" elem="Button" mods={ { isMargin: true, isForgotValidated } }>
                    <button block="Button" type="submit" disabled={ !isForgotValidated }>
                        { __('Send') }
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

    onCreateChange = (invalidFields) => {
        this.setState({ isCreateValidated: invalidFields.length === 0 });
    };

    renderCreateAccount() {
        const {
            onCreateAccountAttempt,
            onCreateAccountSuccess
        } = this.props;

        const {
            gender,
            maleId,
            femaleId,
            preferNotToSayId,
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
                <p block="MyAccountOverlay" elem="Subtitle">
                    { __('Sign up for a tailored shopping experience') }
                </p>
                <fieldset block="MyAccountOverlay" elem="Legend">
                    <Field
                      type="text"
                      placeholder={ __('FIRST NAME*') }
                      id="firstname"
                      name="firstname"
                      autocomplete="given-name"
                      validation={ ['notEmpty'] }
                    />
                    <Field
                      type="text"
                      placeholder={ __('LAST NAME*') }
                      id="lastname"
                      name="lastname"
                      autocomplete="family-name"
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
                          id="male"
                          label={ __('Male') }
                          name="gender"
                          value={ maleId }
                          onClick={ this.handleGenderChange }
                          defaultChecked={ gender }
                        />
                        <Field
                          type="radio"
                          id="female"
                          label={ __('Female') }
                          name="gender"
                          value={ femaleId }
                          onClick={ this.handleGenderChange }
                          defaultChecked={ gender }
                        />
                        <Field
                          type="radio"
                          id="preferNot"
                          label={ __('Prefer not to say') }
                          name="gender"
                          value={ preferNotToSayId }
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
                    <div
                      block="MyAccountOverlay"
                      elem="Checkbox"
                      mods={ { isArabic } }
                    >
                        <Field
                          type="checkbox"
                          id="privacyPolicy"
                          name="privacyPolicy"
                          value="privacyPolicy"
                          onClick={ this.handleCheckboxChange }
                          checked={ isChecked }
                        />
                        <label htmlFor="PrivacyPolicy">
                            { __('Yes, I\'d like to receive news and promotions from 6TH STREET. ') }
                            <a href="https://en-ae.6thstreet.com/privacy-policy">
                                <strong>{ __('Click here') }</strong>
                            </a>
                            { __(' to view privacy policy') }
                        </label>
                    </div>
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

    onSignInChange = (invalidFields) => {
        this.setState({ isSignInValidated: invalidFields.length === 0 });
    };

    renderSignIn() {
        const {
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword
        } = this.props;

        const { isArabic, isSignInValidated } = this.state;

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
                    <Field
                      type="text"
                      placeholder={ __('EMAIL OR PHONE*') }
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
                      autocomplete="current-password"
                      validation={ ['notEmpty', 'password'] }
                    />
                </fieldset>
                <button
                  type="button"
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { likeLink: true } }
                  mix={ { block: 'MyAccountOverlay', elem: 'Button', mods: { isArabic } } }
                  onClick={ handleForgotPassword }
                >
                    { __('Forgot password?') }
                </button>
                <div
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { isSignIn: true, isSignInValidated } }
                >
                    <button block="Button" disabled={ !isSignInValidated }>{ __('Sign in') }</button>
                </div>
            </Form>
        );
    }

    renderChangeStore() {
        return (
            <div block="MyAccountOverlay" elem="StoreSwitcher">
                <LanguageSwitcher />
                <CountrySwitcher />
            </div>
        );
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
                    { this.renderChangeStore() }
                </Overlay>
            </div>
        );
    }
}

export default withRouter(MyAccountOverlay);
