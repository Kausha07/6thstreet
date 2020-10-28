import MyAccountQuery from 'Query/MyAccount.query';
import { updateCustomerDetails, updateCustomerSignInStatus } from 'SourceStore/MyAccount/MyAccount.action';
import {
    CUSTOMER,
    MyAccountDispatcher as SourceMyAccountDispatcher,
    ONE_MONTH_IN_SECONDS
} from 'SourceStore/MyAccount/MyAccount.dispatcher';
import {
    removeCartItems,
    setCartId
} from 'Store/Cart/Cart.action';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { ORDERS } from 'Store/Order/Order.reducer';
import { setStoreCredit } from 'Store/StoreCredit/StoreCredit.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getInitialState as getStoreCreditInitialState } from 'Store/StoreCredit/StoreCredit.reducer';
import WishlistDispatcher from 'Store/Wishlist/Wishlist.dispatcher';
import {
    getMobileApiAuthorizationToken,
    resetPassword,
    updateCustomerData
} from 'Util/API/endpoint/MyAccount/MyAccount.enpoint';
import {
    deleteAuthorizationToken,
    deleteMobileAuthorizationToken,
    setAuthorizationToken,
    setMobileAuthorizationToken
} from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { prepareQuery } from 'Util/Query';
import { executePost, fetchMutation } from 'Util/Request';

export { CUSTOMER, ONE_MONTH_IN_SECONDS } from 'SourceStore/MyAccount/MyAccount.dispatcher';

export class MyAccountDispatcher extends SourceMyAccountDispatcher {
    requestCustomerData(dispatch) {
        const query = MyAccountQuery.getCustomerQuery();

        const stateCustomer = BrowserDatabase.getItem(CUSTOMER) || {};
        if (stateCustomer.id) {
            dispatch(updateCustomerDetails(stateCustomer));
        }

        return executePost(prepareQuery([query])).then(
            ({ customer }) => {
                dispatch(updateCustomerDetails({ ...stateCustomer, ...customer }));
                BrowserDatabase.setItem({ ...stateCustomer, ...customer }, CUSTOMER, ONE_MONTH_IN_SECONDS);
            },
            (error) => dispatch(showNotification('error', error[0].message))
        );
    }

    logout(_, dispatch) {
        dispatch(updateCustomerSignInStatus(false));
        deleteAuthorizationToken();
        deleteMobileAuthorizationToken();
        dispatch(setCartId(null));
        dispatch(removeCartItems());

        CartDispatcher.getCart(dispatch);
        WishlistDispatcher.updateInitialWishlistData(dispatch);

        BrowserDatabase.deleteItem(ORDERS);
        BrowserDatabase.deleteItem(CUSTOMER);

        dispatch(updateCustomerDetails({}));
        dispatch(setStoreCredit(getStoreCreditInitialState()));
    }

    async signIn(options = {}, dispatch) {
        const mutation = MyAccountQuery.getSignInMutation(options);

        try {
            const result = await fetchMutation(mutation);
            const { generateCustomerToken: { token } } = result;

            setAuthorizationToken(token);
            dispatch(updateCustomerSignInStatus(true));

            await this.handleMobileAuthorization(dispatch, options);
            await WishlistDispatcher.updateInitialWishlistData(dispatch);
            await StoreCreditDispatcher.getStoreCredit(dispatch);

            return true;
        } catch ([e]) {
            throw e;
        }
    }

    async handleMobileAuthorization(dispatch, options) {
        const { email: username, password } = options;
        const { data: { token } = {} } = await getMobileApiAuthorizationToken({
            username,
            password,
            cart_id: null
        });

        dispatch(setCartId(null));

        setMobileAuthorizationToken(token);

        // Run async otherwise login gets slow
        CartDispatcher.getCart(dispatch);
    }

    forgotPassword(dispatch, options = {}) {
        const { email } = options;

        return resetPassword({ email });
    }

    updateCustomerData(dispatch, data) {
        const { fullname, gender, email } = data;

        const mappedData = {
            firstname: fullname.substr(0, fullname.indexOf(' ')),
            lastname: fullname.substr(fullname.indexOf(' ') + 1),
            email,
            gender: gender === 'male' ? 1 : 2,
            custom_attributes: []
        };

        const dataForUpdate = { ...data, ...mappedData };

        dispatch(updateCustomerDetails(dataForUpdate));

        // eslint-disable-next-line
        return updateCustomerData(mappedData);
    }
}

export default new MyAccountDispatcher();
