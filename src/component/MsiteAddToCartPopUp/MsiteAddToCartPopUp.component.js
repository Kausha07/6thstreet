import React, { createRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";
import { isArabic } from "Util/App/App";
import PDPAddToCart from "Component/PDPAddToCart/index";
import "./MsiteAddToCartPopUp.style";

export const mapDispatchToProps = (dispatch, state) => ({
  setProductInfo: (product) =>
    PDPDispatcher.setPDPProductDetailsForWishListATC(product, dispatch),
});

const MsiteAddToCartPopUp = (props) => {
  const { productInfo } = props;
  const msitePopUpRef = createRef();
  const [isAddToCartButtonClicked, setIsAddToCartButtonClicked] =
    useState(false);
  const [selectedSizeType, setSelectedSizeType] = useState("eu");
  const [selectedSizeCode, setSelectedSizeCode] = useState("");

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);

    return () =>
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
  }, [msitePopUpRef]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (isAddToCartButtonClicked) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [isAddToCartButtonClicked]);

  const closePopupOnOutsideClick = (e) => {
    if (
      isAddToCartButtonClicked &&
      msitePopUpRef.current &&
      !msitePopUpRef.current.contains(e.target)
    ) {
      const subPopup = e.target.closest(".PDPSizeGuide-Modal");

      if (subPopup) {
        return;
      }

      setIsAddToCartButtonClicked(false);
      const html = document.getElementsByTagName("html")[0];
      html.style.overflow = "auto";
    }
  };

  const handleAddToCartClick = (productInfo) => {
    const { setProductInfo } = props;
    setProductInfo(productInfo);
    setIsAddToCartButtonClicked(true);
  };

  const setSize = (sizeType, sizeCode) => {
    setSelectedSizeType(sizeType || "eu");
    setSelectedSizeCode(sizeCode || "");
  };

  const closeAddToCartPopUp = () => {
    setIsAddToCartButtonClicked(false);
  };

  const renderMsiteAddToCartOverlay = () => {
    const { size_eu, size_uk, size_fl, size_us } = productInfo;
    const isSizeLessProduct =
      size_eu.length === 0 && size_uk.length === 0 && size_us.length === 0;

    if (isSizeLessProduct) {
      return (
        <PDPAddToCart
          simple_products={productInfo?.simple_products}
          setSize={setSize}
          popUpType="wishListPopUp"
          isSizeLessProduct={true}
          isAddToCartButtonClicked={false}
          closeAddToCartPopUp={closeAddToCartPopUp}
        />
      );
    }
    return (
      <div block="msitePopUp">
        <div block="msitePopUpOverlay">
          <div block="msitePopUpDetailsBlock" ref={msitePopUpRef}>
            {(size_eu?.length > 0 ||
              size_uk?.length > 0 ||
              size_fl?.length > 0 ||
              size_us?.length > 0) && (
              <p block="msitePopUpHeading" mods={{ isArabic: isArabic() }}>
                {__("Select Size")}
              </p>
            )}
            <PDPAddToCart
              simple_products={productInfo?.simple_products}
              setSize={setSize}
              popUpType="wishListPopUp"
              isSizeLessProduct={false}
              isAddToCartButtonClicked={true}
              closeAddToCartPopUp={closeAddToCartPopUp}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAddToCartButton = () => {
    const finalProduct = { data: productInfo };
    const { in_stock, stock_qty } = productInfo;
    return (
      <>
        <button
          onClick={() => {
            handleAddToCartClick(finalProduct);
          }}
          block={
            "msiteAddtoCartButton " +
            (in_stock === 0 || (in_stock === 1 && stock_qty === 0)
              ? "OOSActive"
              : null)
          }
          disabled={in_stock === 0 || (in_stock === 1 && stock_qty === 0)}
        >
          {in_stock === 0 || (in_stock === 1 && stock_qty === 0)
            ? __("Out of Stock")
            : __("Move to Cart")}
        </button>
        {isAddToCartButtonClicked && renderMsiteAddToCartOverlay()}
      </>
    );
  };
  return <>{renderAddToCartButton()}</>;
};

export default connect(null, mapDispatchToProps)(MsiteAddToCartPopUp);
