import { MyAccountExchangeCreate as SourceComponent } from "Component/MyAccountExchangeCreate/MyAccountExchangeCreate.component";
import MyAccountReturnSuccessItem from "Component/MyAccountReturnSuccessItem";
import { formatDate } from "Util/Date";
import Link from "Component/Link";

import {
  STATUS_DENIED,
  STATUS_TITLE_MAP,
} from "./MyAccountExchangeView.config";
import { isArabic } from "Util/App";
import Image from "Component/Image";

import "./MyAccountExchangeView.style";
import PackageImage from "Component/MyAccountOrderView/icons/package.png";
import Accordion from "Component/Accordion";
import ExchangeIcon from "Component/Icons/Exchange/icon.svg";
import CancelledImage from "Component/MyAccountOrderView/icons/cancelled.png";
import TimerImage from "Component/MyAccountOrderView/icons/timer.png";

import {
  DELIVERY_SUCCESSFUL,
  STATUS_IN_TRANSIT,
  STATUS_DISPATCHED,
  STATUS_LABEL_MAP_DOORSTEP_EXCHANGE,
  STATUS_LABEL_MAP_NORMAL_EXCHANGE,
  NORMAL_EX_DELIVERY_MESSAGE,
  DOORSTEP_EX_DELIVERY_MESSAGE,
  NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE,
  INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE,
  NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE,
  NORMAL_EX_DELIVERY_MESSAGE_EDD_DISABLED,
  NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
  INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
  NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE_EDD_DISABLED,
} from "./MyAccountExchangeView.config";

import { exchangeFormatGroupStatus } from "Util/Common";

export class MyAccountExchangeView extends SourceComponent {
  getItemsFromGroup = () => {
    const { orderItemGroups } = this.props;
    const allItems = [
      ...orderItemGroups.reduce((acc, { items }) => [...acc, ...items], []),
    ];
    return allItems;
  };

  renderHeading() {
    const {
      orderNumber,
      exchangeSuccess = false,
      orderIncrementId,
    } = this.props;

    return (
      <div block="MyAccountExchangeView" elem="Heading">
        <h3>{__("EXCHANGE")}</h3>
        <h3
          block="MyAccountExchangeView"
          elem="HeadingText"
          mods={{ isArabic: isArabic() }}
        >{` #${orderIncrementId}`}</h3>
      </div>
    );
  }
  renderRequestSuccessContent() {
    const { customer: { email } = {} ,orderNumber} = this.props;

    return (
      <>
        <p>{__("We have received your request.")}</p>
        {!!email && (
          <p>
            {__("An email has been sent to ")}
            <span>{email}</span>
            {__(" with next steps.")}
          </p>
        )}
      </>
    );
  }

  renderSuccessDetails() {
    const { returnNumber, parentOrderIncrementId = "", date } = this.props;
    const dateObject = new Date(date.replace(/-/g, "/"));
    const dateString = formatDate('DD/MM/YY', dateObject);

    return (
        <div block="MyAccountReturnSuccess" elem="Details">
            <h3>{ __('Request information') }</h3>
            <p>
                { __('ID: ') }
                <span>{ returnNumber }</span>
            </p>
            {parentOrderIncrementId && (
              <p>
                {__("Order ID: ")}
                <span>{parentOrderIncrementId}</span>
              </p>
            )}            <p>
                { __('Date requested ') }
                <span>{dateString}</span>
            </p>
        </div>
    );
}
  renderDetails() {
    const {
      date,
      status,
      orderNumber,
      exchangeSuccess,
      returnNumber,
    } = this.props;
    const dateObject = new Date(date.replace(/-/g, "/"));
    const dateString = formatDate("DD MMM YYYY", dateObject);
    const { [status]: title } = STATUS_TITLE_MAP;

    return (
      <div block="MyAccountExchangeView" elem="Details">
        <div block="MyAccountExchangeView" elem="SubDetails">
          <p
            block="MyAccountExchangeView"
            elem="Status"
            mods={{ isDenied: status === STATUS_DENIED }}
          >
            {__("Status: ")}
            <span>{__(`${title || status.split("_").join(" ")}`)}</span>
          </p>
          <p block="MyAccountExchangeView" elem="DetailsDate">
            {__("Date Requested: ")}
            <span>{dateString}</span>
          </p>
          <p block="MyAccountExchangeView" elem="Order">
            {__("Order ID: ")}
            <span>{orderNumber}</span>
          </p>
        </div>
      </div>
    );
  }

