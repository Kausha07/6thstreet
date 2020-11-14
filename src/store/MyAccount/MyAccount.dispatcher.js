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
import { setClubApparel } from 'Store/ClubApparel/ClubApparel.action';
import ClubApparelDispatcher from 'Store/ClubApparel/ClubApparel.dispatcher';
import { getInitialState as getClubApparelInitialState } from 'Store/ClubApparel/ClubApparel.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { ORDERS } from 'Store/Order/Order.reducer';
import { setStoreCredit } from 'Store/StoreCredit/StoreCredit.action';
import StoreCreditDispatcher from 'Store/StoreCredit/StoreCredit.dispatcher';
import { getInitialState as getStoreCreditInitialState } from 'Store/StoreCredit/StoreCredit.reducer';
import WishlistDispatcher from 'Store/Wishlist/Wishlist.dispatcher';
import {
    getMobileApiAuthorizationToken,
    getOrders,
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
import Event, { EVENT_GTM_GENERAL_INIT } from 'Util/Event';
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
                const { firstname, lastname } = customer;
                const data = {
                    ...customer,
                    firstname: firstname.indexOf(' ') > 0 ? firstname.substr(0, firstname.indexOf(' ')) : firstname,
                    lastname: firstname.indexOf(' ') > 0 ? firstname.substr(firstname.indexOf(' ') + 1) : lastname
                };

                dispatch(updateCustomerDetails({ ...stateCustomer, ...data }));
                BrowserDatabase.setItem({ ...stateCustomer, ...data }, CUSTOMER, ONE_MONTH_IN_SECONDS);
            },
            (error) => {
                dispatch(showNotification('error', error[0].message));

                window.location.reload();
            }
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
        dispatch(setClubApparel(getClubApparelInitialState()));

        Event.dispatch(EVENT_GTM_GENERAL_INIT);
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

            Event.dispatch(EVENT_GTM_GENERAL_INIT);

            return true;
        } catch ([e]) {
            deleteAuthorizationToken();
            deleteMobileAuthorizationToken();

            throw e;
        }
    }

    async handleMobileAuthorization(dispatch, options) {
        const { email: username, password } = options;
        const { data: { token, user: { custom_attributes, gender, id } } = {} } = await getMobileApiAuthorizationToken({
            username,
            password,
            cart_id: null
        });

        dispatch(setCartId(null));

        setMobileAuthorizationToken(token);
        this.setCustomAttributes(dispatch, custom_attributes);
        this.setGender(dispatch, gender);

        // Run async as Club Apparel is not visible anywhere after login
        ClubApparelDispatcher.getMember(dispatch, id);

        // Run async otherwise login gets slow
        CartDispatcher.getCart(dispatch);
    }

    setCustomAttributes(dispatch, custom_attributes) {
        const customer = BrowserDatabase.getItem(CUSTOMER) || {};
        const phoneAttribute = custom_attributes.filter(
            ({ attribute_code }) => attribute_code === 'contact_no'
        );
        const isVerifiedAttribute = custom_attributes.filter(
            ({ attribute_code }) => attribute_code === 'is_mobile_otp_verified'
        );
        const { value: phoneNumber } = phoneAttribute && phoneAttribute[0] ? phoneAttribute[0] : null;
        const { value: isVerified } = isVerifiedAttribute && isVerifiedAttribute[0] ? isVerifiedAttribute[0] : null;
        dispatch(updateCustomerDetails({ ...customer, phone: phoneNumber, isVerified }));
    }

    setGender(dispatch, gender) {
        const customer = BrowserDatabase.getItem(CUSTOMER) || {};

        dispatch(updateCustomerDetails({ ...customer, gender }));
    }

    forgotPassword(dispatch, options = {}) {
        const { email } = options;

        return resetPassword({ email });
    }

    async getOrders(limit) {
        return getOrders(limit);
    }

    updateCustomerData(dispatch, data) {
        const {
            fullname,
            gender,
            email,
            phone,
            dob
        } = data;

        const mappedData = {
            firstname: fullname,
            email,
            gender: gender.toString(),
            custom_attributes: {
                contact_no: phone,
                dob
            }
        };

        dispatch(updateCustomerDetails({ ...data, ...mappedData }));

        // eslint-disable-next-line
        return updateCustomerData(mappedData);
    }
}

export default new MyAccountDispatcher();
