import { MyAccountReturnSuccessItem as SourceComponent } from "Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import { isArabic } from "Util/App";
import "./MyAccountOrderViewItem.style";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate } from "Util/Date/index";
import { DEFAULT_MESSAGE } from "../../component/Header/Header.config";

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
      } = {},
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
        {edd_info && edd_info.is_enable && !isFailed && this.renderEdd()}
      </div>
    );
  }
  renderEdd = () => {
    const { eddResponse, compRef, myOrderEdd, edd_info, item: { edd_msg_color } } = this.props;
    let actualEddMess = "";
    let actualEdd = "";

      const {
        defaultEddDateString,
        defaultEddDay,
        defaultEddMonth,
        defaultEddDat,
      } = getDefaultEddDate(edd_info.default_message);
      if (compRef === "checkout") {
        if (eddResponse) {
          if (isObject(eddResponse)) {
            Object.values(eddResponse).filter((entry) => {
              if (entry.source === "checkout" && entry.featute_flag_status === 1) {
                actualEddMess = isArabic()
                  ? entry.edd_message_ar
                  : entry.edd_message_en;
                actualEdd = entry.edd_date;
              }
            });
          } else {
            actualEddMess = `${DEFAULT_MESSAGE} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
            actualEdd = defaultEddDateString;
          }
        }
      } else {
        actualEddMess = myOrderEdd;
        actualEdd = myOrderEdd;
      }

    if (!actualEddMess) {
      return null;
    }

    let colorCode = compRef === 'checkout' ? '28d9aa' : edd_msg_color
    return (
      <div block="AreaText" style={{ color: colorCode }}>
        <span>{actualEddMess}</span>
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
