import PropTypes from "prop-types";
import { PureComponent } from "react";

import Field from "Component/Field";
import Image from "Component/Image";
import { ReturnItemType, ReturnResolutionType } from "Type/API";
import { v4 } from "uuid";
import StrikeThrough from "../PLPAddToCart/icons/strike-through.png";
import NotifySuccessImg from "../PDPAddToCart/icons/success-circle.png";
import { Rings } from "react-loader-spinner";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";
import { NOTIFY_EMAIL } from "../PDPAddToCart/PDPAddToCard.config";
import BrowserDatabase from "Util/BrowserDatabase";
import "./MyAccountReturnCreateItem.style";

export class MyAccountReturnCreateItem extends PureComponent {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onResolutionChange: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    reasonOptions: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    resolutions: PropTypes.arrayOf(ReturnResolutionType).isRequired,
    item: ReturnItemType.isRequired,
    displayDiscountPercentage: PropTypes.bool.isRequired,
    reasonId: PropTypes.string,
  };
  state = {
    notifyMeEmail: BrowserDatabase.getItem(NOTIFY_EMAIL) || "",
  };
  static defaultProps = {
    fixedPrice: false,
    displayDiscountPercentage: true,
  };

  renderReasons() {
    const {
      item: { item_id },
      isSelected,
      onReasonChange,
      reasonOptions,
    } = this.props;

    if (!isSelected) {
      return null;
    }

    return (
      <Field
        type="select"
        id={`${item_id}_reason`}
        name={`${item_id}_reason`}
        placeholder={__("Select a reason")}
        mix={{ block: "MyAccountReturnCreateItem", elem: "Reasons" }}
        onChange={onReasonChange}
        selectOptions={reasonOptions}
      />
    );
  }

  renderImage() {
    const {
      item: { thumbnail },
    } = this.props;

    return (
      <Image
        lazyLoad={true}
        src={thumbnail}
        mix={{ block: "MyAccountReturnCreateItem", elem: "Image" }}
      />
    );
  }

  renderField(type) {
    const {
      item: { item_id, is_returnable },
    } = this.props;
    const { onClick } = this.props;
    return (
      <Field
        id={item_id}
        name={item_id}
        value={item_id}
        mix={{ block: "MyAccountReturnCreateItem", elem: "Checkbox" }}
        type="checkbox"
        onClick={onClick}
        defaultChecked={false}
        disabled={type === "RETURN" && !is_returnable}
      />
    );
  }

  renderDetails() {
    const {
      displayDiscountPercentage,
      isExchange,
      item: {
        name,
        color,
        row_total,
        price,
        discount_percent,
        discount_amount,
        size: sizeField,
        exchangeable_qty = 0,
        qty_shipped,
      },
    } = this.props;
    const size =
      typeof sizeField === "string" ? sizeField : (sizeField || {}).value;
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
          {!!qty_shipped && !isExchange && (
            <p>
              {__("Qty: ")}
              <span>{+qty_shipped}</span>
            </p>
          )}
          {!!exchangeable_qty && isExchange && (
            <p>
              {__("Qty: ")}
              <span>{+exchangeable_qty}</span>
            </p>
          )}
          {!!size && (
            <p>
              {__("Size: ")}
              <span>{size}</span>
            </p>
          )}
        </div>
        <p block="MyAccountReturnCreateItem" elem="Price">
          <span
            block="MyAccountReturnCreateItem"
            elem="PriceRegular"
            mods={{ isDiscount: !!+discount_amount && !!+discount_percent }}
          >
            {!isExchange
              ? `${formatPrice(+row_total)}`
              : `${formatPrice(+price)}`}
          </span>
          {!!+discount_amount && !!+discount_percent && (
            <>
              {displayDiscountPercentage && (
                <span
                  block="MyAccountReturnCreateItem"
                  elem="PriceDiscountPercent"
                >
                  {`(-${+discount_percent}%)`}
                </span>
              )}
              <span block="MyAccountReturnCreateItem" elem="PriceDiscount">
                {isExchange
                  ? `${formatPrice(+price - +discount_amount)}`
                  : `${formatPrice(+row_total - +discount_amount)}`}
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  renderSizeOption(
    productStock,
    code,
    label,
    selectedStatus,
    availProductStatus
  ) {
    const {
      selectedSizeCodes,
      onAvailSizeSelect,
      item: { item_id },
      notifyMeSuccess,
      notifyMeLoading,
    } = this.props;
    const isNotAvailable =
      (availProductStatus && selectedStatus)
        ? false
        : selectedStatus
        ? selectedStatus
        : parseInt(productStock[code].quantity) === 0;
    const selectedLabelStyle = {
      fontSize: "14px",
      color: "#ffffff",
      fontWeight: 600,
      letterSpacing: 0,
      backgroundColor: "#000000",
    };
    let filteredSizeCode = Object.entries(selectedSizeCodes).filter(
      ([order_item_id, { value }]) => {
        if (order_item_id === item_id) {
          return value === code;
        }
      }
    );
    const isCurrentSizeSelected =
      filteredSizeCode.length > 0 ? filteredSizeCode[0] : false;
    const selectedStrikeThruLineStyle = {
      opacity: 0.6,
      filter: "none",
    };
    return (
      <div
        block="PLPAddToCart-SizeSelector"
        elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}
        key={v4()}
        className="SizeOptionList"
        onClick={() => {
          if (!notifyMeLoading && !notifyMeSuccess)
            onAvailSizeSelect({ target: { value: code } }, item_id);
        }}
      >
        <input
          id={code}
          key={code}
          type="radio"
          elem="SizeOption"
          name="size"
          block="PLPAddToCart"
          value={code}
          checked={isCurrentSizeSelected}
        />
        <div>
          <label
            htmlFor={code}
            style={isCurrentSizeSelected ? selectedLabelStyle : {}}
          >
            {label}
          </label>
          {isNotAvailable && (
            <Image
              lazyLoad={false}
              src={StrikeThrough}
              className="lineImg"
              style={isCurrentSizeSelected ? selectedStrikeThruLineStyle : {}}
            />
          )}
        </div>
        <div />
      </div>
    );
  }

  getSizeSelect = () => {
    const {
      products,
      item: { item_id, size = {} },
      isArabic,
      sizeObject,
      selectedAvailProduct,
      availableProducts,
      selectedSizeType,
    } = this.props;
    let availProduct = null;
    if (availableProducts.length > 0) {
      availProduct = availableProducts.filter((product) => {
        if (products[item_id]["6s_also_available"].includes(product.sku)) {
          return product;
        }
      });
    }

    let filteredProductStock =
      selectedAvailProduct[item_id] &&
      selectedAvailProduct[item_id].id !== false
        ? availProduct[0]
        : products[item_id];
    let availProductStatus =
      selectedAvailProduct[item_id] &&
      selectedAvailProduct[item_id].id !== false;
    const { simple_products: productStock } = filteredProductStock;
    if (
      sizeObject?.sizeCodes !== undefined &&
      Object.keys(productStock || []).length !== 0 &&
      filteredProductStock[`size_${size["label"].toLowerCase()}`].length !== 0
    ) {
      return (
        <div
          block="PLPAddToCart-SizeSelector-SizeContainer"
          elem="AvailableSizes"
          mods={{ isArabic }}
        >
          {sizeObject.sizeCodes.reduce((acc, code) => {
            const label = productStock[code]?.size[selectedSizeType];
            const selectedStatus = label === `${size["value"]}`;
            if (label && (availProductStatus || !selectedStatus)) {
              acc.push(
                this.renderSizeOption(
                  productStock,
                  code,
                  label,
                  selectedStatus,
                  availProductStatus
                )
              );
            }

            return acc;
          }, [])}
        </div>
      );
    }

    return <span id="notavailable">{__("OUT OF STOCK")}</span>;
  };

  renderSizeContent = () => {
    const { sizeObject } = this.props;
    return (
      <div block="PLPAddToCart" elem="SizeSelector">
        {sizeObject.sizeTypes !== undefined &&
        sizeObject.sizeTypes.length !== 0 ? (
          <>
            <div block="PDPAddToCart" elem="SizeInfoContainer">
              <h2 block="PDPAddToCart-SizeInfoContainer" elem="title">
                {__("Select a Size")}
              </h2>
            </div>
            <div block="SizeParentWrapper">
              <div block="PLPAddToCart-SizeSelector" elem="SizeContainer">
                {this.getSizeSelect()}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  renderAvailableProducts = () => {
    const {
      onAvailableProductClick,
      selectedAvailProduct,
      item: { item_id },
      availableProducts,
    } = this.props;
    return availableProducts.map((product) => {
      const { sku, thumbnail_url, color } = product;

      return (
        <li
          block="PDPAlsoAvailableProduct"
          elem={
            selectedAvailProduct[item_id] &&
            sku === selectedAvailProduct[item_id]["id"]
              ? "selectedProduct"
              : ""
          }
          id={sku}
          onClick={(event) => onAvailableProductClick(event, item_id, sku)}
        >
          <div
            block="PDPAlsoAvailableProduct-Link"
            elem="Image"
            id={sku}
            style={{
              backgroundImage: `url(${thumbnail_url})`,
            }}
          />
          <h5 block="ProductItem" elem="Title" id={sku}>
            {color}
          </h5>
        </li>
      );
    });
  };

  renderAvailableItemsSection = () => {
    const { isLoading, alsoAvailable } = this.props;

    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <div block="PDPAlsoAvailable">
            <div block="PDPAddToCart" elem="SizeInfoContainer">
              <h2 block="PDPAddToCart-SizeInfoContainer" elem="title">
                {__("Select a Color")}
              </h2>
            </div>
            <ul block="PDPAlsoAvailable" elem="List">
              {this.renderAvailableProducts()}
            </ul>
          </div>
        );
      }
    }

    return null;
  };

  onNotifyMeSendClick = () => {
    const {
      showAlertNotification,
      sendNotifyMeEmail,
      notifyMeLoading,
      item: { item_id },
    } = this.props;
    if (notifyMeLoading) {
      return;
    }
    const { notifyMeEmail } = this.state;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (notifyMeEmail.length === 0 || !emailRegex.test(notifyMeEmail)) {
      showAlertNotification(__("That looks like an invalid email address"));
      return;
    }
    sendNotifyMeEmail(notifyMeEmail, item_id);
  };

  renderOutOfStockPopUp() {
    const {
      isOutOfStock,
      notifyMeLoading,
      item: { item_id },
      customer: { email },
      guestUserEmail,
      isArabic,
    } = this.props;
    const { notifyMeEmail } = this.state;
    if (
      !isOutOfStock[item_id] ||
      (isOutOfStock[item_id] && !isOutOfStock[item_id])
    ) {
      return null;
    }

    return (
      <div block="PDPAddToCart" elem="OutOfStockContainer">
        <span block="PDPAddToCart" elem="OutOfStockHeading">
          {__("out of stock")}
        </span>
        <span block="PDPAddToCart" elem="NotifyWhenAvailable">
          {__("Notify me when it’s available")}
        </span>
        <div block="PDPAddToCart" elem="EmailSendContainer">
          <input
            block="PDPAddToCart"
            elem="EmailInput"
            placeholder={`${__("Email")}*`}
            value={notifyMeEmail}
            disabled={notifyMeLoading}
            onChange={({ target }) => {
              this.setState({ notifyMeEmail: target.value });
            }}
          />
          <span
            block="PDPAddToCart"
            elem="EmailSendBtn"
            lang={isArabic ? "ar" : "en"}
            onClick={this.onNotifyMeSendClick}
          >
            {notifyMeLoading ? __("Sending..") : __("Send")}
          </span>
        </div>
        {notifyMeLoading && (
          <div block="PDPAddToCart" elem="LoadingContainer">
            <Rings color="white" height={80} width={"100%"} />
          </div>
        )}
      </div>
    );
  }

  renderNotifyMeSuccess() {
    const { notifyMeSuccess } = this.props;
    if (!notifyMeSuccess) {
      return null;
    }

    return (
      <div block="PDPAddToCart" elem="NotifyMeSuccessContainer">
        <Image lazyLoad={true} src={NotifySuccessImg} alt="success circle" />

        <span>
          {__("We’ll let you know as soon as the product becomes available")}
        </span>
      </div>
    );
  }

  isReasonSelected = () => {
    const {
      selectedItems,
      item: { item_id },
    } = this.props;
    return selectedItems[item_id];
  };

  render() {
    const { isSelected, isExchange } = this.props;
    return (
      <div block="MyAccountReturnCreateItem">
        <div block="MyAccountReturnCreateItem" elem="Content">
          {this.renderField({
            type: "RETURN",
          })}
          {this.renderImage()}
          {this.renderDetails()}
        </div>
        {isSelected && (
          <div block="MyAccountReturnCreateItem" elem="Resolution">
            {this.renderReasons()}
          </div>
        )}
        {isExchange && this.renderOutOfStockPopUp()}
        {isExchange && this.isReasonSelected() && isSelected && (
          <>
            {this.renderSizeContent()}
            {this.renderAvailableItemsSection()}
          </>
        )}
      </div>
    );
  }
}

export default MyAccountReturnCreateItem;
