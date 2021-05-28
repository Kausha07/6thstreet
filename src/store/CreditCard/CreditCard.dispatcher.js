import { setSavedCards, setSavedCardsLoading } from './CreditCard.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { getCardType } from 'Util/API/endpoint/Checkout/Checkout.endpoint';
import { addNewCreditCard, saveCreditCard, getSavedCards } from 'Util/API/endpoint/CreditCard/CreditCard.enpoint';

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

    async saveCreditCard(_, data) {
        return saveCreditCard(data);
    }

    async getSavedCards(dispatch) {
        dispatch(setSavedCardsLoading(true));
        getSavedCards().then((resp) => {
            dispatch(setSavedCards(resp));
            dispatch(setSavedCardsLoading(false));
        })
            .catch((err) => {
                dispatch(setSavedCardsLoading(false));
                dispatch(showNotification('error', __('Something went wrong! Please, try again!')));
            })
        return getSavedCards();
    }
}

export default new CreditCardDispatcher();
