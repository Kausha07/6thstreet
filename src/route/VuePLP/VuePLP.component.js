/* eslint-disable fp/no-let */
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import MyAccountOverlay from "Component/MyAccountOverlay";
import "./VuePLP.style";
import "../PLP/PLP.style";
import Loader from "Component/Loader";
import { capitalizeFirstLetters } from "../../../packages/algolia-sdk/app/utils";
import { VUE_PLP_TEXT } from "../../util/Common/index";
import PLPDispatcher from "Store/PLP/PLP.dispatcher";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import VueQuery from "../../query/Vue.query";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUIDToken } from "Util/Auth";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";
import ProductItem from "Component/ProductItem";
import { isArabic } from "Util/App";

import RecommendedForYouVueSliderItem from "../../component/RecommendedForYouVueSlider/RecommendedForYouVueSlider.Item";
export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  gender: state.AppState.gender,
  requestedOptions: state.PLP.options,
  isLoading: state.PLP.isLoading,
  pages: state.PLP.pages,
  gender: state.AppState.gender,
  prevProductSku: state.PLP.prevProductSku,
});

export const mapDispatchToProps = (dispatch, state) => ({
  requestProductList: (options) =>
    PLPDispatcher.requestProductList(options, dispatch, state),
  updateBreadcrumbs: (breadcrumbs) => {
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  },
});

const VuePLP = (props) => {
  const stateObj = {
    recommendedForYou: [],
    showPopup: false,
  };

  const [state, setState] = useState(stateObj);

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

  const showMyAccountPopup = () => {
    setState({ ...state, showPopup: true });
  };

  const closePopup = () => {
    setState({ ...state, showPopup: false });
  };

  const onSignIn = () => {
    closePopup();
  };

  const request = async () => {
    let vueSliderType = [
      "vue_style_it_slider",
      "vue_recently_viewed_slider",
      "vue_visually_similar_slider",
      "vue_browsing_history_slider",
    ];
    const { gender } = props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const query = {
      filters: [],
      num_results: 50,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    const payload = VueQuery.buildQuery(vueSliderType[3], query, {
      gender,
    });
    fetchVueData(payload)
      .then((resp) => {
        setState({
          ...state,
          recommendedForYou: resp.data,
        });
      })
      .catch((err) => {
        console.error("fetchVueData error", err);
      });
  };

  useEffect(() => {
    request();
    updateBreadcrumbs();
  }, []);

  const updateBreadcrumbs = () => {
    const { updateBreadcrumbs, location: { pathname = "", search = "" } = {} } =
      props;
    const { q = {} } = getRequestOptions();
    let breadCrumbName = q
      ? isArabic() ? VUE_PLP_TEXT[q]  : capitalizeFirstLetters(q).split("_").join(" ")
      : "Available products";
    updateBreadcrumbs([{ name: breadCrumbName }]);
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
    const { recommendedForYou } = state;
    var qid = null;
    if (new URLSearchParams(window.location.search).get("qid")) {
      qid = new URLSearchParams(window.location.search).get("qid");
    } else {
      qid = localStorage.getItem("queryID");
    }
    return recommendedForYou.map((i, index) =>
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
              isVuePLP ={ true}
              closePopup={closePopup}
              onSignIn={onSignIn}
              isPopup
            />
          )}
          <div>
            <div block="Products" elem="Wrapper">
              <div block="PLPPagesContainer">
                <div block="PLPPages Products-Lists" id="Products-Lists">
                  {state.recommendedForYou && renderPage()}
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </main>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VuePLP);
