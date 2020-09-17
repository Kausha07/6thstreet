/* eslint-disable @scandipwa/scandipwa-guidelines/create-config-files */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Html from 'Component/Html';
import Popup from 'Component/Popup';

import './StoreSwitcherPopup.style';

export const STORE_POPUP_ID = 'testStoreId';

class StoreSwitcherPopup extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired
    };

    render() {
        const { showOverlay } = this.props;
        showOverlay('testStoreId');
        console.log('ehh');
        return (
            <Popup>
                <Html content="wff" />
                <div block="StoreSwitcherPopup">
                    TEST TEXTTT
                </div>
            </Popup>
        );
    }
}

export default StoreSwitcherPopup;
