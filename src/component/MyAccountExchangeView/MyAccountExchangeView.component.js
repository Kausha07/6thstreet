import { MyAccountExchangeCreate as SourceComponent } from "Component/MyAccountExchangeCreate/MyAccountExchangeCreate.component";
import MyAccountReturnSuccessItem from "Component/MyAccountReturnSuccessItem";
import { formatDate } from "Util/Date";
import Link from "Component/Link";

import {
  STATUS_DENIED,
  STATUS_TITLE_MAP,
} from "./MyAccountExchangeView.config";

import "./MyAccountExchangeView.style";

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
      <div block="MyAccountReturnSuccess" elem="Heading">
        <h3>
          {exchangeSuccess
            ? __("Order #%s", orderIncrementId)
            : __("Order #%s", orderNumber)}
        </h3>
        {exchangeSuccess && this.renderRequestSuccessContent()}
      </div>
    );
  }
  renderRequestSuccessContent() {
    const { customer: { email } = {} } = this.props;

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
  renderDetails() {
    const {
      date,
      status,
      orderNumber,
      exchangeSuccess,
      returnNumber,
    } = this.props;
    const dateObject = new Date(date.replace(/-/g, "/"));
    const dateString = formatDate("YY/MM/DD at hh:mm", dateObject);
    const { [status]: title } = STATUS_TITLE_MAP;

    return (
      <div block="MyAccountExchangeView" elem="Details">
        <p block="MyAccountExchangeView" elem="DetailsDate">
          {__("Date Requested: ")}
          <span>{dateString}</span>
        </p>
        <div block="MyAccountExchangeView" elem="SubDetails">
          <p
            block="MyAccountExchangeView"
            elem="Status"
            mods={{ isDenied: status === STATUS_DENIED }}
          >
            {__("Status: ")}
            <span>{`${title || status.split("_").join(" ")}`}</span>
          </p>
          {exchangeSuccess && (
            <p block="MyAccountExchangeView" elem="Order">
              {__("ID: ")}
              <span>{returnNumber}</span>
            </p>
          )}
          {!exchangeSuccess && (
            <p block="MyAccountExchangeView" elem="Order">
              {__("Order ID: ")}
              <span>{orderNumber}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  renderItems() {
    const { items = [], exchangeSuccess } = this.props;
    let finalItems = exchangeSuccess ? this.getItemsFromGroup() : items;
    return (
      <div
        block="MyAccountExchangeView"
        elem="Items"
        mix={{ block: "MyAccountReturnSuccess", elem: "Items" }}
      >
        {finalItems.map((item) => (
          <div key={item.id}>
            <MyAccountReturnSuccessItem item={item} />
            {!exchangeSuccess && (
              <div block="MyAccountExchangeView" elem="Reason">
                <h3>{__("Reason")}</h3>
                {!!(item.reason || []).length && <p>{item.reason[0].value}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  renderBackButton() {
    const { orderId } = this.props;

    if (!orderId) {
      return null;
    }

    return (
      <Link
        block="MyAccountReturnSuccess"
        elem="BackButton"
        to={`/my-account/my-orders/${orderId}`}
      >
        {__("Back to Order Detail")}
      </Link>
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
        {this.renderHeading()}
        {this.renderDetails()}
        {this.renderItems()}
      </>
    );
  }

  render() {
    return (
      <div block="MyAccountReturnSuccess">
        {this.renderLoader()}
        {this.renderContent()}
        {this.renderBackButton()}
      </div>
    );
  }
}

export default MyAccountExchangeView;
