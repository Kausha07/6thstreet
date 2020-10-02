import MyAccountAddressBook from 'Component/MyAccountAddressBook';
import MyAccountClubApparel from 'Component/MyAccountClubApparel';
import MyAccountDashboard from 'Component/MyAccountDashboard';
import MyAccountMyOrders from 'Component/MyAccountMyOrders';
import MyAccountMyWishlist from 'Component/MyAccountMyWishlist';
import MyAccountReturns from 'Component/MyAccountReturns';
import {
    MyAccount as SourceMyAccount
} from 'SourceRoute/MyAccount/MyAccount.component';
import {
    ADDRESS_BOOK,
    CLUB_APPAREL,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    RETURN_ITEM
} from 'Type/Account';

export class MyAccount extends SourceMyAccount {
    renderMap = {
        [CLUB_APPAREL]: MyAccountClubApparel,
        [DASHBOARD]: MyAccountDashboard,
        [MY_ORDERS]: MyAccountMyOrders,
        [RETURN_ITEM]: MyAccountReturns,
        [MY_WISHLIST]: MyAccountMyWishlist,
        [ADDRESS_BOOK]: MyAccountAddressBook
    };
}

export default MyAccount;
