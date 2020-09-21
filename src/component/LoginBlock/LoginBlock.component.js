import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './LoginBlock.style';

class LoginBlock extends PureComponent {
    static propTypes = {
        isSignedIn: PropTypes.bool.isRequired,
        name: PropTypes.string
    };

    static defaultProps = {
        name: 'Guest'
    };

    constructor() {
        super();
        console.log(this.props);
        this.state = { isOpen: true };
    }

    handleDismiss = () => {
        this.setState({
            isOpen: false
        });
    };

    renderBlock() {
        const { isOpen } = this.state;
        if (!isOpen) {
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

    renderButtons() {
        const { isSignedIn } = this.props;
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
                <button mix={ { block: 'LoginBlock', elem: 'CreateButton secondary' } }>
                    Create Account
                </button>
                <button mix={ { block: 'LoginBlock', elem: 'LoginButton primary' } }>
                    Sign in
                </button>
            </div>
        );
    }

    render() {
        return this.renderBlock();
    }
}

export default LoginBlock;
