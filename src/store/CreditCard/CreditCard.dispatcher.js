import {
    addNewCreditCard
} from 'Util/API/endpoint/CreditCard/CreditCard.enpoint';

export class CreditCardDispatcher {
    /* eslint-disable-next-line */
    async addNewCreditCard(dispatch, data) {
        const { number, expData, cvv } = data;

        return addNewCreditCard({
            number,
            expiryMonth: expData.substr('0', '2'),
            expiryyear: expData.substr('3', '5'),
            cvv
        });
    }
}

export default new CreditCardDispatcher();
