/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
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

import Field from 'SourceComponent/Field';
import Form from 'SourceComponent/Form';
import Loader from 'SourceComponent/Loader';
import Overlay from 'SourceComponent/Overlay';
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
        isCheckout: PropTypes.bool,
        closePopup: PropTypes.func.isRequired,
        isHidden: PropTypes.bool.isRequired
    };

    static defaultProps = {
        isCheckout: false
    };

    state = {
        isPopup: false
    };

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: __('Welcome back')
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
            handleCreateAccount
        } = this.props;
        const { render, title } = this.renderMap[state];
        const isSignIn = state === STATE_SIGN_IN;
        const isCreateAccount = state === STATE_CREATE_ACCOUNT;

        return (
            <div block="MyAccountOverlay" elem="Action" mods={ { state } }>
                <img block="MyAccountOverlay" elem="Image" src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/6street-login-banner.png" alt="" />
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

        const svg = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" /></svg>;
        return (
            <button
              block="MyAccountOverlay"
              elem="Close"
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

    renderForgotPassword() {
        const {
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            onFormError
        } = this.props;

        return (
            <Form
              key="forgot-password"
              onSubmit={ onForgotPasswordAttempt }
              onSubmitSuccess={ onForgotPasswordSuccess }
              onSubmitError={ onFormError }
            >
                <img block="MyAccountOverlay" elem="LockImg" src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/forgot_pass.png" alt="" />
                <p block="MyAccountOverlay" elem="Heading">{ __('Forgot your Password?') }</p>
                <p block="MyAccountOverlay" elem="ForgotPasswordSubheading">{ __('Please enter your email and we will send you a link to reset your password') }</p>
                    <Field
                      type="text"
                      id="email"
                      name="email"
                      placeholder={ __('Email or phone') }
                      autocomplete="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <div block="MyAccountOverlay" elem="Button">
                        <button block="Button" mods={ { isMargin: true } } type="submit">
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

    renderCreateAccount() {
        const {
            onCreateAccountAttempt,
            onCreateAccountSuccess
        } = this.props;

        return (
            <Form
              key="create-account"
              onSubmit={ onCreateAccountAttempt }
              onSubmitSuccess={ onCreateAccountSuccess }
              onSubmitError={ onCreateAccountAttempt }
            >
                    <p block="MyAccountOverlay" elem="Subtitle">Sign up for a tailored shopping experience</p>
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <Field
                          type="text"
                          placeholder={ __('First Name') }
                          id="firstname"
                          name="firstname"
                          autocomplete="given-name"
                          validation={ ['notEmpty'] }
                        />
                        <Field
                          type="text"
                          placeholder={ __('Last Name') }
                          id="lastname"
                          name="lastname"
                          autocomplete="family-name"
                          validation={ ['notEmpty'] }
                        />
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Radio">
                        <Field type="radio" id="selectMale" label={ __('Male') } name="gender" value="selectMale" checked />
                        <Field type="radio" id="selectFemale" label={ __('Female') } name="gender" value="selectFemale" />
                        <Field type="radio" id="selectPreferNot" label={ __('Prefer not to say') } name="gender" value="selectPreferNot" />
                    </div>
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <Field
                          type="text"
                          placeholder={ __('Email') }
                          id="email"
                          name="email"
                          autocomplete="email"
                          validation={ ['notEmpty', 'email'] }
                        />
                        <Field
                          type="password"
                          placeholder={ __('Password') }
                          id="password"
                          name="password"
                          autocomplete="new-password"
                          validation={ ['notEmpty', 'password'] }
                        />
                        <div block="MyAccountOverlay" elem="Radio">
                            <Field
                              type="checkbox"
                              id="privacyPolicy"
                              name="privacyPolicy"
                              value="privacyPolicy"
                            />
                            <label htmlFor="PrivacyPolicy">
                                { __('Yes, I\'d like to receive news and promotions from 6TH STREET. ') }
                                <a href="https://en-ae.6thstreet.com/privacy-policy"><strong>{ __('Click here') }</strong></a>
                                { __(' to view privacy policy') }
                            </label>
                        </div>
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Button">
                        <button
                          block="Button"
                          mods={ { isMargin: true } }
                          type="submit"
                        >
                            { __('Create Account') }
                        </button>
                    </div>
            </Form>
        );
    }

    renderSignIn() {
        const {
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword
        } = this.props;

        return (
            <Form
              key="sign-in"
              onSubmit={ onSignInAttempt }
              onSubmitSuccess={ onSignInSuccess }
              onSubmitError={ onFormError }
            >
                <fieldset block="MyAccountOverlay" elem="Legend">
                    <Field
                      type="text"
                      placeholder={ __('Email') }
                      id="email"
                      name="email"
                      autocomplete="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="password"
                      placeholder={ __('Password') }
                      id="password"
                      name="password"
                      autocomplete="current-password"
                      validation={ ['notEmpty', 'password'] }
                    />
                </fieldset>
                <button
                  block="MyAccountOverlay"
                  elem="Button"
                  mods={ { likeLink: true } }
                  onClick={ handleForgotPassword }
                >
                    { __('Forgot password?') }
                </button>
                <div block="MyAccountOverlay" elem="Button">
                    <button block="Button">{ __('Sign in') }</button>
                </div>
            </Form>
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
            isPopup
        } = this.state;

        return (
            <div block="HeaderAccount" elem="PupUp" mods={ { isHidden } }>
                <Overlay
                  id={ CUSTOMER_ACCOUNT_OVERLAY_KEY }
                  mix={ { block: 'MyAccountOverlay', mods: { isPopup } } }
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
