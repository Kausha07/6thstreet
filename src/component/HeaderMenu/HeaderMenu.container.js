import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import HeaderMenu from './HeaderMenu.component';

export const mapDispatchToProps = (_dispatch) => ({
    toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key))
});

export class HeaderMenuContainer extends PureComponent {
    render() {
        return (
            <HeaderMenu
              { ...this.props }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(HeaderMenuContainer);
