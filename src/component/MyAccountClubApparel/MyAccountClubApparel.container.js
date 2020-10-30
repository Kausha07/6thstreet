import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import ClubApparelDispatcher, { CLUB_APPAREL } from 'Store/ClubApparel/ClubApparel.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { ClubApparelMember } from 'Util/API/endpoint/ClubApparel/ClubApparel.type';
import BrowserDatabase from 'Util/BrowserDatabase';

import MyAccountClubApparel from './MyAccountClubApparel.component';

export const mapStateToProps = ({
    ClubApparelReducer: {
        clubApparel
    },
    MyAccountReducer: {
        customer
    }
}) => ({
    clubApparel,
    customer
});

export const mapDispatchToProps = (dispatch) => ({
    getMember: () => ClubApparelDispatcher.getMember(dispatch),
    linkAccount: (data) => ClubApparelDispatcher.linkAccount(dispatch, data),
    verifyOtp: (data) => ClubApparelDispatcher.verifyOtp(dispatch, data),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class MyAccountClubApparelContainer extends PureComponent {
    static propTypes = {
        getMember: PropTypes.func.isRequired,
        linkAccount: PropTypes.func.isRequired,
        verifyOtp: PropTypes.func.isRequired,
        customer: customerType,
        showNotification: PropTypes.func.isRequired,
        clubApparel: ClubApparelMember.isRequired
    };

    static defaultProps = {
        customer: null
    };

    containerFunctions = {
        linkAccount: this.linkAccount.bind(this),
        verifyOtp: this.verifyOtp.bind(this)
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
        const storageClubApparel = BrowserDatabase.getItem(CLUB_APPAREL) || null;
        const { getMember } = this.props;

        if (!storageClubApparel) {
            getMember();
        }
    }

    containerProps = () => {
        const { clubApparel } = this.state;

        return {
            clubApparel
        };
    };

    linkAccount(fields) {
        const { customer: { id }, linkAccount } = this.props;
        const { phone } = fields;

        linkAccount({ customerId: id, mobileNo: phone }).then(
            () => {
                // TODO: Create response processing after Club Apparel will begin work on Client side
            },
            this._handleError
        );
    }

    verifyOtp(fields) {
        const { customer: { id }, verifyOtp } = this.props;
        const { otp } = fields;

        verifyOtp({ customerId: id, otp }).then(
            () => {
                // TODO: Create response processing after Club Apparel will begin work on Client side
            },
            this._handleError
        );
    }

    render() {
        return (
            <MyAccountClubApparel
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountClubApparelContainer);
