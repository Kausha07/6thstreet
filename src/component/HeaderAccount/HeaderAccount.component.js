/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MyAccountOverlay from 'Component/MyAccountOverlay';
import MyAccountSignedInOverlay from 'Component/MyAccountSignedInOverlay';
import { customerType } from 'Type/Account';
import { isArabic } from 'Util/App';

import './HeaderAccount.style';

class HeaderAccount extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isAccount: PropTypes.bool.isRequired,
        customer: customerType,
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        isMobile: false,
        customer: null
    };

    _isArabic = isArabic();

    state = {
        showPopup: false
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };

    showMyAccountPopup = () => {
        this.setState({ showPopup: true });
    };

    renderMyAccountPopup() {
        const { customer } = this.props;
        const { showPopup } = this.state;

        if (!showPopup) {
            return null;
        }

        if (customer) {
            return <MyAccountSignedInOverlay onHide={ this.closePopup } />;
        }

        return <MyAccountOverlay closePopup={ this.closePopup } isPopup />;
    }

    renderAccountButton() {
        const { customer, isBottomBar } = this.props;

        if (isBottomBar) {
            return (
                <label htmlFor="Account">{ __('Account') }</label>
            );
        }

        const accountButtonText = customer ? `${customer.firstname} ${customer.lastname}`
            : __('Login/Register');

        return (
            <div block="HeaderAccount" elem="ButtonWrapper">
                <button
                  block="HeaderAccount"
                  elem="Button"
                  mods={ { isArabic: this._isArabic } }
                  onClick={ this.showMyAccountPopup }
                >
                    <label htmlFor="Account">{ accountButtonText }</label>
                </button>
                { this.renderMyAccountPopup() }
            </div>
        );
    }

    render() {
        const { isBottomBar, isAccount, isMobile } = this.props;

        return (
            <div
              block="HeaderAccount"
              mods={ { isBottomBar } }
              mix={ {
                  block: 'HeaderAccount',
                  mods: { isAccount },
                  mix: {
                      block: 'HeaderAccount',
                      mods: { isMobile }
                  }
              } }
            >
                { this.renderAccountButton() }
            </div>
        );
    }
}

export default HeaderAccount;
