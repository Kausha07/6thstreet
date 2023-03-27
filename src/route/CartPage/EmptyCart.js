import { useState } from "react";
import Link from "Component/Link";
import Image from "Component/Image";
import { isArabic } from "Util/App";
import { isSignedIn } from "Util/Auth";
import MyAccountOverlay from "Component/MyAccountOverlay";
import EmptyCardIcon from "./icons/cart.svg";
import { TYPE_HOME } from "Route/UrlRewrites/UrlRewrites.config";

export function RenderEmptyCartPage() {
  const [showSignInPopUp, setShowSignInPopUp] = useState(false);
  return (
    <>
      {showSignInPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInPopUp(false)}
          onSignIn={() => setShowSignInPopUp(false)}
          isPopup
        />
      )}

      <div block="CartPage" elem="EmptyCart" mods={{ isArabic }}>
        <div className="EmptyCartContainer" >
          <div block="CartPage" elem="EmptyCartImg">
            <Image src={EmptyCardIcon} />
          </div>
          <div>
            <div className="mt-2 EmptyMessage">
              {__("Your shopping bag is empty!")}
            </div>
            <span>
              {__("Continue shopping or login to view your saved bag")}
            </span>
            <div block="ExploreNowBtn">
              <Link
                block="ExploreNowBtn"
                elem="ExploreButton"
                to={`/women.html`}
              >
                <span block="ExploreNowBtn" elem="ExploreButtonText">
                  {__("Continue Shopping")}
                </span>
              </Link>
              {!!!isSignedIn() && (
                <div block="ExploreNowBtn" elem="SignInButton">
                  <button
                    block="ExploreNowBtn"
                    elem="SignInBtnText"
                    onClick={() => {
                      setShowSignInPopUp(true);
                    }}
                  >
                    {__("Sign In")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function RenderEmptyCartPageForMobile() {
  const [showSignInPopUp, setShowSignInPopUp] = useState(false);
  return (
    <>
      {showSignInPopUp && (
        <MyAccountOverlay
          closePopup={() => setShowSignInPopUp(false)}
          onSignIn={() => setShowSignInPopUp(false)}
          isPopup
        />
      )}
      <div block="CartPage" elem="EmptyCart" mods={{ isArabic }}>
        <div
        className="EmptyCartContainerMobile"
        >
          <div block="CartPage" elem="EmptyCartImg">
            <Image src={EmptyCardIcon} alt={"cart-icon"} />
          </div>
          <div className="EmptyCartText">
            <p block="CartPage" elem="EmptyCartTextDec">
              {__("Your shopping bag is empty!")}
            </p>
            <span className="EmptyCartSubText">
              {__("Continue shopping or login to view your saved bag")}
            </span>
          </div>
        </div>
        <div block="ExploreNowBtn">
          <Link
            block="ExploreNowBtn"
            elem="ExploreButton"
            to={`/`}
            onClick={() => (window.pageType = TYPE_HOME)}
          >
            <span block="ExploreNowBtn" elem="ExploreButtonText">
              {__("Continue Shopping")}
            </span>
          </Link>
          {!!!isSignedIn() && (
            <div block="ExploreNowBtn" elem="SignInButton">
              <button
                block="ExploreNowBtn"
                elem="SignInBtnText"
                onClick={() => {
                  setShowSignInPopUp(true);
                }}
              >
                {__("Sign In")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
