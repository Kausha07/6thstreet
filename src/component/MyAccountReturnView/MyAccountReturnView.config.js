export const STATUS_PENDING = 'Pending';

export const STATUS_DENIED = 'Denied';

export const STATUS_TITLE_MAP = {
    [STATUS_PENDING]: __('Pending'),
    [STATUS_DENIED]: __('Denied')
};

export const STATUS_CREATED = "pickup_pending";
export const STATUS_TRANSIT = "pickedup";
export const STATUS_REFUND_INITIATED = "refund_initiated";

export const STATUS_LABEL_MAP_NORMAL_RETURN = {
    [STATUS_CREATED]: __("Pickup Initiated"),
    [STATUS_TRANSIT]: __("Items Picked Up"),
    [STATUS_REFUND_INITIATED]: __("Refund Initiated"),
  };

export const RETURN_PENDING_MESSAGE = __("Our courier partner executive will pickup the item");
export const RETURN_PICKED_UP = __("We have picked up the item and your refund will be processed in 5 to 7 business days");