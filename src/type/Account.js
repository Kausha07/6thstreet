import PropTypes from 'prop-types';

export {
    regionType,
    addressType,
    addressesType,
    customerType,
    baseOrderInfoType,
    orderType,
    ordersType,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEWSLETTER_SUBSCRIPTION
} from 'SourceType/Account';

export const tabType = PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    alternativePageName: PropTypes.string,
    linkClassName: PropTypes.string
});

export const tabMapType = PropTypes.objectOf(tabType);

export const STORE_CREDIT = 'storecredit';
export const CLUB_APPAREL = 'club-apparel';
export const RETURN_ITEM = 'return-item';

export const activeTabType = PropTypes.string;
