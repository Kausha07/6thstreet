import { useState } from "react";
import { connect } from "react-redux";
import { v4 } from "uuid";

import { showNotification } from "Store/Notification/Notification.action";
import { getStore } from "Store";
import CartDispatcher from "Store/Cart/Cart.dispatcher";
import Wishlist from "Store/Wishlist/Wishlist.dispatcher";

import ProductItem from "Component/ProductItem";
import Link from "Component/Link";
import CartPageSizePopUp from "Component/CartPageSizePopUp/index";

import "./CartPageSliders.style.scss";

export const mapDispatchToProps = (dispatch) => ({
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
  addProductToCart: (
    productData,
    color,
    optionValue,
    basePrice,
    brand_name,
    thumbnail_url,
    url,
    itemPrice,
    searchQueryId
  ) =>
    CartDispatcher.addProductToCart(
      dispatch,
      productData,
      color,
      optionValue,
      basePrice,
      brand_name,
      thumbnail_url,
      url,
      itemPrice,
      searchQueryId
    ),
  removeFromWishlist: (id) => Wishlist.removeSkuFromWishlist(id, dispatch),
});

const CartPageSliders = (props) => {
  const {
    sliderProducts,
    heading,
    linkTo,
    sliderType,
    isVueData,
    addProductToCart,
    removeFromWishlist,
  } = props;
  const [showSizePopUp, setShowSizePopUp] = useState(false);
  const [clickedProductInfo, setClickedProductInfo] = useState({});
  const [availableSizeObject, setAvailableSizeObject] = useState([]);
  const [sizeObject, setSizeObject] = useState({});
  const [isdirectlyAddToCartProduct, setIsdirectlyAddToCartProduct] =
    useState(false);
  const [insertedProductSizeStatus, setInsertedProductSizeStatus] =
    useState(true);
  const [selectedSizeCode, setSelectedSizeCode] = useState("");
  const [currentActiveSize, setCurrentActiveSize] = useState("eu");
  const [selectedClickAndCollectStore, setSelectedClickAndCollectStore] =
    useState(null);

  const handleClick = (e, product) => {
    e.preventDefault();
    const {
      simple_products,
      size_eu = [],
      size_uk = [],
      size_us = [],
    } = product;

    setClickedProductInfo(product);

    if (sliderType === "LookingForThis") {
      setShowSizePopUp(false);
      setSizeObject(simple_products);
      setInsertedProductSizeStatus(false);
      addProductsToCartWidget(false, product, false);
      return;
    }
    setCurrentActiveSize("eu");

    if (
      size_uk?.length === 0 &&
      size_eu?.length === 0 &&
      size_us?.length === 0 &&
      Object.entries(simple_products)?.length > 0
    ) {
      setShowSizePopUp(!showSizePopUp);
    }
    sliderType !== "LookingForThis" && renderSizeObject(product);
  };

  const renderSizeObject = (product) => {
    const { simple_products, size_eu, size_uk, size_us } = product;
    let sizeObject = {};
    let insertedSizeStatus = true;

    if (simple_products !== undefined) {
      const filteredProductKeys = Object.keys(simple_products)
        .reduce((acc, key) => {
          const {
            size: { eu: productSize },
          } = simple_products[key];
          acc.push([size_eu.indexOf(productSize), key]);
          return acc;
        }, [])
        .sort((a, b) => {
          if (a[0] < b[0]) {
            return -1;
          }
          if (a[0] > b[0]) {
            return 1;
          }
          return 0;
        })
        .reduce((acc, item) => {
          acc.push(item[1]);
          return acc;
        }, []);

      const filteredProductSizeKeys = Object.keys(
        product.simple_products[filteredProductKeys[0]].size || {}
      );
      let sizeArray = ["uk", "eu", "us"];
      let finalSizeArray = [];

      let object = {
        sizeCodes: filteredProductKeys || [],
        sizeTypes: filteredProductSizeKeys?.length
          ? sizeArray.filter((item) => {
              product[`size_${item}`].length > 0 && finalSizeArray.push(item);
            })
          : [],
      };

      object = {
        sizeCodes: filteredProductKeys || [],
        sizeTypes: filteredProductSizeKeys?.length ? finalSizeArray : [],
      };

      if (
        filteredProductKeys?.length <= 1 &&
        filteredProductSizeKeys?.length === 0
      ) {
        insertedSizeStatus = false;
        sizeObject = object;
      }

      if (
        filteredProductKeys?.length > 1 &&
        filteredProductSizeKeys?.length === 0
      ) {
        const object = {
          sizeCodes: [filteredProductKeys[1]],
          sizeTypes: filteredProductSizeKeys,
        };
        insertedSizeStatus = false;
        sizeObject = object;
      }
      sizeObject = object;
      setSizeObject(sizeObject);
      setAvailableSizeObject(sizeObject?.sizeTypes);
      setInsertedProductSizeStatus(insertedSizeStatus);
      if (!insertedSizeStatus) {
        setShowSizePopUp(false);
        addProductsToCartWidget(false, product, insertedSizeStatus);
      } else {
        setShowSizePopUp(!showSizePopUp);
      }
    }
  };

  const selectedItemSizeCode = (val) => {
    setSelectedSizeCode(val);
  };

  const selectedItemCurrentSize = (val) => {
    setCurrentActiveSize(val);
  };

  const addProductsToCartWidget = (
    isClickAndCollect = false,
    product,
    insertedSizeStatus = true
  ) => {
    let {
      thumbnail_url,
      url = "",
      link = "",
      color,
      brand_name,
      price = {},
      size_uk = [],
      size_eu = [],
      size_us = [],
      name,
      sku: configSKU,
      objectID,
      product_type_6s,
      simple_products,
    } = product;
    const productStock = simple_products;

    if (!price[0]) {
      showNotification("error", __("Unable to add product to cart."));
      return;
    }
    const itemPrice = price[0][Object.keys(price[0])[0]]["6s_special_price"];
    const basePrice = price[0][Object.keys(price[0])[0]]["6s_base_price"];

    var qid = new URLSearchParams(window.location.search).get("qid");
    let searchQueryId;
    if (!qid) {
      searchQueryId = getStore().getState().SearchSuggestions.queryID;
    } else {
      searchQueryId = qid;
    }
    if (
      (size_uk.length !== 0 || size_eu.length !== 0 || size_us.length !== 0) &&
      selectedSizeCode !== ""
    ) {
      const { size } = productStock?.[selectedSizeCode];
      const optionId = currentActiveSize.toLocaleUpperCase();
      const optionValue = size?.[currentActiveSize];
      addProductToCart(
        {
          sku:
            sliderType === "LookingForThis"
              ? simple_products
              : selectedSizeCode,
          configSKU,
          qty: 1,
          optionId,
          optionValue,
          selectedClickAndCollectStore:
            selectedClickAndCollectStore?.value || "",
        },
        color,
        optionValue,
        basePrice,
        brand_name,
        thumbnail_url,
        (url = url !== "" ? url : link),
        itemPrice,
        searchQueryId
      ).then((response) => {
        if (response) {
          showNotification("error", __(response));
          afterAddToCart(false, configSKU);
        } else {
          afterAddToCart(true, configSKU);
        }
      });
    } else if (!insertedSizeStatus) {
      const code = Object.keys(productStock);
      addProductToCart(
        {
          sku: sliderType === "LookingForThis" ? simple_products : code[0],
          configSKU,
          qty: 1,
          optionId: "",
          optionValue: "",
        },
        color,
        null,
        basePrice,
        brand_name,
        thumbnail_url,
        (url = url !== "" ? url : link),
        itemPrice,
        searchQueryId
      ).then((response) => {
        if (response) {
          showNotification("error", __(response));
          afterAddToCart(false, configSKU);
        } else {
          afterAddToCart(true, configSKU);
        }
      });
    }
  };

  const afterAddToCart = (isAdded = "true", configSKU) => {
    const timeout = 1250;
    setSelectedSizeCode("");
    if (isAdded) {
      closePopUp(false);
      if (sliderType === "wishlist") {
        const wishListItem = sliderProducts
          .slice(0, 5)
          .find(({ product: { sku } }) => sku === configSKU);
        const { wishlist_item_id } = wishListItem;
        if (wishlist_item_id) {
          removeFromWishlist(wishlist_item_id);
        }
      }
    }
  };

  const renderSlider = () => {
    const slicedSliderProducts = sliderProducts?.slice(0, 25);
    if (slicedSliderProducts?.length > 0) {
      return (
        <div block="cartSlider" id={sliderType}>
          <div block="cartHeader">
            <h2 block="cartHeading">{heading}</h2>
          </div>
          <div block="cartPageSlider">
            <ul block="spckItems">
              {slicedSliderProducts?.map((item, i) => {
                const data = sliderType === "wishlist" ? item.product : item;
                const { in_stock, stock_qty } = data;

                return (
                  <div block="spckItem" key={i}>
                    <ProductItem
                      position={1}
                      product={data}
                      key={v4()}
                      page="cart"
                      pageType="cartSlider"
                      isVueData={isVueData}
                    />
                    <button
                      block={
                        "cartButton " +
                        (in_stock === 0 || (in_stock === 1 && stock_qty === 0)
                          ? "OOSActive"
                          : null)
                      }
                      onClick={(e) => {
                        handleClick(e, data);
                      }}
                      disabled={
                        in_stock === 0 || (in_stock === 1 && stock_qty === 0)
                          ? true
                          : false
                      }
                    >
                      {in_stock === 0 || (in_stock === 1 && stock_qty === 0)
                        ? __("Out of stock")
                        : __("Move to cart")}
                    </button>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const closePopUp = (val) => {
    setShowSizePopUp(val);
  };
  const setdirectlyAddToCartProduct = (val) => {
    setIsdirectlyAddToCartProduct(val);
  };

  const setShowHideSizePopUp = (val) => {
    setShowSizePopUp(val);
  };
  return (
    <>
      {renderSlider()}
      {showSizePopUp && (
        <CartPageSizePopUp
          clickedProductInfo={clickedProductInfo}
          sizeObject={sizeObject}
          insertedProductSizeStatus={insertedProductSizeStatus}
          availableSizeObject={availableSizeObject}
          isdirectlyAddToCartProduct={isdirectlyAddToCartProduct}
          closePopUp={closePopUp}
          setdirectlyAddToCartProduct={setdirectlyAddToCartProduct}
          sliderType={sliderType}
          addProductsToCartWidget={addProductsToCartWidget}
          selectedItemSizeCode={selectedItemSizeCode}
          selectedItemCurrentSize={selectedItemCurrentSize}
          currentActiveSize={currentActiveSize}
          showSizePopUp={showSizePopUp}
          setShowHideSizePopUp={setShowHideSizePopUp}
        />
      )}
    </>
  );
};

export default connect(null, mapDispatchToProps)(CartPageSliders);
