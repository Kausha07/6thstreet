import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import MyAccountOverlay from 'Component/MyAccountOverlay';
import { isArabic } from 'Util/App';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';

import './LoginBlock.style';

class LoginBlock extends PureComponent {
    static propTypes = {
        isSignedIn: PropTypes.bool.isRequired,
        name: PropTypes.string
    };

    static defaultProps = {
        name: 'Guest'
    };

    state = {
        isOpen: true,
        isArabic: isArabic(),
        showPopup: false,
        registerField: false
    };

    handleDismiss = () => {
        this.setState({
            isOpen: false
        });
    };

    routeChangeAccount = () => history.push('/my-account');

    renderBlock() {
        const { isOpen } = this.state;

        if (!isOpen || isSignedIn()) {
            return null;
        }

        return (
            <div block="LoginBlock">
                <div
                  role="button"
                  aria-label="Dismiss"
                  tabIndex={ 0 }
                  onClick={ this.handleDismiss }
                  onKeyDown={ this.handleDismiss }
                  mix={ { block: 'LoginBlock', elem: 'Dismiss' } }
                />
                <br />
                { this.renderHeader() }
                { this.renderButtons() }
            </div>
        );
    }

    renderHeader() {
        const { isSignedIn, name } = this.props;
        if (isSignedIn) {
            return (
                <div>
                    <h3 mix={ { block: 'LoginBlock', elem: 'Header' } }>
                        { `Welcome, ${name}` }
                    </h3>
                    <span mix={ { block: 'LoginBlock', elem: 'SubHeader' } }>
                        Customize your shopping experience
                    </span>
                </div>
            );
        }

        return (
            <div>
                <h3 mix={ { block: 'LoginBlock', elem: 'Header' } }>Let&apos;s get personal</h3>
                <span mix={ { block: 'LoginBlock', elem: 'SubHeader' } }>
                    Sign in for a tailored shopping experience
                </span>
            </div>
        );
    }

    closePopup = () => {
        this.setState({ showPopup: false, registerField: false });
    };

    showPopup = () => {
        this.setState({ showPopup: true, registerField: false });
    };

    showRegisterPopup = () => {
        this.setState({ showPopup: true, registerField: true });
    };

    setRegisterFieldFalse = () => {
        this.setState({ registerField: false });
    };

    renderMyAccountPopup() {
        const { showPopup, registerField } = this.state;

        if (!showPopup) {
            return null;
        }

        return (
            <MyAccountOverlay
              setRegisterFieldFalse={ this.setRegisterFieldFalse }
              registerField={ registerField }
              closePopup={ this.closePopup }
              isPopup
            />
        );
    }

    renderButtons() {
        const { isSignedIn } = this.props;
        const { isArabic } = this.state;

        if (isSignedIn) {
            return (
                <div mix={ { block: 'LoginBlock', elem: 'ButtonContainer' } }>
                    <button mix={ { block: 'LoginBlock', elem: 'Button primary' } }>
                        My account
                    </button>
                </div>
            );
        }

        return (
            <div mix={ { block: 'LoginBlock', elem: 'ButtonContainer' } }>
                <button
                  onClick={ this.showRegisterPopup }
                  mix={ { block: 'LoginBlock', elem: 'CreateButton secondary', mods: { isArabic } } }
                >
                    Create Account
                </button>
                <button
                  onClick={ this.showPopup }
                  mix={ { block: 'LoginBlock', elem: 'LoginButton primary', mods: { isArabic } } }
                >
                    Sign in
                </button>
                { this.renderMyAccountPopup() }
            </div>
        );
    }

    render() {
        return this.renderBlock();
    }
}

export default LoginBlock;
