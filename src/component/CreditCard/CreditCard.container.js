import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CreditCardDispatcher from 'Store/CreditCard/CreditCard.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { FIVE_MINUTES_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import CreditCard from './CreditCard.component';

export const mapDispatchToProps = (dispatch) => ({
    addNewCreditCard: (cardData) => CreditCardDispatcher.addNewCreditCard(dispatch, cardData),
    showSuccessMessage: (message) => dispatch(showNotification('success', message)),
    showErrorMessage: (message) => dispatch(showNotification('error', message))
});

export class CreditCardContainer extends PureComponent {
    static propTypes = {
        addNewCreditCard: PropTypes.func.isRequired,
        showSuccessMessage: PropTypes.func.isRequired,
        showErrorMessage: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCreditCardAdd: this.onCreditCardAdd.bind(this)
    };

    onCreditCardAdd(fields) {
        const { addNewCreditCard, showErrorMessage, showSuccessMessage } = this.props;

        addNewCreditCard(fields).then(
            (response) => {
                if (response.id) {
                    BrowserDatabase.setItem(response.id, 'CREDIT_CART_TOKEN', FIVE_MINUTES_IN_SECONDS);
                    showSuccessMessage(__('Credit card successfully added'));
                } else {
                    showErrorMessage(__('Something went wrong'));
                }
            },
            this._handleError
        );
    }

    render() {
        return (
            <CreditCard
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(CreditCardContainer);
