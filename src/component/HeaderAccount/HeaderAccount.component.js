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
        isPopup: true,
        isHidden: false
    };

    componentDidMount() {
        console.log('Mount');
    }

    closePopup = () => {
        console.log(this.state);
        this.setState({ isHidden: true },
            () => this.renderAccountPopUp(),
            () => this.setState({ isHidden: false }));
    };

    openPopup = () => {
        console.log(this.state);
        this.setState(({ isHidden }) => ({ isHidden: !isHidden }), () => this.renderAccountPopUp());
    };

    renderAccountPopUp = () => {
        const { isPopup, isHidden } = this.state;
        console.log(this.state);
        const popUpElement = (
                <MyAccountOverlay isPopup={ isPopup } closePopup={ this.closePopup } isHidden={ isHidden } />
        );

        this.setState({ accountPopUp: popUpElement });
    };

    render() {
        const { isBottomBar, isAccount } = this.props;
        const { accountPopUp, isHidden } = this.state;
        const isOpen = !isHidden;

        return (
            <div block="HeaderAccount" mods={ { isBottomBar } } mix={ { block: 'HeaderAccount', mods: { isAccount } } }>
                { !isBottomBar ? (
                    <div>
                        <button onClick={ this.renderAccountPopUp } block="HeaderAccount" elem="Button" mods={ { isOpen } }>
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
