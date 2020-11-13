import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import ClubApparelDispatcher from 'Store/ClubApparel/ClubApparel.dispatcher';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { customerType } from 'Type/Account';

import MyAccountClubApparelOverlay from './MyAccountClubApparelOverlay.component';
import {
    STATE_LINK,
    STATE_NOT_SUCCESS,
    STATE_SUCCESS,
    STATE_VERIFY
} from './MyAccountClubApparelOverlay.config';

export const mapStateToProps = (_state) => ({
    customer: _state.MyAccountReducer.customer,
    country: _state.AppState.country
});

export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    linkAccount: (data) => ClubApparelDispatcher.linkAccount(dispatch, data),
    verifyOtp: (data) => ClubApparelDispatcher.verifyOtp(dispatch, data)
});

export class MyAccountClubApparelOverlayContainer extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired,
        verifyOtp: PropTypes.func.isRequired,
        country: PropTypes.string.isRequired,
        customer: customerType
    };

    static defaultProps = {
        customer: null
    };

    state = {
        state: STATE_LINK,
        phone: '',
        isLoading: false
    };

    containerFunctions = () => ({
        linkAccount: this.linkAccount.bind(this),
        verifyOtp: this.verifyOtp.bind(this)
    });

    containerProps = () => {
        const {
            state,
            phone,
            countryPhoneCode,
            isLoading
        } = this.state;

        return {
            state,
            phone,
            countryPhoneCode,
            isLoading
        };
    };

    linkAccount(fields) {
        const { customer: { id }, linkAccount } = this.props;
        const { phone, countryPhoneCode } = fields;
        const formattedPhone = `00${countryPhoneCode.substr(1)}${phone}`;
        this.setState({ isLoading: true });

        linkAccount({ customerId: id, mobileNo: formattedPhone }).then(
            (response) => {
                // TODO: Create response processing after Club Apparel will begin work on Client side
                if (response) {
                    const { data: { memberId } } = response;

                    this.setState({
                        state: STATE_VERIFY,
                        countryPhoneCode,
                        memberId,
                        phone: formattedPhone,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        state: STATE_NOT_SUCCESS,
                        isLoading: false
                    });
                }
            },
            this._handleError
        );
    }

    verifyOtp(fields) {
        const { customer: { id }, verifyOtp } = this.props;
        const { otp } = fields;
        const { memberId, phone } = this.state;

        verifyOtp({
            customerId: id,
            otp,
            memberId,
            mobileNo: phone
        }).then(
            (response) => {
                if (response) {
                    this.setState({
                        state: STATE_SUCCESS,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        state: STATE_NOT_SUCCESS,
                        isLoading: false
                    });
                }
            },
            this._handleError
        );
    }

    render() {
        return (
            <MyAccountClubApparelOverlay
              { ...this.props }
              { ...this.containerFunctions() }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountClubApparelOverlayContainer);
