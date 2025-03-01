import { MyAccountReturnSuccessItem as SourceComponent } from "Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import { isArabic } from "Util/App";
import "./MyAccountOrderViewItem.style";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate, getDefaultEddMessage } from "Util/Date/index";
import {
  DEFAULT_MESSAGE,
  DEFAULT_READY_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
  INTL_BRAND,
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_SPLIT_KEY,
} from "../../util/Common/index";
import { SPECIAL_COLORS } from "../../util/Common";
import Event, { EVENT_GTM_EDD_VISIBILITY, MOE_trackEvent, EVENT_PRODUCT_RATING_CLICK, EVENT_PRODUCT_RATING_CLEAR, EVENT_PRODUCT_RATING_VALUE } from "Util/Event";
import { Store } from "../Icons";
import Image from "Component/Image";
import Tick from "./icons/tick.png";
import HollowStar from "./icons/hollow-star.png";
import RatingStar from "./icons/rating_star.png";

import { updateStarRating, deleteStarRating } from "Util/API/endpoint/MyAccount/MyAccount.enpoint";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { ThreeDots } from "react-loader-spinner";
import { ExpressDeliveryTruck, Shipping } from "Component/Icons";


export class MyAccountOrderViewItem extends SourceComponent {

  state = {
    starHover: 0,
    isRatingSubmited: false,
    isRatingProccessing: false
  };

  renderSitewidePriceLine() {
    const { currency, item: { price, original_price, unit_final_price } = {} } = this.props;
    const discountPercentage = Math.round(100 * (1 - (unit_final_price || price) / original_price));

    return (
      <>
        <span className="purchasePrice">{`${formatPrice(
          +unit_final_price || +price,
          currency
        )}`}</span>
        &nbsp;
        <span className="delBasePrice">{`${formatPrice(
          +original_price,
          currency
        )}`}</span>
        &nbsp;
        <span className="discountPerCheck">{`(-${discountPercentage}%)`}</span>
      </>
    );
  }


  getReturnExchangeMessage = (returnable_date, exchangeable_date) => {
    if(!returnable_date && !exchangeable_date) {
      return __("This item is not returnable or exchangeable.");
    } else {
      const returnable_date_expired = this.expiredDateIfAny(returnable_date);
      const exchangeable_date_expired = this.expiredDateIfAny(exchangeable_date);
      if(!returnable_date && exchangeable_date) {
        return exchangeable_date_expired ? __("Exchange window closed on %s", exchangeable_date_expired) :   __("This item is not returnable. Exchange only.");
      } else if(!exchangeable_date && returnable_date) {
        return returnable_date_expired ? __("Return window closed on %s", returnable_date_expired) : __("This item is not exchangeable. Return only.");
      } else {
        return returnable_date_expired ? __("Returned/exchange window closed on %s", returnable_date_expired) : "";
      }
    }
  }
    
  expiredDateIfAny = (dateStr) => {
    if (!dateStr) return "";
  
    // Convert the date string to a Date object
    const givenDate = new Date(dateStr + ' UTC'); // Assume the dateStr is in UTC
  
    // Get the country code from the URL or another method
    const countryCode = getCountryFromUrl();
  
    // Map country codes to their respective time zones
    const timeZones = {
      ae: 'Asia/Dubai',
      sa: 'Asia/Riyadh',
      bh: 'Asia/Bahrain',
      om: 'Asia/Muscat',
      kw: 'Asia/Kuwait',
      qa: 'Asia/Qatar',
      // Add more as needed
    };
  
    const timeZone = timeZones[countryCode.toLowerCase()] || 'UTC';
  
    // Convert givenDate to the country's local time
    const localGivenDate = new Date(givenDate.toLocaleString('en-US', { timeZone }));
  
    // Get today's date in the same timezone
    const today = new Date();
    const localToday = new Date(today.toLocaleString('en-US', { timeZone }));
    localToday.setHours(0, 0, 0, 0); // Reset to start of the day
  
    // Convert both dates to ISO strings for comparison (YYYY-MM-DD)
    const givenDateISO = localGivenDate.toISOString().split('T')[0];
    const todayISO = localToday.toISOString().split('T')[0];
  
    // Define options for formatting the date
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
  
    const dateToReturn = localGivenDate.toLocaleDateString('en-US', options).replace(',', '');
    return givenDateISO > todayISO ? "" : dateToReturn;
  };
  

