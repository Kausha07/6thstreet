export const STATUS_COMPLETE = 'complete';

export const STATUS_CANCELED = 'canceled';

export const STATUS_PROCESSING = 'processing';

export const STATUS_PAYMENY_ABORTED = 'payment_aborted';

export const STATUS_PAYMENY_SUCCESS = 'payment_success';

export const STATUS_HIDE_BAR = [
    STATUS_COMPLETE,
    STATUS_CANCELED,
    STATUS_PAYMENY_ABORTED
];

export const STATUS_FAILED = [
    STATUS_CANCELED,
    STATUS_PAYMENY_ABORTED
];

export const STATUS_SUCCESS = [
    STATUS_COMPLETE,
    STATUS_PAYMENY_SUCCESS
];

export const STATUS_BEING_PROCESSED = [
    STATUS_PROCESSING,
    STATUS_PAYMENY_SUCCESS
];
