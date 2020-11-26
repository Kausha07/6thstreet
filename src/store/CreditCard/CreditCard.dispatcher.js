import { getCardType } from 'Util/API/endpoint/Checkout/Checkout.enpoint';
import { addNewCreditCard } from 'Util/API/endpoint/CreditCard/CreditCard.enpoint';

export class CreditCardDispatcher {
    /* eslint-disable-next-line */
    async addNewCreditCard(dispatch, data) {
        const { number, expDate = '', cvv } = data;

        return addNewCreditCard({
            type: 'card',
            number,
            expiryMonth: expDate.substr('0', '2'),
            expiry_month: expDate.substr('0', '2'),
            expiryyear: expDate.substr('2', '4'),
            expiry_year: expDate.substr('2', '4'),
            cvv
        });
    }

    async getCardType(dispatch, bin) {
        return getCardType({ bin });
    }
}

export default new CreditCardDispatcher();
