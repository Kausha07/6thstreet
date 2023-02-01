import UrlRewritesQuery from "Query/UrlRewrites.query";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { hideActiveOverlay } from "Store/Overlay/Overlay.action";
import {
  resetPLPPage,
  setPrevProductSku,
  setPLPLoading,
} from "Store/PLP/PLP.action";
import { fetchQuery } from "Util/Request";
import { TYPE_CATEGORY, TYPE_NOTFOUND, TYPE_PRODUCT } from "Util/Common/config";
import UrlRewrite from "./UrlRewrite.component";
import browserHistory from "Util/History";
import isMobile from "Util/Mobile";

export const mapStateToProps = (state) => ({
  locale: state.AppState.locale,
});

export const mapDispatchToProps = (_dispatch) => ({
  hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
  resetPLPPage: () => _dispatch(resetPLPPage()),
  setPLPLoading: (isLoading) => _dispatch(setPLPLoading(isLoading)),
  setPrevProductSku: (sku) => _dispatch(setPrevProductSku(sku)),
});

const UrlRewrites = (props) => {
  const stateObj = {
    prevPathname: "",
    isLoading: true,
    currentLocation: null,
    type: "",
    id: -1,
    sku: "",
    query: "",
    brandDescription: "",
    brandImg: "",
    brandName: "",
  };

  const [state, setState] = useState(stateObj);
  const location = window.location;
  const history = useHistory();

  useEffect(() => {
    let prevLocation;
    let finalPrevLocation;
    let initialPrevProductSku;
    browserHistory.listen((nextLocation) => {
      let locationArr = [
        "/men.html",
        "/women.html",
        "/kids.html",
        "/home.html",
        "/",
      ];
      finalPrevLocation = prevLocation;
      prevLocation = nextLocation;
      if (
        finalPrevLocation &&
        !locationArr.includes(finalPrevLocation.pathname) &&
        finalPrevLocation.state &&
        finalPrevLocation.state.product
      ) {
        const {
          state: {
            product: { sku },
          },
        } = finalPrevLocation;
        initialPrevProductSku = sku;
        props.setPLPLoading(true);
        props.setPrevProductSku(sku);
      } else if (
        finalPrevLocation &&
        locationArr.includes(finalPrevLocation.pathname)
      ) {
        window.scrollTo(0, 0);
      }
      if (
        finalPrevLocation &&
        finalPrevLocation.search &&
        finalPrevLocation.search.includes("&p=") &&
        nextLocation.search.includes("&p=") &&
        isMobile.any()
      ) {
        let customPrevLoc = new URLSearchParams(finalPrevLocation.search);
        customPrevLoc.delete("p");
        let customCurrLoc = new URLSearchParams(location.search);
        customCurrLoc.delete("p");
        if (
          customCurrLoc.toString() !== customPrevLoc.toString() &&
          history.action === "POP"
        ) {
          const url = new URL(location.href.replace(/%20&%20/gi, "%20%26%20"));
          url.searchParams.set("p", 0);
          const { pathname, search } = url;
          window.location.replace(pathname + search);
          resetPLPPage();
          triggerRequestUrlRewrite(true);
        }
      }
    });

    const { resetPLPPage } = props;
    const url = new URLSearchParams(location.search);
    if (url.get("p") && url.get("p") !== "0") {
      resetPLPPage();
      url.set("p", 0);
      window.scrollTo(0, 0);
      const { pathname } = location;
      history.replace(pathname + "?" + url.toString());
    }
  }, []);

  useEffect(() => {
    triggerRequestUrlRewrite();
  }, [location.href]);

  useEffect(() => {
    const { pathname } = location;
    const { query } = state;
    if (query) {
      let partialQuery = location.search;
      if (partialQuery) {
        if (partialQuery.indexOf("idx") !== -1) {
          return;
        } else {
          partialQuery = partialQuery.substring(1);
          history.push(`${pathname}${query}`);
        }
      } else if (window.pageType === "CMS_PAGE") {
        history.push(`${pathname}`);
      } 
    }
  }, [state.query]);

  const triggerRequestUrlRewrite = () => {
    hideActiveOverlay();
    document.body.style.overflow = "visible";
    requestUrlRewrite(true);
  };

  const requestUrlRewrite = async (isUpdate = false) => {
    const { pathname: urlParam = "", search } = location;
    const slicedUrl = urlParam.slice(urlParam.search("id/"));
    const magentoProductId = Number(slicedUrl.slice("3").split("/")[0]);
    const possibleSku = getPossibleSku();
    setState({
      ...state,
      isLoading: isUpdate,
    });
    if (search.startsWith("?q=")) {
      // Normal PLP, Catalog Search
      setState({
        ...state,
        prevPathname: urlParam,
        currentLocation: location.href,
        type: TYPE_CATEGORY,
        id: magentoProductId,
        sku: possibleSku,
        query: search,
        brandDescription: "",
        brandImg: "",
        brandName: "",
        isLoading: false,
      });
      window.pageType = TYPE_CATEGORY;
    } else if (search.startsWith("?p")) {
      // URL with query params, when resolver returns null
      setState({
        ...state,
        prevPathname: urlParam,
        type: TYPE_CATEGORY,
        id: magentoProductId,
        sku: possibleSku,
        currentLocation: location.href,
        query: "",
        isLoading: false,
      });
      window.pageType = TYPE_CATEGORY;
    } else {
      // PDP & PLP w/o query params
      let gClidParam = "";
      let hasQueryString = 0;
      let appendQueryString;
      if (search.startsWith("?")) {
        if (search.startsWith("?gclid=")) {
          let gclidValue = new URLSearchParams(location.search).get("gclid");
          gClidParam = `&gclid=${gclidValue}`;
        } else {
          hasQueryString = 1;
          appendQueryString = `&${location.search.split("?")[1].toString()}`;
        }
      }
      const { urlResolver } = await fetchQuery(
        UrlRewritesQuery.getQuery({ urlParam })
      );
      let UpdatedURL;
      if (urlResolver && urlResolver.data.url) {
        UpdatedURL =
          urlResolver.data.url.split("&p=")[0] +
          "&p=0" +
          urlResolver.data.url.split("&p=")[1].substring(1);
      }

      const {
        type = magentoProductId || possibleSku ? TYPE_PRODUCT : TYPE_NOTFOUND,
        id,
        query = gClidParam || hasQueryString ? `?${UpdatedURL}` : UpdatedURL,
        data: {
          //url: query,
          brand_html: brandDescription,
          brand_logo: brandImg,
          brand_name: brandName,
        },
      } = urlResolver || { data: {} };
      if (!urlResolver) {
        setState({
          ...state,
          prevPathname: urlParam,
          type: TYPE_NOTFOUND,
          id: magentoProductId,
          sku: possibleSku,
          isLoading: false,
          currentLocation: location.href,
          query: search,
        });
        window.pageType = TYPE_NOTFOUND;
      } else {
        const finalType =
          type === TYPE_NOTFOUND && decodeURI(location.search).match(/idx=/)
            ? TYPE_CATEGORY
            : type;
        window.pageType = finalType;
        setState({
          ...state,
          prevPathname: urlParam,
          type: finalType,
          id: id === undefined ? magentoProductId : id,
          isLoading: false,
          currentLocation: location.href,
          sku: possibleSku,
          query:
            finalType === TYPE_PRODUCT
              ? ""
              : hasQueryString
              ? `${query}${appendQueryString}`
              : `${query}${gClidParam}`,
          brandDescription: brandDescription,
          brandImg: brandImg,
          brandName: brandName,
        });
      }
    }
  };

  const getPossibleSku = () => {
    const { pathname } = location;

    const uriElements = pathname
      .substr(0, pathname.indexOf(".html"))
      .substr(1)
      .split("-");

    const result = uriElements
      .reduce((acc, element) => {
        if (/\d/.test(element) || acc.length !== 0) {
          acc.push(element);
        }

        return acc;
      }, [])
      .join("-");

    return result.length ? result : "";
  };

  return <UrlRewrite {...state} location={location} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlRewrites);