import { useState, useEffect, createRef } from "react";

import StrikeThrough from "Component/PLPAddToCart/icons/strike-through.png";
import Image from "Component/Image";
import PDPSizeGuide from "Component/PDPSizeGuide";

import { isArabic } from "Util/App";

import "./CartPageSizePopUp.style.scss";

const CartPageSizePopUp = (props) => {
  const {
    clickedProductInfo,
    sizeObject,
    insertedProductSizeStatus,
    addProductsToCartWidget,
    selectedItemSizeCode,
    selectedItemCurrentSize,
    currentActiveSize,
    showSizePopUp,
    setShowHideSizePopUp,
  } = props;

  const wrapperRef = createRef();
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [sizelabel, setLabel] = useState("");

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (showSizePopUp) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [showSizePopUp]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showSizePopUp &&
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target)
    ) {
      const subPopup = e.target.closest(".PDPSizeGuide-Modal");

      if (subPopup) {
        return;
      }
      setShowHideSizePopUp(false);
    }
  };

  const renderSizeTypeSelect = () => {
    if (sizeObject.sizeTypes !== undefined) {
      return (
        <div block="availableSizeSelectors">
          {sizeObject.sizeTypes.map((type = "") => {
            if (type) {
              if (clickedProductInfo[`size_${type}`]?.length > 0) {
                return (
                  <div
                    key={type}
                    block={`${
                      currentActiveSize === type ? "activeSize" : null
                    } CartPageSizeSelector`}
                    elem="SizeTypeOption"
                    value={type}
                    onClick={(e) => {
                      selectedItemCurrentSize(type);
                    }}
                  >
                    {type.toUpperCase()}
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      );
    }
  };

  const getSizeSelect = () => {
    if (
      sizeObject.sizeCodes !== undefined &&
      Object.keys(clickedProductInfo?.simple_products)?.length !== 0 &&
      clickedProductInfo[`size_${currentActiveSize}`]?.length !== 0
    ) {
      return (
        <div block="CartPage-SizeSelector" elem="AvailableSizes">
          {sizeObject.sizeCodes.reduce((acc, code) => {
            const label =
              clickedProductInfo?.simple_products?.[code]?.size?.[
                currentActiveSize
              ];
            const quantity =
              clickedProductInfo?.simple_products?.[code]?.quantity;
            if (label) {
              acc.push(
                renderSizeOption(
                  clickedProductInfo?.simple_products,
                  code,
                  label,
                  quantity
                )
              );
            }
            return acc;
          }, [])}
        </div>
      );
    }
  };

  const renderSizeOption = (productStock, code, label, quantity) => {
    const isNotAvailable = parseInt(productStock[code].quantity) === 0;
    const selectedLabelStyle = {
      fontSize: "14px",
      color: "#ffffff",
      fontWeight: 600,
      letterSpacing: 0,
      backgroundColor: "#000000",
    };
    const selectedStrikeThruLineStyle = {
      opacity: 0.6,
      filter: "none",
    };
    const isCurrentSizeSelected = currentActiveSize === code;
    const iscurrentsizeSelected = sizelabel === label;

    return (
      <div
        block="CartPage-SizeSelector"
        elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}
        onClick={() => {
          onSizeSelect({ target: { value: code }, label });
        }}
      >
        <input
          id={code}
          key={code}
          type="radio"
          elem="SizeOption"
          name="size"
          block="CartPage"
          value={code}
          checked={isCurrentSizeSelected}
        />
        <div>
          <label
            for={code}
            style={iscurrentsizeSelected ? selectedLabelStyle : {}}
          >
            {label}
          </label>
          {isNotAvailable && (
            <Image
              lazyLoad={false}
              src={StrikeThrough}
              className="lineImg"
              style={isCurrentSizeSelected ? selectedStrikeThruLineStyle : {}}
              alt={"strike-through"}
            />
          )}
        </div>
        <div block="leftQuantity">
          {quantity < 3 && quantity > 0 && __("Last %s left", quantity)}
        </div>
      </div>
    );
  };

  const onSizeSelect = ({ target, label }) => {
    const { value } = target;
    let outOfStockVal = isOutOfStock;
    setLabel(label);
    if (
      clickedProductInfo?.simple_products &&
      clickedProductInfo?.simple_products[value]
    ) {
      const selectedSize = clickedProductInfo?.simple_products[value];
      if (
        selectedSize["quantity"] !== undefined &&
        selectedSize["quantity"] !== null &&
        (typeof selectedSize["quantity"] === "string"
          ? parseInt(selectedSize["quantity"], 0) === 0
          : selectedSize["quantity"] === 0)
      ) {
        outOfStockVal = true;
      } else {
        outOfStockVal = false;
      }
    }
    selectedItemSizeCode(value);
    setIsOutOfStock(outOfStockVal);
    let productStock = clickedProductInfo?.simple_products || {};
    (clickedProductInfo?.stock_qty !== 0 ||
      clickedProductInfo?.highlighted_attributes === null ||
      (Object.keys(clickedProductInfo).length !== 0 &&
        clickedProductInfo.constructor !== Object)) &&
      Object.keys(productStock).length !== 0 &&
      addProductsToCartWidget(
        false,
        clickedProductInfo,
        insertedProductSizeStatus
      );
  };

  const renderSizeInfo = () => {
    if (
      sizeObject.sizeTypes !== undefined &&
      sizeObject.sizeTypes.length !== 0 &&
      sizeObject.sizeCodes.length > 1
    ) {
      return (
        <div block="cartPageSizeInfoContainer" mods={{ isArabic: isArabic() }}>
          <PDPSizeGuide product={clickedProductInfo} />
        </div>
      );
    }
    return null;
  };

  const renderSizePopUP = () => {
    return (
      <div block="sizeSelectionPopUpblock" ref={wrapperRef}>
        <div block="sizeSelectionPopUpblock" elem="innerDiv">
          <h2 block="cartPageHeading">{__("SELECT SIZE")}</h2>
          {renderSizeTypeSelect()}
          {getSizeSelect()}
          {renderSizeInfo()}
        </div>
      </div>
    );
  };

  return <div block="outerBlock">{renderSizePopUP()}</div>;
};

export default CartPageSizePopUp;
