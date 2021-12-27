import PropTypes from "prop-types";
import { PureComponent } from "react";

import Accordion from "Component/Accordion";
import Image from "Component/Image";
import Loader from "Component/Loader";
import {
  STATUS_BEING_PROCESSED,
  STATUS_CANCELED,
  STATUS_COMPLETE,
  STATUS_FAILED,
  STATUS_PAYMENT_ABORTED,
  STATUS_SUCCESS,
} from "Component/MyAccountOrderListItem/MyAccountOrderListItem.config";
import MyAccountOrderViewItem from "Component/MyAccountOrderViewItem";
import { getFinalPrice } from "Component/Price/Price.config";
import { ExtendedOrderType } from "Type/API";
import { HistoryType } from "Type/Common";
import { getCurrency, isArabic } from "Util/App";
import { appendOrdinalSuffix } from "Util/Common";
import { formatDate } from "Util/Date";
import Applepay from "./icons/apple.png";
import QPAY from "./icons/qpay.png";
import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import CancelledImage from "./icons/cancelled.png";
import CloseImage from "./icons/close.png";
import PackageImage from "./icons/package.png";
import TimerImage from "./icons/timer.png";
import TruckImage from "./icons/truck.png";
import WarningImage from "./icons/warning.png";
import {
  STATUS_DELIVERED,
  STATUS_LABEL_MAP,
  STATUS_SENT,
} from "./MyAccountOrderView.config";

