import { CheckoutSuccess } from "Component/CheckoutSuccess/CheckoutSuccess.component";
import Image from "Component/Image";
import WarningImage from "Component/MyAccountOrderView/icons/warning.png";
import { EVENT_MOE_ECOMMERCE_PURCHASE_FAILED } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";

export class CheckoutFail extends CheckoutSuccess {
  componentWillUnmount() {
    const { setCheckoutDetails } = this.props;
    setCheckoutDetails(false);
  }
  componentDidMount() {
    const {
      totals: {
        items,
        coupon_code,
        currency_code,
        shipping_fee,
        subtotal,
        total,
        id,
      },
      orderID,
    } = this.props;
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);
    const formattedDetetails = items.map(
      ({
        full_item_info: {
          name,
          brand_name,
          itemPrice,
          price,
          category,
          config_sku,
          gender,
          size_option,
          size_value,
          sku,
          color,
          product_type_6s,
        },
      }) => ({
        brand_name: brand_name || "",
        color: color || "",
        discounted_price: itemPrice || price,
        product_name: name || "",
        product_sku: config_sku || sku,
        gender: gender || "",
        size_id: size_option || "",
        size: size_value || "",
        subcategory: product_type_6s || category || "",
      })
    );
    Moengage.track_event(EVENT_MOE_ECOMMERCE_PURCHASE_FAILED, {
      country: getCountryFromUrl() ? getCountryFromUrl().toUpperCase() : "",
      language: getLanguageFromUrl() ? getLanguageFromUrl().toUpperCase() : "",
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      coupon_code_applied: coupon_code || "",
      currency: currency_code || "",
      product_count: items.length || "",
      shipping_fee: shipping_fee || "",
      subtotal_amount: subtotal || "",
      order_id: orderID || "",
      total_amount: total || "",
      transaction_id: id || "",
      product: formattedDetetails,
      app6thstreet_platform: "Web",
    });
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
