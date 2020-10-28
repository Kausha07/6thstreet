import {
    addNewCreditCard
} from 'Util/API/endpoint/CreditCard/CreditCard.enpoint';

export class CreditCardDispatcher {
    /* eslint-disable-next-line */
    async addNewCreditCard(dispatch, data) {
        const { number, expDate, cvv } = data;

        return addNewCreditCard({
            number: number.replace(/\s/g, ''),
            expiryMonth: expDate.substr('0', '2'),
            expiryyear: expDate.substr('3', '5'),
            cvv
        });
    }
}

export default new CreditCardDispatcher();
