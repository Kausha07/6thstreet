/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-magic-numbers */
/* eslint-disable radix */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CreditCard from './CreditCard.component';

export class CreditCardContainer extends PureComponent {
    static propTypes = {
        setCreditCardData: PropTypes.func.isRequired
    };

    isNumber(value) {
        const stringVal = value.toString();
        const lastInput = stringVal.charAt(stringVal.length - 1);
        if (lastInput === '.') {
            return false;
        }

        return !isNaN(-value);
    }

    format(value, spacePosition, expInput) {
        const regex = new RegExp(`(.{${spacePosition}})`, 'g');

        if (expInput) {
            return value.replace(/[^\dA-Z]/gi, '')
                .toUpperCase()
                .replace(regex, '$1/')
                .replace(/^\|+|\/+$/g, '');
        }

        return value.replace(/[^\dA-Z]/gi, '')
            .toUpperCase()
            .replace(regex, '$1 ')
            .trim();
    }

    countSpaces(text, expInput) {
        if (expInput) {
            return text.includes('/') ? 1 : 0;
        }

        const spaces = text.match(/(\s+)/g);
        return spaces ? spaces.length : 0;
    }

    reformatInputField = (element, spacePosition) => {
        const expInput = spacePosition === 2;
        const onlyNumbers = expInput ? element.value.replace('/', '') : element.value.replace(/\s/g, '');

        if (!this.isNumber(onlyNumbers)) {
            element.value = element.value.slice(0, -1);
            return;
        }

        const position = element.selectionEnd;
        const previousValue = element.value;
        element.value = this.format(element.value, spacePosition, expInput);

        if (position !== element.value.length) {
            const beforeCaret = previousValue.substr(0, position);
            const countPrevious = this.countSpaces(beforeCaret, expInput);
            const countCurrent = this.countSpaces(this.format(beforeCaret, spacePosition, expInput), expInput);
            element.selectionEnd = position + (countCurrent - countPrevious);
        }
    };

    expDateValidator(value) {
        const message = __('Please check the correct card correct card correct card expiration date (MM/YY)');
        const first = parseInt(value.charAt(0));
        const month = parseInt(value.slice(0, 2));
        const yearFirst = parseInt(value.slice(2, 3));
        const year = parseInt(value.slice(2, 4));

        // month validation
        if (first > 1 || first < 0) {
            return message;
        }
        if (value.length > 1) {
            if (month === 0 || ((month > 12 || month < 1) && first !== 0)) {
                return message;
            }
        }
        if (value.length > 2) {
            const date = new Date();
            const thisYearFirst = date.getFullYear().toString().slice(2, 3);
            // year gap
            if ((yearFirst > parseInt(thisYearFirst) + 1) || yearFirst < parseInt(thisYearFirst)) {
                return message;
            }
        }

        // check if card expire
        if (value.length > 3) {
            const today = new Date();
            const expDay = new Date(parseInt(`20${year}`), month, 1);

            if (today > expDay) {
                return message;
            }
        }

        return null;
    }

    render() {
        const { setCreditCardData } = this.props;

        return (
            <CreditCard
              setCreditCardData={ setCreditCardData }
              expDateValidator={ this.expDateValidator }
              isNumber={ this.isNumber }
              reformatInputField={ this.reformatInputField }
              { ...this.props }
            />
        );
    }
}

export default CreditCardContainer;