  renderDetails() {
    let {
      currency,
      edd_info,
      compRef,
      displayDiscountPercentage,
      isFailed,
      item: {
        brand_name = "",
        name,
        color,
        price,
        size: { value: size = "" } = {},
        qty,
        cross_border = 0,
        ctc_store_name = "",
        int_shipment = "0",
        international_vendor = null,
        original_price,
        unit_final_price,
        returnable_date=null,
        exchangeable_date=null
      } = {},
      status,
      paymentMethod,
      international_shipping_fee,
      item,
      itemStatus="",
      orderDetailsCartTotal: {
        site_wide_applied = 0,
        discount_code = "",
      } = {},
    } = this.props;
    const isIntlBrand =
      (parseInt(cross_border) === 1 &&
        edd_info &&
        edd_info.has_cross_border_enabled) ||
      int_shipment === "1";
    const orderEddDetails = JSON.parse(localStorage.getItem("ORDER_EDD_ITEMS"));
    const renderOtherEdd =
      paymentMethod?.code === "checkout_qpay" ||
      paymentMethod?.code === "tabby_installments";
    const discountPercentage = Math.round(100 * (1 - (unit_final_price || price) / original_price));
    const return_exchange_message = itemStatus.toLowerCase() === 'delivery_successful' ? this.getReturnExchangeMessage(returnable_date, exchangeable_date) : "";
    return (
      <div block="MyAccountReturnSuccessItem" elem="Details">
        <h2>{brand_name}</h2>
        <div block="MyAccountOrderViewItem" elem="Name">
          {name}
        </div>
        
        <div block="MyAccountReturnSuccessItem" elem="DetailsOptions">
          {!!color && (
            <p>
              {__("Color: ")}
              <span>{color}</span>
            </p>
          )}
          {!!qty && (
            <p>
              {__("Qty: ")}
              <span>{+qty}</span>
            </p>
          )}
          {!!size && (
            <p>
              {__("Size: ")}
              <span>{size}</span>
            </p>
          )}
        </div>
        <p block="MyAccountReturnSuccessItem" elem="Price">
          <span block="MyAccountReturnSuccessItem" elem="PriceRegular" mods={{ isArabic: isArabic() ? true : false }}>
            {discountPercentage && (site_wide_applied || discount_code)
              ? this.renderSitewidePriceLine()
              : `${formatPrice(+price, currency)}`}
          </span>
        </p>
        {
          return_exchange_message && (
            <div>
              <p>{return_exchange_message}</p>
            </div>
          )
        }
        {!!ctc_store_name && (
          <div block="MyAccountOrderViewItem" elem="ClickAndCollect">
            <Store />
            <div
              block="MyAccountOrderViewItem-ClickAndCollect"
              elem="StoreName"
            >
              {ctc_store_name}
            </div>
          </div>
        )}
        {((renderOtherEdd &&
          orderEddDetails &&
          edd_info &&
          edd_info.is_enable) ||
          (edd_info && edd_info.is_enable) && edd_info.has_order_detail) &&
          (isIntlBrand || parseInt(cross_border) === 0 || edd_info.has_item_level) &&
          !isFailed &&
          status !== "payment_failed" &&
          status !== "payment_aborted" ?
          this.renderEdd(parseInt(cross_border) === 1, orderEddDetails) : null
        }
      </div>
    );
  }

  renderIntlTag() {
    return (
      <span block="AdditionShippingInformation">
        {__("International Shipment")}
      </span>
    );
  }

