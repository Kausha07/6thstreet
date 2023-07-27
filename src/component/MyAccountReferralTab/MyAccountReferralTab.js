import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "Store/Notification/Notification.action";
import { Oval } from "react-loader-spinner";
import {
  fetchAndCreateReferralCode,
  fetchReferralTexts,
} from "../../util/API/endpoint/Referral/Referral.endpoint";
import "./MyAccountReferralTab.style.scss";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { REFERRAL_COPY, REFERRAL_SHARE, MOE_trackEvent } from "Util/Event";
import Image from "Component/Image";
import Loader from "Component/Loader";
import Invite from "./icons/invite.png";
import InviteBoth from "./icons/reward-both.png";
import Arrow from "./icons/arrow.png";
import WhatsappIcon from "./icons/whatsapp.png";
import Close from "./icons/close.png";
import CopyIcon from "./icons/copy.png";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import ShareButton from "Component/ShareButton";
import Popup from "SourceComponent/Popup";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";

export const TERMS_OVERLAY = "terms_overlay_tnc";

export default function MyAccountReferralTab() {
  const [referralCode, setReferralCode] = useState("");
  const [referralHeading, setReferralHeading] = useState("");
  const [referralText, setReferralText] = useState("");
  const [socialShareText, setSocialShareText] = useState("");
  const [isLoading, setIsLoading] = useState();
  const isArabicValue = isArabic();
  const isMobileDevice = isMobile.any();
  const dispatch = useDispatch();

  function copyReferralCode(code) {
    navigator.clipboard.writeText(code);
    dispatch(showNotification("success", __("Link copied to clipboard")));
    MOE_trackEvent(REFERRAL_COPY, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }

  function handleWhatsAppClick(text) {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  const IsReferralEnabled = useSelector(
    (state) => state.AppConfig.IsReferralEnabled
  );
  const customer = useSelector((state) => state.MyAccountReducer.customer);

  async function createReferralCode() {
    if (customer.referral_coupon) {
      console.log("BARATH",customer.referral_coupon )
      setReferralCode(customer.referral_coupon);
    } else {
      setIsLoading(true);
      const response = await fetchAndCreateReferralCode();
      if (response && response.referralCouponCode) {
        setReferralCode(response.referralCouponCode);
        setIsLoading(false);
      }
    }
  }

  async function setReferralCodeTexts() {
    setIsLoading(true);
    const responseReferralText = await fetchReferralTexts();
    if (responseReferralText && responseReferralText.status) {
      if (responseReferralText.invite_friends) {
        setReferralHeading(responseReferralText.invite_friends);
      }
      if (responseReferralText.refer_friend) {
        if (responseReferralText.refer_friend.match(/\\n/)) {
          const reftext = responseReferralText.refer_friend.replace(
            /\\n/g,
            "<br>"
          );
          setReferralText(reftext);
        } else {
          setReferralText(responseReferralText.refer_friend);
        }
      }
      if (responseReferralText.social_share_text) {
        if (responseReferralText.social_share_text.match(/\<br>/)) {
          const refShareText = responseReferralText.social_share_text.replace(
            /\<br>/g,
            "\n"
          );
          if (responseReferralText.social_share_text.match(/\{{code}}/)) {
            const refShareTextWithCode = refShareText.replace(
              /\{{code}}/g,
              `${referralCode}`
            );
            setSocialShareText(refShareTextWithCode);
          } else {
            setSocialShareText(refShareText);
          }
        } else {
          setSocialShareText(responseReferralText.social_share_text);
        }
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    createReferralCode();
  }, []);

  useEffect(() => {
    setReferralCodeTexts();
  }, [referralCode]);

  // if (isLoading) {
  //   return (
  //     <div className="ReferralLoading">
  //       <Oval
  //         color="#333"
  //         secondaryColor="#333"
  //         height={50}
  //         width={"100%"}
  //         strokeWidth={3}
  //         strokeWidthSecondary={3}
  //       />
  //     </div>
  //   );
  // }


  function renderTermsContent() {
    return (
      <div block="TermsPopup" mods={{ isArabicValue }}>
        <h3>Terms & Conditions</h3>
        <div block="Terms" elem="Content">
          <ul>
            <li>
              {__("Referral code can be shared unlimited number of times")}
            </li>
            <li>
              {__(
                "Referral coupon code can be used only by logged in customers"
              )}
            </li>
            <li>
              {__(
                "Referral code can be only used on the first order of the account and only once per account"
              )}
            </li>
            <li>
              {__(
                "Referral rewards will apply as per active promotion in the country to which the account belongs"
              )}
            </li>
            <li>
              {__(
                "Reward benefits will be awarded in the form of store credit to respective accounts"
              )}
            </li>
            <li>
              {__(
                "Referral benefits will be awarded upon completion of first order by the referee using the referrer’s referral coupon code"
              )}
            </li>
            <li>
              {__("Store credit can be used at any time without expiry date")}
            </li>
            <li>
              {__("Users cannot use their own referral code to place an order")}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  function renderCloseButton() {
    return (
      <div
        block="MyAccountReferralOverlay"
        elem="PopupClose"
        mods={{ isArabicValue }}
      >
        <button
          block="MyAccountReferralOverlay"
          elem="Close"
          onClick={() => dispatch(hideActiveOverlay())}
          
        >
          <img src={Close} alt="Close button" />
        </button>
      </div>
    );
  }

  function renderTermsPopup() {
    return (
      <>
        <Popup
          mix={{
            block: "MyAccountReferralOverlay",
          }}
          clickOutside={true}
          id={TERMS_OVERLAY}
          title="Terms & Conditions"
          mods={{ isArabicValue }}
        >
          {isMobileDevice && renderCloseButton()}
          {renderTermsContent()}
        </Popup>
      </>
    );
  }

  const renderBannerContent = () => {
    return (
      <div block="MyAccountReferral" elem="BannerContent">
        <div
          block="MyAccountReferral"
          elem="BannerText"
          dangerouslySetInnerHTML={{ __html: `<p>${referralHeading}</p>` }}
        ></div>
      </div>
    );
  };
  const renderCodeContent = () => {
    return (
      <div block="MyAccountReferral" elem="CodeWrapper">
        <p block="Referral" elem="Text">
          {__("Your invite code")}
        </p>
        <p block="Referral" elem="Code">
          {referralCode}
        </p>

        <div block="Referral" elem="Share">
          <div block="ShareIcon">
            <div
              block="ShareIcon"
              elem="Image"
              onClick={() => handleWhatsAppClick(socialShareText)}
            >
              <Image lazyLoad={true} alt={"Whatsapp"} src={WhatsappIcon} />
            </div>
            <p>{__("Whatsapp")}</p>
          </div>
          <div block="ShareIcon" title="Copy code">
            <div
              block="ShareIcon"
              elem="Image"
              onClick={() => copyReferralCode(referralCode)}
            >
              <Image lazyLoad={true} alt={"Copy"} src={CopyIcon} />
            </div>

            <p>{__("Copy code")}</p>
          </div>
          <div block="ShareIcon" title="Share">
            <ShareButton text={socialShareText} isReferral />
            <p>{__("More")}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderInviteContent = () => {
    return (
      <div block="MyAccountReferral" elem="InviteWrapper">
        <div block="MyAccountReferral" elem="InviteContainer">
          <div block="Invite" elem="Container">
            <Image lazyLoad={true} alt={"Invite"} src={Invite} />
            <p>{__("Invite your friends on 6thStreet to win store credit")}</p>
          </div>
          <div block="Invite" elem="Container" mods={{ isArabicValue }}>
            <Image lazyLoad={true} alt={"Arrow"} src={Arrow} />
          </div>
          <div block="Invite" elem="Container">
            <Image lazyLoad={true} alt={"Invite"} src={InviteBoth} />
            <p dangerouslySetInnerHTML={{ __html: `${referralText}` }}></p>
          </div>
        </div>
        <div block="MyAccountReferral" elem="Terms">
          <button
            block="Terms"
            elem="Btn"
            onClick={() => dispatch(toggleOverlayByKey(TERMS_OVERLAY))}
          >
            {__("Terms and Conditions Apply")}
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      {IsReferralEnabled && referralCode}
      <div block="MyAccountReferral" elem="Container" mods={{ isArabicValue }}>
        {renderBannerContent()}
        {renderCodeContent()}
        {renderInviteContent()}
      </div>
      {renderTermsPopup()}
    </>
  );
}
