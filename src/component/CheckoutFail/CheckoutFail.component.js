import { CheckoutSuccess } from "Component/CheckoutSuccess/CheckoutSuccess.component";
import Image from "Component/Image";
import WarningImage from "Component/MyAccountOrderView/icons/warning.png";
import { EVENT_MOE_ECOMMERCE_PURCHASE_FAILED, MOE_trackEvent } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import "./CheckoutFail.style";
import { SUCCESS, FAILURE } from "Component/CareemPay/CareemPay.config";

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
      paymentMethod,
    } = this.props;
    const currentAppState = BrowserDatabase.getItem(APP_STATE_CACHE_KEY);

    let productName = [],
      productColor = [],
      productBrand = [],
      productSku = [],
      productGender = [],
      productBasePrice = [],
      productSizeOption = [],
      productSizeValue = [],
      productSubCategory = [],
      productThumbanail = [],
      productUrl = [],
      productQty = [],
      productCategory = [],
      productItemPrice = [];
    items?.forEach((item) => {
      let productKeys = item?.full_item_info;
      productName.push(productKeys?.name);
      productColor.push(productKeys?.color);
      productBrand.push(productKeys?.brand_name);
      productSku.push(productKeys?.config_sku);
      productGender.push(productKeys?.gender);
      productBasePrice.push(productKeys?.original_price);
      productSizeOption.push(productKeys?.size_option);
      productSizeValue.push(productKeys?.size_value);
      productSubCategory.push(productKeys?.subcategory);
      productThumbanail.push(productKeys?.thumbnail_url);
      productUrl.push(productKeys?.url);
      productQty.push(productKeys?.qty);
      productCategory.push(productKeys?.original_price);
      productItemPrice.push(productKeys?.itemPrice);
    });
    MOE_trackEvent(EVENT_MOE_ECOMMERCE_PURCHASE_FAILED, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      category: currentAppState.gender
        ? currentAppState.gender.toUpperCase()
        : "",
      coupon_code_applied: coupon_code || "",
      currency: currency_code || "",
      product_count: items?.length || "",
      shipping_fee: shipping_fee || "",
      subtotal_amount: subtotal || "",
      order_id: orderID || "",
      total_amount: total || "",
      transaction_id: id || "",
      brand_name: productBrand?.length > 0 ? productBrand : "",
      color: productColor?.length > 0 ? productColor : "",
      discounted_price: productItemPrice?.length > 0 ? productItemPrice : "",
      full_price: productBasePrice?.length > 0 ? productBasePrice : "",
      product_name: productName?.length > 0 ? productName : "",
      product_sku: productSku?.length > 0 ? productSku : "",
      gender: productGender?.length > 0 ? productGender : "",
      size_id: productSizeOption?.length > 0 ? productSizeOption : "",
      size: productSizeValue?.length > 0 ? productSizeValue : "",
      subcategory: productSubCategory?.length > 0 ? productSubCategory : "",
      app6thstreet_platform: "Web",
      payment_method: paymentMethod?.code || "",
    });
  }

  renderStatus() {
    const { careemPayStatus } = this.props;

    return (
      <div block="MyAccountOrderView" elem="StatusFailed">
        <Image
          lazyLoad={true}
          src={WarningImage}
          mix={{ block: "MyAccountOrderView", elem: "WarningImage" }}
          alt={"WarningImage"}
        />
        {(careemPayStatus === SUCCESS) ? <p>{__("Order Failed")}</p> : <p>{__("Payment Failed")}</p>}
        
      </div>
    );
  }

  renderEdgeCaseMessage() {
    const { careemPayInfo, careemPayStatus } = this.props;

    if(careemPayStatus === FAILURE) {
      return null;
    }

    if(careemPayInfo && careemPayInfo.messageTitle && careemPayInfo.messageDetails ) {
      return (
        <div block="alertMessage">
          <h3>{careemPayInfo?.messageTitle}</h3>
          <p>{careemPayInfo?.messageDetails}</p>
        </div>
      );
    }

    return (
      <div block="alertMessage">
        <h3>{__("The ordered product is currently out of stock.")}</h3>
        <p>{__("If  amount is deducted from your account  it will be refunded within 5 working days.")}</p>
      </div>
    );
  }

  renderDetails() {
    const { paymentMethod, careemPayInfo, careemPayStatus } = this.props;
    let isEdgeCase = false;
    if(careemPayInfo && careemPayInfo.isCreateOrderFail) {
      isEdgeCase = true;
    }
    localStorage.removeItem("cartProducts");
    return (
      <div block="CheckoutSuccess">
        <div block="CheckoutSuccess" elem="Details">
          {this.renderStatus()}
          {isEdgeCase ? this.renderEdgeCaseMessage() : null}
          {this.renderTotalsItems()}
          {this.renderAddresses()}
          {this.renderDeliveryOption()}
          {this.renderPaymentType()}
          {paymentMethod?.code === "checkout_qpay" ||
          paymentMethod?.code === "tabby_installments" ||
          paymentMethod?.code === "checkout_knet"
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
