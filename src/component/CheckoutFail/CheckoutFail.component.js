import { CheckoutSuccess } from "Component/CheckoutSuccess/CheckoutSuccess.component";
import Image from "Component/Image";
import WarningImage from "Component/MyAccountOrderView/icons/warning.png";

export class CheckoutFail extends CheckoutSuccess {
  componentWillUnmount() {
    const { setCheckoutDetails } = this.props;
    setCheckoutDetails(false);
  }

  renderStatus() {
    return (
      <div block="MyAccountOrderView" elem="StatusFailed">
        <Image
          lazyLoad={true}
          src={WarningImage}
          mix={{ block: "MyAccountOrderView", elem: "WarningImage" }}
        />
        <p>{__("Payment Failed")}</p>
      </div>
    );
  }

  renderDetails() {
    const { paymentMethod } = this.props;
    localStorage.removeItem("cartProducts");
    return (
      <div block="CheckoutSuccess">
        <div block="CheckoutSuccess" elem="Details">
          {this.renderStatus()}
          {this.renderTotalsItems()}
          {this.renderAddresses()}
          {this.renderDeliveryOption()}
          {this.renderPaymentType()}
          {paymentMethod?.code === "checkout_qpay" ||
          paymentMethod?.code === "tabby_installments"
            ? this.renderPaymentSummary()
            : this.renderTotals()}
        </div>
        {this.renderButton()}
        {this.renderMyAccountPopup()}
      </div>
    );
  }
}

export default CheckoutFail;
