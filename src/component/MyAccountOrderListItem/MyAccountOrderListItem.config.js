export const STATUS_COMPLETE = 'complete';

export const STATUS_CANCELED = 'canceled';

export const STATUS_PROCESSING = 'processing';

export const STATUS_PAYMENT_ABORTED = 'payment_aborted';

export const STATUS_PAYMENT_SUCCESS = 'payment_success';

export const STATUS_HIDE_BAR = [
    STATUS_COMPLETE,
    STATUS_CANCELED,
    STATUS_PAYMENT_ABORTED
];

export const STATUS_FAILED = [
    STATUS_CANCELED,
    STATUS_PAYMENT_ABORTED
];

export const STATUS_SUCCESS = [
    STATUS_COMPLETE,
    STATUS_PAYMENT_SUCCESS
];

export const STATUS_BEING_PROCESSED = [
    STATUS_PROCESSING,
    STATUS_PAYMENT_SUCCESS
];
