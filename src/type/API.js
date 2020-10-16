import PropTypes from 'prop-types';

export const ReturnReasonType = PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string
});

// They have the same type declaration. Creating it to be able to differetiate them
export const ReturnResolutionType = ReturnReasonType;

export const AbstractReturnItemType = PropTypes.shape({
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })
});

export const ReturnItemType = PropTypes.shape({
    ...AbstractReturnItemType,
    item_id: PropTypes.string,
    row_total: PropTypes.string,
    discount_percent: PropTypes.string,
    discount_amount: PropTypes.string,
    product_options: PropTypes.shape({
        info_buyRequest: PropTypes.shape({
            qty: PropTypes.string
        })
    })
});

export const ReturnSuccessItemType = PropTypes.shape({
    ...AbstractReturnItemType,
    id: PropTypes.string,
    price: PropTypes.string,
    original_price: PropTypes.string,
    qty_requested: PropTypes.number
});
