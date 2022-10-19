import { useSelector } from 'react-redux'

import PasswordChangePageContainer from "./PasswordChangePage.container"

import PasswordChangePageV1 from './PasswordChange'

export default function PasswordChangePageCountryBased() {
    const newSigninSignupVersionEnabled = useSelector(state =>
        state.AppConfig.newSigninSignupVersionEnabled);
    if (newSigninSignupVersionEnabled) {
        return <PasswordChangePageV1 />;
    } else {
        return <PasswordChangePageContainer />;
    }
}