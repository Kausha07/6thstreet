import { lazy, Suspense } from 'react';
import { useSelector } from "react-redux";
const MyAccountOverlayContainerV1 = lazy(() => import(/* webpackChunkName: 'MyAccountOverlayContainerV1' */ "../MyAccountOverlayV1/MyAccountOverlay.container"));
const MyAccountOverlayContainerV0 = lazy(() => import(/* webpackChunkName: 'MyAccountOverlayContainerV1' */ "./MyAccountOverlay.container"));
// import MyAccountOverlayContainerV1 from "../MyAccountOverlayV1/MyAccountOverlay.container";
// import MyAccountOverlayContainerV0 from "./MyAccountOverlay.container";

export default function MyAccountOverlay({
  closePopup,
  onSignIn,
  isPopup,
  email,
  setRegisterFieldFalse,
  registerField,
  showMyAccountMenuPopUp,
  redirectToMyOrdersPage,
}) {
  const newSigninSignupVersionEnabled = useSelector(
    (state) => state.AppConfig.newSigninSignupVersionEnabled
  );
  if (newSigninSignupVersionEnabled) {
    return (
      <Suspense fallback={<div></div>}>
        <MyAccountOverlayContainerV1
          closePopup={closePopup}
          onSignIn={onSignIn}
          isPopup={isPopup}
          email={email}
          setRegisterFieldFalse={setRegisterFieldFalse}
          registerField={registerField}
          showMyAccountMenuPopUp={showMyAccountMenuPopUp}
          redirectToMyOrdersPage={redirectToMyOrdersPage}
        />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={<div></div>}>
        <MyAccountOverlayContainerV0
          closePopup={closePopup}
          onSignIn={onSignIn}
          isPopup={isPopup}
          email={email}
          setRegisterFieldFalse={setRegisterFieldFalse}
          registerField={registerField}
        />
      </Suspense>
    );
  }
}
