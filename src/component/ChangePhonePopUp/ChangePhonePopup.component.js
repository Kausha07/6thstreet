import { PureComponent } from 'react';

import Popup from 'Component/Popup';

import { CHANGE_PHONE_POPUP } from './ChangePhonePopup.config';

import './ChangePhonePopup.style.scss';

class ChangePhonePopup extends PureComponent {
    render() {
        return (
            <Popup
              id={ CHANGE_PHONE_POPUP }
              mix={ { block: 'ChangePhonePopup' } }
            >
                aaaaa
            </Popup>
        );
    }
}

export default ChangePhonePopup;
