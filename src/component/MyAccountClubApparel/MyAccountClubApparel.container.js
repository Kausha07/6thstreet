import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import ClubApparelDispatcher, { CLUB_APPAREL } from 'Store/ClubApparel/ClubApparel.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { customerType } from 'Type/Account';
import { ClubApparelMember } from 'Util/API/endpoint/ClubApparel/ClubApparel.type';
import BrowserDatabase from 'Util/BrowserDatabase';

import MyAccountClubApparel from './MyAccountClubApparel.component';

export const mapStateToProps = (_state) => ({
    customer: _state.MyAccountReducer.customer,
    activeOverlay: _state.OverlayReducer.activeOverlay,
    hideActiveOverlay: _state.OverlayReducer.hideActiveOverlay,
    country: _state.AppState.country,
    clubApparel: _state.ClubApparelReducer.clubApparel
});

export const mapDispatchToProps = (dispatch) => ({
    getMember: () => ClubApparelDispatcher.getMember(dispatch),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class MyAccountClubApparelContainer extends PureComponent {
    static propTypes = {
        getMember: PropTypes.func.isRequired,
        linkAccount: PropTypes.func,
        verifyOtp: PropTypes.func,
        customer: customerType,
        showNotification: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired,
        clubApparel: ClubApparelMember.isRequired
    };

    static defaultProps = {
        customer: null,
        linkAccount: () => {},
        verifyOtp: () => {}
    };

    state = {
        clubApparel: null
    };

    static getDerivedStateFromProps(props, state) {
        const { clubApparel } = props;
        const { clubApparel: currentClubApparel } = state;

        if (clubApparel !== currentClubApparel) {
            return { clubApparel };
        }

        return null;
    }

    componentDidMount() {
        // const storageClubApparel = BrowserDatabase.getItem(CLUB_APPAREL) || null;
        const { getMember } = this.props;

        // if (!storageClubApparel) {
        //     getMember();
        // }
        getMember();
    }

    containerProps = () => {
        const { clubApparel } = this.state;
        const { activeOverlay, country } = this.props;

        return {
            activeOverlay,
            country,
            clubApparel
        };
    };

    containerFunctons = () => {
        const { showOverlay, hideActiveOverlay } = this.props;
        return { showOverlay, hideActiveOverlay, ...this.containerFunctions };
    };

    render() {
        return (
            <MyAccountClubApparel
              { ...this.containerProps() }
              { ...this.containerFunctons() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountClubApparelContainer);
