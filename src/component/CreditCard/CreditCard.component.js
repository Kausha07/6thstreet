/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MINI_CARDS } from './CreditCard.config';
import secure from './icons/secure.png';
import Field from 'Component/Field';

import './CreditCard.style';

class CreditCard extends PureComponent {
    static propTypes = {
        supported_networks: PropTypes.array,
        isAmex: PropTypes.bool.isRequired
    };

    static defaultProps = {
        supported_networks: []
    };

    state = {
        cvv: '',
        validatorMessage: null,
        cardLogo: null,
        numberFilled: false,
        expDateFilled: false,
        cvvFilled: false,
        saveCard: true
    };

    componentDidMount() {
        const { setOrderButtonDisabled, setCreditCardData } = this.props;
        setOrderButtonDisabled();
        setCreditCardData({ saveCard: true });
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
        const {
            setCreditCardData,
            reformatInputField,
            getCardLogo,
            isAmex
        } = this.props;
        const { cvv } = this.state;
        const { value } = e.target;
        const element = document.getElementById('number');
        const onlyNumbers = value.replace(/\s/g, '') || '';
        const cardLogo = getCardLogo(onlyNumbers);

        reformatInputField(element, 4);
        setCreditCardData({ number: onlyNumbers });

        if (onlyNumbers.length === 16 || (isAmex && onlyNumbers.length === 15)) {
            this.setState({ cardLogo, numberFilled: true });
            return;
        }

        this.setState({
            cardLogo,
            numberFilled: false,
            cvv: onlyNumbers.length === 0 ? '' : cvv
        });
    };

    handleExpDateChange = (e) => {
        const { setCreditCardData, expDateValidator, reformatInputField } = this.props;
        const { value } = e.target;
        const element = document.getElementById('expData');
        const onlyNumbers = value.replace('/', '') || '';
        const message = expDateValidator(onlyNumbers);

        reformatInputField(element, 2);
        setCreditCardData({ expDate: onlyNumbers });

        this.setState({ validatorMessage: message });

        if (onlyNumbers.length === 4) {
            this.setState({ expDateFilled: true });
            return;
        }

        this.setState({ expDateFilled: false });
    };

    handleCvvChange = (e) => {
        const { setCreditCardData, isNumber, isAmex } = this.props;
        const { value = '' } = e.target;

        if (isNumber(value)) {
            setCreditCardData({ cvv: value });
            if (value.length === 3 || (isAmex && value.length === 4)) {
                this.setState({ cvv: value, cvvFilled: true });
                return;
            }

            this.setState({ cvv: value, cvvFilled: false });
        }
    };

    handlePaste = (e) => {
        e.preventDefault();
    };

    handleCheckboxChange = () => {
        const { setCreditCardData } = this.props;
        let value = !this.state.saveCard;
        this.setState({ saveCard: value });
        setCreditCardData({ saveCard: value });
    }

    renderCreditCardForm() {
        const { isAmex } = this.props;
        const { cvv, cardLogo } = this.state;

        return (
            <div block="CreditCard" elem="Card" dir="ltr">
                <p>card number</p>
                <input
                    type="text"
                    placeholder="0000  0000  0000  0000"
                    id="number"
                    name="number"
                    inputMode="numeric"
                    maxLength="19"
                    onChange={this.handleNumberChange}
                    validation={['notEmpty']}
                    onPaste={this.handlePaste}
                />
                <p>{__('exp date')}</p>
                <div
                    block="CreditCard"
                    elem="Row"
                >
                    <input
                        type="text"
                        placeholder={__('MM/YY')}
                        id="expData"
                        name="expData"
                        inputMode="numeric"
                        maxLength="5"
                        onChange={this.handleExpDateChange}
                        validation={['notEmpty']}
                        onPaste={this.handlePaste}
                    />
                    <input
                        type="text"
                        placeholder={__('CVV')}
                        id="cvv"
                        name="cvv"
                        inputMode="numeric"
                        maxLength={isAmex ? '4' : '3'}
                        value={cvv}
                        onChange={this.handleCvvChange}
                        validation={['notEmpty']}
                        onPaste={this.handlePaste}
                    />
                    <div
                        block="CreditCard"
                        elem="CardLogo"
                    >
                        {cardLogo ? <img src={cardLogo} alt="logo" /> : null}
                    </div>
                </div>
            </div>
        );
    }

    renderMiniCard(miniCard) {
        const img = MINI_CARDS[miniCard];

        return <img src={img} alt="method" key={miniCard} />;
    }

    renderAcceptedCardsInfo() {
        const { cardData: { options: { supported_networks = [] } } } = this.props;

        return (
            <div block="CreditCard" elem="Info">
                <div block="CreditCard" elem="AcceptedCards">
                    {__('accepted cards:')}
                    {supported_networks.map((miniCard) => this.renderMiniCard(miniCard))}
                </div>
                <div block="CreditCard" elem="Secure">
                    <img src={secure} alt="secure" />
                    {__('100% secured payments')}
                </div>
            </div>
        );
    }

    renderValidatorInfo() {
        const { validatorMessage } = this.state;

        if (validatorMessage) {
            return (
                <div block="CreditCard" elem="Validator">
                    { validatorMessage}
                </div>
            );
        }

        return null;
    }

    renderSaveCardToggle(checkboxId) {
        const { saveCard } = this.state;

        return (
            <div block="SaveCard">
                <Field
                    block="CreditCard"
                    elem="Toggle"
                    type="toggle"
                    id={checkboxId}
                    name={checkboxId}
                    value={checkboxId}
                    checked={saveCard}
                    onClick={this.handleCheckboxChange}
                />
                <label block="CreditCard" elem="Label" htmlFor={checkboxId}>
                    {"Save Card"}
                </label>
            </div>
        );
    }

    render() {
        return (
            <div block="CreditCard">
                { this.renderValidatorInfo()}
                { this.renderCreditCardForm()}
                {this.renderSaveCardToggle('save_card_info')}
                { this.renderAcceptedCardsInfo()}
            </div>
        );
    }
}

export default CreditCard;
