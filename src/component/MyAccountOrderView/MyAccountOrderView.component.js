import Accordion from "Component/Accordion";
import { MINI_CARDS } from "Component/CreditCard/CreditCard.config";
import Image from "Component/Image";
import Loader from "Component/Loader";
import {
  STATUS_BEING_PROCESSED,
  STATUS_EXCHANGE_PENDING,
  STATUS_CANCELED,
  STATUS_COMPLETE,
  STATUS_FAILED,
  STATUS_PAYMENT_ABORTED,
  STATUS_EXCHANGE_REJECTED,
  STATUS_SUCCESS,
  translateArabicStatus,
} from "Component/MyAccountOrderListItem/MyAccountOrderListItem.config";
import MyAccountOrderViewItem from "Component/MyAccountOrderViewItem";
import { getFinalPrice } from "Component/Price/Price.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { ExtendedOrderType } from "Type/API";
import { HistoryType } from "Type/Common";
import { getCurrency, isArabic } from "Util/App";
import { appendOrdinalSuffix } from "Util/Common";
import { formatDate, getDefaultEddDate, formatRefundDate } from "Util/Date";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import {
  APPLE_PAY,
  CASH_ON_DELIVERY,
  EXCHANGE_STORE_CREDIT,
  CHECKOUT_APPLE_PAY,
  CHECKOUT_QPAY,
  CHECK_MONEY,
  TABBY_ISTALLMENTS,
  KNET_PAY,
  TAMARA,
} from "../CheckoutPayments/CheckoutPayments.config";
import Event, { EVENT_GTM_EDD_VISIBILITY, MOE_trackEvent } from "Util/Event";
import Applepay from "./icons/apple.png";
import CancelledImage from "./icons/cancelled.png";
import CloseImage from "./icons/close.png";
import PackageImage from "./icons/package.png";
import QPAY from "./icons/qpay.png";
import TimerImage from "./icons/timer.png";
import isMobile from "Util/Mobile";
import TruckImage from "./icons/truck.png";
import WarningImage from "./icons/warning.png";
import { Store } from "../Icons";
import ContactHelpContainer from "Component/ContactHelp/ContactHelp.container";
import { EarnedCashReward } from "../MyWallet/HelperComponents/HelperComponents.js";
import {
  CANCEL_ITEM_LABEL,
  DELIVERY_FAILED,
  DELIVERY_SUCCESSFUL,
  RETURN_ITEM_LABEL,
  STATUS_IN_TRANSIT,
  EXCHANGE_ITEM_LABEL,
  CANCEL_ORDER_LABEL,
  NEW_STATUS_LABEL_MAP,
  NEW_EXCHANGE_STATUS_LABEL_MAP,
  STATUS_DISPATCHED,
  PICKUP_FAILED,
  PICKEDUP,
  READY_TO_PICK,
} from "./MyAccountOrderView.config";
import "./MyAccountOrderView.style";
import Link from "Component/Link";
import { isObject } from "Util/API/helper/Object";
import {
  SPECIAL_COLORS,
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
} from "../../util/Common";
import {
  EVENT_MOE_RETURN_AN_ITEM_CLICK,
  EVENT_MOE_CANCEL_AN_ITEM_CLICK,
} from "Util/Event";
import { CAREEM_PAY } from "Component/CareemPay/CareemPay.config";
import {
  STATUS_LABEL_MAP_DOORSTEP_EXCHANGE,
  NORMAL_EX_DELIVERY_MESSAGE,
  DOORSTEP_EX_DELIVERY_MESSAGE,
  NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE,
  INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE,
  NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE,
  NORMAL_EX_DELIVERY_MESSAGE_EDD_DISABLED,
  NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
  INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
  NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE_EDD_DISABLED,
} from "Component/MyAccountExchangeView/MyAccountExchangeView.config";
import ExchangeIcon from "Component/Icons/Exchange/icon.svg";
import { exchangeFormatGroupStatus } from "Util/Common";

import { getStarRating } from "Util/API/endpoint/MyAccount/MyAccount.enpoint";

import { ARABIC_MONTHS } from "../MyAccountOrderListItem/MyAccountOrderListItem.config";
import { ExpressDeliveryTruck } from "Component/Icons";

class MyAccountOrderView extends PureComponent {
  static propTypes = {
    order: ExtendedOrderType,
    isLoading: PropTypes.bool.isRequired,
    getCountryNameById: PropTypes.func.isRequired,
    openOrderCancelation: PropTypes.func.isRequired,
    history: HistoryType.isRequired,
    displayDiscountPercentage: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    order: null,
    productsRating: {},
    displayDiscountPercentage: true,
  };

  state = {
    isArabic: isArabic(),
    eddEventSent: false,
  };

  renderAddress = (title, address) => {
    const { getCountryNameById } = this.props;
    const { isArabic } = this.state;
    const {
      firstname,
      middlename,
      lastname,
      street,
      postcode,
      city,
      country_id,
      telephone,
    } = address;

    return (
      <div block="MyAccountOrderView" elem="Address">
        <h3>{title}</h3>
        <p>{`${firstname} ${middlename || ""} ${lastname}`.trim()}</p>
        <p block="Address" elem="Street">{`${street} ${postcode}`}</p>
        <p>{`${city} - ${getCountryNameById(country_id)}`}</p>
        <p className={isArabic ? "telephone" : ""}>{`${telephone}`}</p>
      </div>
    );
  };

