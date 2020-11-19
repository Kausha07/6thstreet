/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ClickOutside from 'Component/ClickOutside';
import MyAccountOverlay from 'Component/MyAccountOverlay';
import MyAccountSignedInOverlay from 'Component/MyAccountSignedInOverlay';
import { customerType } from 'Type/Account';
import { isArabic } from 'Util/App';

import './HeaderAccount.style';

class HeaderAccount extends PureComponent {
    static propTypes = {
        requestCustomerData: PropTypes.func.isRequired,
        isBottomBar: PropTypes.bool.isRequired,
        isAccount: PropTypes.bool.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        customer: customerType,
        isMobile: PropTypes.bool,
        isFooter: PropTypes.bool.isRequired,
        handleFooterIsAccountOpen: PropTypes.func.isRequired
    };

    static defaultProps = {
        isMobile: false,
        customer: null
    };

    _isArabic = isArabic();

    state = {
        showPopup: false,
        showPopupSignedIn: false
    };

    closePopup = () => {
        this.setState({ showPopup: false, showPopupSignedIn: false });
        this.handleFooterPopup();
    };

    showMyAccountPopup = () => {
        const { isSignedIn } = this.props;
        this.setState({ showPopup: true, showPopupSignedIn: isSignedIn });
        this.handleFooterPopup();
    };

    handleFooterPopup = () => {
        const { handleFooterIsAccountOpen, isFooter } = this.props;
        if (isFooter) {
            handleFooterIsAccountOpen();
        }
    };

    onSignIn = () => {
        const { requestCustomerData } = this.props;

        requestCustomerData();
        this.closePopup();
    };

    renderMyAccountPopup() {
        const { isSignedIn } = this.props;
        const { showPopup, showPopupSignedIn } = this.state;

        if (!showPopup) {
            return null;
        }

        if (isSignedIn && showPopupSignedIn) {
            return (
                <ClickOutside onClick={ this.closePopup }>
                    <div>
                        <MyAccountSignedInOverlay onHide={ this.closePopup } />
                    </div>
                </ClickOutside>
            );
        }

        return <MyAccountOverlay closePopup={ this.closePopup } onSignIn={ this.onSignIn } isPopup />;
    }

    renderAccountButton() {
        const {
            isSignedIn,
            customer,
            isBottomBar,
            isFooter
        } = this.props;

        if (isBottomBar) {
            return (
                <label htmlFor="Account">{ __('Account') }</label>
            );
        }

        const accountButtonText = isSignedIn
            && customer
            && customer.firstname
            && customer.lastname
            ? `${customer.firstname} ${customer.lastname}`
            : __('Login/Register');

        return (
            <div block="HeaderAccount" elem="ButtonWrapper">
                <button
                  block="HeaderAccount"
                  elem="Button"
                  mods={ { isArabic: this._isArabic, isFooter } }
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
