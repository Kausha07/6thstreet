/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MyAccountOverlay from 'Component/MyAccountOverlay';

import './HeaderAccount.style';

class HeaderAccount extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isAccount: PropTypes.bool.isRequired
    };

    state = {
        accountPopUp: '',
        isPopup: true
    };

    closePopup = () => {
        this.setState({ accountPopUp: '' });
    };

    renderAccountPopUp = () => {
        const { isPopup } = this.state;
        const popUpElement = (
                <MyAccountOverlay isPopup={ isPopup } closePopup={ this.closePopup } />
        );

        this.setState({ accountPopUp: popUpElement });
    };

    render() {
        const { isBottomBar, isAccount } = this.props;
        const { accountPopUp } = this.state;

        return (
            <div block="HeaderAccount" mods={ { isBottomBar } } mix={ { block: 'HeaderAccount', mods: { isAccount } } }>
                { !isBottomBar ? (
                    <div>
                        <button onClick={ this.renderAccountPopUp } block="HeaderAccount" elem="Button">
                            <label htmlFor="Account">{ __('Login/Register') }</label>
                        </button>
                        { accountPopUp }
                    </div>
                ) : (
                    <label htmlFor="Account">{ __('Account') }</label>
                ) }
            </div>
        );
    }
}

export default HeaderAccount;
