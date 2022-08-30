/* eslint-disable fp/no-let */
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import MyAccountOverlay from "Component/MyAccountOverlay";
import "../PLP/PLP.style";
import "./VuePLP.style";
import Loader from "Component/Loader";
import PLPDispatcher from "Store/PLP/PLP.dispatcher";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import ProductItem from "Component/ProductItem";
import VueQuery from "../../query/Vue.query";
import BrowserDatabase from "Util/BrowserDatabase";
import { getUUIDToken } from "Util/Auth";
import { fetchVueData } from "Util/API/endpoint/Vue/Vue.endpoint";

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
});

const VuePLP = (props) => {
  const stateObj = {
    recommendedForYou: [],
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

  const request = async () => {
    const { requestProductList } = props;
    const requestOptions = getRequestOptions();
    requestProductList({ options: requestOptions });
    const { gender } = props;
    const userData = BrowserDatabase.getItem("MOE_DATA");
    const query = {
      filters: [],
      num_results: 10,
      mad_uuid: userData?.USER_DATA?.deviceUuid || getUUIDToken(),
    };
    const payload = VueQuery.buildQuery("vue_browsing_history_slider", query, {
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
  }, []);

  const renderProduct = (product, index, qid) => {
    console.log("muskan--------->", state.recommendedForYou[0],product);

    const { sku } = product;
    const { renderMySignInPopup } = props;
    return (
      <ProductItem
        position={index}
        product={product}
        key={sku}
        pageType="plp"
        page="plp"
        renderMySignInPopup={renderMySignInPopup}
        qid={qid}
        lazyLoad={false}
        sendProductImpression={() => {}}
      />
    );
  };

  const renderProducts = (products) => {
    products.forEach((item, index) => {
      Object.assign(item, {
        product_Position: index + 1,
      });
    });
    var qid = null;
    if (new URLSearchParams(window.location.search).get("qid")) {
      qid = new URLSearchParams(window.location.search).get("qid");
    } else {
      qid = localStorage.getItem("queryID");
    }
    return products.map((i, index) => renderProduct(i, index + 1, qid));
  };

  const renderPage = ([key, page]) => {
    return (
      <div block="PLPPage" key={key}>
        <ul block="ProductItems">{renderProducts(page)}</ul>
      </div>
    );
  };

  const renderPages = () => {
    const { pages = {} } = props;
    return Object.entries(pages).map(renderPage);
  };

  const {
    pages,
    isLoading,
    showPopup,
    closePopup,
    location: { pathname },
  } = props;
  let catalogKey = pathname.includes("catalogsearch");
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  } else {
    return (
      <main block={catalogKey ? "SearchPage" : "PLP"} id="plp-main-scroll-id">
        <ContentWrapper label={__("Product List Page")}>
          {showPopup && (
            <MyAccountOverlay
              closePopup={closePopup}
              onSignIn={closePopup}
              isPopup
            />
          )}
          <div block="Products" elem="Wrapper">
            <div block="PLPPagesContainer">
              <div block="PLPPages Products-Lists" id="Products-Lists">
                {/* {state.recommendedForYou && renderPages()} */}
                {pages && renderPages()}
              </div>
            </div>
          </div>
        </ContentWrapper>
      </main>
    );
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VuePLP));
