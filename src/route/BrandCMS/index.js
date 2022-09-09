import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";

import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import { capitalizeFirstLetters } from "../../../packages/algolia-sdk/app/utils";

import { setGender } from "Store/AppState/AppState.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";
export const BreadcrumbsDispatcher = import(
  /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);
import { setLastTapItemOnHome } from "Store/PLP/PLP.action";
import BrandCmsDispatcher from "Store/BrandCms/BrandCms.dispatcher";

import MyAccountOverlay from "Component/MyAccountOverlay";

import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import DynamicContent from "Component/DynamicContent";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
import NoMatch from "Route/NoMatch";
import Loader from "Component/Loader";
import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";

export const mapDispatchToProps = (dispatch) => ({
  requestBrandCMSData: () => BrandCmsDispatcher.requestBrandCms(dispatch),
  updateBreadcrumbs: (breadcrumbs) =>
    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    ),
});

function BrandCMS(props) {
  const {
    location: { pathname },
  } = props;

  const gender = useSelector((state) => state.AppState.gender);
  const BrandCMSData = useSelector((state) => state.BrandCms);

  const [isLoading, setIsLoading] = useState();
  const [widget, setWidget] = useState([]);
  const [storeWidget, setStoreWidget] = useState([]);
  const [shouldRender, setShouldRender] = useState();
  const [showPopup, setShowPopup] = useState();
  const [signInPopUp, setSignInPopUp] = useState("");
  //dispatch
  const dispatch = useDispatch();

  const showMyAccountPopup = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
    setSignInPopUp("");
  };

  const setLastTapItem = (item) => {
    setLastTapItemOnHome(item);
  };

  const getTagName = () => {
    let params = {};
    params.tagName = pathname
      .replace(".html", "")
      .replace("/store/", "")
      .split("?")[0]
      .split("&idx=")[0];
    params.BreadcrumbsName = isArabic()
      ? params.tagName
      : capitalizeFirstLetters(params.tagName)
          .split(/(?:_|-)+/)
          .join(" ");

    // const tagName = pathname
    //   .replace(".html", "")
    //   .replace("/", "")
    //   .replaceAll("/", "_");
    // if (location.search && location.search.startsWith("?tag")) {
    //   const { params: parsedParams } = WebUrlParser.parsePLP(location.href);
    //   params = parsedParams;
    // }
    return params;
  };

  const renderWidget = async () => {
    setIsLoading(true);
    let widgetData = [];
    
    //props.requestBrandCMSData();
    try {
      //dispatch({ type: SET_BRAND_CMS_LOADING, isBrandCmsLoading: true });

      const devicePrefix = isMobile.any() ? "m/" : "d/";
      widgetData = await getStaticFile(HOME_STATIC_FILE_KEY, {
        $FILE_NAME: `${devicePrefix}store_page.json`,
      });

      const { tagName } = getTagName();
      const storeWidget = widgetData.filter(
        (item) => item.tag.toLowerCase() === tagName.toLowerCase()
      );
      const shouldRender = !(storeWidget && storeWidget.length == 0);
      setWidget(storeWidget);
      setShouldRender(shouldRender);
      setIsLoading(false);

      //dispatch({ type: "SET_BRAND_CMS_DATA", data: widgetData });
      //dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
    } catch (e) {
      console.log(e);
      //dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
    }
  };

  const updateBreadcrumbs = () => {
    const { updateBreadcrumbs } = props;
    const { BreadcrumbsName } = getTagName();

    const breadcrumbs = [
      {
        url: "/",
        name: BreadcrumbsName,
      },
      {
        url: "/",
        name: __("Home"),
      },
    ];

    updateBreadcrumbs(breadcrumbs);
  };

  useEffect(() => {
    renderWidget();
    //props.requestBrandCMSData();
    updateBreadcrumbs();
  }, []);

  useEffect(() => {
    setStoreWidget(widget);
  }, [widget]);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  } 
  else if (!isLoading && storeWidget.length === 0) {
    return <NoMatch />;
  }

  return (
    <main block="BrandCMS">
      <ContentWrapper label={__("BrandBy_Huge_DiscountCMS Page")}>
        {showPopup && (
          <MyAccountOverlay
            closePopup={closePopup}
            onSignIn={closePopup}
            isPopup
          />
        )}
        {/* {shouldRenderBanner() && (
            <div>
              <CircleItemSliderSubPage bannerData={bannerData} />
            </div>
          )} */}
        {shouldRender && (
          <DynamicContent
            gender={gender}
            content={storeWidget}
            setLastTapItemOnHome={setLastTapItem}
            renderMySignInPopup={showMyAccountPopup}
          />
        )}
      </ContentWrapper>
    </main>
  );
}

//export default BrandCMS;

export default connect(null, mapDispatchToProps)(BrandCMS);
