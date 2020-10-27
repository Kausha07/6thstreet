/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
/* eslint-disable fp/no-let */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MINI_CARDS } from './CreditCard.config';
import secure from './icons/secure.png';

import './CreditCard.style';

class CreditCard extends PureComponent {
    static propTypes = {
        supported_networks: PropTypes.array
    };

    static defaultProps = {
        supported_networks: []
    };

    state = {
        validatorMessage: null
    };

    handleNumberChange = (e) => {
        const { setCreditCardData } = this.props;
        let { value } = e.target;

        let newValue = '';
        value = value.replace(/\s/g, '');

        for (let i = 0; i < value.length; i++) {
            if (i % 4 === 0 && i > 0) {
                newValue = newValue.concat('  ');
            }
            newValue = newValue.concat(value[i]);
        }

        setCreditCardData({ number: newValue });
    };

    handleExpDateChange = (e) => {
        const { setCreditCardData } = this.props;
        let { value } = e.target;

        let newValue = '';
        value = value.replace('/', '');

        for (let i = 0; i < value.length; i++) {
            if (i === 2) {
                newValue = newValue.concat('/');
            }
            newValue = newValue.concat(value[i]);
        }
        const message = this.expDateValidator(newValue);

        this.setState({ validatorMessage: message });

        setCreditCardData({ expDate: newValue });
    };

    handleCvvChange = (e) => {
        const { setCreditCardData } = this.props;

        setCreditCardData({ cvv: e.target.value });
    };

    renderCreditCardForm() {
        return (
            <div block="CreditCard" elem="Card">
                <p>card number</p>
                <input
                  type="text"
                  placeholder="0000  0000  0000  0000"
                  id="number"
                  name="number"
                  pattern="\d*"
                  maxLength="22"
                  onChange={ this.handleNumberChange }
                  validation={ ['notEmpty'] }
                />
                <p>exp date</p>
                <div
                  block="CreditCard"
                  elem="Row"
                >
                    <input
                      type="text"
                      placeholder={ __('MM/YY') }
                      id="expData"
                      name="expData"
                      pattern="\d*"
                      maxLength="5"
                      onChange={ this.handleExpDateChange }
                      validation={ ['notEmpty'] }
                    />
                    <input
                      type="text"
                      placeholder={ __('CVV') }
                      id="cvv"
                      name="cvv"
                      maxLength="3"
                      onChange={ this.handleCvvChange }
                      validation={ ['notEmpty'] }
                    />
                </div>
            </div>
        );
    }

    renderMiniCard(miniCard) {
        const img = MINI_CARDS[miniCard];

        return <img src={ img } alt="method" />;
    }

    renderAcceptedCardsInfo() {
        const { cardData: { options: { supported_networks } } } = this.props;

        return (
            <div block="CreditCard" elem="Info">
                <div block="CreditCard" elem="AcceptedCards">
                    { __('accepted cards:') }
                    { supported_networks.map((miniCard) => this.renderMiniCard(miniCard)) }
                </div>
                <div block="CreditCard" elem="Secure">
                    <img src={ secure } alt="secure" />
                    { __('100% secured payments') }
                </div>
            </div>
        );
    }

    renderValidatorInfo() {
        const { validatorMessage } = this.state;

        if (validatorMessage) {
            return (
                <div block="CreditCard" elem="Validator">
                    { validatorMessage }
                </div>
            );
        }

        return null;
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
        return (
            <div block="CreditCard">
                { this.renderValidatorInfo() }
                { this.renderCreditCardForm() }
                { this.renderAcceptedCardsInfo() }
            </div>
        );
    }
}

export default CreditCard;
