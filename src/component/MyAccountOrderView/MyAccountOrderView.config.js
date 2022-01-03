export const STATUS_PROCESSING = 'processing';

export const STATUS_DISPATCHED = 'courier_dispatched';

export const STATUS_IN_TRANSIT = 'courier_in_transit';

export const DELIVERY_FAILED = 'delivery_failed';

export const DELIVERY_SUCCESSFUL = 'delivery_successful';

export const CANCEL_ITEM_LABEL = __("Cancel an Item");

export const RETURN_ITEM_LABEL = __("Return an Item")

export const STATUS_LABEL_MAP = {
    [STATUS_PROCESSING]: __('Processing'),
    [STATUS_DISPATCHED]: __('Shipped'),
    [STATUS_IN_TRANSIT]: __('In Transit'),
    [DELIVERY_FAILED]: __('Delivery Failed'),
    [DELIVERY_SUCCESSFUL]: __('Delivered')
};
