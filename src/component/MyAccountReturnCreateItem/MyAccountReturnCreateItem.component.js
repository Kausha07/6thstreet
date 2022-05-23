import PropTypes from "prop-types";
import { PureComponent } from "react";

import Field from "Component/Field";
import Image from "Component/Image";
import { ReturnItemType, ReturnResolutionType } from "Type/API";
import { v4 } from "uuid";

import { formatPrice } from "../../../packages/algolia-sdk/app/utils/filters";

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
      item: {
        name,
        color,
        row_total,
        discount_percent,
        discount_amount,
        size: sizeField,
        qty_shipped,
        product_options: {
          info_buyRequest: { qty },
        },
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
          {!!qty_shipped && (
            <p>
              {__("Qty: ")}
              <span>{+qty_shipped}</span>
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
            {`${formatPrice(+row_total)}`}
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
                {`${formatPrice(+row_total - +discount_amount)}`}
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  getSizeTypeSelect() {
    const {
      selectedSizeType,
      onSizeTypeSelect,
      sizeObject = {},
      isArabic,
      isOutOfStock,
      product,
    } = this.props;
    if (isOutOfStock) {
      return null;
    }

    if (sizeObject.sizeTypes !== undefined) {
      return (
        <div block="PLPAddToCart" elem="SizeTypeSelect" mods={{ isArabic }}>
          <select
            key="SizeTypeSelect"
            block="PLPAddToCart"
            elem="SizeTypeSelectElement"
            value={selectedSizeType}
            onChange={onSizeTypeSelect}
          >
            {sizeObject.sizeTypes.map((type = "") => {
              if (product[`size_${type}`].length > 0) {
                return (
                  <option
                    key={type}
                    block="PLPAddToCart"
                    elem="SizeTypeOption"
                    value={type}
                  >
                    {type.toUpperCase()}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
      );
    }

    return null;
  }

  renderSizeOption(productStock, code, label) {
    const { selectedSizeCode, onSizeSelect } = this.props;
    const isNotAvailable = parseInt(productStock[code].quantity) === 0;
    const selectedLabelStyle = {
      fontSize: "14px",
      color: "#ffffff",
      fontWeight: 600,
      letterSpacing: 0,
      backgroundColor: "#000000",
    };
    const isCurrentSizeSelected = selectedSizeCode === code;
    if (isNotAvailable) {
      return null;
    }
    return (
      <div
        block="PLPAddToCart-SizeSelector"
        elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}
        key={v4()}
        className="SizeOptionList"
        onClick={() => {
          onSizeSelect({ target: { value: code } });
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
          {/* {isNotAvailable && (
                <Image
                  lazyLoad={false}
                  src={StrikeThrough}
                  className="lineImg"
                  style={isCurrentSizeSelected ? selectedStrikeThruLineStyle : {}}
                />
              )} */}
        </div>
        <div />
      </div>
    );
  }

  getSizeSelect = () => {
    const {
      product: { simple_products: productStock },
      product,
      isArabic,
      sizeObject,
      selectedSizeType,
    } = this.props;
    if (
      sizeObject?.sizeCodes !== undefined &&
      Object.keys(productStock || []).length !== 0 &&
      product[`size_${selectedSizeType}`].length !== 0
    ) {
      return (
        <div
          block="PLPAddToCart-SizeSelector-SizeContainer"
          elem="AvailableSizes"
          mods={{ isArabic }}
        >
          {sizeObject.sizeCodes.reduce((acc, code) => {
            const label = productStock[code].size[selectedSizeType];

            if (label) {
              acc.push(this.renderSizeOption(productStock, code, label));
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
              <div block="PLPAddToCart-SizeSelector" elem="SizeTypeContainer">
                {this.getSizeTypeSelect()}
              </div>
              <div block="PLPAddToCart-SizeSelector" elem="SizeContainer">
                {this.getSizeSelect()}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  renderAvailableImage = () => {
    console.log("muskan--->",this.props);

    const {
      product: { thumbnail_url },
    } = this.props;
    return (
      <div
        block="PDPAlsoAvailableProduct-Link"
        elem="Image"
        style={{
          backgroundImage: `url(${thumbnail_url})`,
        }}
      />
    );
  }

  renderColor = ()=> {
    const {
      product: { color },
    } = this.props;

    return (
      <h5 block="ProductItem" elem="Title">
        {color}
      </h5>
    );
  }

  
  renderAvailableProducts = () => {
    return (
      <li block="PDPAlsoAvailableProduct">
        {this.renderAvailableImage()}
        {this.renderColor()}
      </li>
    );
  };

  renderAvailableItemsSection = () => {
    const {
      product: { sku },
      isLoading,
      alsoAvailable,
    } = this.props;

    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <div block="PDPAlsoAvailable">
            <ul block="PDPAlsoAvailable" elem="List">
              {this.renderAvailableProducts()}
            </ul>
          </div>
        );
      }
    }

    return null;
  }

  isReasonSelected = () => {
    const { reasonId, reasonOptions } = this.props;
    let finalReason = "";
    reasonOptions.filter((reason) => {
      if (reason.id === reasonId) {
        finalReason = reason.label;
      }
    });
    return finalReason;
  };

  render() {
    const { isSelected } = this.props;
    console.log("muskan result->", this.props, this.isReasonSelected());
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
        {this.isReasonSelected() === "Wrong Color" &&
          this.renderAvailableItemsSection()}
        {(this.isReasonSelected() === "Wrong Size" ||
          this.isReasonSelected() === "Unfit") &&
          this.renderSizeContent()}
      </div>
    );
  }
}

export default MyAccountReturnCreateItem;
