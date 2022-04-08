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

import Field from "Component/Field";
import Image from "Component/Image";
import Loader from "Component/Loader";
import { FIXED_CURRENCIES } from "Component/Price/Price.config";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { withRouter } from "react-router";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";
import { Store } from "../Icons";
import "./CartPageItem.extended.style";
import "./CartPageItem.style";
import Price from "Component/Price";

/**
 * Cart and CartOverlay item
 * @class CartItem
 */
export class CartItem extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    item: CartItemType.isRequired,
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
        block="CartPageItem"
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
      <ul block="CartPageItem" elem="Options" mods={{ isLikeTable }}>
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
      <figure block="CartPageItem" elem="Wrapper">
        {this.renderImage()}
        {this.renderContent()}
      </figure>
    );
  }

  renderProductOptionValue = (optionValue, i, array) => {
    const { label, value } = optionValue;
    const isNextAvailable = Boolean(array[i + 1]);

    return (
      <span block="CartPageItem" elem="ItemOptionValue" key={label}>
        {label || value}
        {isNextAvailable && ", "}
      </span>
    );
  };

  renderProductOption = (option) => {
    const { label, values = [], id } = option;

    return (
      <div block="CartPageItem" elem="ItemOption" key={id}>
        <div block="CartPageItem" elem="ItemOptionLabel" key={`label-${id}`}>
          {`${label}:`}
        </div>
        <div block="CartPageItem" elem="ItemOptionValues">
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
        block="CartPageItem"
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
        product: { name },
      },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartPageItem" elem="Heading" mods={{ isArabic }}>
        {name}
      </p>
    );
  }

  renderBrandName() {
    const {
      item: { brand_name },
    } = this.props;
    const { isArabic } = this.state;

    return (
      <p block="CartPageItem" elem="Heading" mods={{ isArabic }}>
        {brand_name}
      </p>
    );
  }

  renderProductPrice() {
    const {
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
      <div block="CartPageItem" elem="Price" mods={{ isArabic }}>
        <Price price={price} renderSpecialPrice={false} cart={true} />
      </div>
    );
  }

  renderClickAndCollectStoreName() {
    const {
      item: { extension_attributes },
    } = this.props;

    const { isArabic } = this.state;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div block="CartPageItem" elem="ClickAndCollect" mods={{ isArabic }}>
          <div block="CartPageItem-ClickAndCollect" elem="icon">
            <Store />
          </div>
          <div block="CartPageItem-ClickAndCollect" elem="StoreName">
            {extension_attributes?.click_to_collect_store_name}
          </div>
        </div>
      );
    }
    return null;
  }

  renderColSizeQty() {
    const {
      item: {
        color,
        optionValue,
        qty,
        full_item_info: { size_option },
      },
      toggleCartItemQuantityPopup,
    } = this.props;
    const { isArabic } = this.state;
    return (
      <div block="CartPageItem" elem="ColSizeQty" mods={{ isArabic }}>
        {color && (
          <>
            <span block="CartItem-ColSizeQty" elem="Col">
              <span>{__("Color:")}</span>
              <span>{color}</span>
            </span>
            <span block="pipe">&nbsp;|&nbsp;</span>
          </>
        )}
        <span
          block="CartItem-ColSizeQty"
          elem="Qty"
          onClick={() => toggleCartItemQuantityPopup()}
        >
          <span>{__("Qty:")}</span>
          <span>{qty}</span>
        </span>
        {optionValue && (
          <>
            <span block="pipe">&nbsp;|&nbsp;</span>
            <span>
              <span>{__("Size: ")}</span>
              <span>{`${size_option || ""} ${optionValue}`}</span>
            </span>
          </>
        )}
      </div>
    );
  }
  renderEdd = () => {
    const { EddResponse } = this.props;
    const { isArabic } = this.state;
    let ActualEddMess = "";
    let ActualEdd = "";
    if (EddResponse) {
      Object.values(EddResponse).filter((entry) => {
        if (entry.source === "cart" && entry.featute_flag_status === 1) {
          ActualEddMess = isArabic
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

  renderContent() {
    const {
      isLikeTable,
      item: { customizable_options, bundle_options },
    } = this.props;
    const { isNotAvailble } = this.state;

    return (
      <figcaption block="CartPageItem" elem="Content" mods={{ isLikeTable }}>
        {this.renderBrandName()}
        {this.renderProductName()}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderProductConfigurations()}
        {this.renderColSizeQty()}
        {!isNotAvailble && (
          <>
            {this.renderProductPrice()}
            {this.renderClickAndCollectStoreName()}
          </>
        )}
        {this.renderActions()}
        {this.renderEdd()}
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
        block="CartPageItem"
        elem="Actions"
        mods={{ isEditing, isLikeTable, isArabic }}
      >
        <button
          block="CartPageItem"
          id="RemoveItem"
          name="RemoveItem"
          elem="Delete"
          aria-label="Remove item from cart"
          onClick={handleRemoveItem}
        >
          <span />
        </button>
        {isNotAvailble ? (
          <span block="CartPageItem" elem="NotAvailable">
            {__("Not available")}
          </span>
        ) : (
          <Field
            id="item_qty"
            name="item_qty"
            type="number"
            isControlled
            min={minSaleQuantity}
            max={maxSaleQuantity}
            mix={{ block: "CartPageItem", elem: "Qty" }}
            value={qty}
            onChange={handleChangeQuantity}
          />
        )}
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
            block: "CartPageItem",
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
      <li block="CartPageItem">
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(CartItem);
