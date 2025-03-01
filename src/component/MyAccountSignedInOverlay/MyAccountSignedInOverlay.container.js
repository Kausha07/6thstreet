import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import MyAccountSignedInOverlay from './MyAccountSignedInOverlay.component';
import { MY_ACCOUNT_SIGNED_IN_OVERLAY } from './MyAccountSignedInOverlay.config';
import { customerType } from "Type/Account";
export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapStateToProps = (_state) => ({
    clubApparel: _state.ClubApparelReducer.clubApparel,
    is_exchange_enabled: _state.AppConfig.is_exchange_enabled,
    newSignUpEnabled: _state.AppConfig.newSigninSignupVersionEnabled,
    IsReferralEnabled: _state.AppConfig.IsReferralEnabled,
    isClubApparelEnabled: _state.AppConfig.isClubApparelEnabled,
    customer: _state.MyAccountReducer.customer,
    IsVipCustomerEnabled: _state.AppConfig.isVIPEnabled,
    isWalletEnabled: _state.AppConfig.isWalletV1Enabled,
});

export const mapDispatchToProps = (dispatch) => ({
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideOverlay: () => dispatch(hideActiveOverlay()),
    logout: () => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.logout(null, dispatch)),
});

export class MyAccountSignedInOverlayContainer extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired,
        hideOverlay: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        newSignUpEnabled:PropTypes.bool,
        IsReferralEnabled:PropTypes.bool,
        isClubApparelEnabled:PropTypes.bool,
        customer: customerType.isRequired,
        IsVipCustomerEnabled: PropTypes.bool,
        isWalletEnabled: PropTypes.bool,
    };

    containerFunctions = {
        signOut: this.signOut.bind(this)
    };

    componentDidMount() {
        const { showOverlay } = this.props;

        showOverlay(MY_ACCOUNT_SIGNED_IN_OVERLAY);
    }

    componentWillUnmount() {
        const { hideOverlay } = this.props;

        hideOverlay();
    }

    signOut() {
        const { logout, onHide } = this.props;

        logout();
        onHide();
    }

    render() {
        const { onHide } = this.props;
        return (
            <MyAccountSignedInOverlay
              onHide={ onHide }
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountSignedInOverlayContainer);
