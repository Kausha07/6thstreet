import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';

import HeaderMenu from './HeaderMenu.component';

export const mapStateToProps = (_state) => ({
    activeOverlay: _state.OverlayReducer.activeOverlay
});

export const mapDispatchToProps = (_dispatch) => ({
    toggleOverlayByKey: (key) => _dispatch(toggleOverlayByKey(key))
});

export class HeaderMenuContainer extends PureComponent {
    static propTypes = {
        activeOverlay: PropTypes.string.isRequired
    };

    containerProps = () => {
        const { activeOverlay } = this.props;
        return { activeOverlay };
    };

    render() {
        return (
            <HeaderMenu
              { ...this.props }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuContainer);
