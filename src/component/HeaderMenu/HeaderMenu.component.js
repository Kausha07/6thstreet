// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Menu from 'Component/Menu';

import './HeaderMenu.style';

class HeaderMenu extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderMenu() {
        return (
            <Menu />
        );
    }

    render() {
        return (
            <div block="HeaderMenu">
                { this.renderMenu() }
            </div>
        );
    }
}

export default HeaderMenu;
