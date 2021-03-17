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

import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps,
    PasswordChangePageContainer as SourcePasswordChangePageContainer
} from 'SourceRoute/PasswordChangePage/PasswordChangePage.container';
import MyAccountDispatcher from 'Store/MyAccount/MyAccount.dispatcher';
import { getQueryParam } from 'Util/Url';

import PasswordChangePage from './PasswordChangePage.component';
import { STATUS_PASSWORD_UPDATED } from './PasswordChangePage.config';

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    resetPassword: (data) => MyAccountDispatcher.resetPassword(data)
});

export class PasswordChangePageContainer extends SourcePasswordChangePageContainer {
    onPasswordSuccess(fields) {
        const { resetPassword, location, showNotification } = this.props;
        const { passwordReset: password } = fields;
        const token = getQueryParam('token', location);

        resetPassword({ newPassword: password, resetToken: token }).then(
            (response) => {
                switch (typeof response) {
                case 'string':
                    showNotification('error', __(response));

                    break;
                case 'boolean':
                    showNotification('success', __('Password has been successfully updated!'));
                    setTimeout(() => {
                        window.location.href = '/';
                    }, '4000');

                    break;
                default:
                    showNotification('error', __('Something Went Wrong'));

                    break;
                }

                this.setState({ isLoading: false });
            }
        );
    }

    updateMeta() {
        const { updateMeta } = this.props;
        updateMeta({ title: __('Password Change Page') });
    }

    render() {
        const { passwordResetStatus } = this.state;

        if (passwordResetStatus === STATUS_PASSWORD_UPDATED) {
            return <Redirect to="/" />;
        }

        return (
            <PasswordChangePage
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChangePageContainer);
