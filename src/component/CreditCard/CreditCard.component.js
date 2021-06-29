/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MINI_CARDS } from './CreditCard.config';
import secure from './icons/secure.png';
import Field from 'Component/Field';
import { isArabic } from "Util/App";

import './CreditCard.style';
import PlusIcon from "./icons/plus.png";
import SelectedIcon from './icons/selected.png';

class CreditCard extends PureComponent {
    static propTypes = {
        supported_networks: PropTypes.array,
        isAmex: PropTypes.bool.isRequired
    };

    static defaultProps = {
        supported_networks: []
    };

    constructor(props) {
        super(props);
        this.state = {
            cvv: '',
            cardLogo: null,
            saveCard: true,
            cvvFilled: false,
            numberFilled: false,
            expDateFilled: false,
            validatorMessage: null,
            isArabic: isArabic(),
        };
    }

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
        const { newCardVisible, savedCards } = this.props;
        if (newCardVisible) {//this case is for add new card
            return validatorMessage || !numberFilled || !expDateFilled || !cvvFilled;
        }

        //below code is for saved cards.
        let isSelected = savedCards.find(a => a.selected === true);
        if (isSelected) {
            return !cvvFilled;
        } else {
            return true;
        }
    }

    handleNumberChange = (e) => {
        const {
            setCreditCardData,
            reformatInputField,
            getCardLogo,
            isAmex,
            cardNumberValidator
        } = this.props;
        const { cvv } = this.state;
        const { value } = e.target;
        const element = document.getElementById('number');
        const onlyNumbers = value.replace(/\s/g, '') || '';
        const cardLogo = getCardLogo(onlyNumbers);
        const message = cardNumberValidator(onlyNumbers);

        reformatInputField(element, 4);
        setCreditCardData({ number: onlyNumbers });

        this.setState({ validatorMessage: message });

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

    handleNewCardClick = () => {
        this.props.toggleNewCardVisible(true);
        this.props.removePromotionSavedCard();
    }

    renderCreditCardForm() {
        const { isAmex } = this.props;
        const { cvv, cardLogo, isArabic } = this.state;

        return (
            <div block="CreditCard" elem="Card" dir={isArabic ? "rtl" : "ltr"}>
                <p>{__("card number")}</p>
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
                    dir="ltr"
                    style={{ textAlign: isArabic ? 'right' : 'left' }}
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
        if (img) {
            return <img src={img} alt="method" key={miniCard} />;
        }
        return null;
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
                    {validatorMessage}
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
                    {__("Save Card")}
                </label>
            </div>
        );
    }

    newCardBtn() {
        return (
            <div block="NewCard" elem="btn" onClick={this.handleNewCardClick}>
                <img src={PlusIcon} alt="plus" />
                <label>
                    {__("New Card")}
                </label>
            </div>
        );
    }

    renderSavedCards(savedCards) {
        const { isArabic } = this.state;
        return (
            <div block="SavedCards" elem="Container" style={{ gridTemplateColumns: `repeat(${savedCards.length}, 220px)` }}>
                {
                    savedCards.map((item) => {
                        const { entity_id, selected, details } = item;
                        const { maskedCC, bin = "000000", expirationDate, scheme } = details;
                        const cardNum = `${bin.substr(0, 4)} **** **** ${maskedCC}`;
                        if (selected) {
                            const { cvv } = this.state;
                            const { isAmex } = this.props;
                            return (
                                <div block="SelectedSavedCard" elem="Item" key={entity_id}>
                                    <img src={SelectedIcon} alt={"selected"} block="SavedCard" elem="Tick"
                                        style={{ marginRight: isArabic ? '12px' : '0px' }} />
                                    <span block="SelectedSavedCard" elem="CardNumber">{cardNum}</span>
                                    <div block="SelectedSavedCard" elem="CvvImgCon">
                                        <span>{`${expirationDate.substr(0, 3)}${expirationDate.substr(5, 2)}`}</span>
                                        <input
                                            id="cvv"
                                            type="text"
                                            name="cvv"
                                            value={cvv}
                                            inputMode="numeric"
                                            placeholder={__('CVV')}
                                            validation={['notEmpty']}
                                            onPaste={this.handlePaste}
                                            onChange={this.handleCvvChange}
                                            maxLength={isAmex ? '4' : '3'}
                                        />
                                        {this.renderMiniCard(scheme.toLowerCase())}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div block="SavedCard" elem="Item" key={entity_id} onClick={() => {
                                this.props.selectSavedCard(entity_id);
                                if (this.state.cvv.length > 0) {//remove cvv if filled on another card
                                    this.setState({ cvv: '' });
                                }
                                this.props.applyPromotionSavedCard();
                            }}>
                                <span block="SavedCard" elem="CardNumber" dir={isArabic ? "rtl" : "ltr"}>{cardNum}</span>
                                <div block="SavedCard" elem="CvvImgCon">
                                    <span>{`${expirationDate.substr(0, 3)}${expirationDate.substr(5, 2)}`}</span>
                                    {this.renderMiniCard(scheme.toLowerCase())}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderSavedCardsBlock(savedCards) {
        return (
            <React.Fragment>
                <label block="MyCards" elem="Label">
                    {__("My Cards")}
                </label>
                {this.renderSavedCards(savedCards)}
                {this.newCardBtn()}
            </React.Fragment>
        );
    }

    renderCardsBlock() {
        const { savedCards, newCardVisible } = this.props;
        const isSavedCardsAvailable = savedCards.length > 0;
        if (newCardVisible) {
            return this.renderCreditCardForm();
        } else if (isSavedCardsAvailable) {
            return this.renderSavedCardsBlock(savedCards);
        }
        return null;
    }

    render() {
        const { loadingSavedCards, newCardVisible ,isSignedIn} = this.props;
        if (loadingSavedCards) {
            return null;
        }
        return (
            <div block="CreditCard">
                {this.renderValidatorInfo()}
                {this.renderCardsBlock()}
                {newCardVisible && isSignedIn && this.renderSaveCardToggle('save_card_info')}
                {this.renderAcceptedCardsInfo()}
            </div>
        );
    }
}

export default CreditCard;