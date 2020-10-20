import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';

import './CreditCard.style';

class CreditCard extends PureComponent {
    static propTypes = {
        onCreditCardAdd: PropTypes.func.isRequired
    };

    renderCreditCardForm() {
        const { onCreditCardAdd } = this.props;

        return (
            <Form
              onSubmitSuccess={ onCreditCardAdd }
            >
                <Field
                  type="text"
                  placeholder="Card number"
                  id="number"
                  name="number"
                  validation={ ['notEmpty'] }
                />
                <Field
                  type="text"
                  placeholder="Expiration Date"
                  id="expData"
                  name="expData"
                  validation={ ['notEmpty'] }
                />
                <Field
                  type="text"
                  placeholder="CVV"
                  id="cvv"
                  name="cvv"
                  validation={ ['notEmpty'] }
                />
                <button
                  block="Button"
                  type="submit"
                >
                    { __('Add credit cart') }
                </button>
            </Form>
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
