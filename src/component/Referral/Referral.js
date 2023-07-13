import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "Store/Notification/Notification.action";
import { Oval } from "react-loader-spinner";
import {
  fetchAndCreateReferralCode,
  fetchReferralTexts,
} from "../../util/API/endpoint/Referral/Referral.endpoint";
import copy from "./IconsAndImages/copy.png";
import referral from "./IconsAndImages/referral.svg";
import fallbackImage from "../../style/icons/fallback.png";
import ShareButton from "Component/ShareButton";
import "./Referral.style.scss";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { REFERRAL_COPY, REFERRAL_SHARE, MOE_trackEvent } from "Util/Event";

export default function Referral({ referralCodeValue }) {
  const url = new URL(window.location.href);
  const [referralCode, setReferralCode] = useState("");
  const [referralHeading, setReferralHeading] = useState("");
  const [referralText, setReferralText] = useState("");
  const [socialShareText, setSocialShareText] = useState("");
  const [isLoading, setIsLoading] = useState();

  const dispatch = useDispatch();

  function copyReferralCode() {
    navigator.clipboard.writeText(referralCode);
    dispatch(showNotification("success", __("Link copied to clipboard")));
    MOE_trackEvent(REFERRAL_COPY, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }

  const IsReferralEnabled = useSelector(
    (state) => state.AppConfig.IsReferralEnabled
  );

  async function createReferralCode() {
    if (referralCodeValue) {
      setReferralCode(referralCodeValue);
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

  if (isLoading) {
    return (
      <div className="ReferralLoading">
        <Oval
          color="#333"
          secondaryColor="#333"
          height={50}
          width={"100%"}
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }

  return (
    <>
      {IsReferralEnabled && referralCode ? (
        <div className="Referral">
          <div className="referralIcon">
            <img src={referral} alt="refer" />
          </div>
          <div className="Heading">
            <h3>{referralHeading}</h3>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: `<p>${referralText}</p>` }}
            className="SubHeading"
          ></div>
          <div className="ReferralCore">
            <div className="ReferralCode">{referralCode}</div>
            <div className="icons">
              <div className="CopyShareIcon" onClick={() => copyReferralCode()}>
                <img src={copy} alt="copy" />
              </div>
              <div
                className="ShareButtonContainer"
                onClick={() => {
                  MOE_trackEvent(REFERRAL_SHARE, {
                    country: getCountryFromUrl().toUpperCase(),
                    language: getLanguageFromUrl().toUpperCase(),
                    app6thstreet_platform: "Web",
                  });
                }}
              >
                <ShareButton
                  title={document.title}
                  text={socialShareText}
                  image={fallbackImage}
                  isReferral
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
