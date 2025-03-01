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
import { updateMeta } from "Store/Meta/Meta.action";
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
  setMeta: (meta) => dispatch(updateMeta(meta)),
});

function BrandCMS(props) {
  const {
    location: { pathname },
  } = props;

  const gender = useSelector((state) => state.AppState.gender);
  const BrandCMSData = useSelector((state) => state.BrandCms);
  const customer = useSelector((state) => state.MyAccountReducer.customer);
  const abTestingConfig = useSelector((state) => state.AppConfig.abTestingConfig);
  const vwoData = useSelector((state) => state.AppConfig.vwoData);

  const [isLoading, setIsLoading] = useState(true);
  const [storeWidgets, setStoreWidgets] = useState([]);
  const [widgets, setWidgets] = useState([]);
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

    return params;
  };

  const getWidgets = async () => {
    const { brandCmsData, isBrandCmsLoading } = BrandCMSData;

    if (brandCmsData.length > 0 && !isBrandCmsLoading) {
      setStoreWidgets(brandCmsData);
      setIsLoading(isBrandCmsLoading);
    } else {
      try {
        setIsLoading(true);
        dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: true });
        const devicePrefix = isMobile.any() ? "m/" : "d/";
        const widgetData = await getStaticFile(HOME_STATIC_FILE_KEY, {
          $FILE_NAME: `${devicePrefix}store_page.json`,
        });
        dispatch({ type: "SET_BRAND_CMS_DATA", data: widgetData });
        dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
        Array.isArray(widgetData) && widgetData?.length > 0
          ? setStoreWidgets(widgetData)
          : setStoreWidgets([]);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
        setStoreWidgets([]);
        setIsLoading(false);
      }
    }
  };

  const getSegmentWiseWidgets = async () => {
    try {
      setIsLoading(true);
      dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: true });
      const devicePrefix = isMobile.any() ? "m/" : "d/";
      const userSegementValue = customer?.user_segment ? customer.user_segment : abTestingConfig?.HPP?.defaultUserSegment;
      const widgetData = await getStaticFile(HOME_STATIC_FILE_KEY, {
        $FILE_NAME: `${devicePrefix}${userSegementValue}_store_page.json`,
      });

      const { HPP : { variationName = "" } = {}}  = vwoData || {};
      
      const variant_name = variationName ? variationName : abTestingConfig?.HPP?.defaultValue; 

    if (!widgetData || widgetData?.length === 0) {
      dispatch({ type: "SET_BRAND_CMS_DATA", data: [] });
      dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
    }else{
      // same logic as home page for filter usersegment wise widgets
      const filteredContent = widgetData.filter(
        (item) => !item?.widget_variant || item.widget_variant === `${variant_name}`
      );
      dispatch({ type: "SET_BRAND_CMS_DATA", data: filteredContent?.length > 0 ? filteredContent : widgetData });
      dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });      
      Array.isArray(filteredContent) && filteredContent?.length > 0 ? setStoreWidgets(filteredContent) : setStoreWidgets(widgetData);
    }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      dispatch({ type: "SET_BRAND_CMS_LOADING", isBrandCmsLoading: false });
      setStoreWidgets([]);
      setIsLoading(false);
    }
  }

  const renderWidget = () => {
    const { tagName = "" } = getTagName();
    let widgetData = [];
    if (tagName && storeWidgets) {
      widgetData = storeWidgets.filter(
        (item) => item?.tag?.toLowerCase() === tagName.toLowerCase()
      );
      setWidgets(widgetData);
    } else {
      setWidgets([]);
    }
  };

  const updateBreadcrumbs = () => {
    const { updateBreadcrumbs, setMeta } = props;
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
    setMeta({
      title: BreadcrumbsName
        ? BreadcrumbsName
        : "Shop Online @ 6thStreet.com for Men, Women & Kids across GCC",
    });
    updateBreadcrumbs(breadcrumbs);
  };

  useEffect(() => {
    getSegmentWiseWidgets();
    renderWidget();
  }, []);

  useEffect(() => {
    getSegmentWiseWidgets();
  }, [customer?.user_segment, abTestingConfig?.HPP?.defaultUserSegment]);

  useEffect(() => {
    renderWidget();
    updateBreadcrumbs();
  }, [storeWidgets, location.pathname]);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  } else if (!isLoading && !(widgets?.length > 0)) {
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

        {!isLoading && widgets?.length > 0 && (
          <DynamicContent
            gender={gender}
            content={widgets}
            setLastTapItemOnHome={setLastTapItem}
            renderMySignInPopup={showMyAccountPopup}
          />
        )}
      </ContentWrapper>
    </main>
  );
}

export default connect(null, mapDispatchToProps)(BrandCMS);
