import PropTypes from "prop-types";
import { PureComponent } from "react";
import Field from "Component/Field";
import PDPAlsoAvailable from "Component/PDPAlsoAvailable";

import Form from "Component/Form";
import Loader from "Component/Loader";
import MyAccountReturnCreateItem from "Component/MyAccountReturnCreateItem";
import { ReturnReasonType, ReturnResolutionType } from "Type/API";
import { v4 } from "uuid";

import "./MyAccountExchangeCreate.style";

export class MyAccountExchangeCreate extends PureComponent {
  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    onResolutionChange: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    incrementId: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        item_id: PropTypes.string,
        reason_options: PropTypes.arrayOf(ReturnReasonType),
      })
    ),
    isLoading: PropTypes.bool.isRequired,
    selectedNumber: PropTypes.number.isRequired,
    handleDiscardClick: PropTypes.func.isRequired,
    resolutions: PropTypes.arrayOf(ReturnResolutionType),
  };

  static defaultProps = {
    items: [],
    incrementId: "",
    resolutions: [],
  };

  renderOrderItem = (item) => {
    const { item_id } = item;
    const { onItemClick, onResolutionChange, onReasonChange, resolutions } =
      this.props;

    if (!item.is_exchangable) {
      return false;
    }

    return (
      <li block="MyAccountExchangeCreate" elem="Item" key={item_id}>
        <MyAccountReturnCreateItem
          item={item}
          onClick={onItemClick}
          onResolutionChange={onResolutionChange}
          onReasonChange={onReasonChange}
          resolutions={resolutions}
        />
      </li>
    );
  };

  renderOrderItems() {
    const { items = [], onFormSubmit } = this.props;
    return (
      <Form id="create-exchange" onSubmitSuccess={onFormSubmit}>
        <ul>{items.map(this.renderOrderItem)}</ul>
        {this.renderActions()}
      </Form>
    );
  }

  renderResolutions() {
    const { resolutions, onResolutionChangeValue } = this.props;
    const { pathname = "" } = location;
    const isCancel = pathname.includes("/exchange-item/cancel");
    const resolutionValue = resolutions.map(({ id, label }) => ({
      id,
      label,
      value: isCancel ? id + 1 : id,
    }));
    return (
      <Field
        type="select"
        id={`exchange_resolution`}
        name={`exchange_resolution`}
        placeholder={__("Select a resolution")}
        mix={{ block: "MyAccountReturnCreateItem", elem: "Resolutions" }}
        onChange={onResolutionChangeValue}
        selectOptions={resolutionValue}
      />
    );
  }

  renderActions() {
    const { handleDiscardClick, selectedNumber, reasonId } = this.props;
    const submitText =
      selectedNumber !== 1
        ? __("Exchange %s items", selectedNumber)
        : __("Exchange %s item", selectedNumber);
    return (
      <div>
        {this.renderResolutions()}
        <div block="MyAccountExchangeCreate" elem="Actions">
          <button
            block="MyAccountExchangeCreate"
            elem="ButtonDiscard"
            type="button"
            mix={{ block: "Button" }}
            onClick={handleDiscardClick}
          >
            {__("Discard")}
          </button>
          <button
            block="MyAccountExchangeCreate"
            elem="ButtonSubmit"
            type="submit"
            mix={{ block: "Button" }}
          >
            {submitText}
          </button>
        </div>
      </div>
    );
  }

  renderLoader() {
    const { isLoading } = this.props;

    return <Loader isLoading={isLoading} />;
  }

  renderOrderNumber() {
    const { incrementId } = this.props;

    return (
      <h2 block="MyAccountExchangeCreate" elem="OrderNumber">
        {__("Order #%s", incrementId)}
      </h2>
    );
  }

  renderHeading() {
    return (
      <h2 block="MyAccountExchangeCreate" elem="Heading">
        {__("Select 1 or more items you wish to exchange.")}
      </h2>
    );
  }

  renderExchangeNotPossible() {
    return __("Exchange is not possible at the time");
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

  renderContent() {
    const { isLoading, incrementId } = this.props;
    if (isLoading) {
      return null;
    }

    if (!isLoading && !incrementId) {
      return this.renderExchangeNotPossible();
    }

    return (
      <>
        {this.renderOrderNumber()}
        {this.renderHeading()}
        {this.renderOrderItems()}
      </>
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
            <div block="PLPAddToCart-SizeSelector" elem="SizeTypeContainer">
              {this.getSizeTypeSelect()}
            </div>
            <div block="PLPAddToCart-SizeSelector" elem="SizeContainer">
              {this.getSizeSelect()}
            </div>
          </>
        ) : null}
      </div>
    );
  };

  renderAvailableItemsSection() {
    const {
      product: { sku },
      isLoading,
      alsoAvailable,
    } = this.props;

    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <PDPAlsoAvailable
            productsAvailable={alsoAvailable}
            renderMySignInPopup={() => {}}
            productSku={sku}
          />
        );
      }
    }

    return null;
  }
  render() {
    console.log("muskna------>", this.props, this);
    return (
      <div block="MyAccountExchangeCreate">
        {this.renderLoader()}
        {this.renderContent()}
        {this.renderAvailableItemsSection()}
        {this.renderSizeContent()}
      </div>
    );
  }
}

export default MyAccountExchangeCreate;