  setEddEventSent = () => {
    this.setState({ eddEventSent: true });
  };

  renderItem = (
    item,
    eddItem,
    isItemUnderProcessing = false,
    increment_id = "",
    itemStatus
  ) => {
    const {
      order: { order_currency_code: currency, status },
      displayDiscountPercentage,
      eddResponse,
      edd_info,
      international_shipping_fee,
      productsRating,
      updateRating,
      isProductRatingEnabled,
      order,
    } = this.props;
    const { eddEventSent } = this.state;
    let finalEdd =
      item.status === "Processing" || item.status === "processing"
        ? eddItem?.edd
        : item?.edd;

    const exchangeMessage =
      item?.exchange_type?.toLowerCase() === "normal"
        ? __("Normal Exchange")
        : item?.exchange_type?.toLowerCase() === "hih"
        ? __("Doorstep Exchange")
        : null;
    return (
      <>
        {isItemUnderProcessing && exchangeMessage && (
          <p block="MyAccountOrderView" elem="exchangeMessage">
            {exchangeMessage}
          </p>
        )}
        <MyAccountOrderViewItem
          key={item.item_id}
          item={item}
          setEddEventSent={this.setEddEventSent}
          eddEventSent={eddEventSent}
          status={status}
          myOrderEdd={finalEdd}
          compRef={"myOrder"}
          eddResponse={eddResponse}
          edd_info={edd_info}
          currency={currency}
          displayDiscountPercentage={displayDiscountPercentage}
          international_shipping_fee={international_shipping_fee}
          incrementId={increment_id}
          productsRating={productsRating}
          itemStatus={itemStatus}
          updateRating={updateRating}
          isProductRatingEnabled={isProductRatingEnabled}
          orderDetailsCartTotal={order}
        />
      </>
    );
  };

