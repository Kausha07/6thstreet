import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CreditCardDispatcher from 'Store/CreditCard/CreditCard.dispatcher';

import CreditCard from './CreditCard.component';

export const mapDispatchToProps = (dispatch) => ({
    addNewCreditCard: (cardData) => CreditCardDispatcher.addNewCreditCard(dispatch, cardData)
});

export class CreditCardContainer extends PureComponent {
    static propTypes = {
        addNewCreditCard: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCreditCardAdd: this.onCreditCardAdd.bind(this)
    };

    onCreditCardAdd(fields) {
        const { addNewCreditCard } = this.props;

        addNewCreditCard(fields);
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
