import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CreditCard.style';

class CreditCard extends PureComponent {
    static propTypes = {
        onCreditCardAdd: PropTypes.func.isRequired
    };

    state = {
        number: '',
        expDate: '',
        cvv: ''
    };

    handleNumberChange = (e) => {
        this.setState({ number: e.target.value });
    };

    handleExpDateChange = (e) => {
        this.setState({ expDate: e.target.value });
    };

    handleCvvChange = (e) => {
        this.setState({ cvv: e.target.value });
    };

    handleClick = () => {
        const { onCreditCardAdd } = this.props;
        const { cvv, expDate, number } = this.state;

        onCreditCardAdd({ cvv, expDate, number });
    };

    renderCreditCardForm() {
        return (
            <>
                <input
                  type="text"
                  placeholder={ __('Card number') }
                  id="number"
                  name="number"
                  onChange={ this.handleNumberChange }
                  validation={ ['notEmpty'] }
                />
                <input
                  type="text"
                  placeholder={ __('Expiration Date') }
                  id="expData"
                  name="expData"
                  onChange={ this.handleExpDateChange }
                  validation={ ['notEmpty'] }
                />
                <input
                  type="text"
                  placeholder={ __('CVV') }
                  id="cvv"
                  name="cvv"
                  onChange={ this.handleCvvChange }
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="button"
                  onClick={ this.handleClick }
                >
                    { __('Add credit cart') }
                </button>
            </>
        );
    }

    render() {
        return (
            <div block="CreditCard">
                { this.renderCreditCardForm() }
            </div>
        );
    }
}

export default CreditCard;
