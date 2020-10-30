/* eslint-disable no-restricted-globals */
/* eslint-disable fp/no-let */
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

    expDateValidator(value) {
        const message = __('Please check the correct card correct card correct card expiration date (MM/YY)');
        const first = parseInt(value.charAt(0));
        const month = parseInt(value.slice(0, 2));
        const yearFirst = parseInt(value.slice(3, 4));
        const year = parseInt(value.slice(3, 5));

        // month validation
        if (first > 1 || first < 0) {
            return message;
        }
        if (value.length > 1) {
            if (month === 0 || ((month > 12 || month < 1) && first !== 0)) {
                return message;
            }
        }
        if (value.length > 3) {
            const date = new Date();
            const thisYearFirst = date.getFullYear().toString().slice(2, 3);
            // year gap
            if (yearFirst > parseInt(thisYearFirst) + 1) {
                return message;
            }
        }

        // check if card expire
        if (value.length > 4) {
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
              { ...this.props }
            />
        );
    }
}

export default CreditCardContainer;
