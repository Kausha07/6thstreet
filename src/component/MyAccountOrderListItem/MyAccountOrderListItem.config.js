export const STATUS_COMPLETE = "complete";

export const STATUS_CANCELED = "canceled";

export const STATUS_CLOSED = "closed";

export const STATUS_PROCESSING = "processing";

export const STATUS_PAYMENT_ABORTED = "payment_aborted";

export const STATUS_PAYMENT_SUCCESS = "payment_success";
export const STATUS_PENDING = "pending";
export const STATUS_FRAUD = "fraud";
export const STATUS_HOLDED = "holded";

export const ORDER_STATUS = {
  [STATUS_COMPLETE]: "Delivered",
  [STATUS_CANCELED]: "Cancelled",
  [STATUS_CLOSED]: "Refunded",
  [STATUS_PROCESSING]: "Processing",
  [STATUS_PAYMENT_ABORTED]: "Payment Failed",
  [STATUS_PAYMENT_SUCCESS]: "Processing",
  [STATUS_PENDING]: "Ordered",
  [STATUS_FRAUD]: "Ordered",
  [STATUS_HOLDED]: "On Hold",
};

export const STATUS_HIDE_PROGRESSBAR = [
  STATUS_PAYMENT_ABORTED,
  STATUS_CANCELED,
  STATUS_COMPLETE,
  STATUS_CLOSED,
  STATUS_HOLDED,
];
export const STATUS_HIDE_BAR = [
  STATUS_COMPLETE,
  STATUS_CANCELED,
  STATUS_PAYMENT_ABORTED,
  STATUS_CLOSED,
];

export const STATUS_FAILED = [STATUS_CANCELED, STATUS_PAYMENT_ABORTED];

export const STATUS_SUCCESS = [STATUS_COMPLETE, STATUS_PAYMENT_SUCCESS];

export const STATUS_BEING_PROCESSED = [
  STATUS_PROCESSING,
  STATUS_PAYMENT_SUCCESS,
];

export const STATUS_ITEM_CANCELLABLE = [
  STATUS_PROCESSING,
  STATUS_PAYMENT_SUCCESS,
  STATUS_PENDING,
];
export const STATUS_ABLE_TO_RETURN = [
  STATUS_PROCESSING,
  STATUS_PAYMENT_SUCCESS,
  STATUS_COMPLETE,
];

export const ARABIC_STATUS_TRANSLATE = {
  complete: "مكتمل",
  canceled: "ملغى",
  processing: "معالجة",
  payment_aborted: "تم إلغاء الدفع",
  payment_success: "تم الدفع بنجاح",
};

export const translateArabicStatus = (status) => {
  if (typeof ARABIC_STATUS_TRANSLATE[status] === "undefined") {
    return status.split("_").join(" ");
  }

  return ARABIC_STATUS_TRANSLATE[status];
};

export const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "إبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
