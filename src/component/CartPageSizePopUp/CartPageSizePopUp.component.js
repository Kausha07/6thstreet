import { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";

import StrikeThrough from "Component/PLPAddToCart/icons/strike-through.png";
import Image from "Component/Image";
import PDPSizeGuide from "Component/PDPSizeGuide";

import { isArabic } from "Util/App";

import "./CartPageSizePopUp.style.scss";
import {
  getFinalExpressDeliveryKey,
  checkProductExpressEligible,
} from "Util/Common";
import { mapDispatchToProps } from "Route/BrandCMS";

export const mapStateToProps = (state) => ({
  edd_info: state.AppConfig.edd_info,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
  isExpressServiceAvailable: state.MyAccountReducer.isExpressServiceAvailable,
  currentSelectedCityArea: state.MyAccountReducer.currentSelectedCityArea,
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

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
    edd_info,
    isExpressDelivery,
    isExpressServiceAvailable,
    currentSelectedCityArea,
    isSignedIn,
  } = props;

  const wrapperRef = createRef();
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [selectedCityArea, setSelectedCityArea] = useState(false);
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

  useEffect(() => {
    if (isSignedIn) {
      setSelectedCityArea(
        currentSelectedCityArea
          ? currentSelectedCityArea
          : JSON.parse(localStorage.getItem("currentSelectedAddress"))
          ? JSON.parse(localStorage.getItem("currentSelectedAddress"))
          : BrowserDatabase.getItem("cityAreaFromSelectionPopUp")
          ? BrowserDatabase.getItem("cityAreaFromSelectionPopUp")
          : {}
      );
    } else if (!isSignedIn) {
      setSelectedCityArea(null);
    }
  }, [isSignedIn]);

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

  const checkSKUExpressEligible = (productStock, code, label) => {
    const quantity = productStock[code].quantity;

    const {
      edd_info,
      clickedProductInfo: { international_vendor },
      cross_border = 0,
      clickedProductInfo: {
        express_delivery_home = "",
        express_delivery_work = "",
        express_delivery_other = "",
      },
    } = props;

    const product = productStock[code];
    const whs_quantity = +product?.whs_quantity || 0;
    const store_quantity = +product?.store_quantity || 0;
    const mp_quantity = +product?.mp_quantity || 0;
    const express_delivery_key = getFinalExpressDeliveryKey({
      isPDP: true,
      express_delivery_home,
      express_delivery_work,
      express_delivery_other,
    });

    const isProductExpressEligible =
      checkProductExpressEligible(express_delivery_key);

    const isInternationalProduct =
      edd_info?.international_vendors?.includes(international_vendor) ||
      cross_border;

    const isExpressEligibleSKU =
      isProductExpressEligible &&
      selectedCityArea &&
      !isInternationalProduct &&
      isExpressServiceAvailable?.express_eligible &&
      isExpressDelivery &&
      quantity !== 0 &&
      (whs_quantity !== 0 || store_quantity !== 0 || mp_quantity !== 0) &&
      !(+product?.quantity <= +product?.cross_border_qty);

    return isExpressEligibleSKU;
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
    const isExpressEligibleSKU = checkSKUExpressEligible(
      productStock,
      code,
      label
    );

    return (
      <div
        block="CartPage-SizeSelector"
        elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}
        onClick={() => {
          !isNotAvailable && onSizeSelect({ target: { value: code }, label });
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
            block="sizeOptionLabel"
            mods={{
              isExpressEligibleSKU: isExpressEligibleSKU,
              isArabic: isArabic() && isExpressEligibleSKU,
            }}
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

export default connect(mapStateToProps, mapDispatchToProps)(CartPageSizePopUp);
