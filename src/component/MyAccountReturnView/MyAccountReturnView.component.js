import {
    MyAccountReturnSuccess as SourceComponent
} from 'Component/MyAccountReturnSuccess/MyAccountReturnSuccess.component';
import MyAccountReturnSuccessItem from 'Component/MyAccountReturnSuccessItem';
import { formatDate } from 'Util/Date';

import {
  STATUS_DENIED,
  STATUS_TITLE_MAP,
  RETURN_PENDING_MESSAGE,
  RETURN_PICKED_UP,
  RETURN_REFUND_INITIATED,
  STATUS_LABEL_MAP_NORMAL_RETURN,
  STATUS_CREATED,
  STATUS_TRANSIT,
  STATUS_REFUND_INITIATED,
} from "./MyAccountReturnView.config";

import {
  DELIVERY_SUCCESSFUL,
  STATUS_IN_TRANSIT,
  STATUS_DISPATCHED,
} from "Component/MyAccountExchangeView/MyAccountExchangeView.config";

import { isArabic } from "Util/App";
import Image from "Component/Image";
import PackageImage from "Component/MyAccountOrderView/icons/package.png";
import Accordion from "Component/Accordion";
import Link from "Component/Link";
import RefundIcon from "Component/Icons/Refund/icon.svg";
import { exchangeFormatGroupStatus } from "Util/Common";

import "./MyAccountReturnView.style";

export class MyAccountReturnView extends SourceComponent {
  renderHeading() {
    const { returnNumber } = this.props;

    return (
      <div block="MyAccountReturnView" elem="Heading">
        <h3>{__("RETURN")}</h3>
        <h3
          block="MyAccountReturnView"
          elem="HeadingText"
          mods={{ isArabic: isArabic() }}
        >{` #${returnNumber}`}</h3>
      </div>
    );
  }

    renderDetails() {
        const { date, status, orderNumber } = this.props;
        const dateObject = new Date(date.replace(/-/g, "/"));
        const dateString = formatDate('DD MMM YYYY', dateObject);
        const { [status]: title } = STATUS_TITLE_MAP;

        return (
            <div block="MyAccountReturnView" elem="Details">
                <div block="MyAccountReturnView" elem="SubDetails">
                    <p block="MyAccountReturnView" elem="Status" mods={ { isDenied: status === STATUS_DENIED } }>
                        { __('Status: ') }
                        <span>{ title || status }</span>
                    </p>
                    <p block="MyAccountReturnView" elem="DetailsDate">
                    { __('Date Requested: ') }
                    <span>{dateString}</span>
                    </p>
                    <p block="MyAccountReturnView" elem="Order">
                        { __('Order ID: ') }
                        <span>{ orderNumber }</span>
                    </p>
                </div>
            </div>
        );
    }

  renderItem = (item, eddItem, index) => {
    const { exchangeSuccess } = this.props;

    return (
      <div
        block="MyAccountReturnView"
        elem="Items"
        mix={{ block: "MyAccountReturnSuccess", elem: "Items" }}
      >
        <div key={index}>
          <MyAccountReturnSuccessItem item={item} key={index} />
          {!exchangeSuccess && (
            <div block="MyAccountReturnView" elem="Reason">
              <h3>{__("Reason")}</h3>
              {!!(item.reason || []).length && <p>{item.reason[0].value}</p>}
            </div>
          )}
        </div>
      </div>
    );
  };

  renderBackButton() {
    return (
      <Link
        block="MyAccountReturnView"
        elem="BackButton"
        to={`/my-account/return-item`}
        mods={{ isArabic: isArabic() }}
      ></Link>
    );
  }

  shouldDisplayBar = (status) => {
    if (
      STATUS_CREATED?.includes(status?.toLowerCase()) ||
      status?.toLowerCase() === STATUS_TRANSIT ||
      status?.toLowerCase() === STATUS_REFUND_INITIATED
    ) {
      return true;
    } else {
      return false;
    }
  };