  renderItem = (item, isItemUnderProcessing = false, index) => {
    const { exchangeSuccess } = this.props;
    const exchangeMessage =
      item?.exchange_type?.toLowerCase() === "normal"
        ? __("Normal Exchange")
        : item?.exchange_type?.toLowerCase() === "hih"
        ? __("Doorstep Exchange")
        : null;

    return (
      <div
        block="MyAccountExchangeView"
        elem="Items"
        mix={{ block: "MyAccountReturnSuccess", elem: "Items" }}
      >
        <div key={index}>
          {isItemUnderProcessing && exchangeMessage && (
            <p block="MyAccountExchangeView" elem="exchangeMessage">
              {exchangeMessage}
            </p>
          )}
          <MyAccountReturnSuccessItem item={item} key={index} />
          {!exchangeSuccess && (
            <div block="MyAccountExchangeView" elem="Reason">
              <h3>{__("Reason")}</h3>
              {!!(item?.reason || []).length && (
                <p>{item?.reason?.[0]?.value}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  shouldDisplayBar = (status) => {
    if (
      STATUS_DISPATCHED.includes(status?.toLowerCase()) ||
      STATUS_IN_TRANSIT.includes(status?.toLowerCase()) ||
      DELIVERY_SUCCESSFUL.includes(status?.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  renderAccordionProgress = (status, item) => {
    const displayStatusBar = this.shouldDisplayBar(status);
    const { exchange_type = null } = item;
    const STATUS_LABELS =
      exchange_type?.toUpperCase() === "HIH"
        ? Object.assign({}, STATUS_LABEL_MAP_DOORSTEP_EXCHANGE)
        : Object.assign({}, STATUS_LABEL_MAP_NORMAL_EXCHANGE);

    if (!displayStatusBar) {
      return null;
    }

    return (
      <div
        block="MyAccountExchangeView"
        elem="AccordionStatus"
        mix={{ block: "MyAccountExchangeView", elem: "StatusBar" }}
      >
        <div block="MyAccountOrderListItem" elem="ProgressBar">
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCurrent"
            mods={{
              isShipped: !STATUS_DISPATCHED.includes(status?.toLowerCase()),
              inTransit: STATUS_IN_TRANSIT.includes(status?.toLowerCase()),
              isDelivered: DELIVERY_SUCCESSFUL.includes(status?.toLowerCase()),
              isArabic: isArabic(),
            }}
          />
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCheckbox"
            mods={{
              isShipped: !STATUS_DISPATCHED.includes(status?.toLowerCase()),
              inTransit: STATUS_IN_TRANSIT.includes(status?.toLowerCase()),
              isDelivered: DELIVERY_SUCCESSFUL.includes(status?.toLowerCase()),
              isArabic: isArabic(),
            }}
          />
        </div>
        <div block="MyAccountOrderListItem" elem="StatusList">
          {Object.values(STATUS_LABELS).map((label, index) => (
            <div key={index}>
              <p block="MyAccountOrderListItem" elem="StatusTitle">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  getDeliveryMessage = (
    exchangeType,
    exchangeItemStatus,
    isInternational,
    isEDDEnabled
  ) => {
    let deliveryMessageAndIcon =
      (STATUS_DISPATCHED.includes(exchangeItemStatus?.toLowerCase()) ||
        STATUS_IN_TRANSIT.includes(exchangeItemStatus?.toLowerCase())) &&
      exchangeType?.toLowerCase() === "normal" &&
      isInternational
        ? {
            message: isEDDEnabled
              ? NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE
              : NORMAL_EXCHANGE_INTERNATIONAL_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : (STATUS_DISPATCHED.includes(exchangeItemStatus?.toLowerCase()) ||
            STATUS_IN_TRANSIT.includes(exchangeItemStatus?.toLowerCase())) &&
          exchangeType?.toLowerCase() === "normal"
        ? {
            message: isEDDEnabled
              ? NORMAL_EX_DELIVERY_MESSAGE
              : NORMAL_EX_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : (STATUS_DISPATCHED.includes(exchangeItemStatus?.toLowerCase()) ||
            STATUS_IN_TRANSIT.includes(exchangeItemStatus?.toLowerCase())) &&
          exchangeType?.toLowerCase() === "hih"
        ? {
            message: DOORSTEP_EX_DELIVERY_MESSAGE,
          }
        : DELIVERY_SUCCESSFUL.includes(exchangeItemStatus?.toLowerCase()) &&
          exchangeType?.toLowerCase() === "normal" &&
          !isInternational
        ? {
            message: isEDDEnabled
              ? NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE
              : NORMAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : DELIVERY_SUCCESSFUL.includes(exchangeItemStatus?.toLowerCase()) &&
          exchangeType?.toLowerCase() === "normal" &&
          isInternational
        ? {
            message: isEDDEnabled
              ? INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE
              : INTERNATIONAL_EX_SUCCESSFUL_DELIVERY_MESSAGE_EDD_DISABLED,
          }
        : { message: "" };

    return deliveryMessageAndIcon;
  };

  renderAccordion = (item, index) => {
    const { orderItemGroups: shipped = [], edd_info } = this.props;
    const {
      cross_border = "0",
      exchange_type = null,
      package_status = null,
      international_vendor = "",
      label,
      exchange_item_status = null,
    } = item;

    const isInternational =
      parseInt(item?.cross_border) === 1 &&
      edd_info?.international_vendors?.indexOf(international_vendor) > -1;
    const getIcon =
      package_status === "Cancelled" || package_status === "cancelled"
        ? CancelledImage
        : package_status?.toLowerCase() === "processing" ||
          label?.toLowerCase()?.includes("processing")
        ? TimerImage
        : PackageImage;
    const isEDDEnabled = edd_info ? true : false;
    const { message } = this.getDeliveryMessage(
      exchange_type,
      package_status,
      isInternational,
      isEDDEnabled
    );
    const date_range =
      edd_info?.intl_vendor_edd_range?.[international_vendor?.toLowerCase()];
    const deliveryDays =
      exchange_type?.toLowerCase() === "normal" && !isInternational
        ? "3-4"
        : exchange_type?.toLowerCase() === "normal" && isInternational
        ? date_range
        : "";
    const isDisplayBarVisible = this.shouldDisplayBar(package_status);
    const isItemUnderProcessing =
      label?.toLowerCase() === "items under processing" ||
      label === "المنتجات قيد التجهيز";
    return (
      <div
        key={item.track_number}
        block="MyAccountOrderView"
        elem="AccordionWrapper"
        mods={{ isArabic: isArabic() }}
      >
        <Accordion
          mix={{ block: "MyAccountExchangeView", elem: "Accordion" }}
          is_expanded={index === 0}
          title={this.renderAccordionTitle(
            label,
            getIcon,
            package_status,
            exchange_type
          )}
          MyAccountSection={true}
        >
          {exchange_type !== "" &&
          exchange_type !== null &&
          package_status !== "" &&
          package_status !== null &&
          isDisplayBarVisible ? (
            (exchange_type === "HIH" && package_status === "exchanged") ||
            exchange_item_status === "delivered" ? null : (
              <div block="MyAccountExchangeView" elem="deliveryMessage">
                <Image
                  src={ExchangeIcon}
                  mix={{
                    block: "MyAccountExchangeView",
                    elem: "AccordionTitleImage",
                    mods: { isArabic: isArabic() },
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
          {this.renderAccordionProgress(item?.package_status, item)}
          <div></div>
          {item?.items?.map((data) =>
            this.renderItem(data, isItemUnderProcessing)
          )}
        </Accordion>
      </div>
    );
  };

  renderAccordionTitle(title, image, package_status = null, exchangeType = "") {
    const { orderItemGroups = [] } = this.props;
    const exchangeTypeText =
      exchangeType?.toUpperCase() === "HIH"
        ? __("Doorstep Exchange")
        : __("Normal Exchange");

    const statusToShow = exchangeFormatGroupStatus(package_status);
    return (
      <div block="MyAccountExchangeView" elem="AccordionTitle">
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
          {orderItemGroups?.length === 1 &&
          (title?.toLowerCase()?.includes("package") || title?.includes("شحنة"))
            ? __("Package")
            : __(`${title}`)}
        </h3>
        {exchangeType !== null && exchangeType !== "" && (
          <>
            <h3 block="MyAccountExchangeView" elem="exchangeTypeHeading">
              <span>-</span>
              {exchangeTypeText}
            </h3>

            {statusToShow != null && (
              <h3 block="MyAccountExchangeView" elem="exchangeTypeStatus">
                {exchangeTypeText === "" && <span>-</span>}
                {statusToShow}
              </h3>
            )}
          </>
        )}
      </div>
    );
  }

  renderAccordions = () => {
    const { orderItemGroups: shipped = [] } = this.props;

    return (
      <div block="MyAccountOrderView" elem="Accordions">
        {shipped.map((item, index) => this.renderAccordion(item, index))}
      </div>
    );
  };

  renderItems() {
    return <>{this.renderAccordions()}</>;
  }

  renderBackButton() {
    const { orderId } = this.props;

    if (!orderId) {
      return null;
    }

    return (
      <Link
        block="MyAccountExchangeView"
        elem="BackButton"
        to={`/my-account/return-item`}
        mods={{ isArabic: isArabic() }}
      ></Link>
    );
  }

  renderBackToOrderPage() {
    const { orderId } = this.props;

    if (!orderId) {
      return null;
    }

    return (
      <div block="MyAccountExchangeView" elem="BackToOrderPageButtonDiv">
        <Link
          block="MyAccountExchangeView"
          elem="BackToOrderPageButton"
          to={`/my-account/my-orders/${orderId}`}
        >
          {__("Back to Order Detail")}
        </Link>
      </div>
    );
  }

  renderContent() {
    const { isLoading, returnNumber,orderNumber,exchangeSuccess } =
      this.props;

    if (isLoading) {
      return null;
    }

    if (!isLoading) {
      if(exchangeSuccess && !returnNumber){
        return this.renderExchangeNotPossible();
      }else if(!exchangeSuccess && !orderNumber){
      return this.renderExchangeNotPossible();
      }
    }

    return (
      <>
        <div block="MyAccountExchangeView" elem="Header">
          {this.renderBackButton()} {this.renderHeading()}
        </div>
        {exchangeSuccess && this.renderItems()}
        {exchangeSuccess ? this.renderSuccessDetails() : this.renderDetails()}
        {!exchangeSuccess && this.renderItems()}
      </>
    );
  }

  render() {
    return (
      <div block="MyAccountReturnSuccess">
        {this.renderLoader()}
        {this.renderContent()}
        {this.renderBackToOrderPage()}
      </div>
    );
  }
}

export default MyAccountExchangeView;
