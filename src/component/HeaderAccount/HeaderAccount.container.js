import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';

import HeaderAccount from './HeaderAccount.component';

export const mapStateToProps = (state) => ({
    language: state.AppState.language,
    isLoggedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = () => ({});

export class HeaderAccountContainer extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool,
        isAccount: PropTypes.bool,
        isLoggedIn: PropTypes.bool.isRequired,
        language: PropTypes.string.isRequired
    };

    static defaultProps = {
        isBottomBar: false,
        isAccount: false
    };

    containerProps = () => ({
        customer: this._getCustomerInformation()
    });

    _getCustomerInformation() {
        const { isLoggedIn } = this.props;

        if (!isSignedIn() && !isLoggedIn) {
            return null;
        }

        return BrowserDatabase.getItem(CUSTOMER);
    }

    render() {
        return (
            <HeaderAccount
              { ...this.props }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderAccountContainer);
