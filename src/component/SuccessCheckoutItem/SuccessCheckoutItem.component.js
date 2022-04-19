/* eslint-disable react/jsx-one-expression-per-line */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Store } from "../Icons";
import Price from "Component/Price";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddDate } from "Util/Date/index";

import Image from "Component/Image";
import Loader from "Component/Loader";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";

import "./SuccessCheckoutItem.style";
import "./SuccessCheckoutItem.extended.style";

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
  EddResponse: state.MyAccountReducer.EddResponse,
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

    let price = [
      {
        [currency_code]: {
          "6s_base_price": basePrice,
          "6s_special_price": row_total,
          default: row_total,
          default_formated: `${currency_code} ${row_total}`,
        },
      },
    ];

    return (
      <div block="SuccessCheckoutItem" elem="Price" mods={{ isArabic }}>
        <Price price={price} renderSpecialPrice={false} cart={true} />
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

  renderContent() {
    const {
      isLikeTable,
      item: { customizable_options, bundle_options },
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
        {this.renderEdd()}
      </figcaption>
    );
  }
  renderEdd = () => {
    const { EddResponse } = this.props;
    const { isArabic } = this.state;
    let ActualEddMess = "";
    let ActualEdd = "";
    if (EddResponse) {
      if (isObject(EddResponse)) {
        Object.values(EddResponse).filter((entry) => {
          if (entry.source === "thankyou" && entry.featute_flag_status === 1) {
            ActualEddMess = isArabic
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
        ActualEddMess = `Delivery by ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
        ActualEdd = defaultEddDateString;
      }
    }

    if (!ActualEddMess) {
      return null;
    }
    return (
      <div block="AreaText">
        <span>{ActualEddMess}</span>
      </div>
    );
  };
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
          lazyLoad={true}
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
    const { isLoading } = this.props;

    return (
      <li block="SuccessCheckoutItem">
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(SuccessCheckoutItem));
