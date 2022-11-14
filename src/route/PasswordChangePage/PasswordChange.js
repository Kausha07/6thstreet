
import { connect } from 'react-redux';
import { useState, useEffect } from "react";
import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps,
} from 'SourceRoute/PasswordChangePage/PasswordChangePage.container';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { getQueryParam } from 'Util/Url';
import ContentWrapper from 'Component/ContentWrapper';
import Field from 'Component/Field';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import successTick from './IconsAndImages/successTick.png';
import errorCross from './IconsAndImages/errorCross.png';
import './PasswordChange.style.scss';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    resetPassword: (data) => MyAccountDispatcher.resetPassword(data)
});

export function PasswordChange(props) {
    const { onPasswordAttempt, onError } = props;
    const [isLoading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);
    const [isAtleastOneCapital, setIsAtleastOneCapital] = useState(false);
    const [isAtleastOneDigit, setIsatleastOneDigit] = useState(false);
    const [isSavePasswordDisabled, setIsSavePasswordDisabled] = useState(true);
    const AtleastOneCapitalRegex = /[A-Z][A-Z]*/;
    const AtleastOneDigitRegex = /\d/;
    const PasswordLengthRequired = 8;

    useEffect(() => {
        if (AtleastOneCapitalRegex.test(newPassword)) {
            setIsAtleastOneCapital(true);
        } else if (!AtleastOneCapitalRegex.test(newPassword)) {
            setIsAtleastOneCapital(false);
        }
        if (AtleastOneDigitRegex.test(newPassword)) {
            setIsatleastOneDigit(true);
        } else if (!AtleastOneDigitRegex.test(newPassword)) {
            setIsatleastOneDigit(false);
        }
        if (newPassword === null || newPassword.length === 0) {
            setIsatleastOneDigit(false);
            setIsAtleastOneCapital(false);
        }
    }, [newPassword]);

    useEffect(() => {
        if ((isAtleastOneCapital && isAtleastOneDigit) &&
            (newPassword?.length >= PasswordLengthRequired && newPassword === repeatPassword)) {
            setIsSavePasswordDisabled(false);
        } else {
            setIsSavePasswordDisabled(true);
        }
    }, [newPassword, repeatPassword]);

    function onPasswordSuccess(fields) {
        console.log("test new password flow 1")
        const { resetPassword, location, showNotification } = this.props;
        const { passwordReset: password } = fields;
        const token = getQueryParam('token', location);
        console.log("test new password flow 2")
        resetPassword({ newPassword: password, resetToken: token }).then(
            (response) => {
                console.log("test new password flow 3")
                switch (typeof response) {
                    case 'string':
                        console.log("test new password flow 4")
                        showNotification('error', __(response));

                        break;
                    case 'boolean':
                        console.log("test new password flow 5")
                        showNotification('success', __('Password has been successfully updated!'));
                        setTimeout(() => {
                            window.location.href = '/';
                        }, '4000');

                        break;
                    default:
                        console.log("test new password flow 6")
                        showNotification('error', __('Something Went Wrong'));

                        break;
                }
            }
        );
    }

    return (
        <>
            <main block="PasswordChangePage" aria-label={__('Password Change Page')}>
                <ContentWrapper
                    mix={{ block: 'PasswordChangePage' }}
                    wrapperMix={{ block: 'PasswordChangePage', elem: 'Wrapper' }}
                    label={__('Password Change Actions')}
                >
                    <Loader isLoading={isLoading} />
                    <h1>{__('Reset Password')}</h1>
                    <p>{__(`You have requested to change your password. If you didn't initiated 
                            this process, please contact our customer service.`)}</p>
                    <Form
                        key="reset-password"
                        onSubmit={onPasswordAttempt}
                        onSubmitSuccess={onPasswordSuccess}
                        onSubmitError={onError}
                    >
                        <Field
                            type="password"
                            placeholder={__('NEW PASSWORD')}
                            id="passwordReset"
                            name="passwordReset"
                            autocomplete="new-password"
                            validation={['notEmpty', 'password']}
                            value={newPassword}
                            onChange={(password) => setNewPassword(password)}
                        />
                        <Field
                            type="password"
                            placeholder={__('REPEAT PASSWORD')}
                            id="passwordResetConfirm"
                            name="passwordResetConfirm"
                            autocomplete="new-password"
                            validation={['notEmpty', 'password']}
                            value={repeatPassword}
                            onChange={(password) => setRepeatPassword(password)}
                        />
                        <div className='error-msgs'>
                            <div className='msg'>
                                <span className='msgs-icon'>
                                    <img src={isAtleastOneCapital ? successTick : errorCross} alt="error" />
                                </span>
                                <span className={!isAtleastOneCapital ? "error" : "succuss"}>
                                    {__("Atleast one uppercase letter")}
                                </span>
                            </div>
                            <div className='msg'>
                                <span className='msgs-icon'>
                                    <img src={isAtleastOneDigit ? successTick : errorCross} alt="error" />
                                </span>
                                <span className={!isAtleastOneDigit ? "error" : "succuss"}>
                                    {__("Atleast one digit")}
                                </span>
                            </div>
                            <div className='msg'>
                                <span className='msgs-icon'>
                                    <img src={newPassword && newPassword.length >= PasswordLengthRequired ? successTick : errorCross} alt="error" />
                                </span>
                                <span className={newPassword && newPassword.length >= PasswordLengthRequired ? "succuss" : "error"}>
                                    {__("Atleast 8 character in length")}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className='terms-conditions'>
                                {__('By resetting your password you agree with our ')}
                                <span>{__('Terms & Conditions ')} </span>
                                {__('and ')}
                                <span>{__('Privacy Policy ')}</span>
                            </p>
                        </div>
                        <div className="save-btn">
                            <button
                                type="submit"
                                className={isSavePasswordDisabled ? "disabled-btn" : ""}
                                disabled={isSavePasswordDisabled}
                            >
                                {__('Save')}
                            </button>
                        </div>
                    </Form >
                </ContentWrapper>
            </main>
        </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange);