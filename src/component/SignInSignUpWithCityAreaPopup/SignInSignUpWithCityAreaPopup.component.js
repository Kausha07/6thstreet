import React, { useState, useEffect, createRef } from "react";
import { isSignedIn } from "Util/Auth";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import Image from "Component/Image";
import address from "Component/PDPSummary/icons/address_black.svg";
import ModalWithOutsideClick from "Component/ModalWithOutsideClick";
import "./SignInSignUpWithCityAreaPopup.style";

export const SignInSignUpWithCityAreaPopup = (props) => {
  const {
    renderMyAccountOverlay,
    toggleRegisterScreen,
    showHidePOPUP,
    showPopUp,
    showHideCityAreaSelection,
    isSignInTypePopUp,
    setExpressPopUp,
  } = props;

  const wrapperRef = createRef();

  useEffect(() => {
    if (!isSignInTypePopUp) {
      window.addEventListener("scroll", closePopupOnOutsideClick);
      window.addEventListener("mousedown", closePopupOnOutsideClick);
    }
    return () => {
      window.removeEventListener("scroll", closePopupOnOutsideClick);
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showPopUp &&
      wrapperRef.current &&
      !wrapperRef?.current?.contains(e.target) &&
      !isMobile.any()
    ) {
      showHidePOPUP(false);
      setExpressPopUp(false);
    }
  };

  const renderSignInPopUp = () => {
    if (!isSignedIn()) {
      renderMyAccountOverlay();
      toggleRegisterScreen(false);
      showHidePOPUP(false);
      setExpressPopUp(true);
    }
  };

  const renderCreateAccountPopUp = () => {
    if (!isSignedIn()) {
      renderMyAccountOverlay();
      toggleRegisterScreen(true);
      showHidePOPUP(false);
      setExpressPopUp(true);
    }
  };

  const renderComponent = () => {
    return (
      <div
        block="signInSignUpWithCityAreaMainBlock"
        elem={isSignInTypePopUp && "stylePopUp"}
        mods={{ isArabic: isArabic() }}
      >
        <div block="signInSignUpWithCityAreaOuterBlock">
          <div block="signInSignUpWithCityAreaPopUp" ref={wrapperRef}>
            <h1 block="signInSignUpWithCityAreaPopUpHeading">
              {__("Sign in or create a account to see delivery location")}
            </h1>
            <div block="signInSignUpWithCityAreaInnerBlock">
              <div block="createAccountSignInButton">
                <button
                  block="createAccountButton"
                  onClick={renderCreateAccountPopUp}
                >
                  {__("Create Account")}
                </button>
                <button block="signInButton" onClick={renderSignInPopUp}>
                  {__("Sign In")}
                </button>
              </div>
              <div block="partition">{__("or")}</div>
              <div block="selectLocation">
                <Image lazyLoad={false} src={address} alt="" />
                <div
                  block="selectLocationText"
                  onClick={() => {
                    setExpressPopUp(true);
                    return showHideCityAreaSelection(true);
                  }}
                >
                  {__("Select your location")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const render = () => {
    if (isSignInTypePopUp || isMobile.any()) {
      return (
        <ModalWithOutsideClick
          show={showPopUp}
          onClose={() => {
            setExpressPopUp(false);
            showHidePOPUP(false);
          }}
        >
          {renderComponent()}
        </ModalWithOutsideClick>
      );
    } else {
      return renderComponent();
    }
  };

  return render();
};

export default SignInSignUpWithCityAreaPopup;