  renderEdd = (crossBorder, orderEddDetails) => {
    const {
      eddResponse,
      compRef,
      myOrderEdd,
      setEddEventSent,
      eddEventSent,
      edd_info,
      isFailed,
      item: { edd_msg_color, brand_name = "", ctc_store_name, international_vendor = null, is_express_delivery = false, 
        int_shipment = "0",
        cross_border = 0 
      },
      status,
      intlEddResponse,
      international_shipping_fee,
      itemStatus= this.props
    } = this.props;
    let actualEddMess = "";
    let actualEdd = "";
    const defaultDay = ctc_store_name
      ? edd_info.ctc_message
      : edd_info.default_message;

    const paymentInformation = JSON.parse(localStorage.getItem("PAYMENT_INFO"));
    const { defaultEddDay, defaultEddMonth, defaultEddDat } =
      getDefaultEddDate(defaultDay);
    const isIntlBrand =
      (parseInt(cross_border) === 1 &&
        edd_info &&
        edd_info.has_cross_border_enabled) ||
      int_shipment === "1";
    if (compRef === "checkout") {
      let customDefaultMess = isArabic()
        ? EDD_MESSAGE_ARABIC_TRANSLATION[DEFAULT_READY_MESSAGE]
        : DEFAULT_READY_MESSAGE;
      const intlEddObj = intlEddResponse["thankyou"]?.find(
        ({ vendor }) => vendor.toLowerCase() === international_vendor?.toString().toLowerCase()
      );
      const intlEddMess = intlEddObj
        ? isArabic()
          ? intlEddObj["edd_message_ar"]
          : intlEddObj["edd_message_en"]
        : isIntlBrand
        ? isArabic()
          ? intlEddResponse["thankyou"][0]["edd_message_ar"]
          : intlEddResponse["thankyou"][0]["edd_message_en"]
        : "";

      if (isIntlBrand) {
        actualEddMess = intlEddMess;
      } else {
        if (ctc_store_name) {
          actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
        } else {
          actualEddMess = paymentInformation["finalEddString"];
        }
      }
    } else {
      actualEddMess = myOrderEdd;
      actualEdd = myOrderEdd;
      if (myOrderEdd && !eddEventSent && edd_info) {
        Event.dispatch(EVENT_GTM_EDD_VISIBILITY, {
          edd_details: {
            edd_status: edd_info.has_order_detail,
            default_edd_status: null,
            edd_updated: null,
          },
          page: "my_order",
        });
        setEddEventSent();
      }
    }

    if (!actualEddMess) {
      return null;
    }

    let colorCode =
      compRef === "checkout" ? SPECIAL_COLORS["shamrock"] : edd_msg_color;
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY;
    const splitByInclude = actualEddMess.includes(splitKey);
    const splitByReadyInclude =
      splitReadyByKey && actualEddMess.includes(splitReadyByKey);
    const idealFormat = splitByInclude || splitByReadyInclude ? true : false;
    let splitBy = actualEddMess.split(splitKey);

    if (idealFormat) {
      if (splitByReadyInclude) {
        splitBy = actualEddMess.split(splitReadyByKey);
        splitKey = splitReadyByKey;
      } else {
        splitBy = actualEddMess.split(splitKey);
        splitKey = splitKey;
      }
    }
    if(is_express_delivery) {
      return (
        <>
          <div className="EddExpressDeliveryTextBlock">
            <ExpressDeliveryTruck />  
            <span class="EddExpressDeliveryTextRed">{__("Express")} </span>
            <span class="EddExpressDeliveryTextNormal"> {idealFormat ? `${splitBy[0]} ${splitKey}` : null}{" "}</span>
            <span class="EddExpressDeliveryTextBold">{idealFormat ? `${splitBy[1]}` : actualEddMess}</span>
          </div>
        </>
      )
    } else {
      return (
        <div block="eddStandardDelivery">
          <div block="EddStandardDeliveryTextBlock">
            <Shipping />
            <div block="shipmentText">
              <span block="EddStandardDeliveryText">
                {__("Standard")} {}
                {__("Delivery")} {}
                {splitKey} {}
              </span>
              <span block="EddStandardDeliveryTextBold">
                {actualEddMess?.split(splitKey)?.[1]}
              </span>
            </div>
          </div>
          <div>
            {(isIntlBrand &&
                  edd_info &&
                  edd_info.is_enable &&
                  !isFailed &&
                  status !== "payment_failed" &&
                  status !== "payment_aborted") ||
                (international_shipping_fee && +cross_border) ||
                int_shipment === "1"
                  ? <div>{this.renderIntlTag()}</div>
                  : null}
          </div>
        </div>
      )
    }

    return (
      <div block="AreaText" mods={{ isArabic: isArabic() ? true : false }} >
        <span
          style={{ color: !idealFormat ? colorCode : SPECIAL_COLORS["nobel"] }}
        >
          {idealFormat ? `${splitBy[0]} ${splitKey}` : null}{" "}
        </span>
        <span style={{ color: colorCode }}>
          {idealFormat ? `${splitBy[1]}` : actualEddMess}
        </span>
      </div>
    );
  };

