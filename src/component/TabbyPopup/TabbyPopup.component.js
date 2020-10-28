import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Iframe from 'react-iframe';

import Popup from 'Component/Popup';

import { TABBY_POPUP_ID } from './TabbyPopup.config';

import './TabbyPopup.style.scss';

class TabbyPopup extends PureComponent {
    static propTypes = {
        tabbyWebUrl: PropTypes.string.isRequired
    };

    renderContent() {
        const { tabbyWebUrl } = this.props;

        return (
            <Iframe
              src={ tabbyWebUrl }
              width="545"
              height="682"
              id="tabby_popup"
              display="initial"
              position="relative"
            />
        );
    }

    render() {
        return (
            <Popup
              id={ TABBY_POPUP_ID }
              mix={ { block: 'TabbyPopup' } }
            >
                { this.renderContent() }
            </Popup>
        );
    }
}

export default TabbyPopup;
