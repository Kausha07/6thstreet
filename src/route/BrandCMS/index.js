import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import { setGender } from "Store/AppState/AppState.action";
import { changeNavigationState } from "Store/Navigation/Navigation.action";
import { TOP_NAVIGATION_TYPE } from "Store/Navigation/Navigation.reducer";

import MyAccountOverlay from "Component/MyAccountOverlay";

import { setLastTapItemOnHome } from "Store/PLP/PLP.action";
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import DynamicContent from "Component/DynamicContent";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
import NoMatch from "Route/NoMatch";
import Loader from "Component/Loader";
import { HOME_STATIC_FILE_KEY } from "Route/HomePage/HomePage.config";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";

function BrandCMS(props) {
  const {
    location: { pathname },
  } = props;

  const gender = useSelector((state) => state.AppState.gender);

  const [isLoading, setIsLoading] = useState();
  const [widget, setWidget] = useState([]);
  const [shouldRender, setShouldRender] = useState();
  const [showPopup, setShowPopup] = useState();
  const [signInPopUp, setSignInPopUp] = useState("");

  
  const showMyAccountPopup = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
    setSignInPopUp("");
  };
  //   const onSignIn = () => {
  //     closePopup();
  //   };
  const setLastTapItem = (item) => {
    setLastTapItemOnHome(item);
  };
  const renderWidget = async () => {
    setIsLoading(true);
    const devicePrefix = isMobile.any() ? "m/" : "d/";
    const widgetData = await getStaticFile(HOME_STATIC_FILE_KEY, {
      $FILE_NAME: `${devicePrefix}store_page.json`,
    });
    const tagName = pathname
      .replace(".html", "")
      .replace("/", "")
      .replaceAll("/", "_");
    const tagNameonly = pathname.replace(".html", "").replace("/store/", "")

    const storeWidget = widgetData.filter(
      (item) => item.tag.toLowerCase() === (tagName.toLowerCase())
    );
    const shouldRender = !(storeWidget && storeWidget.length == 0);
    setWidget(storeWidget);
    setShouldRender(shouldRender);
    
    setIsLoading(false);
  };
  useEffect(() => {
    renderWidget();
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  } else if (!isLoading && widget.length === 0) {
    return <NoMatch />;
  }

  return (
    <main block="BrandCMS">
      <ContentWrapper label={__("BrandCMS Page")}>
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
            content={widget}
            setLastTapItemOnHome={setLastTapItem}
            renderMySignInPopup={showMyAccountPopup}
          />
        )}
      </ContentWrapper>
    </main>
  );
}

export default BrandCMS;
