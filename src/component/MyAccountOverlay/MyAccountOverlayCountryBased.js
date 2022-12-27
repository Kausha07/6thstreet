import { useSelector } from "react-redux";
import MyAccountOverlayContainerV1 from "../MyAccountOverlayV1/MyAccountOverlay.container";
import MyAccountOverlayContainerV0 from "./MyAccountOverlay.container";

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
    );
  } else {
    return (
      <MyAccountOverlayContainerV0
        closePopup={closePopup}
        onSignIn={onSignIn}
        isPopup={isPopup}
        email={email}
        setRegisterFieldFalse={setRegisterFieldFalse}
        registerField={registerField}
      />
    );
  }
}
