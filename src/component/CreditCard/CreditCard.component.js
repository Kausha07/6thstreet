import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './CreditCard.style';

class CreditCard extends PureComponent {
    static propTypes = {
        setCreditCardData: PropTypes.func.isRequired
    };

    handleNumberChange = (e) => {
        const { setCreditCardData } = this.props;

        setCreditCardData({ number: e.target.value });
    };

    handleExpDateChange = (e) => {
        const { setCreditCardData } = this.props;

        setCreditCardData({ expDate: e.target.value });
    };

    handleCvvChange = (e) => {
        const { setCreditCardData } = this.props;

        setCreditCardData({ cvv: e.target.value });
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
