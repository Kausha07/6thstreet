/* eslint-disable react/jsx-one-expression-per-line */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Store } from "../Icons";

import Image from "Component/Image";
import Loader from "Component/Loader";
import {
  getFinalPrice,
  DISPLAY_DISCOUNT_PERCENTAGE,
} from "Component/Price/Price.config";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";

import "./SuccessCheckoutItem.style";
import "./SuccessCheckoutItem.extended.style";

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
});

export class SuccessCheckoutItem extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    item: CartItemType.isRequired,
    country: PropTypes.string.isRequired,
    currency_code: PropTypes.string.isRequired,
    isLikeTable: PropTypes.bool,
    history: PropTypes.object.isRequired,
    thumbnail: PropTypes.string.isRequired,
  };

  state = {
    isArabic: isArabic(),
  };

  static defaultProps = {
    isLikeTable: false,
  };

  state = {
    isArabic: isArabic(),
  };

  routeToProduct = () => {
    const {
      history,
      item: {
        product: { url },
      },
    } = this.props;

    history.push(url.split(".com")[1]);
  };

  renderWrapper() {
    return (
      <button
        onClick={this.routeToProduct}
        block="SuccessCheckoutItem"
        elem="Link"
      >
        <figure block="SuccessCheckoutItem" elem="Wrapper">
          {this.renderImage()}
          {this.renderContent()}
        </figure>
      </button>
    );
  }

  renderProductOptionValue = (optionValue, i, array) => {
    const { label, value } = optionValue;
    const isNextAvailable = Boolean(array[i + 1]);

    return (
      <span block="SuccessCheckoutItem" elem="ItemOptionValue" key={label}>
        {label || value}
        {isNextAvailable && ", "}
      </span>
    );
  };

  renderProductOption = (option = {}) => {
    const { label, values = [], id } = option;

    return (
      <div block="SuccessCheckoutItem" elem="ItemOption" key={id}>
        <div
          block="SuccessCheckoutItem"
          elem="ItemOptionLabel"
          key={`label-${id}`}
        >
          {`${label}:`}
        </div>
        <div block="SuccessCheckoutItem" elem="ItemOptionValues">
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
      <div
        block="SuccessCheckoutItem"
        elem="ItemOptionsWrapper"
        mods={{ isLikeTable }}
      >
        {itemOptions.map(this.renderProductOption)}
      </div>
    );
  }

  renderProductName() {
    const {
      item: {
        full_item_info: { brand_name, name },
      },
    } = this.props;
    const { isArabic } = this.state;
    return (
      <>
        <p block="SuccessCheckoutItem" elem="Heading" mods={{ isArabic }}>
          {brand_name}
        </p>
        <div block="SuccessCheckoutItem" elem="Details" mods={{ isArabic }}>
          {name}
        </div>
      </>
    );
  }

  renderProductPrice() {
    const {
      country,
      currency_code,
      item: { row_total, basePrice },
    } = this.props;
    const { isArabic } = this.state;

    const rowPrice = getFinalPrice(row_total, currency_code);
    let discountPercentage = Math.round(100 * (1 - row_total / basePrice));
    const withoutDiscount = (
      <>
        {`${currency_code} `}
        <span>{`${rowPrice} `}</span>
      </>
    );
    const finalBasePrice = getFinalPrice(basePrice, currency_code);

    const renderDiscountPercentage = () => {
      if (!DISPLAY_DISCOUNT_PERCENTAGE[country]) {
        return null;
      }

      return isArabic ? (
        <span block="SuccessCheckoutItem" elem="DiscountPercentage">
          {discountPercentage}
          %-
        </span>
      ) : (
        <span block="SuccessCheckoutItem" elem="DiscountPercentage">
          -{discountPercentage}%<span> </span>
        </span>
      );
    };

    const withDiscount = (
      <div block="SuccessCheckoutItem" elem="DiscountPrice">
        <div>
          {currency_code} {`${finalBasePrice}`}
        </div>
        {renderDiscountPercentage()}
        <span
          block="SuccessCheckoutItem"
          elem="WithoutDiscount"
          mods={{ isArabic }}
        >
          <span>{withoutDiscount}</span>
        </span>
      </div>
    );

    return (
      <div block="SuccessCheckoutItem" elem="Price" mods={{ isArabic }}>
        {basePrice === row_total || !basePrice ? withoutDiscount : withDiscount}
      </div>
    );
  }

  renderColSizeQty() {
    const {
      item: { color, optionValue, qty },
    } = this.props;
    const { isArabic } = this.state;

    if (optionValue) {
      return (
        <div block="SuccessCheckoutItem" elem="ColSizeQty" mods={{ isArabic }}>
          <span>
            {" "}
            {__("Color: ")} {color}
          </span>

          <span>
            | {__("Size:")} {optionValue}
          </span>

          <span>
            | {__("Qty: ")} {qty}
          </span>
        </div>
      );
    }

    return (
      <div block="SuccessCheckoutItem" elem="ColSizeQty">
        {color ? (
          <span>
            {" "}
            {__("Color: ")} {color}
          </span>
        ) : null}

        <span>
          {color ? "|" : null} {__("Qty: ")}{" "}
        </span>
        {qty}
      </div>
    );
  }

  renderClickAndCollectStoreName(extension_attributes) {
    const { isArabic } = this.state;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div
          block="SuccessCheckoutItem"
          elem="ClickAndCollect"
          mods={{ isArabic }}
        >
          <div block="SuccessCheckoutItem-ClickAndCollect" elem="icon">
            <Store />
          </div>
          <div block="SuccessCheckoutItem-ClickAndCollect" elem="StoreName">
            {extension_attributes?.click_to_collect_store_name}
          </div>
        </div>
      );
    }
    return null;
  }

  renderContent() {
    const {
      isLikeTable,
      item: { customizable_options, bundle_options, extension_attributes },
    } = this.props;

    return (
      <figcaption
        block="SuccessCheckoutItem"
        elem="Content"
        mods={{
          isLikeTable,
        }}
      >
        {this.renderProductName()}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderColSizeQty()}
        {this.renderProductPrice()}
        {this.renderClickAndCollectStoreName(extension_attributes)}
      </figcaption>
    );
  }

  renderImage() {
    const {
      item: {
        product: { name },
      },
      thumbnail,
    } = this.props;
    const { isArabic } = this.state;

    return (
      <>
        <Image
          src={thumbnail}
          mix={{
            block: "SuccessCheckoutItem",
            elem: "Picture",
            mods: { isArabic },
          }}
          ratio="custom"
          alt={`Product ${name} thumbnail.`}
        />
        <img style={{ display: "none" }} alt={name} src={thumbnail} />
      </>
    );
  }

  render() {
    const {
      isLoading,
      item: { extension_attributes },
    } = this.props;

    return (
      <li
        block="SuccessCheckoutItem"
        mods={{
          ClickNCollect: extension_attributes?true:false,
        }}
      >
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(SuccessCheckoutItem));
