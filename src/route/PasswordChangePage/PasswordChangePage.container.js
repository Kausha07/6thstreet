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

import { connect } from "react-redux";
import { Redirect } from "react-router";

import {
  mapDispatchToProps as sourceMapDispatchToProps,
  mapStateToProps,
  PasswordChangePageContainer as SourcePasswordChangePageContainer,
} from "SourceRoute/PasswordChangePage/PasswordChangePage.container";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { getQueryParam } from "Util/Url";

import PasswordChangePage from "./PasswordChangePage.component";
import { STATUS_PASSWORD_UPDATED } from "./PasswordChangePage.config";
import Event, {
  EVENT_FORGOT_PASSWORD_RESET_SUCCESS,
  EVENT_FORGOT_PASSWORD_RESET_FAIL,
  EVENT_GTM_AUTHENTICATION,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
export const mapDispatchToProps = (dispatch) => ({
  ...sourceMapDispatchToProps(dispatch),
  resetPassword: (data) => MyAccountDispatcher.resetPassword(data),
});

export class PasswordChangePageContainer extends SourcePasswordChangePageContainer {
  onPasswordSuccess(fields) {
    console.log("test old password flow 1")
    const { resetPassword, location, showNotification } = this.props;
    const { passwordReset: password } = fields;
    const token = getQueryParam("token", location);
    console.log("test old password flow 2")
    resetPassword({ newPassword: password, resetToken: token }).then(
      (response) => {
        console.log("test old password flow 3")
        switch (typeof response) {
          case "string":
            console.log("test old password flow 4")
            showNotification("error", __(response));
            this.sendGTMEvents(EVENT_FORGOT_PASSWORD_RESET_FAIL);
            this.sendMOEEvents(EVENT_FORGOT_PASSWORD_RESET_FAIL);
            break;
          case "boolean":
            console.log("test old password flow 5")
            showNotification(
              "success",
              __("Password has been successfully updated!")
            );
            this.sendGTMEvents(EVENT_FORGOT_PASSWORD_RESET_SUCCESS);
            this.sendMOEEvents(EVENT_FORGOT_PASSWORD_RESET_SUCCESS);
            setTimeout(() => {
              window.location.href = "/";
            }, "4000");

            break;
          default:
            console.log("test old password flow 6")
            showNotification("error", __("Something Went Wrong"));
            this.sendGTMEvents(EVENT_FORGOT_PASSWORD_RESET_FAIL);
            this.sendMOEEvents(EVENT_FORGOT_PASSWORD_RESET_FAIL);
            break;
        }

        this.setState({ isLoading: false });
      }
    );
  }

  sendGTMEvents(event) {
    const eventAction = { name: event, action: event, category: "user_login" };
    Event.dispatch(EVENT_GTM_AUTHENTICATION, eventAction);
  }

  sendMOEEvents(event) {
    Moengage.track_event(event, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }

  updateMeta() {
    const { updateMeta } = this.props;
    updateMeta({ title: __("Password Change Page") });
  }

  render() {
    const { passwordResetStatus } = this.state;

    if (passwordResetStatus === STATUS_PASSWORD_UPDATED) {
      return <Redirect to="/" />;
    }

    return (
      <PasswordChangePage
        {...this.containerProps()}
        {...this.containerFunctions}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordChangePageContainer);
