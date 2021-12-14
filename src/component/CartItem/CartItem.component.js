/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-one-expression-per-line */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Field from "Component/Field";
import Image from "Component/Image";
import Loader from "Component/Loader";
import {
  FIXED_CURRENCIES,
  DISPLAY_DISCOUNT_PERCENTAGE,
} from "Component/Price/Price.config";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import Price from "Component/Price";

import "./CartItem.style";
import "./CartItem.extended.style";

/**
 * Cart and CartOverlay item
 * @class CartItem
 */

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
});

export class CartItem extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    item: CartItemType.isRequired,
    country: PropTypes.string.isRequired,
    currency_code: PropTypes.string.isRequired,
    brand_name: PropTypes.string,
    isEditing: PropTypes.bool,
    isLikeTable: PropTypes.bool,
    history: PropTypes.object.isRequired,
    handleRemoveItem: PropTypes.func.isRequired,
    minSaleQuantity: PropTypes.number.isRequired,
    maxSaleQuantity: PropTypes.number.isRequired,
    handleChangeQuantity: PropTypes.func.isRequired,
    getCurrentProduct: PropTypes.func.isRequired,
    toggleCartItemQuantityPopup: PropTypes.func.isRequired,
    thumbnail: PropTypes.string.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    closePopup: PropTypes.func,
    availability: PropTypes.number.isRequired,
    isCartPage: PropTypes.bool,
    readOnly: PropTypes.bool,
  };
  state = {
    isArabic: isArabic(),
    isNotAvailble: false,
  };

  static defaultProps = {
    isEditing: false,
    isLikeTable: false,
    brand_name: "",
    closePopup: () => {},
    isCartPage: false,
    readOnly: false,
  };

  static getDerivedStateFromProps(props) {
    const {
      item: { availability, availableQty, qty },
    } = props;

    return {
      isNotAvailble:
        availability === 0 || availableQty === 0 || qty > availableQty,
    };
  }
  renderProductConfigurationOption = ([key, attribute]) => {
    const {
      item: {
        product: { configurable_options = {} },
      },
    } = this.props;

    const { attribute_code, attribute_value } = attribute;

    if (!Object.keys(configurable_options).includes(key)) {
      return null;
    }

    const {
      [attribute_code]: {
        // configurable option attribute
        attribute_options: {
          [attribute_value]: {
            // attribute option value label
            label,
          },
        },
      },
    } = configurable_options;

    return (
      <li
        key={attribute_code}
        aria-label={attribute_code}
        block="CartItem"
        elem="Option"
      >
        {label}
      </li>
    );
  };

  renderProductConfigurations() {
    const {
      item: {
        product: { configurable_options, variants },
      },
      isLikeTable,
      getCurrentProduct,
    } = this.props;

    if (!variants || !configurable_options) {
      return null;
    }

    const { attributes = {} } = getCurrentProduct() || {};

    if (!Object.entries(attributes).length) {
      return null;
    }

    return (
      <ul block="CartItem" elem="Options" mods={{ isLikeTable }}>
        {Object.entries(attributes).map(this.renderProductConfigurationOption)}
      </ul>
    );
  }

  routeToProduct = () => {
    const {
      history,
      hideActiveOverlay,
      closePopup,
      item: {
        product: { url },
      },
    } = this.props;

    if (
      window.location.pathname !== "/cart" &&
      window.location.pathname !== "/checkout/shipping"
    ) {
      hideActiveOverlay();
      closePopup();
    }

    history.push(url.split(".com")[1]);
  };
  renderWrapper() {
    // TODO: implement shared-transition here?

    return (
      <figure block="CartItem" elem="Wrapper">
        {this.renderImage()}
        {this.renderContent()}
      </figure>
    );
  }

  renderProductOptionValue = (optionValue, i, array) => {
    const { label, value } = optionValue;
    const isNextAvailable = Boolean(array[i + 1]);

    return (
      <span block="CartItem" elem="ItemOptionValue" key={label}>
        {label || value}
        {isNextAvailable && ", "}
      </span>
    );
  };

  renderProductOption = (option) => {
    const { label, values = [], id } = option;

    return (
      <div block="CartItem" elem="ItemOption" key={id}>
        <div block="CartItem" elem="ItemOptionLabel" key={`label-${id}`}>
          {`${label}:`}
        </div>
        <div block="CartItem" elem="ItemOptionValues">
          {values.map(this.renderProductOptionValue)}
        </div>
      </div>
    );
  };

  renderProductOptions(itemOptions = []) {
    const { isLikeTable } = this.props;

    if (!itemOptions.length) {
      return null;
    }

    return (
      <div block="CartItem" elem="ItemOptionsWrapper" mods={{ isLikeTable }}>
        {itemOptions.map(this.renderProductOption)}
      </div>
    );
  }

  renderProductName() {
    const {
      item: {
        product: { name },
      },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartItem" elem="Heading" mods={{ isArabic }}>
        {name}
      </p>
    );
  }

  renderBrandName() {
    const { brand_name } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartItem" elem="Heading" mods={{ isArabic }}>
        {brand_name}
      </p>
    );
  }

  renderProductPrice() {
    const {
      country,
      currency_code,
      item: { row_total, basePrice },
    } = this.props;

    const { isArabic } = this.state;
    const decimals = FIXED_CURRENCIES.includes(currency_code) ? 3 : 2;
    const decimalPrice = parseFloat(row_total).toFixed(decimals);
    const decimalBasePrice = parseFloat(basePrice).toFixed(decimals);
    let price = [
      {
        [currency_code]: {
          "6s_base_price": decimalBasePrice,
          "6s_special_price": decimalPrice,
          default: decimalPrice,
          default_formated: `${currency_code} ${decimalPrice}`,
        },
      },
    ];
  

    return (
      <div block="CartItem" elem="Price" mods={{ isArabic }}>
        <Price price={price} renderSpecialPrice={false} cart={true} />
      </div>
    );
  }

  onQuantityChange = (quantity) => {
    const {
      handleChangeQuantity,
      item: { qty },
    } = this.props;
    handleChangeQuantity(quantity);
  };

  renderQuantitySelection = () => {
    const {
      minSaleQuantity,
      maxSaleQuantity,
      handleChangeQuantity,
      item: { qty },
    } = this.props;

    const { isArabic } = this.state;

    const qtyList = Array.from(
      { length: maxSaleQuantity - minSaleQuantity + 1 },
      (v, k) => k + minSaleQuantity
    );

    return (
      <div block="CartItem" elem="Quantity" mods={{ isArabic }}>
        <select
          value={qty}
          onChange={(e) => this.onQuantityChange(e.target.value)}
        >
          {qtyList.map((item, index) => {
            return (
              <option
                key={index}
                selected={qty == item}
                block="CartItem"
                elem="QuantityOption"
                value={item}
              >
                {item}
              </option>
            );
          })}

          {/* <option block="CartItem" elem="QuantityOption" value="2">
            2
          </option> */}
        </select>
      </div>
    );
  };
  renderColSizeQty() {
    const {
      item: { color, optionValue, qty },
    } = this.props;
    const { isArabic } = this.state;

    if (optionValue) {
      return (
        <div block="CartItem" elem="ColSizeQty" mods={{ isArabic }}>
          <div block="CartItem" elem="Color" mods={{ isArabic }}>
            <span> {__("Color:")}</span>
            {color}
          </div>
          <div block="CartItem" elem="Size" mods={{ isArabic }}>
            <span block="CartItem" elem="Pipe" mods={{ isArabic }}>
              |
            </span>
            <span> {__("Size:")} </span>
            {optionValue}
          </div>

          {this.renderQuantitySelection()}
        </div>
      );
    }

    return (
      <div block="CartItem" elem="ColSizeQty" mods={{ isArabic }}>
        <div block="CartItem" elem="Color" mods={{ isArabic }}>
          <span> {__("Color:")}</span>
          {color}
        </div>
        <div block="CartItem" elem="Size" mods={{ isArabic }}>
          <span block="CartItem" elem="Pipe" mods={{ isArabic }}>
            |
          </span>
          <span> {__("Qty:")} </span>
          {qty}
        </div>
      </div>
    );
  }

  renderContent() {
    const {
      isLikeTable,
      item: { customizable_options, bundle_options },
    } = this.props;
    const { isNotAvailble } = this.state;

    return (
      <figcaption block="CartItem" elem="Content" mods={{ isLikeTable }}>
        {this.renderBrandName()}
        {/* {this.renderProductName()} */}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderProductConfigurations()}
        {this.renderColSizeQty()}
        {isNotAvailble ? null : this.renderProductPrice()}
        {this.renderActions()}
      </figcaption>
    );
  }

  renderActions() {
    const {
      isEditing,
      isLikeTable,
      item: { qty },
      minSaleQuantity,
      maxSaleQuantity,
      handleRemoveItem,
      handleChangeQuantity,
    } = this.props;
    const { isArabic, isNotAvailble } = this.state;

    return (
      <div
        block="CartItem"
        elem="Actions"
        mods={{ isEditing, isLikeTable, isArabic }}
      >
        <button
          block="CartItem"
          id="RemoveItem"
          name="RemoveItem"
          elem="Delete"
          aria-label="Remove item from cart"
          onClick={handleRemoveItem}
        >
          <span />
        </button>
      </div>
    );
  }

  renderImage() {
    const {
      item: {
        product: { name },
        full_item_info: { url_key },
      },
      thumbnail,
      isCartPage,
    } = this.props;
    const { isArabic } = this.state;
    let customURL = `${url_key}.html`;
    return (
      <div onClick={() => this.props.history.push(customURL)}>
        <Image
          lazyLoad={true}
          src={thumbnail}
          mix={{
            block: "CartItem",
            elem: "Picture",
            mods: { isArabic, isCartPage },
          }}
          ratio="custom"
          alt={`Product ${name} thumbnail.`}
        />
        <Image
          lazyLoad={true}
          style={{ display: "none" }}
          alt={name}
          src={thumbnail}
        />
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <li block="CartItem">
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(CartItem));
