/* eslint-disable fp/no-let */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import MyAccountOverlay from "Component/MyAccountOverlay";
import "./VuePLP.style";
import "../PLP/PLP.style";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import VueQuery from "../../query/Vue.query";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUIDToken } from "Util/Auth";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import { getLastOrder } from "Util/API/endpoint/Checkout/Checkout.endpoint";
import ProductItem from "Component/ProductItem";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { VUE_PAGE_VIEW } from "Util/Event";
import { getUUID } from "Util/Auth";
import { setPrevPath } from "Store/PLP/PLP.action";
import { isSignedIn } from "Util/Auth";
import { MOBILE_AUTH_TOKEN } from "Util/Auth";
import {
  TOP_PICKS_SLIDER,
  RECENTLY_VIEWED_SLIDER,
  STYLE_IT_SLIDER,
  VISUALLY_SIMILAR_SLIDER,
  VUE_VISUALLY_SIMILAR_SLIDER,
  VUE_STYLE_IT_SLIDER,
  VUE_RECENTLY_VIEWED_SLIDER,
  VUE_COMPACT_STYLE_IT_SLIDER,
} from "./VuePLP.config";
import Loader from "Component/Loader";

export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

const VuePLP = (props) => {
  const stateObj = {
    vueRecommendation: props?.location?.state?.vueProducts || [],
    showPopup: false,
  };

  const [state, setState] = useState(stateObj);
  const [lastOrderSku, setLastOrderSku] = useState([]);
  const [payloadQuery, setPayloadQuery] = useState("");
  const [topPicksReqSent, setTopPicksReqSent] = useState(false);
  const [recentFirstProduct, setRecentFirstProduct] = useState("");
  const [recentSecondProduct, setRecentSecondProduct] = useState("");
  const [recentlyViewedCallSent, setRecentlyViewCallSent] = useState(false);
  const [firstOrderCall, setFirstOrderCall] = useState(false);
  const [secondOrderCall, setSecondOrderCall] = useState(false);
  const [firstRecentCall, setFirstRecentCall] = useState(false);
  const [noLastOrderSku, setNoLastOrderSku] = useState(false);
  const [noRecentlyViewed, setNoRecentlyViewed] = useState(false);
  const [requestNumber, setRequestNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [widgetIDFromViewAllBtn, setWidgetIDOnViewAllBtn] = useState(props?.location?.state?.widgetIDOnViewAllBtn || "")

  const signedIn = isSignedIn();
  const gender = useSelector((state) => state.AppState.gender);
  const prevPath = useSelector((state) => state.PLP.prevPath);
  const dispatch = useDispatch();
  const getRequestOptions = () => {
    let params;
    if (location.search && location.search.startsWith("?q")) {
      const { params: parsedParams } = WebUrlParser.parsePLP(location.href);
      params = parsedParams;
    } else {
      const { params: parsedParams } = WebUrlParser.parsePLPWithoutQuery(
        location.href
      );
      params = parsedParams;
    }
    return params;
  };
  const { q = {} } = getRequestOptions();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const showMyAccountPopup = () => {
    setState({ ...state, showPopup: true });
  };

  const closePopup = () => {
    setState({ ...state, showPopup: false });
  };

  const onSignIn = () => {
    closePopup();
  };

  const lastOrder = () => {
    let userToken = BrowserDatabase.getItem(MOBILE_AUTH_TOKEN) || "";
    if (
      params &&
      (params.q == STYLE_IT_SLIDER || params.q == VISUALLY_SIMILAR_SLIDER) &&
      signedIn &&
      !params.product_id
    ) {
      if (userToken) {
        const orderKey = {
          "Content-Type": "application/json",
          "x-api-token": userToken,
        };
        getLastOrder(orderKey)
          .then((resp) => {
            if (resp.items && Object.entries(resp.items).length) {
              let productSKU = [];
              resp.items.forEach((item) => {
                productSKU.push(item.config_sku);
              });
              setLastOrderSku(productSKU);
            } else {
              setNoLastOrderSku(true);
              if (noRecentlyViewed) {
                setPayloadQuery(TOP_PICKS_SLIDER);
              }
            }
          })
          .catch((err) => {
            setNoLastOrderSku(true);
            if (noRecentlyViewed) {
              setPayloadQuery(TOP_PICKS_SLIDER);
            }
            console.error("Last order error", err);
          });
      } else {
        setNoLastOrderSku(true);
        if (noRecentlyViewed) {
          setPayloadQuery(TOP_PICKS_SLIDER);
        }
      }
    } else {
      setNoLastOrderSku(true);
      if (noRecentlyViewed) {
        setPayloadQuery(TOP_PICKS_SLIDER);
      }
    }
  };
  const getRecentlyViewedSku = () => {
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const vueSliderType = VUE_RECENTLY_VIEWED_SLIDER;
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 50,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    const defaultQueryPayload = {
      userID,
      product_id: "",
    };
    const payload = VueQuery.buildQuery(
      vueSliderType,
      query,
      defaultQueryPayload
    );
    let recentProductsArr = [];
    fetchVueData(payload)
      .then((resp) => {
        if (resp?.data && resp.data?.length > 0) {
          resp?.data.forEach((product) => {
            recentProductsArr.push(product?.sku);
          });
          if (recentProductsArr && recentProductsArr.length > 1) {
            if (recentFirstProduct) {
              return;
            } else {
              const random = Math.floor(
                Math.random() * recentProductsArr.length
              );
              const setFirstProd = recentProductsArr[random];
              setRecentFirstProduct(setFirstProd);
              const index = recentProductsArr.indexOf(
                recentProductsArr[random]
              );
              if (index > -1) {
                recentProductsArr.splice(index, 1);
              }
            }
            if (recentSecondProduct) {
              return;
            } else {
              const secondRandom = Math.floor(
                Math.random() * recentProductsArr.length
              );
              const setSecondProd = recentProductsArr[secondRandom];
              setRecentSecondProduct(setSecondProd);
            }
          }
        } else {
          setIsLoading(true);
          setFirstRecentCall(true);
          setNoRecentlyViewed(true);
          if (noLastOrderSku || !signedIn) {
            setPayloadQuery(TOP_PICKS_SLIDER);
          }
        }
      })
      .catch((err) => {
        if (noLastOrderSku || !signedIn) {
          setPayloadQuery(TOP_PICKS_SLIDER);
        }
        setIsLoading(false);
        console.error("fetchVueData error", err);
      });
    setRecentlyViewCallSent(true);
  };
  let randomSkuObj = { first_product: "", second_product: "" };
  const getRandomSku = () => {
    let lastOrderArray = lastOrderSku;
    if ((lastOrderArray && lastOrderArray.length == 0) || !signedIn) {
      return;
    } else if (lastOrderArray && lastOrderArray.length > 1) {
      if (randomSkuObj.first_product.length) {
        return;
      } else {
        const random = Math.floor(Math.random() * lastOrderArray.length);
        randomSkuObj.first_product = lastOrderArray[random];
        const index = lastOrderArray.indexOf(lastOrderArray[random]);
        if (index > -1) {
          lastOrderArray.splice(index, 1);
        }
      }
      if (randomSkuObj.second_product.length) {
        return;
      } else {
        const secondRandom = Math.floor(Math.random() * lastOrderArray.length);
        randomSkuObj.second_product = lastOrderArray[secondRandom] || "";
      }
      return randomSkuObj;
    } else {
      randomSkuObj.first_product = lastOrderArray[0];
      return randomSkuObj;
    }
  };

  const request = async () => {
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const vueSliderType = widgetIDFromViewAllBtn ? widgetIDFromViewAllBtn : (payloadQuery ? `vue_${payloadQuery}` : `vue_${q}`);
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 50,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    const handleRandomSKU = getRandomSku();
    const defaultQueryPayload = {
      userID,
      product_id: params?.product_id || "",
    };
    if (vueSliderType !== VUE_VISUALLY_SIMILAR_SLIDER) {
      defaultQueryPayload.gender = gender;
    }
    const payload = VueQuery.buildQuery(
      vueSliderType,
      query,
      defaultQueryPayload
    );

    if (
      (vueSliderType == VUE_VISUALLY_SIMILAR_SLIDER && !params.product_id) ||
      (vueSliderType == VUE_STYLE_IT_SLIDER && !params.product_id)
    ) {
      if (noLastOrderSku && noRecentlyViewed) {
        setPayloadQuery(TOP_PICKS_SLIDER);
      }
      const handleRandomProd = () => {
        if (!firstOrderCall && handleRandomSKU?.first_product) {
          return handleRandomSKU?.first_product;
        } else if (
          firstOrderCall &&
          handleRandomSKU?.second_product &&
          !secondOrderCall
        ) {
          return handleRandomSKU?.second_product;
        } else if (
          ((firstOrderCall &&
            (secondOrderCall || !handleRandomSKU?.second_product)) ||
            noLastOrderSku) &&
          !firstRecentCall &&
          recentFirstProduct
        ) {
          return recentFirstProduct;
        } else if (
          ((firstOrderCall &&
            (secondOrderCall || !handleRandomSKU?.second_product)) ||
            noLastOrderSku) &&
          firstRecentCall &&
          recentSecondProduct
        ) {
          return recentSecondProduct;
        } else {
          return "";
        }
      };
      const handleRandomProduct = handleRandomProd();
      const dynamicQueryPayload = {
        userID,
        product_id: handleRandomProduct,
      };
      const dynamicPayload = VueQuery.buildQuery(
        vueSliderType,
        query,
        dynamicQueryPayload
      );
      if (requestNumber > 4) {
        setPayloadQuery(TOP_PICKS_SLIDER);
        return;
      }
      if (handleRandomProduct) {
        setRequestNumber(requestNumber + 1);
        setIsLoading(true);
        fetchVueData(dynamicPayload)
          .then((resp) => {
            if (!resp.data) {
              if (
                !firstOrderCall &&
                !secondOrderCall &&
                !firstRecentCall &&
                signedIn
              ) {
                setFirstOrderCall(true);
              } else if (
                firstOrderCall &&
                !secondOrderCall &&
                !firstRecentCall &&
                signedIn
              ) {
                if (noRecentlyViewed) {
                  setPayloadQuery(TOP_PICKS_SLIDER);
                } else {
                  setSecondOrderCall(true);
                }
              } else if (
                firstOrderCall &&
                secondOrderCall &&
                !firstRecentCall
              ) {
                if (noRecentlyViewed) {
                  setPayloadQuery(TOP_PICKS_SLIDER);
                } else {
                  setFirstRecentCall(true);
                }
              } else if (firstOrderCall && secondOrderCall && firstRecentCall) {
                setPayloadQuery(TOP_PICKS_SLIDER);
              } else {
                setPayloadQuery(TOP_PICKS_SLIDER);
              }
            } else {
              setIsLoading(false);
              setState({
                ...state,
                vueRecommendation: resp.data,
              });
            }
          })
          .catch((err) => {
            setPayloadQuery(TOP_PICKS_SLIDER);
            setIsLoading(false);
            console.error("fetchVueData error", err);
          });
      }
    } else {
      if (!topPicksReqSent) {
        setIsLoading(true);
        fetchVueData(payload)
          .then((resp) => {
            if (!resp.data || resp.data.length == 0) {
              setPayloadQuery(TOP_PICKS_SLIDER);
              setIsLoading(true);
            } else {
              setIsLoading(false);
              setState({
                ...state,
                vueRecommendation: resp.data,
              });
            }
            setTopPicksReqSent(true);
          })
          .catch((err) => {
            setIsLoading(false);
            console.error("fetchVueData error", err);
          });
      }
    }
  };

  useEffect(() => {
    updateBreadcrumbs();
    dispatch(setPrevPath(prevPath));
    const locale = VueIntegrationQueries.getLocaleFromUrl();
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: VUE_PAGE_VIEW,
      params: {
        event: VUE_PAGE_VIEW,
        pageType: "vue_plp",
        currency: VueIntegrationQueries.getCurrencyCodeFromLocale(locale),
        clicked: Date.now(),
        uuid: getUUID(),
        referrer: prevPath ? prevPath : null,
        url: window.location.href,
      },
    });
    if (!signedIn) {
      setFirstOrderCall(true);
      setSecondOrderCall(true);
      setNoLastOrderSku(true);
    }
    if (
      signedIn &&
      (params.q == STYLE_IT_SLIDER || params.q == VISUALLY_SIMILAR_SLIDER) &&
      !params.product_id
    ) {
      lastOrder();
    }
    if (
      (params.q == STYLE_IT_SLIDER || params.q == VISUALLY_SIMILAR_SLIDER) &&
      !params.product_id &&
      !recentlyViewedCallSent
    ) {
      getRecentlyViewedSku();
    }
  }, []);

  useEffect(() => {
    if (
      state?.vueRecommendation?.length === 0 ||
      state?.vueRecommendation?.length === undefined
    ) {
      request();
    }
  }, [
    state?.vueRecommendation,
    lastOrderSku,
    firstOrderCall,
    secondOrderCall,
    firstRecentCall,
    payloadQuery,
    noRecentlyViewed,
    noLastOrderSku,
  ]);

  useEffect(() => {
    if (
      (state?.vueRecommendation?.length === 0 ||
        state?.vueRecommendation?.length === undefined) &&
      noLastOrderSku
    ) {
      request();
    }
  }, [recentFirstProduct]);

  useEffect(() => {
    if (widgetIDFromViewAllBtn) {
      request();
    }
  }, [widgetIDFromViewAllBtn]);

  const fetchBreadCrumbsName = (q) => {
    switch (q) {
      case STYLE_IT_SLIDER:
        return __("Style It With");
      case VISUALLY_SIMILAR_SLIDER:
        return __("You May Also Like");
      case RECENTLY_VIEWED_SLIDER:
        return __("Recently Viewed");
      case TOP_PICKS_SLIDER:
        return __("You May Like");
      case VUE_COMPACT_STYLE_IT_SLIDER:
        return __("Looking for this?");
    }
  };

  const updateBreadcrumbs = () => {
    let breadCrumbName = q ? fetchBreadCrumbsName(q) : "Available products";
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update([{ name: breadCrumbName }], dispatch)
    );
  };

  const renderProduct = (item, index, qid) => {
    const { sku } = item;
    return (
      <ProductItem
        position={index}
        product={item}
        renderMySignInPopup={showMyAccountPopup}
        key={sku}
        page="vuePlp"
        pageType="vuePlp"
        qid={qid}
        isVueData={true}
      />
    );
  };

  const renderProducts = () => {
    const { vueRecommendation } = state;
    var qid = null;
    if (new URLSearchParams(window.location.search).get("qid")) {
      qid = new URLSearchParams(window.location.search).get("qid");
    } else {
      qid = localStorage.getItem("queryID");
    }
    return vueRecommendation.map((i, index) =>
      renderProduct(i, index + 1, qid)
    );
  };

  const renderPage = () => {
    return (
      <div block="PLPPage">
        <ul block="ProductItems">{renderProducts()}</ul>
      </div>
    );
  };

  return (
    <>
      <div>
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      </div>
      <Loader isLoading={isLoading} />
      <div block="UrlRewrites" id="UrlRewrites">
        <main
          block={"PLP"}
          mix={{ block: "VuePLP", elem: "VuePLPContainer" }}
          id="plp-main-scroll-id"
        >
          <ContentWrapper label={__("Product List Page")}>
            {state.showPopup && (
              <MyAccountOverlay
                isVuePLP={true}
                closePopup={closePopup}
                onSignIn={onSignIn}
                isPopup
              />
            )}
            <div>
              <div block="Products" elem="Wrapper">
                <div block="PLPPagesContainer">
                  <div block="PLPPages Products-Lists" id="Products-Lists">
                    {state.vueRecommendation ? renderPage() : null}
                  </div>
                </div>
              </div>
            </div>
          </ContentWrapper>
        </main>
      </div>
    </>
  );
};

export default VuePLP;
