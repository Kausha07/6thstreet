import { MyAccountReturnSuccessItem as SourceComponent } from "Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import Price from "Component/Price";

import "./MyAccountOrderViewItem.style";

export class MyAccountOrderViewItem extends SourceComponent {
  renderDetails() {
    const {
      currency,
      displayDiscountPercentage,
      item: {
        brand_name,
        name,
        color,
        price,
        original_price,
        size: { value: size = "" } = {},
        product_options: {
          info_buyRequest: { qty },
        },
      } = {},
    } = this.props;
    let finalPrice = [
      {
        [currency]: {
          "6s_base_price": Math.floor(original_price),
          "6s_special_price": Math.floor(price),
          default: Math.floor(price),
          default_formated: `${currency} ${Math.floor(price)}`,
        },
      },
    ];
    // eslint-disable-next-line no-magic-numbers
    const discountPercentage = Math.round(100 * (1 - price / original_price));
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
          <Price price={finalPrice} renderSpecialPrice={false} />
        </p>
      </div>
    );
  }

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
