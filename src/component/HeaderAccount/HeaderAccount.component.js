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
        isPopup: true,
        isHidden: true
    };

    closePopup = () => {
        console.log(this.state);
        this.setState({ isHidden: true }, () => this.renderAccountPopUp());
    };

    openPopup = () => {
        console.log(this.state);
        this.setState(({ isHidden }) => ({ isHidden: !isHidden }), () => this.renderAccountPopUp());
    };

    renderAccountPopUp = () => {
        const { isPopup } = this.state;
        console.log(this.state);

        const popUpElement = (
            <div>
                <MyAccountOverlay isPopup={ isPopup } closePopup={ this.closePopup } />
            </div>
        );

        this.setState({ accountPopUp: popUpElement });
    };

    render() {
        const { isBottomBar, isAccount } = this.props;
        const { accountPopUp, isHidden } = this.state;

        return (
            <div block="HeaderAccount" mods={ { isBottomBar } } mix={ { block: 'HeaderAccount', mods: { isAccount } } }>
                { !isBottomBar ? (
                    <div block="HeaderAccount" elem="PupUp" mods={ { isHidden } }>
                        <button onClick={ this.renderAccountPopUp } block="HeaderAccount" elem="Button">
                            { accountPopUp }
                        </button>
                        <label htmlFor="Account">{ __('Login/Register') }</label>
                    </div>
                ) : (
                    <label htmlFor="Account">{ __('Account') }</label>
                ) }
            </div>
        );
    }
}

export default HeaderAccount;
