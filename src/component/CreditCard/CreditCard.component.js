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

    handleNumberChange = (e) => {
        const { setCreditCardData, numberValidator } = this.props;
        let { value } = e.target;

        let newValue = '';
        value = value.replace(/\s/g, '');

        for (let i = 0; i < value.length; i++) {
            if (i % 4 === 0 && i > 0) {
                newValue = newValue.concat('  ');
            }
            newValue = newValue.concat(value[i]);
        }
        const message = numberValidator(value);
        this.setState({ validatorMessage: message });

        setCreditCardData({ number: newValue });
        if (newValue.length === 22) {
            this.setState({ number: newValue, numberFilled: true });
            return;
        }
        this.setState({ number: newValue, numberFilled: false });
    };

    handleExpDateChange = (e) => {
        const { setCreditCardData, expDateValidator } = this.props;
        let { value } = e.target;

        let newValue = '';
        value = value.replace('/', '');

        for (let i = 0; i < value.length; i++) {
            if (i === 2) {
                newValue = newValue.concat('/');
            }
            newValue = newValue.concat(value[i]);
        }
        const message = expDateValidator(newValue);
        this.setState({ validatorMessage: message });

        setCreditCardData({ expDate: newValue });
        if (newValue.length === 5) {
            this.setState({ expDate: newValue, expDateFilled: true });
            return;
        }
        this.setState({ expDate: newValue, expDateFilled: false });
    };

    handleCvvChange = (e) => {
        const { setCreditCardData, numberValidator } = this.props;
        const { value } = e.target;

        const message = numberValidator(value);
        this.setState({ validatorMessage: message });

        if (value.length === 3) {
            this.setState({ cvvFilled: true });
            return;
        }

        setCreditCardData({ cvv: e.target.value });
        this.setState({ cvvFilled: false });
    };

    renderCreditCardForm() {
        const { number, expDate } = this.state;
        return (
            <div block="CreditCard" elem="Card">
                <p>card number</p>
                <input
                  type="text"
                  placeholder="0000  0000  0000  0000"
                  id="number"
                  name="number"
                  pattern="\d*"
                  value={ number }
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
                      value={ expDate }
                      onChange={ this.handleExpDateChange }
                      validation={ ['notEmpty'] }
                    />
                    <input
                      type="text"
                      placeholder={ __('CVV') }
                      id="cvv"
                      name="cvv"
                      pattern="\d*"
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
