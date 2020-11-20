import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Iframe from 'react-iframe';

import Close from 'Component/HeaderSearch/icons/close-black.png';
import Popup from 'Component/Popup';

import { TABBY_POPUP_ID } from './TabbyPopup.config';

import './TabbyPopup.style.scss';

class TabbyPopup extends PureComponent {
    static propTypes = {
        tabbyWebUrl: PropTypes.string.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired
    };

    renderContent() {
        const { tabbyWebUrl } = this.props;

        return (
            <Iframe
              src={ tabbyWebUrl }
              width="545"
              height="750"
              id={ TABBY_POPUP_ID }
              display="initial"
              position="relative"
            />
        );
    }

    renderCloseButton() {
        const { hideActiveOverlay } = this.props;

        return (
            <div block="TabbyPopup" elem="CloseButtonWrapper">
                <button
                  block="TabbyPopup"
                  elem="Close"
                  // mods={ { isArabic } }
                  onClick={ hideActiveOverlay }
                >
                    <img src={ Close } alt="Close button" />
                </button>
            </div>
        );
    }

    render() {
        return (
            <Popup
              id={ TABBY_POPUP_ID }
              mix={ { block: 'TabbyPopup' } }
            >
                { this.renderCloseButton() }
                { this.renderContent() }
            </Popup>
        );
    }
}

export default TabbyPopup;
