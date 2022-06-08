import { MyAccountReturnSuccessItem as SourceComponent } from "Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import { isArabic } from "Util/App";
import "./MyAccountOrderViewItem.style";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate } from "Util/Date/index";
import {
  DEFAULT_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
} from "../../util/Common/index";
import { SPECIAL_COLORS } from "../../util/Common";
import Event, { EVENT_GTM_EDD_VISIBILITY } from "Util/Event";
import { Store } from "../Icons";

export class MyAccountOrderViewItem extends SourceComponent {
  renderDetails() {
    let {
      currency,
      edd_info,
      displayDiscountPercentage,
      isFailed,
      item: {
        brand_name,
        name,
        color,
        price,
        size: { value: size = "" } = {},
        qty,
        ctc_store_name="",
      } = {},
      status,
    } = this.props;
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
          <span block="MyAccountReturnSuccessItem" elem="PriceRegular">
            {`${formatPrice(+price, currency)}`}
          </span>
        </p>
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
        {edd_info &&
          edd_info.is_enable &&
          !isFailed &&
          status !== "payment_failed" &&
          status !== "payment_aborted" &&
          this.renderEdd()}
      </div>
    );
  }
  renderEdd = () => {
    const {
      eddResponse,
      compRef,
      myOrderEdd,
      setEddEventSent,
      eddEventSent,
      edd_info,
      item: { edd_msg_color },
    } = this.props;
    let actualEddMess = "";
    let actualEdd = "";

    const {
      defaultEddDateString,
      defaultEddDay,
      defaultEddMonth,
      defaultEddDat,
    } = getDefaultEddDate(edd_info.default_message);
    let customDefaultMess = isArabic()
      ? EDD_MESSAGE_ARABIC_TRANSLATION[DEFAULT_MESSAGE]
      : DEFAULT_MESSAGE;
    if (compRef === "checkout") {
      if (eddResponse) {
        if (isObject(eddResponse)) {
          Object.values(eddResponse).filter((entry) => {
            if (
              entry.source === "checkout" &&
              entry.featute_flag_status === 1
            ) {
              actualEddMess = isArabic()
                ? entry.edd_message_ar
                : entry.edd_message_en;
              actualEdd = entry.edd_date;
            }
          });
        } else {
          actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
          actualEdd = defaultEddDateString;
        }
      }
    } else {
      actualEddMess = myOrderEdd;
      actualEdd = myOrderEdd;
      if(myOrderEdd && !eddEventSent){
      Event.dispatch(EVENT_GTM_EDD_VISIBILITY, {
        edd_details: {
          edd_status: edd_info.has_order_detail,
          default_edd_status: null,
          edd_updated: null,
        },
        page: "my_order",
      });
      setEddEventSent()
    }
    }

    if (!actualEddMess) {
      return null;
    }

    let splitKey = isArabic() ? "بواسطه" : "by";

    let colorCode =
      compRef === "checkout" ? SPECIAL_COLORS["shamrock"] : edd_msg_color;
    const idealFormat = actualEddMess.includes(splitKey) ? true : false;
    return (
      <div block="AreaText" mods={{ isArabic: isArabic() ? true : false }}>
        <span
          style={{ color: !idealFormat ? colorCode : SPECIAL_COLORS["nobel"] }}
        >
          {idealFormat
            ? `${actualEddMess.split(splitKey)[0]} ${splitKey}`
            : null}{" "}
        </span>
        <span style={{ color: colorCode }}>
          {idealFormat ? `${actualEddMess.split(splitKey)[1]}` : actualEddMess}
        </span>
      </div>
    );
  };
  render() {
    return (
      <div
        block="MyAccountOrderViewItem"
        mix={{ block: "MyAccountReturnSuccessItem" }}
      >
        <div block="MyAccountReturnSuccessItem" elem="Content">
          {this.renderImage()}
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

export default MyAccountOrderViewItem;