  renderProductRating() {
    const {
      item: {
        sku,
        config_sku,
      } = {},
      productsRating,
    } = this.props;

    return (
      <div className="productRatingSection">
        <h3 className="title">{__("Rate the quality of the product")}</h3>
        <div className="ratingBox">
          {this.renderStarRating()}
          <div className="ratingActions">
            {(this.state.isRatingProccessing && !this.state.isRatingSubmited) && <ThreeDots color="black" height={6} width={"100%"} />}
              {(this.state.isRatingSubmited && !this.state.isRatingProccessing) &&
                <div className="ratingSubmitIcon">
                  <Image
                    lazyLoad={false}
                    src={Tick}
                    className="lineImg"
                    alt="Tick"
                  />
                </div>
              }
              {((productsRating[sku] > 0 && productsRating[sku]) && !this.state.isRatingProccessing) && <button className="submitRating" onClick={() => this.handleDeleteStarRating(sku, config_sku)}>{__("Clear")}</button>}
          </div>
        </div>

      </div>
    );
  }
  renderStarRating() {
    const {
      item: {
        sku,
        config_sku,
      } = {},
      productsRating,
    } = this.props;
    return (
      <div className="ratingStars">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              className="starIcons"
              type="button"
              key={`starIcon_${index}`}
              onClick={() => this.handleStarClick(index)}
              onMouseEnter={() => this.handleStarHoverEnter(index)}
              onMouseLeave={() => this.handleStarHoverLeave()}
            >
              <Image
                lazyLoad={false}
                src={index <= (this.state.starHover || productsRating[sku]) ? RatingStar : HollowStar}
                className="starIcon"
                alt="star"
              />
            </button>
          )
        })}
      </div>
    )
  }
  handleStarHoverLeave() {
    this.setState({ starHover: 0 })
  }
  handleStarHoverEnter(value) {
    this.setState({ starHover: value })
  }

  extractIfHasEXPrefix(inputString) {
    if (inputString.startsWith("EX-") || inputString.startsWith("RAE")) {
      return inputString.substring(3);
    } else {
      return inputString;
    }
  }

  async handleStarClick(value) {
    const {
      item: {
        sku,
        config_sku,
      } = {},
      incrementId,
      productsRating,
      updateRating
    } = this.props;

    if (sku &&  config_sku && productsRating[sku] !== value && !this.state.isRatingProccessing && !this.state.isRatingSubmited) {
      this.setState({ isRatingProccessing: true });
      await updateStarRating({
        "simple_sku": sku,
        "config_sku": config_sku,
        "order_id": +this.extractIfHasEXPrefix(incrementId),
        "rating": value
      }).then((resp) => {
        if(resp.success){
          this.setState({ isRatingProccessing: false });
          this.setState({ isRatingSubmited: true });
          setTimeout(() => {
            this.setState({ isRatingSubmited: false });
          }, 2000);

          if(!productsRating[sku]){
            Event.dispatch(EVENT_PRODUCT_RATING_CLICK, {
              sku: sku || "",
              rating: value || "",
            });
    
            MOE_trackEvent(EVENT_PRODUCT_RATING_CLICK, {
              country: getCountryFromUrl().toUpperCase(),
              language: getLanguageFromUrl().toUpperCase(),
              app6thstreet_platform: "Web",
              sku: sku || "",
              rating: value || "",
            });
          }else{
            Event.dispatch(EVENT_PRODUCT_RATING_VALUE, {
              sku: sku || "",
              rating: value || "",
            });
    
            MOE_trackEvent(EVENT_PRODUCT_RATING_VALUE, {
              country: getCountryFromUrl().toUpperCase(),
              language: getLanguageFromUrl().toUpperCase(),
              app6thstreet_platform: "Web",
              sku: sku || "",
              rating: value || "",
            });
          }
          updateRating(sku, value)        
        }else{
          this.setState({ isRatingProccessing: false });
          this.setState({ isRatingSubmited: false });
        }
      })

    }
  }


  async handleDeleteStarRating(productSimpleSku, productConfigSku) {
    const {
      item: {
        sku,
        config_sku,
      } = {},
      incrementId,
      productsRating,
      updateRating
    } = this.props;
    if (!this.state.isRatingProccessing && !this.state.isRatingSubmited) {
      this.setState({ isRatingProccessing: true });
      const incmntId = this.extractIfHasEXPrefix(incrementId)
      await deleteStarRating(productSimpleSku,encodeURIComponent(productConfigSku), +incmntId).then((resp) => {
        if(resp.success){
          this.setState({ isRatingProccessing: false });
          Event.dispatch(EVENT_PRODUCT_RATING_CLEAR);
          MOE_trackEvent(EVENT_PRODUCT_RATING_CLEAR, {
            country: getCountryFromUrl().toUpperCase(),
            language: getLanguageFromUrl().toUpperCase(),
            app6thstreet_platform: "Web",
          });
          updateRating(sku, 0);
        }else{
          this.setState({ isRatingProccessing: false });
        }       
        
      })
    }
  }

  render() {
    const { item, itemStatus, isProductRatingEnabled } = this.props;
    return (
      <div
        block="MyAccountOrderViewItem"
        mix={{ block: "MyAccountReturnSuccessItem" }}
      >
        <div block="MyAccountReturnSuccessItem" elem="Content">
          {this.renderImage()}
          {this.renderDetails()}
        </div>
        {itemStatus && itemStatus === "delivery_successful" && isProductRatingEnabled && this.renderProductRating()}

      </div>
    );
  }
}

export default MyAccountOrderViewItem;
