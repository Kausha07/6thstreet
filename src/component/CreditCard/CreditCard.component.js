/* eslint-disable no-var */
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
        number: '',
        expDate: '',
        cvv: '',
        validatorMessage: null,
        numberFilled: false,
        expDateFilled: false,
        cvvFilled: false
    };

    componentDidMount() {
        const { setOrderButtonDisabled } = this.props;
        setOrderButtonDisabled();
    }

    componentDidUpdate() {
        const { setOrderButtonDisabled, setOrderButtonEnabled } = this.props;

        setOrderButtonEnabled();
        if (this.haveUnvalidFields()) {
            setOrderButtonDisabled();
        }
    }

    haveUnvalidFields() {
        const {
            validatorMessage,
            numberFilled,
            expDateFilled,
            cvvFilled
        } = this.state;

        return validatorMessage || !numberFilled || !expDateFilled || !cvvFilled;
    }

    format(value) {
        return value.replace(/[^\dA-Z]/gi, '')
            .toUpperCase()
            .replace(/(.{4})/g, '$1 ')
            .trim();
    }

    countSpaces(text) {
        var spaces = text.match(/(\s+)/g);
        return spaces ? spaces.length : 0;
    }

    reformatInputField() {
        const element = document.getElementById('number');
        var position = element.selectionEnd;
        var previousValue = element.value;
        element.value = this.format(element.value);

        if (position !== element.value.length) {
            const beforeCaret = previousValue.substr(0, position);
            const countPrevious = this.countSpaces(beforeCaret);
            const countCurrent = this.countSpaces(this.format(beforeCaret));
            element.selectionEnd = position + (countCurrent - countPrevious);
        }
    }

    handleNumberChange = (e) => {
        const { setCreditCardData, isNumber } = this.props;
        const { value } = e.target;

        const onlyNumbers = value.replace(/\s/g, '');

        if (isNumber(onlyNumbers)) {
            setCreditCardData({ number: onlyNumbers });
            if (onlyNumbers.length === 16) {
                this.setState({ number: value, numberFilled: true });
                return;
            }

            this.setState({ number: value, numberFilled: false });
        }

        // this.reformatInputField();
    };

    handleExpDateChange = (e) => {
        const { setCreditCardData, expDateValidator, isNumber } = this.props;
        let { value } = e.target;

        let newValue = '';
        value = value.replace('/', '');

        for (let i = 0; i < value.length; i++) {
            if (i === 2) {
                newValue = newValue.concat('/');
            }
            newValue = newValue.concat(value[i]);
        }

        const onlyNumbers = newValue.length > 2 ? newValue.substr('0', '2') + newValue.substr('3', '5') : newValue;

        if (isNumber(onlyNumbers)) {
            const message = expDateValidator(newValue);
            this.setState({ validatorMessage: message });

            setCreditCardData({ expDate: newValue });
            if (newValue.length === 5) {
                this.setState({ expDate: newValue, expDateFilled: true });
                return;
            }
            this.setState({ expDate: newValue, expDateFilled: false });
        }
    };

    handleCvvChange = (e) => {
        const { setCreditCardData, isNumber } = this.props;
        const { value } = e.target;

        if (isNumber(value)) {
            setCreditCardData({ cvv: value });
            if (value.length === 3) {
                this.setState({ cvv: value, cvvFilled: true });
                return;
            }

            this.setState({ cvv: value, cvvFilled: false });
        }
    };

    renderCreditCardForm() {
        const { expDate, cvv, number } = this.state;
        return (
            <div block="CreditCard" elem="Card">
                <p>card number</p>
                <input
                  type="text"
                  placeholder="0000  0000  0000  0000"
                  id="number"
                  name="number"
                //   pattern="[0-9]*"
                //   inputMode="numeric"
                  value={ number }
                  maxLength="16"
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
                      maxLength="5"
                      value={ expDate }
                      onChange={ this.handleExpDateChange }
                      validation={ ['notEmpty'] }
                    />
                    <input
                      type="text"
                      placeholder={ __('CVV') }
                      id="cvv"
                      name="cvv"
                    //   pattern="\d*"
                      maxLength="3"
                      value={ cvv }
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
