import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './HeaderAccount.style';

class HeaderAccount extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool.isRequired,
        isAccount: PropTypes.bool.isRequired
        // TODO: implement prop-types
    };

    render() {
        const { isBottomBar, isAccount } = this.props;

        return (
            <div block="HeaderAccount" mods={ { isBottomBar } } mix={ { block: 'HeaderAccount', mods: { isAccount } } }>
                Account
            </div>
        );
    }
}

export default HeaderAccount;
