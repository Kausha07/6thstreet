import {
    addNewCreditCard
} from 'Util/API/endpoint/CreditCard/CreditCard.enpoint';

export class CreditCardDispatcher {
    /* eslint-disable-next-line */
    async addNewCreditCard(dispatch, data) {
        const { number, expDate, cvv } = data;

        return addNewCreditCard({
            number,
            expiryMonth: expDate.substr('0', '2'),
            expiryyear: expDate.substr('2', '4'),
            cvv
        });
    }
}

export default new CreditCardDispatcher();
