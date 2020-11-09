export const STATUS_ORDERED = 0;

export const STATUS_SENT = 1;

export const STATUS_DELIVERED = 2;

export const STATUS_LABEL_MAP = {
    [STATUS_ORDERED]: __('Shipped'),
    [STATUS_SENT]: __('Out of Delivery'),
    [STATUS_DELIVERED]: __('Delivered')
};
