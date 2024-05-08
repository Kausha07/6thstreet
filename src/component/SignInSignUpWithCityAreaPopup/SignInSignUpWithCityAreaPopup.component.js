import React, { useState, useEffect, createRef } from "react";
import { isSignedIn } from "Util/Auth";
import Image from "Component/Image";
import address from "Component/PDPSummary/icons/address_black.svg";
import "./SignInSignUpWithCityAreaPopup.style";

export const SignInSignUpWithCityAreaPopup = (props) => {
  const {
    renderMyAccountOverlay,
    toggleRegisterScreen,
    showHidePOPUP,
    showPopUp,
    showHideCityAreaSelection,
  } = props;

  const wrapperRef = createRef();

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (showPopUp) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [showPopUp]);

  const closePopupOnOutsideClick = (e) => {
    if (
      showPopUp &&
      wrapperRef.current &&
      !wrapperRef?.current?.contains(e.target)
    ) {
      showHidePOPUP(false);
    }
  };

  const renderSignInPopUp = () => {
    if (!isSignedIn()) {
      renderMyAccountOverlay();
      toggleRegisterScreen(false);
    }
  };

  const renderCreateAccountPopUp = () => {
    if (!isSignedIn()) {
      renderMyAccountOverlay();
      toggleRegisterScreen(true);
    }
  };

  return (
    <div block="signInSignUpWithCityAreaMainBlock">
      <div block="signInSignUpWithCityAreaOuterBlock">
        <div block="signInSignUpWithCityAreaPopUp" ref={wrapperRef}>
          <h1>{__("Sign in/ Create Account to see delivery Option")}</h1>
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
                onClick={() => showHideCityAreaSelection(true)}
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

export default SignInSignUpWithCityAreaPopup;
