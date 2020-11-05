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
    customer: _state.MyAccountReducer.customer
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
        handleSuccess: this.handleSuccess.bind(this)
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
        this.setState({ isLoading: true });

        linkAccount({ customerId: id, mobileNo: phone }).then(
            (response) => {
                // TODO: Create response processing after Club Apparel will begin work on Client side
                if (response) {
                    this.setState({
                        state: STATE_VERIFY,
                        countryPhoneCode,
                        phone,
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

        verifyOtp({ customerId: id, otp }).then(
            () => {
                // TODO: Create response processing after Club Apparel will begin work on Client side
            },
            this._handleError
        );
    }

    handleSuccess(e) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_SUCCESS });
    }

    handleNotSucces(e) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_NOT_SUCCESS });
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
