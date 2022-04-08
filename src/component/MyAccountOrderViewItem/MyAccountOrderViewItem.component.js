import { MyAccountReturnSuccessItem as SourceComponent } from "Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import {  isArabic } from "Util/App";
import "./MyAccountOrderViewItem.style";

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
        size: { value: size = '' } = {},
        qty
      } = {}
    } = this.props;

    return (
      <div block="MyAccountReturnSuccessItem" elem="Details">
        <h2>{brand_name}</h2>
        <div block="MyAccountOrderViewItem" elem="Name">{name}</div>
        <div block="MyAccountReturnSuccessItem" elem="DetailsOptions">
          {!!color && (
            <p>
              {__('Color: ')}
              <span>{color}</span>
            </p>
          )}
          {!!qty && (
            <p>
              {__('Qty: ')}
              <span>{+qty}</span>
            </p>
          )}
          {!!size && (
            <p>
              {__('Size: ')}
              <span>{size}</span>
            </p>
          )}
        </div>
        <p block="MyAccountReturnSuccessItem" elem="Price">
          <span
            block="MyAccountReturnSuccessItem"
            elem="PriceRegular"
          >
            {`${formatPrice(+price, currency)}`}
          </span>
        </p>
        {this.renderEdd()}
      </div>
    );
  }
  renderEdd = () => {
    const { EddResponse } = this.props;
    let ActualEddMess = "";
    let ActualEdd = "";
    if (EddResponse) {
      Object.values(EddResponse).filter((entry) => {
        if (entry.source === "myorder" && entry.featute_flag_status === 0) {
          ActualEddMess = isArabic()
            ? entry.edd_message_ar
            : entry.edd_message_en;
          ActualEdd = entry.edd_date;
        }
      });
    }

    if (!ActualEddMess) {
      return null;
    }
    return (
      <div block="AreaText">
        <span>{ActualEddMess.split("by")[0]} by</span>
        <span>{ActualEddMess.split("by")[1]}</span>
      </div>
    );
  };
  render() {
    return (
      <div block="MyAccountOrderViewItem" mix={{ block: 'MyAccountReturnSuccessItem' }}>
        <div block="MyAccountReturnSuccessItem" elem="Content">
          {this.renderImage()}
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

export default MyAccountOrderViewItem;
