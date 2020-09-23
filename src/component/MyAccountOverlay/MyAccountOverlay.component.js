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
        isCheckout: PropTypes.bool
    };

    static defaultProps = {
        isCheckout: false
    };

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            title: __('Sign in to your account')
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword(),
            title: __('Get password link')
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount(),
            title: __('Create new account')
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
        const { state } = this.props;
        const { render } = this.renderMap[state];

        return (
            <div block="MyAccountOverlay" elem="Action" mods={ { state } }>
                <img block="MyAccountOverlay" elem="Image" src="https://static.6media.me/static/version1600859154/frontend/6SNEW/6snew/en_US/images/6street-login-banner.png" alt="" />
                { render() }
            </div>
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
            state,
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            onFormError,
            handleSignIn,
            handleCreateAccount,
            isCheckout
        } = this.props;

        return (
            <>
                <Form
                  key="forgot-password"
                  onSubmit={ onForgotPasswordAttempt }
                  onSubmitSuccess={ onForgotPasswordSuccess }
                  onSubmitError={ onFormError }
                >
                    <Field
                      type="text"
                      id="email"
                      name="email"
                      label={ __('Email') }
                      autocomplete="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button" type="submit">
                            { __('Send reset link') }
                        </button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section aria-labelledby="forgot-password-labe">
                        <h4 id="forgot-password-label">{ __('Already have an account?') }</h4>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ handleSignIn }
                        >
                            { __('Sign in here') }
                        </button>
                    </section>
                    { !isCheckout && (
                        <section aria-labelledby="create-account-label">
                            <h4 id="create-account-label">{ __('Don`t have an account?') }</h4>
                            <button
                              block="Button"
                              mods={ { likeLink: true } }
                              onClick={ handleCreateAccount }
                            >
                                { __('Create an account') }
                            </button>
                        </section>
                    ) }
                </article>
            </>
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
            state,
            onCreateAccountAttempt,
            onCreateAccountSuccess,
            handleSignIn
        } = this.props;

        return (
            <>
                <Form
                  key="create-account"
                  onSubmit={ onCreateAccountAttempt }
                  onSubmitSuccess={ onCreateAccountSuccess }
                  onSubmitError={ onCreateAccountAttempt }
                >
                     <div>Let&apos;s get personal!</div>
                        <p>Sign up for a tailored shopping experience</p>
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <Field
                          type="text"
                          label={ __('First Name') }
                          id="firstname"
                          name="firstname"
                          autocomplete="given-name"
                          validation={ ['notEmpty'] }
                        />
                        <Field
                          type="text"
                          label={ __('Last Name') }
                          id="lastname"
                          name="lastname"
                          autocomplete="family-name"
                          validation={ ['notEmpty'] }
                        />
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Radio">
                            <Field type="radio" id="selectMale" name="gender" value="1" />
                            <Field type="radio" id="selectFemale" name="gender" value="2" />
                            <Field type="radio" id="selectPreferNot" name="gender" value="3" checked="checked" />
                    </div>
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <legend>{ __('Sign-Up Information') }</legend>
                        <Field
                          type="text"
                          label={ __('Email') }
                          id="email"
                          name="email"
                          autocomplete="email"
                          validation={ ['notEmpty', 'email'] }
                        />
                        <Field
                          type="password"
                          label={ __('Password') }
                          id="password"
                          name="password"
                          autocomplete="new-password"
                          validation={ ['notEmpty', 'password'] }
                        />
                        <Field
                          type="password"
                          label={ __('Confirm password') }
                          id="confirm_password"
                          name="confirm_password"
                          autocomplete="new-password"
                          validation={ ['notEmpty', 'password', 'password_match'] }
                        />
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button
                          block="Button"
                          type="submit"
                        >
                            { __('Sign up') }
                        </button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section>
                        <h4>{ __('Already have an account?') }</h4>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ handleSignIn }
                        >
                            { __('Sign in here') }
                        </button>
                    </section>
                </article>
            </>
        );
    }

    renderSignIn() {
        const {
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword,
            handleCreateAccount
        } = this.props;

        return (
            <Form
              key="sign-in"
              onSubmit={ onSignInAttempt }
              onSubmitSuccess={ onSignInSuccess }
              onSubmitError={ onFormError }
            >
                <div block="MyAccountOverlay" elem="Buttons">
                    <button block="Button">{ __('Sign in') }</button>
                    <button
                      block="Button"
                      mods={ { isHollow: true } }
                      onClick={ handleCreateAccount }
                    >
                                { __('Create an account') }
                    </button>
                </div>
                <div>Welcome Back</div>
                <Field
                  type="text"
                  label={ __('Email') }
                  id="email"
                  name="email"
                  autocomplete="email"
                  validation={ ['notEmpty', 'email'] }
                />
                <Field
                  type="password"
                  label={ __('Password') }
                  id="password"
                  name="password"
                  autocomplete="current-password"
                  validation={ ['notEmpty', 'password'] }
                />
                <button
                  block="Button"
                  mods={ { likeLink: true } }
                  onClick={ handleForgotPassword }
                >
                    { __('Forgot password?') }
                </button>
                <button block="Button">{ __('Sign in') }</button>
            </Form>
        );
    }

    render() {
        const {
            isLoading,
            onVisible,
            isCheckout
        } = this.props;

        return (
            <Overlay
              id={ CUSTOMER_ACCOUNT_OVERLAY_KEY }
              mix={ { block: 'MyAccountOverlay' } }
              onVisible={ onVisible }
              isStatic={ !isCheckout && !!isMobile.any() }
            >
                <Loader isLoading={ isLoading } />
                { this.renderMyAccount() }
            </Overlay>
        );
    }
}

export default withRouter(MyAccountOverlay);
