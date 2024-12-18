import PropTypes from "prop-types";
import { MyAccountReturnCreateItem as SourceComponent } from "Component/MyAccountReturnCreateItem/MyAccountReturnCreateItem.component";
import { CONST_HUNDRED, DecimalCountries } from "Util/Common";
import { getCountryCurrencyCode, getCountryFromUrl } from "Util/Url/Url";

import Price from "Component/Price";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";

export class MyAccountCancelCreateItem extends SourceComponent {
  static propTypes = {
    displayDiscountPercentage: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    displayDiscountPercentage: true,
  };

  onQuantityChange = (quantity, itemId) => {
    const { onQuantitySelection } = this.props;
    onQuantitySelection(parseInt(quantity), itemId);
  };

  isItemSelected = (item_id, item,maxSaleQuantity) => {
    const {
      cancelableQty = {},
    } = this.props;
    const selectedValue =
    cancelableQty[item_id]
      ? cancelableQty[item_id].quantity === item
      : maxSaleQuantity === item;
    return selectedValue;
  };

  renderQuantitySelection = (maxSaleQuantity) => {
    const {
      minSaleQuantity = 1,
      item: { item_id },
      cancelableQty = {},
      isArabic
    } = this.props;

    const qtyList = Array.from(
      { length: maxSaleQuantity - minSaleQuantity + 1 },
      (v, k) => k + minSaleQuantity
    );
    const itemValue = cancelableQty[item_id]
      ? cancelableQty[item_id].quantity
      : maxSaleQuantity;
    return (
      <div block="CartItem" elem="Quantity" mods={{ isArabic }}>
        <select
          value={itemValue}
          onChange={(e) => this.onQuantityChange(e.target.value, item_id)}
        >
          {qtyList.map((item, index) => {
            return (
              <option
                key={index}
                selected={this.isItemSelected(item_id,item,maxSaleQuantity)}
                block="CartItem"
                elem="QuantityOption"
                value={item}
              >
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  renderDetails() {
    const {
      displayDiscountPercentage,
      item: {
        name,
        color,
        price,
        original_price,
        size: sizeField,
        qty_to_cancel: qty,
      },
    } = this.props;
    let currency_code = getCountryCurrencyCode();
    const size =
      !!sizeField && typeof sizeField === "object"
        ? sizeField.value
        : sizeField;

    let countriesCode = getCountryFromUrl();

    let finalPrice = [
      {
        [currency_code]: {
          "6s_base_price": DecimalCountries.includes(countriesCode)? Number(original_price).toFixed(3) : Math.floor(original_price),
          "6s_special_price":  DecimalCountries.includes(countriesCode)?  Number(price).toFixed(3) : Math.floor(price),
          default:  DecimalCountries.includes(countriesCode)? Number(price).toFixed(3) : Math.floor(price),
          default_formated:  DecimalCountries.includes(countriesCode)? `${currency_code} ${Number(price).toFixed(3)}` : `${currency_code} ${Math.floor(price)}`,
        },
      },
    ];
    return (
      <div block="MyAccountReturnCreateItem" elem="Details">
        <h2>{name}</h2>
        <div block="MyAccountReturnCreateItem" elem="DetailsOptions">
          {!!color && (
            <p>
              {__("Color: ")}
              <span>{color}</span>
            </p>
          )}
          {!!qty && (
            <p block="Quantity">
            {__("Qty: ")}
            {this.renderQuantitySelection(+qty)}
            </p>
          )}
          {!!size && (
            <p>
              {__("Size: ")}
              <span>{size}</span>
            </p>
          )}
        </div>
        <Price price={finalPrice} renderSpecialPrice={false} />
      </div>
    );
  }

  render() {
    return (
      <div block="MyAccountReturnCreateItem">
        <div block="MyAccountReturnCreateItem" elem="Content">
          {this.renderField({
            type: "CANCELLATION",
          })}
          {this.renderImage()}
          {this.renderDetails()}
        </div>
        <div block="MyAccountReturnCreateItem" elem="Resolution">
          {this.renderReasons()}
          {/* { this.renderResolutions() } */}
        </div>
      </div>
    );
  }
}

export default MyAccountCancelCreateItem;
