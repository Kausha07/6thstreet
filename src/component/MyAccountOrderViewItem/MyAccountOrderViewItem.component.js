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
      displayDiscountPercentage,
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
        {this.renderEdd()}
      </div>
    );
  }
  renderEdd = () => {
    const { EddResponse, compRef, myOrderEdd, citiesData } = this.props;
    let ActualEddMess = "";
    let ActualEdd = "";
    if (citiesData.length > 0) {
      if (compRef === "checkout") {
        if (EddResponse) {
          if (isObject(EddResponse)) {
            Object.values(EddResponse).filter((entry) => {
              if (entry.source === "checkout" && entry.featute_flag_status === 1) {
                ActualEddMess = isArabic()
                  ? entry.edd_message_ar
                  : entry.edd_message_en;
                ActualEdd = entry.edd_date;
              }
            });
          } else {
            const {
              defaultEddDateString,
              defaultEddDay,
              defaultEddMonth,
              defaultEddDat,
            } = getDefaultEddDate(2);
            ActualEddMess = `${DEFAULT_MESSAGE} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
            ActualEdd = defaultEddDateString;
          }
        }
      } else {
        ActualEddMess = myOrderEdd;
        ActualEdd = myOrderEdd;
      }
    }

    if (!ActualEddMess) {
      return null;
    }
    const idealFormat = ActualEddMess.includes("by") ? true : false;
    return (
      <div block="AreaText">
        <span>{ActualEddMess}</span>
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
