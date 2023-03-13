/* eslint-disable fp/no-let */
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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
} from "./VuePLP.config";
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [topPicksReqSent, setTopPicksReqSent] = useState(false);
  const [firstSKUCallSent, setFirstSKUCallSent] = useState(false);

  const signedIn = isSignedIn();
  const gender = useSelector((state) => state.AppState.gender);
  const prevPath = useSelector((state) => state.PLP.prevPath);
  //dispatch
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
              setPayloadQuery(RECENTLY_VIEWED_SLIDER);
            }
          })
          .catch((err) => {
            console.error("Last order error", err);
            setPayloadQuery(RECENTLY_VIEWED_SLIDER);
          });
      } else {
        setPayloadQuery(RECENTLY_VIEWED_SLIDER);
      }
    }
  };

  const getRandomSku = () => {
    let randomSkuObj = {};
    let lastOrderArray = lastOrderSku;
    if (lastOrderArray.length == 0 || !signedIn) {
      return {};
    } else if (lastOrderSku.length > 1) {
      const random = Math.floor(Math.random() * lastOrderArray.length);
      randomSkuObj.first_product = lastOrderArray[random];
      const index = lastOrderArray.indexOf(lastOrderArray[random]);
      if (index > -1) {
        lastOrderArray.splice(index, 1);
        const secondRandom = Math.floor(Math.random() * lastOrderArray.length);
        randomSkuObj.second_product = lastOrderArray[secondRandom];
      }
      return randomSkuObj;
    } else {
      randomSkuObj.first_product = lastOrderArray[0];
      return randomSkuObj;
    }
  };

  const request = async () => {
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const vueSliderType = payloadQuery ? `vue_${payloadQuery}` : `vue_${q}`;
    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;
    const query = {
      filters: [],
      num_results: 50,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    let handleRandomSKU = getRandomSku();
    const handleProductID = params?.product_id
      ? params.product_id
      : (vueSliderType == VUE_VISUALLY_SIMILAR_SLIDER ||
          vueSliderType == VUE_STYLE_IT_SLIDER) &&
        handleRandomSKU?.first_product &&
        !firstSKUCallSent
      ? handleRandomSKU?.first_product
      : (vueSliderType == VUE_VISUALLY_SIMILAR_SLIDER ||
          vueSliderType == VUE_STYLE_IT_SLIDER) &&
        handleRandomSKU?.second_product &&
        firstSKUCallSent
      ? handleRandomSKU?.second_product
      : "";
    const defaultQueryPayload = {
      userID,
      product_id: handleProductID,
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
      vueSliderType == VUE_VISUALLY_SIMILAR_SLIDER ||
      vueSliderType == VUE_STYLE_IT_SLIDER
    ) {
      if (handleProductID) {
        fetchVueData(payload)
          .then((resp) => {
            if (!resp.data || Object.entries(resp.data).length < 1) {
              if (firstSKUCallSent) {
                setPayloadQuery(RECENTLY_VIEWED_SLIDER);
              } else {
                setFirstSKUCallSent(true);
              }
            }
            setState({
              ...state,
              vueRecommendation: resp.data,
            });
          })
          .catch((err) => {
            console.error("fetchVueData error", err);
          });
      } else {
        if (vueSliderType !== VUE_RECENTLY_VIEWED_SLIDER) {
          setPayloadQuery(RECENTLY_VIEWED_SLIDER);
        }
      }
    } else {
      if (!topPicksReqSent) {
        fetchVueData(payload)
          .then((resp) => {
            if (
              vueSliderType == VUE_RECENTLY_VIEWED_SLIDER &&
              (!resp.data || Object.entries(resp.data).length <= 1)
            ) {
              setPayloadQuery(TOP_PICKS_SLIDER);
              setTopPicksReqSent(true);
            }
            setState({
              ...state,
              vueRecommendation: resp.data,
            });
          })
          .catch((err) => {
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
    if (signedIn) {
      lastOrder();
    }
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (
      (state?.vueRecommendation?.length === 0 ||
        state?.vueRecommendation == undefined) &&
      signedIn &&
      (isPageLoaded || params.product_id)
    ) {
      request();
    }
    if (state?.vueRecommendation?.length === 0 && !signedIn) {
      request();
    }
  }, [state?.vueRecommendation, lastOrderSku, payloadQuery, firstSKUCallSent]);

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
  );
};

export default VuePLP;