  renderAccordionProgress = (status, item) => {
    const displayStatusBar = this.shouldDisplayBar(status);

    if (!displayStatusBar) {
      return null;
    }
    const STATUS_LABELS = Object.assign({}, STATUS_LABEL_MAP_NORMAL_RETURN);
    return (
      <div
        block="MyAccountReturnView"
        elem="AccordionStatus"
        mix={{ block: "MyAccountReturnView", elem: "StatusBar" }}
      >
        <div block="MyAccountOrderListItem" elem="ProgressBar">
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCurrent"
            mods={{
              isShipped: !STATUS_CREATED?.includes(status?.toLowerCase()),
              inTransit: status?.toLowerCase() === STATUS_TRANSIT,
              isDelivered: status?.toLowerCase() === STATUS_REFUND_INITIATED,
              isArabic: isArabic(),
            }}
          />
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCheckbox"
            mods={{
              isShipped: !STATUS_CREATED?.includes(status?.toLowerCase()),
              inTransit: status?.toLowerCase() === STATUS_TRANSIT,
              isDelivered: status?.toLowerCase() === STATUS_REFUND_INITIATED,
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

  renderAccordion = (item, index) => {
    const { exchange_type = null, package_status = null, label } = item;
    const getIcon = PackageImage;
    const message = STATUS_CREATED?.includes(package_status?.toLowerCase())
      ? RETURN_PENDING_MESSAGE
      : package_status?.toLowerCase() === STATUS_TRANSIT
      ? RETURN_PICKED_UP
      : package_status?.toLowerCase() === STATUS_REFUND_INITIATED
      ? RETURN_REFUND_INITIATED
      : "";
    const isDisplayBarVisible = this.shouldDisplayBar(package_status);
    return (
      <div
        key={item.track_number}
        block="MyAccountOrderView"
        elem="AccordionWrapper"
        mods={{ isArabic: isArabic() }}
      >
        <Accordion
          mix={{ block: "MyAccountReturnView", elem: "Accordion" }}
          is_expanded={index === 0}
          title={this.renderAccordionTitle(
            label,
            getIcon,
            package_status,
            exchange_type
          )}
          MyAccountSection={true}
        >
          {isDisplayBarVisible && (
            <div block="MyAccountReturnView" elem="deliveryMessage">
              <Image
                src={RefundIcon}
                mix={{
                  block: "MyAccountReturnView",
                  elem: "AccordionTitleImage",
                  mods: { isArabic: isArabic() },
                }}
                alt={"AccordionTitleImage"}
              />
              <p>{message}</p>
            </div>
          )}
          {this.renderAccordionProgress(package_status, item)}
          {item.items.map((data) => this.renderItem(data, item))}
        </Accordion>
      </div>
    );
  };

  renderAccordionTitle(title, image, package_status = "", exchangeType = "") {
    const { groups } = this.props;
    const exchangeTypeText = STATUS_CREATED?.includes(
      package_status?.toLowerCase()
    )
      ? __("Pickup Initiated")
      : package_status?.toLowerCase() === STATUS_TRANSIT
      ? __("Items Picked up")
      : package_status?.toLowerCase() === STATUS_REFUND_INITIATED
      ? __("Refund Initiated")
      : "";
    const statusToShow = exchangeFormatGroupStatus(package_status);
    return (
      <div block="MyAccountReturnView" elem="AccordionTitle">
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
        </h3>

        {exchangeTypeText !== "" && (
          <h3 block="MyAccountReturnView" elem="exchangeTypeHeading">
            <span>-</span>
            {exchangeTypeText}
          </h3>
        )}
        {statusToShow != null && (
          <h3 block="MyAccountReturnView" elem="exchangeTypeHeading">
            {exchangeTypeText === "" && <span>-</span>}
            {statusToShow}
          </h3>
        )}
      </div>
    );
  }

  renderAccordions = () => {
    const { groups: shipped = [] } = this.props;
    return (
      <div block="MyAccountOrderView" elem="Accordions">
        {shipped.map((item, index) => this.renderAccordion(item, index))}
      </div>
    );
  };

  renderBackToOrderPage() {
    const { orderId } = this.props;

    if (!orderId) {
      return null;
    }

    return (
      <div block="MyAccountReturnView" elem="BackToOrderPageButtonDiv">
        <Link
          block="MyAccountReturnView"
          elem="BackToOrderPageButton"
          to={`/my-account/my-orders/${orderId}`}
        >
          {__("Back to Order Detail")}
        </Link>
      </div>
    );
  }

  renderItems() {
    return <>{this.renderAccordions()}</>;
  }

    renderContent() {
        const { isLoading, returnNumber } = this.props;

        if (isLoading) {
            return null;
        }

        if (!isLoading && !returnNumber) {
            return this.renderReturnNotPossible();
        }

    return (
      <>
        <div block="MyAccountReturnView" elem="Header">
          {this.renderBackButton()} {this.renderHeading()}
        </div>
        {this.renderDetails()}
        {this.renderItems()}
        {this.renderBackToOrderPage()}
      </>
    );
  }
}

export default MyAccountReturnView;
