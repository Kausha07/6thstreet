/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import secure from './icons/secure.png';
import { MINI_CARDS } from './CreditCard.config';

import './CreditCard.style';

class SavedCard extends PureComponent {
    render() {
        return (
            <div block="SavedCard" elem="Item">

            </div>
        );
    }
}

export default SavedCard;
