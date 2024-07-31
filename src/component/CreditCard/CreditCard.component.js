/* eslint-disable radix */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MINI_CARDS } from './CreditCard.config';
import secure from './icons/secure.png';
import Field from 'Component/Field';
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import cardValidator from 'card-validator';

import './CreditCard.style';
import PlusIcon from "./icons/plus.png";
import SelectedIcon from './icons/selected.png';
import ccimg from "./icons/ccimg.png";
const AMEX = 'amex';
import CreditCardSwipeToDelete from "Component/CreditCardSwipeToDelete";
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
            saveCard: this.props.isSignedIn,
            cvvFilled: false,
            numberFilled: false,
            expDateFilled: false,
            validatorMessage: null,
            isArabic: isArabic(),
            expMonth: '',
            expYear: '',
            isMobile: isMobile.any() || isMobile.tablet(),
        };
        this.ScrollerRef = React.createRef();
    }

    componentDidMount() {
        const { setOrderButtonDisabled, setCreditCardData, isSignedIn } = this.props;
        setOrderButtonDisabled();
        setCreditCardData({ saveCard: isSignedIn });
    }

    componentDidUpdate() {
        const { setOrderButtonDisabled, setOrderButtonEnabled } = this.props;
        const { isMobile } = this.state;

        setOrderButtonEnabled();
        if (this.haveUnvalidFields()) {
            setOrderButtonDisabled();
        }

        // focus on cvv 
        if (this?.ScrollerRef?.current && !isMobile) {
            this?.ScrollerRef?.current?.scrollIntoView({ behavior: "smooth" });
            document.getElementById("cvv")?.focus();
        }
    }

    haveUnvalidFields() {
        const {
            validatorMessage,
            numberFilled,
            expDateFilled,
            cvvFilled,
            isMobile,
        } = this.state;
        const { newCardVisible, savedCards } = this.props;
        if (newCardVisible) {//this case is for add new card
            return validatorMessage || !numberFilled || !expDateFilled || !cvvFilled;
        }
        if(isMobile) {
            return false;
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

    expDateValidator2(isMonth, value) {
        const { expMonth, expYear } = this.state;

        if(isMonth && expYear === '') {
            // When the user enters the month
            if (!cardValidator.expirationMonth(value).isValid) {
                return __("Card exp month is not valid");
            } else {
                return __("Card exp year is not valid");
            }
        } else if (isMonth && expYear.length === 2) {
            // when user try to edit month
            if (!cardValidator.expirationMonth(value).isValid) {
                return __("Card exp month is not valid");
            } else if (!cardValidator.expirationYear(expYear).isValid){
                return __("Card exp year is not valid");
            }else {
                return null;
            }
        } else if ((!isMonth && expMonth === "") || (!isMonth && expMonth.length === 2)) {
            // when user enters year before month OR after entering month enters a year value
            if (!cardValidator.expirationMonth(expMonth).isValid) {
                return __("Card exp month is not valid");
            } else if (!cardValidator.expirationYear(value).isValid){
                return __("Card exp year is not valid");
            }else {
                return null;
            }
        } 
    }

    handleExpDateChange = (value, isMonth) => {
        const { setCreditCardData, expDateValidator } = this.props;
        const { expMonth, expYear, expDateFilled } = this.state;
        const message = this.expDateValidator2(isMonth, value);
        const key = isMonth ? 'expMonth' : 'expYear';

        setCreditCardData({ [key]: value });

        this.setState({ validatorMessage: message, [key]: value });

        if (isMonth) {
            if (value.length === 2 && expYear.length === 2) {
                this.setState({ expDateFilled: true });
                return;
            } else if (value.length === 2 && value >= 1 && value <= 12) { 
                let yearInput = document.getElementById("expDataYY");
                if (yearInput) {
                    yearInput.focus();
                }
            }
        } else if (expMonth.length === 2 && value.length === 2) {
            this.setState({ expDateFilled: true });
            return;
        }

        this.setState({ expDateFilled: false });
    };

    handleCvvChange = (e, isAmex) => {
        const { setCreditCardData, isNumber } = this.props;
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
        this.setState({ cvv: '' });
    }

    handleMyCardsClick = () => {
        this.props.toggleNewCardVisible(false);
        this.setState({validatorMessage :null})
    }

    renderCreditCardForm() {
        const { isAmex, isSignedIn, savedCards } = this.props;
        const { cvv, cardLogo, isArabic, isMobile } = this.state;
        return (
            <React.Fragment>               
            {isSignedIn && savedCards.length > 0 && !isMobile ? (
              <label
                block="MyCards"
                elem="Link"
                onClick={this.handleMyCardsClick}
              >
                {__("My Cards")}
              </label>
            ) : null}
            
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
                    <div block="CreditCard" elem="ExpDateRow">
                        <input
                            type="text"
                            placeholder={__('MM')}
                            id="expDataMM"
                            name="expDataMM"
                            inputMode="numeric"
                            maxLength="2"
                            onChange={({ target }) => this.handleExpDateChange(target.value.toString(), true)}
                            validation={['notEmpty']}
                            onPaste={this.handlePaste}
                        />
                        <span>{"/"}</span>
                        <input
                            type="text"
                            placeholder={__('YY')}
                            id="expDataYY"
                            name="expDataYY"
                            inputMode="numeric"
                            maxLength="2"
                            onChange={({ target }) => this.handleExpDateChange(target.value.toString(), false)}
                            validation={['notEmpty']}
                            onPaste={this.handlePaste}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder={__('CVV')}
                        id="cvv"
                        name="cvv"
                        inputMode="numeric"
                        maxLength={isAmex ? '4' : '3'}
                        value={cvv}
                        onChange={(e) => this.handleCvvChange(e, isAmex)}
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
            </React.Fragment>
        );
    }

    renderMiniCard(miniCard) {
        const img = MINI_CARDS[miniCard];
        const isAmex = miniCard === AMEX;
        if (img) {
            return <img src={img} alt="method" key={miniCard} style={{ width: isAmex ? '30px' : '40px' }} />;
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
        const { isRenderEmmptyCard } = this.props;
        const { saveCard, isMobile } = this.state;
        if(!isRenderEmmptyCard && isMobile) {
            return null;
        }
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

    checkisExpired(expires_at) {
        const date1 = new Date();
        const date2 = new Date(expires_at);
        return date1 > date2
    }

    handleMsiteCardClick() {
        const { method, selectPaymentMethod } = this.props;
        selectPaymentMethod(method);
        this.props.toggleNewCardVisible(false);
    }

    renderSavedCardsMsite(item) {
        const { isArabic } = this.state;
        const { method, selectedPaymentCode, newCardVisible } = this.props;
        const { m_code } = method;
        const isSelected = m_code === selectedPaymentCode;
        const { entity_id, selected, details, expires_at } = item;
        const {
          maskedCC,
          bin = "000000",
          expirationDate,
          scheme = "",
        } = details;
        let cardNum = `${bin.substr(0, 4)} **** **** ${maskedCC}`;
        let cardNumMsite = ` **** ${maskedCC}`;
        const isExpired = this.checkisExpired(expires_at);

        if (isArabic) {
          cardNum = `${maskedCC} **** **** ${bin.substr(0, 4)}`;
        }

        if (selected && isSelected && !newCardVisible) {
          const { cvv } = this.state;
          const isAmex = scheme.toLowerCase() === AMEX;

          return (
            <div
              block="SelectedSavedCard"
              elem="Item"
              key={entity_id}
              ref={this.ScrollerRef}
            >
              <div block="selectedSavedCardMsite" mods={{ isArabic }}>
                <div>
                  <img src={ccimg} alt={"selected"} />
                </div>

                <div block="selectedSavedCardMsite" elem="headerWrap" mods={{ isArabic }}>
                  <span>{this.renderMiniCard(scheme.toLowerCase())}</span>
                  <span>Credit Card</span> <br />
                  <span block="SelectedSavedCard" elem="CardNumber">
                    {cardNumMsite}
                  </span>{" "}
                  <br />
                  <span>{`${expirationDate.substr(0, 3)}${expirationDate.substr(
                    5,
                    2
                  )}`}</span>
                </div>
              </div>

              <div
                block="SelectedSavedCard"
                elem="CvvImgCon"
                mods={{ isSelected: selected }}
              >
                <input
                  id="cvv"
                  name="cvv"
                  value={cvv}
                  type="password"
                  inputMode="numeric"
                  placeholder={__("CVV")}
                  validation={["notEmpty"]}
                  onPaste={this.handlePaste}
                  maxLength={isAmex ? "4" : "3"}
                  onChange={(e) => this.handleCvvChange(e, isAmex)}
                  style={{ width: isAmex ? "56px" : "50px" }}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            block="SavedCard"
            elem="Item"
            key={entity_id}
            ref={this.ScrollerRef}
            onClick={() => {
              this.handleMsiteCardClick();
              this.props?.setIsRenderEmmptyCard(true);
              this.props.selectSavedCard(entity_id);
              if (this.state.cvv.length > 0) {
                //remove cvv if filled on another card
                this.setState({ cvv: "" });
              }
              this.props.applyPromotionSavedCard();
            }}
          >
            <div block="selectedSavedCardMsite" mods={{ isArabic }}>
              <div>
                <img src={ccimg} alt={"selected"} />
              </div>

              <div block="selectedSavedCardMsite" elem="headerWrap" mods={{ isArabic }}>
                <span>{this.renderMiniCard(scheme.toLowerCase())}</span>
                <span>Credit Card</span> <br />
                <span block="SavedCard" elem="CardNumber">
                  {cardNumMsite}
                </span>{" "}
                <br />
                <span>{`${expirationDate.substr(0, 3)}${expirationDate.substr(
                  5,
                  2
                )}`}</span>
              </div>
            </div>
          </div>
        );
    }

    renderSavedCards(savedCards) {
        const { isArabic, isMobile } = this.state;
        const { deleteCreditCard } = this.props;
        return (
            <div block="SavedCards" elem="Container" 
                style={isMobile ? {} : { gridTemplateColumns: `repeat(${savedCards.length}, 220px)` }}
            >
                {
                    savedCards.map((item) => {
                        const { entity_id, selected, details, expires_at } = item;
                        const { maskedCC, bin = "000000", expirationDate, scheme = "" } = details;
                        let cardNum = `${bin.substr(0, 4)} **** **** ${maskedCC}`;
                        const isExpired = this.checkisExpired(expires_at);

                        if (isArabic) {
                            cardNum = `${maskedCC} **** **** ${bin.substr(0, 4)}`;
                        }

                        if(isMobile) {
                            return this.renderSavedCardsMsite(item);
                        }

                        if (isExpired) {
                          return (
                            <CreditCardSwipeToDelete
                              item={item}
                              renderMiniCard={this.renderMiniCard}
                              deleteCreditCard={deleteCreditCard}
                              isArabic={isArabic}
                              key={cardNum}
                            />
                          );
                        }

                        if (selected) {
                            const { cvv } = this.state;
                            const isAmex = scheme.toLowerCase() === AMEX;
                            return (
                                <div block="SelectedSavedCard" elem="Item" key={entity_id} ref={this.ScrollerRef}>
                                    <img src={SelectedIcon} alt={"selected"} block="SavedCard" elem="Tick"
                                        style={{ marginRight: isArabic ? '12px' : '0px' }} />
                                    <span block="SelectedSavedCard" elem="CardNumber">{cardNum}</span>
                                    <div block="SelectedSavedCard" elem="CvvImgCon">
                                        <span>{`${expirationDate.substr(0, 3)}${expirationDate.substr(5, 2)}`}</span>
                                        <input
                                            id="cvv"
                                            name="cvv"
                                            value={cvv}
                                            type="password"
                                            inputMode="numeric"
                                            placeholder={__('CVV')}
                                            validation={['notEmpty']}
                                            onPaste={this.handlePaste}
                                            maxLength={isAmex ? '4' : '3'}
                                            onChange={(e) => this.handleCvvChange(e, isAmex)}
                                            style={{ width: isAmex ? '56px' : '50px' }}
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
        const { isMobile } = this.state;
        if(isMobile) {
            return (
                <React.Fragment>
                    {this.renderSavedCards(savedCards)}
                </React.Fragment>
            )
        }

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
        const { savedCards, newCardVisible, isRenderEmmptyCard } = this.props;
        const { isMobile } = this.state;
        const isSavedCardsAvailable = savedCards.length > 0;
        if(isMobile) {
            if(isRenderEmmptyCard) {
                return this.renderCreditCardForm();
            }else if (isSavedCardsAvailable) {
                return this.renderSavedCardsBlock(savedCards);
            }
            return null;
        }

        if (newCardVisible) {
            return this.renderCreditCardForm();
        } else if (isSavedCardsAvailable) {
            return this.renderSavedCardsBlock(savedCards);
        }
        return null;
    }

    render() {
        const { loadingSavedCards, newCardVisible, isSignedIn, isRenderEmmptyCard } = this.props;
        const { isMobile } = this.state;
        if (loadingSavedCards) {
            return null;
        }
        return (
            <div block="CreditCard">
                {this.renderValidatorInfo()}
                {this.renderCardsBlock()}
                {
                    ((newCardVisible && isSignedIn) || (isSignedIn && isRenderEmmptyCard))
                    ?
                    this.renderSaveCardToggle('save_card_info')
                    :
                    null
                }
                {!isMobile || isRenderEmmptyCard ? this.renderAcceptedCardsInfo() : null }
            </div>
        );
    }
}

export default CreditCard;