import "./MyAccountOrderView.style";
import {
  CARD,
  TABBY_ISTALLMENTS,
  TABBY_PAY_LATER,
  CHECK_MONEY,
  APPLE_PAY,
  CHECKOUT_APPLE_PAY,
  CASH_ON_DELIVERY,
  FREE,
  CHECKOUT_QPAY,
} from "../CheckoutPayments/CheckoutPayments.config";
import { MINI_CARDS } from "Component/CreditCard/CreditCard.config";

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
    displayDiscountPercentage: true,
  };

  state = {
    isArabic: isArabic(),
  };

  renderAddress = (title, address) => {
    const { getCountryNameById } = this.props;
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
        <p>{`${telephone}`}</p>
      </div>
    );
  };

  renderItem = (item) => {
    const {
      order: { base_currency_code: currency },
      displayDiscountPercentage,
    } = this.props;
    return (
      <MyAccountOrderViewItem
        item={item}
        currency={currency}
        displayDiscountPercentage={displayDiscountPercentage}
      />
    );
  };

  renderTitle() {
    const { isArabic } = this.state;
    const {
      openOrderCancelation,
      order: { status, increment_id, is_returnable },
    } = this.props;
    const buttonText =
      status === STATUS_COMPLETE ? __("Return an Item") : __("Cancel an Item");
    return (
      <div block="MyAccountOrderView" elem="Heading" mods={{ isArabic }}>
        <h3>{__("Order #%s", increment_id)}</h3>
        {(STATUS_BEING_PROCESSED.includes(status) ||
          (status === STATUS_COMPLETE && is_returnable)) && (
          <button onClick={openOrderCancelation}>{buttonText}</button>
        )}
      </div>
    );
  }

  renderStatus() {
    const {
      order: { status, created_at },
    } = this.props;

    if (STATUS_FAILED.includes(status)) {
      const title =
        status === STATUS_PAYMENT_ABORTED
          ? __("Payment Failed")
          : __("Order Cancelled");
      const StatusImage =
        status === STATUS_PAYMENT_ABORTED ? WarningImage : CloseImage;

      return (
        <div block="MyAccountOrderView" elem="StatusFailed">
          <Image
            src={StatusImage}
            mix={{ block: "MyAccountOrderView", elem: "WarningImage" }}
          />
          <p>{title}</p>
        </div>
      );
    }

    return (
      <div block="MyAccountOrderView" elem="Status">
        <p
          block="MyAccountOrderView"
          elem="StatusTitle"
          mods={{ isSuccess: STATUS_SUCCESS.includes(status) }}
        >
          {__("Status: ")}
          <span>{`${status.split("_").join(" ")}`}</span>
        </p>
        <p block="MyAccountOrderView" elem="StatusDate">
          {__("Order placed: ")}
          <span>
            {formatDate("DD MMM YYYY", new Date(created_at.replace(/-/g, "/")))}
          </span>
        </p>
      </div>
    );
  }

  renderPackagesMessage() {
    const {
      order: { status, shipped = [] },
    } = this.props;
    const { isArabic } = this.state;

    if (STATUS_FAILED.includes(status) || shipped.length < 1) {
      return null;
    }
    return (
      <div
        block="MyAccountOrderView"
        elem="PackagesMessage"
        mods={{ isArabic }}
      >
        <Image
          src={TruckImage}
          mix={{ block: "MyAccountOrderView", elem: "TruckImage" }}
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

  renderAccordionTitle(title, image, status = null) {
    const { [status]: statusTitle = null } = STATUS_LABEL_MAP;

    return (
      <div block="MyAccountOrderView" elem="AccordionTitle">
        <Image
          src={image}
          mix={{
            block: "MyAccountOrderView",
            elem: "AccordionTitleImage",
            mods: {isArabic: isArabic()} 
          }}
        />
        <h3>
          {title}
          {!!statusTitle && <span>{` - ${statusTitle}`}</span>}
        </h3>
      </div>
    );
  }

  renderAccordionProgress(status) {
    if (STATUS_DELIVERED === status) {
      return null;
    }

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
            mods={{ isProcessing: status === STATUS_SENT }}
          />
          <div
            block="MyAccountOrderListItem"
            elem="ProgressCheckbox"
            mods={{ isProcessing: status === STATUS_SENT }}
          />
        </div>
        <div block="MyAccountOrderListItem" elem="StatusList">
          {Object.values(STATUS_LABEL_MAP).map((label) => (
            <p block="MyAccountOrderListItem" elem="StatusTitle">
              {label}
            </p>
          ))}
        </div>
      </div>
    );
  }

  renderProcessingItems() {
    const {
      order: { status, unship = [] },
    } = this.props;

    if (STATUS_FAILED.includes(status) || !unship.length) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="AccordionWrapper">
        <Accordion
          mix={{ block: "MyAccountOrderView", elem: "Accordion" }}
          title={this.renderAccordionTitle(
            __("Items under processing"),
            TimerImage
          )}
          is_expanded
        >
          {unship
            .reduce((acc, { items }) => [...acc, ...items], [])
            .filter(
              ({ qty_canceled, qty_ordered }) => +qty_canceled < +qty_ordered
            )
            .map(this.renderItem)}
        </Accordion>
      </div>
    );
  }

  renderCanceledAccordion() {
    const {
      order: { status, shipped = [], unship = [] },
    } = this.props;
    const allItems = [
      ...shipped.reduce((acc, { items }) => [...acc, ...items], []),
      ...unship.reduce((acc, { items }) => [...acc, ...items], []),
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
          >
            {allItems.map(this.renderItem)}
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
        >
          {allItems
            .filter(({ qty_partial_canceled }) => +qty_partial_canceled > 0)
            .map(this.renderItem)}
        </Accordion>
      </div>
    );
  }

  renderAccordion(item, index) {
    const {
      order: { shipped = [] },
    } = this.props;
    const { isArabic } = this.state;
    const itemNumber = shipped.length;
    const suffixNumber = appendOrdinalSuffix(itemNumber - index);
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
          shortDescription={this.renderAccordionProgress(
            item.courier_status_code
          )}
          title={this.renderAccordionTitle(
            __("%s Package", suffixNumber),
            PackageImage,
            item.courier_status_code
          )}
        >
          <p>
            {__(
              "Package contains %s %s",
              item.items.length,
              item.items.length === 1 ? __("item") : __("items")
            )}
          </p>
          {item.items.map(this.renderItem)}
        </Accordion>
      </div>
    );
  }

  renderAccordions() {
    const {
      order: { status, shipped = [] },
    } = this.props;

    if (STATUS_FAILED.includes(status)) {
      return null;
    }

    return (
      <div block="MyAccountOrderView" elem="Accordions">
        {shipped.map((item, index) => this.renderAccordion(item, index))}
        {this.renderProcessingItems()}
        {this.renderCanceledAccordion()}
      </div>
    );
  }

  renderFailedOrderDetails() {
    const {
      order: { status, unship = [] },
    } = this.props;
    const itemsArray = unship.reduce(
      (acc, { items }) => [...acc, ...items],
      []
    );

    if (!STATUS_FAILED.includes(status)) {
      return null;
    }

    return (
      <div
        block="MyAccountOrderView"
        elem="OrderDetails"
        mods={{ failed: true }}
      >
        <h3>{__("Order detail")}</h3>
        {itemsArray.map(this.renderItem)}
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
            <span>{__("Cash on Delivery Fee")}</span>
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
            source: { last4 },
          },
        },
      },
    } = this.props;

    return (
      <div block="MyAccountOrderView" elem="CardPaymentType">
        <div block="MyAccountOrderView" elem="TypeLogo">
          {method === CHECKOUT_APPLE_PAY ? (
            <img src={Applepay} alt="Apple pay" />
          ) : method === CHECKOUT_QPAY ? (
            <img src={QPAY} alt="Apple pay" />
          ) : (
            this.renderMiniCard(cc_type?.toLowerCase())
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
        payment: { method },
      },
    } = this.props;

    switch (method) {
      case CARD:
        if (!this.props?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("Credit Card"));
        }
        return this.renderCardPaymentType();
      case TABBY_ISTALLMENTS:
        return this.renderPaymentTypeText(__("Tabby: Pay in installments"));
      case TABBY_PAY_LATER:
        return this.renderPaymentTypeText(__("Tabby: Pay later"));
      case CHECK_MONEY:
      case CASH_ON_DELIVERY:
        return this.renderPaymentTypeText(__("Cash on Delivery"));
      case APPLE_PAY:
      case CHECKOUT_APPLE_PAY:
        if (!this.props?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("Apple Pay"));
        }
        return this.renderCardPaymentType();
      case CHECKOUT_QPAY:
        if (!this.props?.additional_information?.source?.last4) {
          return this.renderPaymentTypeText(__("QPAY"));
        }
        return this.renderCardPaymentType();
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

  renderPriceLine(price, name, mods = {}, allowZero = false) {
    if (!price && !allowZero) {
      return null;
    }
    const { isTotal, isStoreCredit, isClubApparel } = mods;
    const formatPrice =
      isStoreCredit || isClubApparel ? parseFloat(-price) : parseFloat(price);

    const {
      order: { order_currency_code: currency_code = getCurrency() },
    } = this.props;
    const finalPrice = getFinalPrice(formatPrice, currency_code);

    return (
      <li block="MyAccountOrderView" elem="SummaryItem" mods={mods}>
        <strong block="MyAccountOrderView" elem="Text">
          {name}
          {isTotal && (
            <>
              {" "}
              <span>{__("(Taxes included)")}</span>
            </>
          )}
        </strong>
        <strong block="MyAccountOrderView" elem="Price">
          {currency_code} {finalPrice}
        </strong>
      </li>
    );
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
        club_apparel_amount = 0,
        currency_code = getCurrency(),
      },
    } = this.props;
    const grandTotal = getFinalPrice(grand_total, currency_code);
    const subTotal = getFinalPrice(subtotal, currency_code);

    return (
      <div block="MyAccountOrderView" elem="OrderTotals">
        <ul>
          <div block="MyAccountOrderView" elem="Subtotals">
            {this.renderPriceLine(subTotal, __("Subtotal"))}
            {this.renderPriceLine(shipping_amount, __("Shipping"), {
              divider: true,
            })}
            {customer_balance_amount !== 0
              ? this.renderPriceLine(
                  customer_balance_amount,
                  __("Store Credit"),
                  { isStoreCredit: true }
                )
              : null}
            {parseFloat(club_apparel_amount) !== 0
              ? this.renderPriceLine(
                  club_apparel_amount,
                  __("Club Apparel Redemption"),
                  { isClubApparel: true }
                )
              : null}
            {parseFloat(discount_amount) !== 0
              ? this.renderPriceLine(discount_amount, __("Discount"))
              : null}
            {parseFloat(tax_amount) !== 0
              ? this.renderPriceLine(tax_amount, __("Tax"))
              : null}
            {parseFloat(msp_cod_amount) !== 0
              ? this.renderPriceLine(msp_cod_amount, __("Cash on Delivery"))
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
      <button
        block="MyAccountOrderView"
        elem="BackButton"
        mods={{ isArabic }}
        onClick={this.goBack}
      />
    );
  }

  render() {
    const { isLoading, order } = this.props;
    if (isLoading || !order) {
      return (
        <div block="MyAccountOrderView">
          <Loader isLoading={isLoading} />
        </div>
      );
    }
    const { billing_address } = order;

    return (
      <div block="MyAccountOrderView">
        <Loader isLoading={isLoading} />
        <div block="MyAccountOrderView" elem="Header">
          {this.renderBackButton()}
          {this.renderTitle()}
        </div>
        {this.renderStatus()}
        {this.renderPackagesMessage()}
        {this.renderAccordions()}
        {this.renderFailedOrderDetails()}
        {this.renderSummary()}
        {this.renderAddress(__("Delivering to"), billing_address)}
        {this.renderPaymentType()}
        {this.renderPaymentSummary()}
      </div>
    );
  }
}

export default MyAccountOrderView;
