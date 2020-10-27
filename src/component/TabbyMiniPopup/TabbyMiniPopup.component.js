import PropTypes from 'prop-types';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PureComponent } from 'react';

import './TabbyMiniPopup.style.scss';

class TabbyMiniPopup extends PureComponent {
    static propTypes = {
        closeTabbyPopup: PropTypes.func.isRequired
    };

    renderPdpTabbyPopup() {
        return (
            <>
                Hey
            </>
        );
    }

    renderContent() {
        return (
            <>
            <div block="TabbyMiniPopup" elem="Overlay" onClick={ this.onOverlayClick } />
            <div block="TabbyMiniPopup" elem="Content" onClick={ this.onContentClick }>
                { this.renderPdpTabbyPopup() }
            </div>
            </>
        );
    }

    onOverlayClick = () => {
        const { closeTabbyPopup } = this.props;

        closeTabbyPopup();
    };

    onContentClick = (e) => {
        e.preventDefault();
        console.log('hmm');
    };

    render() {
        console.log(this.props);
        return this.renderContent();
    }
}

export default TabbyMiniPopup;