  renderTitle() {
    const { isArabic } = this.state;
    const {
      order: { increment_id },
    } = this.props;
    return (
      <div block="MyAccountOrderView" elem="Heading" mods={{ isArabic }}>
        <h3 block="Heading" elem="HeadingText">
          {increment_id}
        </h3>
      </div>
    );
  }
  sendMoeEvents(event) {
    MOE_trackEvent(event, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      screen_name: "OrderDetails",
      app6thstreet_platform: "Web",
    });
  }
  renderStatus() {
    const {
      openOrderCancelation,
      order: {
        status,
        created_at,
        is_returnable,
        is_cancelable,
        is_exchangeable,
        is_exchange_order = 0,
        order_id,
        parent_increment_id = "",
      },
      is_exchange_enabled = false,
    } = this.props;

    const date = new Date(created_at?.replace(/-/g, "/"));
    const arabicDate = `${date.getDate()} ${
      ARABIC_MONTHS[date.getMonth()]
    } ${date.getFullYear()}`;

    const modifiedStatus =
      is_exchange_order === 1 && status === "complete"
        ? "exchange_complete"
        : status;
    const finalStatus = isArabic()
      ? translateArabicStatus(modifiedStatus)
      : modifiedStatus
      ? modifiedStatus.split("_").join(" ")
      : "";
    if (STATUS_FAILED.includes(status)) {
      const title =
        status === STATUS_PAYMENT_ABORTED
          ? __("Payment Failed")
          : status === STATUS_EXCHANGE_REJECTED
          ? __("Exchange Rejected")
          : __("Order Cancelled");
      const StatusImage =
        status === STATUS_PAYMENT_ABORTED ? WarningImage : CloseImage;
      return (
        <div block="MyAccountOrderView" elem="StatusFailed">
          <Image
            src={StatusImage}
            mix={{ block: "MyAccountOrderView", elem: "WarningImage" }}
            alt={title ? title : "Warning-image"}
          />
          <p>{title}</p>
        </div>
      );
    }
    return (
      <div block="MyAccountOrderView" elem="Status">
        <div>
          <p
            block="MyAccountOrderView"
            elem="StatusTitle"
            mods={{ isSuccess: STATUS_SUCCESS.includes(status) }}
          >
            {__("Status: ")}
            <span>{` ${finalStatus}`}</span>
          </p>
          <p block="MyAccountOrderView" elem="StatusDate">
            {__("Order placed")}: &nbsp;
            <span>
              {isArabic()
                ? arabicDate
                : formatDate(
                    "DD MMM YYYY",
                    new Date(created_at.replace(/-/g, "/"))
                  )}
            </span>
          </p>
          {parent_increment_id && (
            <p
              block="MyAccountOrderView"
              elem="StatusTitle"
              mods={{ isSuccess: STATUS_SUCCESS.includes(status) }}
            >
              {__("Order ID: ")}
              <span>{` ${parent_increment_id}`}</span>
            </p>
          )}
        </div>
        {
          <div block="MyAccountOrderView" elem="HeadingButtons">
            {is_returnable && (
              <button
                onClick={() => {
                  openOrderCancelation(RETURN_ITEM_LABEL);
                  this.sendMoeEvents(EVENT_MOE_RETURN_AN_ITEM_CLICK);
                }}
              >
                {RETURN_ITEM_LABEL}
              </button>
            )}
            {is_exchangeable && is_exchange_enabled && (
              <button onClick={() => openOrderCancelation(EXCHANGE_ITEM_LABEL)}>
                {EXCHANGE_ITEM_LABEL}
              </button>
            )}
            {is_cancelable && +is_exchange_order === 1 ? (
              <div block="MyAccountOrderView" elem="HeadingButton">
                <button
                  onClick={() => openOrderCancelation(CANCEL_ORDER_LABEL)}
                >
                  {CANCEL_ORDER_LABEL}
                </button>
              </div>
            ) : is_cancelable && +is_exchange_order === 0 ? (
              <button
                onClick={() => {
                  openOrderCancelation(CANCEL_ITEM_LABEL);
                  this.sendMoeEvents(EVENT_MOE_CANCEL_AN_ITEM_CLICK);
                }}
              >
                {CANCEL_ITEM_LABEL}
              </button>
            ) : null}
          </div>
        }
      </div>
    );
  }

  renderPackagesMessage() {
    const {
      order: { groups: shipped = [] },
    } = this.props;
    const { isArabic } = this.state;

    const isPackageMessageVisible = shipped.some((order) => {
      return (
        order.status === STATUS_IN_TRANSIT || order.status === STATUS_DISPATCHED
      );
    });
    if (!isPackageMessageVisible) {
      return null;
    }

    // if (STATUS_FAILED.includes(status) || shipped.length < 1) {
    //   return null;
    // }
    return (
      <div
        block="MyAccountOrderView"
        elem="PackagesMessage"
        mods={{ isArabic }}
      >
        <Image
          src={TruckImage}
          mix={{ block: "MyAccountOrderView", elem: "TruckImage" }}
          alt={"Truckimage"}
        />
        <p>
          {
            shipped.length <= 1
              ? __(
                  "Your order has been shipped in a single package, please find the package details below."
                )
              : __(
                  "Your order has been shipped in multiple packages, please find the package details below."
                )
            // eslint-disable-next-line
          }
        </p>
      </div>
    );
  }

  formatGroupStatus = (status) => {
    // use toLowerCase because sometimes the response from backend is not consistent
    switch (status?.toLowerCase()) {
      case "courier_dispatched": {
        return __("Shipped");
      }
      case "courier_in_transit": {
        return __("In Transit");
      }
      case "delivery_successful": {
        return __("Delivered");
      }
      case "delivery_failed": {
        return __("Delivery Failed");
      }
      case "cancelled": {
        return __("Order Cancelled");
      }
      case "readytopick": {
        return __("Ready for Pick up");
      }
      case "pickedup": {
        return __("Items Picked Up");
      }
      case "pickupfailed": {
        return __("Pick up Failed");
      }
      default: {
        return null;
      }
    }
  };

  renderAccordionTitle(
    title,
    image,
    status = null,
    deliveryDate = null,
    exchangeType = "",
    is_express_delivery = false
  ) {
    const {
      order: { is_exchange_order: exchangeCount, groups },
      isProductRatingEnabled,
    } = this.props;
    const packageStatus = this.formatGroupStatus(status);
    const exchangePackageStatus = exchangeFormatGroupStatus(status);
    const exchangeTypeText =
      exchangeType?.toUpperCase() === "HIH"
        ? __("Doorstep Exchange")
        : exchangeType?.toUpperCase() === "NORMAL"
        ? __("Normal Exchange")
        : null;

    const date = new Date(deliveryDate?.replace(/-/g, "/"));
    const arabicDate = `${date.getDate()} ${
      ARABIC_MONTHS[date.getMonth()]
    } ${date.getFullYear()}`;

    return (
      <div block="MyAccountOrderView" elem="AccordionTitle">
        <Image
          src={image}
          mix={{
            block: "MyAccountOrderView",
            elem: "AccordionTitleImage",
            mods: { isArabic: isArabic() },
          }}
          alt={title ? title : "AccordionTitleImage"}
        />
        <h3>
          {groups?.length === 1 &&
          (title?.toLowerCase()?.includes("package") || title?.includes("شحنة"))
            ? __("Package")
            : title}
          {exchangeTypeText ? (
            <>
              <span>{` - ${exchangeTypeText}`}</span>
              {exchangePackageStatus && (
                <span>{` ${exchangePackageStatus}`}</span>
              )}
            </>
          ) : (
            !!packageStatus &&
            exchangeCount === 0 && <span>{` - ${packageStatus}`}</span>
          )}
        </h3>
        {is_express_delivery && (
            <div className="ExpressDeliveryBlock">
              {" "}
              <div className="ExpressDeliveryTextBlock">
                <ExpressDeliveryTruck /> {__("Express")}
              </div>
            </div>
          )}
        {status === DELIVERY_SUCCESSFUL &&
        deliveryDate &&
        isProductRatingEnabled ? (
          <div className="subTitle">
            {__("Delivered")}: &nbsp;
            {isArabic()
              ? arabicDate
              : formatDate(
                  "DD MMMM YYYY",
                  new Date(deliveryDate.replace(/-/g, "/"))
                )}
          </div>
        ) : null}
      </div>
    );
  }

  shouldDisplayBar = (status) => {
    switch (status) {
      case STATUS_DISPATCHED:
      case STATUS_IN_TRANSIT: {
        return true;
      }
      case DELIVERY_SUCCESSFUL: {
        return this.props.isProductRatingEnabled ? false : true;
      }

      default: {
        return false;
      }
    }
  };

  getDeliveryMessage = (
    exchangeType,
    exchangeItemStatus,
    isInternational,
    isEDDEnabled
  ) => {
    let deliveryMessageAndIcon =
      (exchangeItemStatus === STATUS_DISPATCHED ||
        exchangeItemStatus === STATUS_IN_TRANSIT) &&
      exchangeType?.toLowerCase() === "normal" &&
      isInternational
        ? {
            message: isEDDEnabled
              ? NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE
              : NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : (exchangeItemStatus === STATUS_DISPATCHED ||
            exchangeItemStatus === STATUS_IN_TRANSIT) &&
          exchangeType?.toLowerCase() === "normal"
        ? {
            message: isEDDEnabled
              ? NORMAL_EX_DELIVERY_MESSAGE
              : NORMAL_EX_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : (exchangeItemStatus === STATUS_DISPATCHED ||
            exchangeItemStatus === STATUS_IN_TRANSIT) &&
          exchangeType?.toLowerCase() === "hih"
        ? {
            message: DOORSTEP_EX_DELIVERY_MESSAGE,
          }
        : { message: "" };

    return deliveryMessageAndIcon;
  };

  renderAccordionProgress(status, item) {
    const displayStatusBar = this.shouldDisplayBar(status);
    const {
      order: { is_exchange_order: exchangeCount },
      edd_info,
    } = this.props;
    if (!displayStatusBar) {
      return null;
    }
    let finalEdd =
      item.status === "Processing" || item.status === "processing"
        ? item.items[0]?.edd
        : item?.edd;
    let colorCode =
      item.status === "Processing" || item.status === "processing"
        ? item.items[0]?.edd_msg_color
        : item?.edd_msg_color;
    let crossBorder =
      item.cross_border && item.cross_border === 1 ? true : false;
    const STATUS_LABELS =
      exchangeCount === 1
        ? item?.exchange_type?.toUpperCase() === "HIH"
          ? Object.assign({}, STATUS_LABEL_MAP_DOORSTEP_EXCHANGE)
          : Object.assign({}, NEW_EXCHANGE_STATUS_LABEL_MAP)
        : Object.assign({}, NEW_STATUS_LABEL_MAP);
    return (
      <div
        block="MyAccountOrderView"
        elem="AccordionStatus"
        mix={{ block: "MyAccountOrderListItem", elem: "Status" }}
      >
        <div block="MyAccountOrderListItem" elem="ProgressBar">
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCurrent"
            mods={{
              isShipped: status !== STATUS_DISPATCHED,
              inTransit: status === STATUS_IN_TRANSIT,
              isDelivered: status === DELIVERY_SUCCESSFUL,
            }}
          />
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCheckbox"
            mods={{
              isShipped: status !== STATUS_DISPATCHED,
              inTransit: status === STATUS_IN_TRANSIT,
              isDelivered: status === DELIVERY_SUCCESSFUL,
            }}
          />
        </div>
        <div block="MyAccountOrderListItem" elem="StatusList">
          {Object.values(STATUS_LABELS).map((label, index) => (
            <div block={index === 2 ? "EddDiv" : ""} key={index}>
              <p block="MyAccountOrderListItem" elem="StatusTitle">
                {label}
              </p>
              {index === 2 &&
                edd_info &&
                edd_info.is_enable &&
                finalEdd &&
                this.renderEdd(finalEdd, colorCode)}
              {/* <p block="MyAccountOrderListItem" elem="StatusTitle">
                {label === STATUS_DISPATCHED && item?.courier_shipped_date ? formatDate(
                  "DD MMM",
                  new Date(item?.courier_shipped_date?.replace(/-/g, "/"))
                )
                  : label === STATUS_IN_TRANSIT && item?.courier_in_transit_date ? formatDate(
                    "DD MMM",
                    new Date(item?.courier_in_transit_date?.replace(/-/g, "/"))
                  ) : item.courier_deliver_date ? formatDate(
                    "DD MMM",
                    new Date(item?.courier_deliver_date?.replace(/-/g, "/"))
                  ): null}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    );
  }
  renderEdd = (finalEdd, colorCode) => {
    let actualEddMess = finalEdd;
    const { eddEventSent } = this.state;
    const { edd_info } = this.props;
    if (!actualEddMess) {
      return null;
    }
    if (actualEddMess && !eddEventSent) {
      Event.dispatch(EVENT_GTM_EDD_VISIBILITY, {
        edd_details: {
          edd_status: edd_info.has_order_detail,
          default_edd_status: null,
          edd_updated: null,
        },
        page: "my_order",
      });
      this.setEddEventSent();
    }
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;
    const splitByReadyInclude = actualEddMess.includes(splitReadyByKey);

    let finalColorCode = colorCode ? colorCode : SPECIAL_COLORS["shamrock"];
    const idealFormat =
      splitByReadyInclude || actualEddMess.includes(splitKey) ? true : false;
    let commonSplitKey = splitByReadyInclude ? splitReadyByKey : splitKey;

    return (
      <div block="AreaText">
        <span
          style={{
            color: !idealFormat ? finalColorCode : SPECIAL_COLORS["nobel"],
          }}
        >
          {splitByReadyInclude
            ? `${splitReadyByKey}`
            : idealFormat
            ? `${actualEddMess.split(splitKey)[0]} ${splitKey}`
            : null}{" "}
        </span>
        <span style={{ color: finalColorCode }}>
          {idealFormat
            ? `${actualEddMess.split(commonSplitKey)[1]}`
            : actualEddMess}
        </span>
      </div>
    );
  };
  renderProcessingItems() {
    const {
      order: { status, groups: unship = [] },
    } = this.props;
    if (STATUS_FAILED.includes(status) || !unship.length) {
      return null;
    }
    const processingItems = unship
      .reduce((acc, { items }) => [...acc, ...items], [])
      .filter(({ qty_canceled, qty_ordered }) => +qty_canceled < +qty_ordered);
    if (processingItems.length > 0) {
      return (
        <div block="MyAccountOrderView" elem="AccordionWrapper">
          <Accordion
            mix={{ block: "MyAccountOrderView", elem: "Accordion" }}
            title={this.renderAccordionTitle(
              __("Items under processing"),
              TimerImage
            )}
            is_expanded
            MyAccountSection={true}
          >
            {processingItems.map((item) => this.renderItem(item, ""))}
          </Accordion>
        </div>
      );
    }
  }

  renderCanceledAccordion() {
    const {
      order: { status, groups: shipped = [] },
    } = this.props;
    const allItems = [
      ...shipped.reduce((acc, { items }) => [...acc, ...items], []),
    ];
    if (STATUS_CANCELED === status) {
      return (
        <div block="MyAccountOrderView" elem="AccordionWrapper">
          <Accordion
            mix={{ block: "MyAccountOrderView", elem: "Accordion" }}
            title={this.renderAccordionTitle(
              __("Cancelled items"),
              CancelledImage
            )}
            MyAccountSection={true}
          >
            {allItems.map((item) => this.renderItem(item, ""))}
          </Accordion>
        </div>
      );
    }

    const canceledItems = allItems.filter(
      ({ qty_partial_canceled }) => +qty_partial_canceled > 0
    );

    if (!canceledItems.length) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="AccordionWrapper">
        <Accordion
          mix={{ block: "MyAccountOrderView", elem: "Accordion" }}
          title={this.renderAccordionTitle(
            __("Cancelled items"),
            CancelledImage
          )}
          MyAccountSection={true}
        >
          {canceledItems.map((item) => this.renderItem(item, ""))}
        </Accordion>
      </div>
    );
  }

  renderAccordion(item, index) {
    const {
      order: { groups: shipped = [], increment_id },
      edd_info,
    } = this.props;
    const { isArabic } = this.state;
    const itemNumber = shipped.length;
    const suffixNumber = appendOrdinalSuffix(itemNumber - index);
    const getIcon =
      item.status === "Cancelled" || item.status === "cancelled"
        ? CancelledImage
        : item.status === "Processing" || item.status === "processing"
        ? TimerImage
        : PackageImage;
    const isItemUnderProcessing =
      item?.label?.toLowerCase() === "items under processing" ||
      item?.label === "المنتجات قيد التجهيز";

    const isInternational =
      parseInt(item?.cross_border) === 1 &&
      edd_info?.international_vendors?.indexOf(item?.international_vendor) > -1;
    const isEDDEnabled = edd_info ? true : false;
    const { message } = this.getDeliveryMessage(
      item?.exchange_type,
      item?.status,
      isInternational,
      isEDDEnabled
    );
    const date_range =
      edd_info?.intl_vendor_edd_range?.[
        item?.international_vendor?.toLowerCase()
      ];
    const deliveryDays =
      item?.exchange_type?.toLowerCase() === "normal" && !isInternational
        ? "3-4"
        : item?.exchange_type?.toLowerCase() === "normal" && isInternational
        ? date_range
        : "";
    const isDisplayBarVisible = this.shouldDisplayBar(item?.status);
    return (
      <div
        key={item.shipment_number}
        block="MyAccountOrderView"
        elem="AccordionWrapper"
        mods={{ isArabic }}
      >
        <Accordion
          mix={{ block: "MyAccountOrderView", elem: "Accordion" }}
          is_expanded={index === 0}
          title={this.renderAccordionTitle(
            item.label,
            getIcon,
            item.status,
            item.courier_deliver_date,
            item?.exchange_type,
            item?.is_express_delivery
          )}
          MyAccountSection={true}
        >
          {this.renderMessage(item?.status, item)}
          {item?.exchange_type !== "" &&
          item?.exchange_type !== null &&
          item?.status !== "" &&
          item?.status !== null &&
          isDisplayBarVisible ? (
            item?.status === DELIVERY_SUCCESSFUL ? null : (
              <div block="MyAccountOrderView" elem="deliveryMessage">
                <Image
                  src={ExchangeIcon}
                  mix={{
                    block: "MyAccountExchangeView",
                    elem: "AccordionTitleImage",
                    mods: { isArabic },
                  }}
                  alt={"AccordionTitleImage"}
                />
                <p>
                  {message?.includes(undefined)
                    ? message.replace(undefined, deliveryDays)
                    : message}
                </p>
              </div>
            )
          ) : null}
          {this.renderAccordionProgress(item?.status, item)}
          {item.status !== DELIVERY_SUCCESSFUL &&
            item.status !== DELIVERY_FAILED &&
            item.status !== PICKUP_FAILED &&
            item.status !== PICKEDUP &&
            item.status !== READY_TO_PICK &&
            this.renderShipmentTracking(
              item.courier_name,
              item.courier_logo,
              item.courier_tracking_link
            )}
          {!!item?.ctc_store_name && (
            <div block="MyAccountOrderView" elem="ClickAndCollect">
              <Store />
              <div block="MyAccountOrderView-ClickAndCollect" elem="StoreName">
                {item?.ctc_store_name}
              </div>
            </div>
          )}
          {isItemUnderProcessing && (
            <p>
              {__(
                "Package contains %s %s",
                item.items.length,
                item.items.length === 1 ? __("item") : __("items")
              )}
            </p>
          )}
          <div></div>
          {item.items.map((data) =>
            this.renderItem(
              data,
              item,
              isItemUnderProcessing,
              increment_id,
              item.status
            )
          )}
        </Accordion>
      </div>
    );
  }

  renderAccordions() {
    const {
      order: { status, groups: shipped = [] },
    } = this.props;
    if (STATUS_FAILED.includes(status)) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="Accordions">
        {shipped.map((item, index) => this.renderAccordion(item, index))}
        {/* {this.renderProcessingItems()}
        {this.renderCanceledAccordion()} */}
      </div>
    );
  }

  renderFailedOrderDetails() {
    const {
      order: { status, groups: unship = [] },
    } = this.props;
    const itemsArray = unship.reduce(
      (acc, { items }) => [...acc, ...items],
      []
    );

    if (!STATUS_FAILED.includes(status)) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="Accordions">
        {unship.map((item, index) => this.renderAccordion(item, index))}
      </div>
    );
  }

  renderSummary() {
    const {
      order: {
        status,
        subtotal,
        grand_total,
        order_currency_code,
        msp_cod_amount,
      },
    } = this.props;

    if (status !== STATUS_PAYMENT_ABORTED) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="Summary">
        <p block="MyAccountOrderView" elem="SummaryItem">
          <span>{__("Subtotal")}</span>
          <span>{formatPrice(+subtotal, order_currency_code)}</span>
        </p>
        {!!msp_cod_amount && (
          <p block="MyAccountOrderView" elem="SummaryItem">
            <span>
              {getCountryFromUrl() === "QA"
                ? __("Cash on Receiving Fee")
                : __("Cash on Delivery Fee")}
            </span>
            <span>{formatPrice(+msp_cod_amount, order_currency_code)}</span>
          </p>
        )}
        <p
          block="MyAccountOrderView"
          elem="SummaryItem"
          mods={{ grandTotal: true }}
        >
          <span>{__("Total")}</span>
          <span>{formatPrice(+grand_total, order_currency_code)}</span>
        </p>
      </div>
    );
  }

  renderMiniCard(miniCard) {
    const img = MINI_CARDS[miniCard];
    if (img) {
      return <img src={img} alt="card icon" />;
    }
    return null;
  }

  renderCardPaymentType() {
    const {
      order: {
        payment: {
          cc_type,
          method,
          // cc_last_4,
          additional_information: {
            source: { last4, scheme, scheme_local },
          },
        },
      },
    } = this.props;
    if (!!!scheme) {
      return null;
    }
    return (
      <div block="MyAccountOrderView" elem="CardPaymentType">
        <div block="MyAccountOrderView" elem="TypeLogo">
          {method === CHECKOUT_APPLE_PAY ? (
            <img src={Applepay} alt="Apple pay" />
          ) : method === CHECKOUT_QPAY ? (
            <img src={QPAY} alt="Apple pay" />
          ) : (
            this.renderMiniCard(
              scheme_local === "mada"
                ? scheme_local?.toLowerCase()
                : scheme?.toLowerCase()
            )
          )}
        </div>
        <div block="MyAccountOrderView" elem="Number">
          <div block="MyAccountOrderView" elem="Number-Dots">
            <div />
            <div />
            <div />
            <div />
          </div>
          <div block="MyAccountOrderView" elem="Number-Value">
            {/* {cc_last_4} */}
            {last4 ? last4 : ""}
          </div>
        </div>
      </div>
    );
  }

  renderPaymentTypeText(paymentTitle) {
    return (
      <div block="MyAccountOrderView" elem="TypeTitle">
        {__(paymentTitle)}
      </div>
    );
  }

  renderOrderPaymentType() {
    const {
      order: {
        status,
        payment,
        payment: { method, title },
        //club_apparel_amount = 0,
        store_credit_amount = 0,
      },
    } = this.props;

    if (!!!payment) {
      return null;
    }

    switch (method) {
      case "checkout":
        if (!payment?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("Credit Card"));
        }
        return this.renderCardPaymentType();
      case TABBY_ISTALLMENTS:
        return this.renderPaymentTypeText(__("Tabby: Pay in installments"));
      case CHECK_MONEY:
      case CASH_ON_DELIVERY:
        return this.renderPaymentTypeText(
          getCountryFromUrl() === "QA"
            ? __("Cash on Receiving")
            : __("Cash on Delivery")
        );
      case APPLE_PAY:
      case CHECKOUT_APPLE_PAY:
        if (!this.props?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("Apple Pay"));
        }
        return this.renderCardPaymentType();
      case CHECKOUT_QPAY:
        if (!payment?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("QPAY"));
        }
        return this.renderCardPaymentType();
      case EXCHANGE_STORE_CREDIT:
        return this.renderPaymentTypeText(__("Exchange My Cash"));
      case "free":
        return this.renderPaymentTypeText(title);
      case KNET_PAY:
        return this.renderPaymentTypeText("KNET");
      case CAREEM_PAY:
        return this.renderPaymentTypeText("Careem Pay");
      case TAMARA:
        return this.renderPaymentTypeText("Tamara");
      default:
        return null;
    }
  }

  renderPaymentType() {
    return (
      <div block="MyAccountOrderView" elem="PaymentType">
        <h3>{__("Payment")}</h3>
        {this.renderOrderPaymentType()}
      </div>
    );
  }

  getCouponSavings() {
    const {
      order: { total_mrp = 0, total_discount = 0 },
    } = this.props;
    let discountPercentage = Math.round(100 * (total_discount / total_mrp));

    return discountPercentage;
  }

  renderPriceLine(price, name, mods = {}, allowZero = false) {
    const { isArabic } = this.state;
    if (!price && !allowZero) {
      return null;
    }
    const { isTotal, isStoreCredit, isClubApparel, isFeeTextVisible = false } = mods;
    const formatPrice =
      isStoreCredit || isClubApparel ? parseFloat(-price) : parseFloat(price);

    const {
      order: { order_currency_code: currency_code = getCurrency() },
    } = this.props;
    const finalPrice = getFinalPrice(formatPrice, currency_code);
    const freeTextArray = [__("Shipping"), __("International Shipping Fee"), __("Express Service")];
    
    if(!isFeeTextVisible && parseFloat(price) == 0 ) {
      return null;
    }

    return (
      <li block="MyAccountOrderView" elem="SummaryItem" mods={mods}>
        <strong block="MyAccountOrderView" elem="Text" mods={{ isArabic }}>
          {name}
          {isTotal && (
            <>
              {" "}
              <span>{__("(Taxes included)")}</span>
            </>
          )}
          {name === "Coupon Savings" || name === "توفير الكوبون" ? (
            <>
              &nbsp;
              <span className="discountPercent">
                {isArabic
                  ? `(${this.getCouponSavings()}%-)`
                  : `(-${this.getCouponSavings()}%)`}
              </span>
            </>
          ) : null}
        </strong>
        <strong block="MyAccountOrderView" elem="Price">
          {freeTextArray.includes(name) && parseInt(finalPrice) === 0
            ? __("FREE")
            : isArabic
            ? `${currency_code} ${Math.abs(finalPrice)} ${
                mods?.couponSavings ? "-" : ""
              }`
            : `${mods?.couponSavings ? "-" : ""} ${currency_code} ${Math.abs(
                finalPrice
              )}`}
        </strong>
      </li>
    );
  }

  renderContact() {
    return (
      <>
        {isMobile.any() ? (
          <h3 style={{ textAlign: "center", padding: "12px 0px" }}>
            Questions about this order?
          </h3>
        ) : (
          ""
        )}
        <ContactHelpContainer accountPage={true} />
      </>
    );
  }

  checkIsAnyExpressOrder = (groups = []) => {
      for (let group of groups) {
          for (let item of group?.items) {
              if (item.is_express_delivery) {
                  return true;
              }
          }
      }
      return false;
  }

  renderPaymentSummary() {
    const {
      order: {
        subtotal = 0,
        grand_total = 0,
        shipping_amount = 0,
        discount_amount = 0,
        msp_cod_amount = 0,
        tax_amount = 0,
        customer_balance_amount = 0,
        store_credit_amount = 0,
        // club_apparel_amount = 0,
        currency_code = getCurrency(),
        international_shipping_amount = 0,
        reward_currency_amount = 0,
        fulfilled_from = "",
        total_mrp = 0,
        total_discount = 0,
        express_delivery_charges = 0,
        groups = [],
        is_vip = "0",
        is_vip_chargeable = "0"
      },
      isSidewideCouponEnabled,
    } = this.props;
    const grandTotal = getFinalPrice(grand_total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);
    let isFreeExpressDelivery = false;
    if (parseInt(express_delivery_charges) == 0 && is_vip_chargeable == 0 && is_vip == 1) {
      isFreeExpressDelivery = this.checkIsAnyExpressOrder(groups);
    }

    return (
      <div block="MyAccountOrderView" elem="OrderTotals">
        <ul>
          <div block="MyAccountOrderView" elem="Subtotals">
            {isSidewideCouponEnabled
              ? this.renderPriceLine(total_mrp, __("Total Price"))
              : this.renderPriceLine(subTotal, __("Subtotal"))}
            {isSidewideCouponEnabled
              ? this.renderPriceLine(total_discount, __("Coupon Savings"), {
                  couponSavings: true,
                })
              : null}
            {isSidewideCouponEnabled && total_discount
              ? this.renderPriceLine(subTotal, __("Subtotal"))
              : null}
            {(fulfilled_from === "Local" || fulfilled_from === null) &&
              this.renderPriceLine(shipping_amount, __("Shipping fee"), {
                divider: true,
              })}
            {fulfilled_from === "International" &&
              this.renderPriceLine(
                international_shipping_amount,
                __("International Shipping Fee"),
                {
                  divider: true,
                }
              )}
              {this.renderPriceLine(
                express_delivery_charges,
                __("Express Service"),
                {
                  divider: true,
                  isFeeTextVisible: isFreeExpressDelivery
                }
              )}
            {store_credit_amount !== 0
              ? this.renderPriceLine(store_credit_amount, __("My Cash"), {
                  isStoreCredit: true,
                  couponSavings: true,
                })
              : null}
            {reward_currency_amount !== 0
              ? this.renderPriceLine(reward_currency_amount, __("My Rewards"), {
                  isStoreCredit: true,
                  couponSavings: true,
                })
              : null}
            {this.props?.order?.club_apparel_amount &&
            parseFloat(this.props?.order?.club_apparel_amount) !== 0
              ? this.renderPriceLine(
                  this.props?.order?.club_apparel_amount,
                  __("Club Apparel Redemption"),
                  { isClubApparel: true }
                )
              : null}
            {parseFloat(discount_amount) !== 0 && !isSidewideCouponEnabled
              ? this.renderPriceLine(discount_amount, __("Discount"))
              : null}
            {parseFloat(tax_amount) !== 0
              ? this.renderPriceLine(tax_amount, __("Tax"))
              : null}
            {parseFloat(msp_cod_amount) !== 0
              ? this.renderPriceLine(
                  msp_cod_amount,
                  getCountryFromUrl() === "QA"
                    ? __("Cash on Receiving Fee")
                    : __("Cash on Delivery Fee")
                )
              : null}
            {this.renderPriceLine(
              grandTotal,
              __("Total"),
              { isTotal: true },
              true
            )}
          </div>
        </ul>
      </div>
    );
  }

  goBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  renderBackButton() {
    const { isArabic } = this.state;
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    return (
      <Link to="/my-account/my-orders">
        <button
          block="MyAccountOrderView"
          elem="BackButton"
          mods={{ isArabic }}
        />
      </Link>
    );
  }

  

  renderMessage(groupStatus, group) {
    const {
      order: { status, order_currency_code, refund_amount, refund_date },
    } = this.props;
    const { isArabic } = this.state;
    let message = "";
    let date = "";
    const countryCode = getCountryFromUrl();
    if (
      status == "canceled" &&
      refund_date &&
      refund_amount &&
      order_currency_code
    ) {
      message = __(
        "Refund of %s %s has been initiated to your original payment method. For card payments, it should reflect within 5-7 days.",
        order_currency_code,
        parseFloat(refund_amount)
      );
      date = formatRefundDate(refund_date, countryCode);
    } else if(groupStatus == "delivery_failed" && order_currency_code && group.rto_refund_amount && group.rto_date) {
      message = __(
        "Refund of %s %s has been initiated to your original payment method. For card payments, it should reflect within 5-7 days.", 
        order_currency_code, 
        parseFloat(group.rto_refund_amount)
      );
      date = formatRefundDate(group.rto_date, countryCode);
    }
    if(message && date) {
      return (
        <div
          block="MyAccountOrderView"
          elem="PackagesMessage"
          mods={{ isArabic }}
        >
          <div className="order-group-message">
            <p>
              {message}
            </p>
            <p block="color-grey" mods={{ isArabic }}>
              {date}
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  renderShipmentTracking(name, logo, link) {
    if (name && link) {
      return (
        <div block="ShipmentTracking">
          <div block="ShipmentTracking" elem="Courier">
            <div>Shipped via:</div>
            {logo ? (
              <div block="ShipmentTracking-Courier" elem="LogoContainer">
                <img src={logo} alt="name" />
              </div>
            ) : null}
          </div>
          <div block="ShipmentTracking" elem="Link">
            <a href={link} rel="noopener" target="_blank">
              Track Package
            </a>
          </div>
        </div>
      );
    }
    return null;
  }

  renderREDDMsg = () => {
    const {
      order: { express_redd_refund = [] },
    } = this.props;
    const { isArabic } = this.state;
    if (Array.isArray(express_redd_refund) && express_redd_refund?.length > 0) {
      return express_redd_refund?.map((item, i) => {
        const { refund_message = "", refund_date = "" } = item;
        if (refund_message && refund_date) {
          return (
            <div
              block="MyAccountOrderView"
              elem="PackagesMessageForREDD"
              mods={{ isArabic }}
              key={i}
            >
              <div block="order-group-message">
                <p block="refundMessage">{__(refund_message)}</p>
                <p block="color-grey" mods={{ isArabic }}>
                  {refund_date}
                </p>
              </div>
            </div>
          );
        } else return null;
      });
    } else return null;
  };

  render() {
    const { isLoading, order } = this.props;
    if (isLoading || !order) {
      return (
        <div block="MyAccountOrderView">
          <Loader isLoading={isLoading} />
        </div>
      );
    }
    const { shipping_address } = order;
    return (
      <div block="MyAccountOrderView">
        <Loader isLoading={isLoading} />
        <div block="MyAccountOrderView" elem="Header">
          {this.renderBackButton()}
          {this.renderTitle()}
        </div>
        {this.renderStatus()}
        {/* {this.renderPackagesMessage()} */}
        {this.renderREDDMsg()}
        {this.renderAccordions()}
        {this.renderFailedOrderDetails()}
        {this.renderSummary()}
        {this.renderAddress(__("Delivering to"), shipping_address)}
        {this.renderPaymentType()}
        {this.renderPaymentSummary()}
        {this.renderContact()}
        <EarnedCashReward rewardEarned={order?.total_wallet_earned} />
      </div>
    );
  }
}

export default MyAccountOrderView;
