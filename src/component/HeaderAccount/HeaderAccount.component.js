import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './HeaderAccount.style';

class HeaderAccount extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isAccount: PropTypes.bool.isRequired
    };

    render() {
        const { isBottomBar, isAccount } = this.props;

        return (
            <div block="HeaderAccount" mods={ { isBottomBar } } mix={ { block: 'HeaderAccount', mods: { isAccount } } }>
                <label htmlFor="Account">{ isBottomBar ? __('Account') : __('Login/Register') }</label>
            </div>
        );
    }
}

export default HeaderAccount;
