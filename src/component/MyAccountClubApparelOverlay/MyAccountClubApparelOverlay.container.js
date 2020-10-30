import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';

import MyAccountClubApparelOverlay from './MyAccountClubApparelOverlay.component';
import {
    STATE_LINK,
    STATE_NOT_SUCCESS,
    STATE_SUCCESS,
    STATE_VERIFY
} from './MyAccountClubApparelOverlay.config';

export const mapDispatchToProps = (dispatch) => ({
    hideActiveOverlay: () => dispatch(hideActiveOverlay())
});

export class MyAccountClubApparelOverlayContainer extends PureComponent {
    static propTypes = {
        linkAccount: PropTypes.func.isRequired
    };

    state = {
        state: STATE_LINK,
        phone: ''
    };

    containerFunctions = () => ({
        handleVerify: this.handleVerify.bind(this),
        handleSuccess: this.handleSuccess.bind(this)
    });

    containerProps = () => {
        const { state, phone, countryPhoneCode } = this.state;

        return { state, phone, countryPhoneCode };
    };

    handleVerify(fields) {
        const { linkAccount } = this.props;
        const { phone, countryPhoneCode } = fields;

        this.setState({
            state: STATE_VERIFY,
            countryPhoneCode,
            phone
        });

        linkAccount(fields);
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

export default connect(null, mapDispatchToProps)(MyAccountClubApparelOverlayContainer);
