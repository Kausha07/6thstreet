import React, { useEffect, useState } from "react";

import { formatCDNLink } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import { followUnfollowInfluencer } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getAllInfluencers } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getEnvIDForInfluencer } from "../../util/Common/index";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import Event, {
  EVENT_INFLUENCER_SEARCH_CLICK,
  EVENT_FOLLOW_INFLUENCER_CLICK,
  EVENT_UNFOLLOW_INFLUENCER_CLICK,
  EVENT_GTM_INFLUENCER,
} from "Util/Event";
import Search from "../../component/Icons/Search/icon.svg";

import Link from "Component/Link";
import HeaderLogo from "Component/HeaderLogo";
import "./InfluencerSearch.style.scss";

const InfluencerSearch = (props) => {
  const {
    updateFollowingList,
    renderMySignInPopup,
    guestUser,
    followingList,
    selectedGender,
    closeSearchMobilePopUp,
    masterTrendingInfo,
    influencerSearchText,
  } = props;
  const [allInfluencersList, setAllInfluencersList] = useState([]);
  const [onPageinfluencerSearchText, setOnPageInfluencerSearchText] =
    useState("");

  const getInfluencers = () => {
    const locale = getLocaleFromUrl();
    const envID = getEnvIDForInfluencer();
    try {
      getAllInfluencers(envID, locale).then((resp) => {
        setAllInfluencersList(resp);
      });
    } catch (err) {
      console.error("Error while fetching Influencer info on Search page", err);
    }
  };

  useEffect(() => {
    getInfluencers();
  }, []);

  const followUnfollow = (influencerID, follow) => {
    if (!isSignedIn()) {
      renderMySignInPopup();
      guestUser(influencerID, follow);
    } else {
      const payload = {
        influencerId: influencerID,
        following: !follow,
      };
      followUnfollowInfluencer(payload).then((resp) => {
        updateFollowingList(influencerID, follow);
      });
    }

    if (follow) {
      const eventData = {
        name: EVENT_UNFOLLOW_INFLUENCER_CLICK,
        influencer_id: influencerID,
      };
      Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
    } else {
      const eventData = {
        EventName: EVENT_FOLLOW_INFLUENCER_CLICK,
        influencer_id: influencerID,
      };
      Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
    }
    
  };

  const renderInfluencer = (item, i) => {
    const {
      id: influencerId,
      image_url,
      influencer_name,
      family_name,
      name,
    } = item;
    const isFollowed =
      followingList &&
      followingList.length > 0 &&
      followingList.includes(influencerId);
    if (image_url) {
      return (
        <div key={influencerId} className="influencerOnSearch">
          <Link
            to={formatCDNLink(
              `influencer.html/Store?influencerID=${influencerId}&selectedGender=${selectedGender}`
            )}
            key={i}
            data-banner-type="influencer_slider_banner"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? block.tag : ""}
          >
            <div key={influencerId}>
              <li block="spckItem" id={influencerId}>
                <div block="influencerImage">
                  <img src={image_url} alt={influencer_name} />
                </div>
                <div block="influencerInfo" mods={{ isArabic: isArabic() }}>
                  <h3 block="influencerTitle">{influencer_name}</h3>
                  <p block="influencerTitle">{name + " " + family_name}</p>
                </div>
              </li>
            </div>
          </Link>
          <div block="followUnfollowButton" mods={{ isArabic: isArabic() }}>
            {isFollowed ? (
              <button
                className="followingButton"
                onClick={() => followUnfollow(influencerId, true)}
              >
                {__("Following")}
              </button>
            ) : (
              <button
                className="followButton"
                onClick={() => followUnfollow(influencerId, false)}
              >
                {__("Follow")}
              </button>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderSliderCollection = (item, i) => {
    const { id: influencerId, image_url, influencer_name } = item?.influencer;
    const { id: collectionId, thumbnail_url, title } = item?.collection;

    return (
      <li key={collectionId} className="spckItem">
        <div className="eventImage">
          <Link
            to={`influencer.html/Collection?influencerCollectionID=${collectionId}&influencerID=${influencerId}`}
            key={i}
            data-banner-type="influencerSearch_slider_bannner"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? item.tag : ""}
          >
            <img src={thumbnail_url} alt="influencerSearch_slider_bannner" />
            <p className="sliderTitle">{title}</p>
          </Link>
        </div>
      </li>
    );
  };

  const closeSearchPopUp = () => {
    closeSearchMobilePopUp();
  };

  const handleSearchInfluencerText = (e) => {
    setOnPageInfluencerSearchText(e.target.value);
  };

  const influencerSearchEventTracking = () => {
    const eventData = {
      EventName: EVENT_INFLUENCER_SEARCH_CLICK,
    };
    Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
  };

  const renderSearchForMobile = () => {
    const lowerInfluencerSearchText = onPageinfluencerSearchText?.toLowerCase();
    const sliderContent =
      masterTrendingInfo?.superstars?.[selectedGender]?.data?.[0]?.items;
    const filteredSliderContent = sliderContent?.filter((val) => {
      if (
        val?.collection?.title
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText) ||
        val?.influencer?.influencer_name
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText)
      ) {
        return val;
      }
    });
    const allInfluencerContent =
      allInfluencersList?.influencers?.superstars?.[selectedGender];
    const filteredAllInfluencerContent = allInfluencerContent?.filter((val) => {
      const fullName = val?.name + " " + val?.family_name;
      if (
        val?.influencer_name
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText) ||
        fullName?.toLowerCase().includes(lowerInfluencerSearchText)
      ) {
        return val;
      }
    });
    return (
      <div className="searchBlockForMobile" mods={{ isArabic: isArabic() }}>
        <div block="mobileSearchHeader">
          <HeaderLogo key="logo" />
          <div block="inputOnpage" onClick={influencerSearchEventTracking}>
            <img
              block="searchIconOnPage"
              src={Search}
              mods={{ isArabic: isArabic() }}
            />
            <input
              type="text"
              block="influencerSearchInputForMobile"
              mods={{ isArabic: isArabic() }}
              id="influencerSearch"
              placeholder={__("Search collections, influencers etc...")}
              onChange={handleSearchInfluencerText}
            />
            <p
              onClick={closeSearchPopUp}
              block="cancelButton"
              mods={{ isArabic: isArabic() }}
            >
              {__("Cancel")}
            </p>
          </div>
        </div>

        <div className="collectionSlider">
          {masterTrendingInfo?.superstars?.[selectedGender]?.data[0].type ===
          "influencer_slider_collection" ? (
            <>
              <h3>{__("Collection")}</h3>
              {filteredSliderContent && filteredSliderContent.length > 0 ? (
                <ul className="spckItems">
                  {filteredSliderContent.map(renderSliderCollection)}
                </ul>
              ) : (
                <h2>
                  {__(`No results found for ${onPageinfluencerSearchText}`)}
                </h2>
              )}
            </>
          ) : null}

          <h3>{__("Influencer")}</h3>
          {filteredAllInfluencerContent &&
          filteredAllInfluencerContent.length > 0 ? (
            <ul
              block={
                "influencer_spckItems " +
                (filteredAllInfluencerContent?.length !== 1 &&
                !isMobile.any() &&
                !isMobile.tablet()
                  ? "showDivider "
                  : null) +
                (!isMobile.any()
                  ? " influencer_spckItemsForDesktop"
                  : " influencer_spckItemsForMobile")
              }
            >
              {filteredAllInfluencerContent?.map(renderInfluencer)}
            </ul>
          ) : (
            <h2>{__(`No results found for ${onPageinfluencerSearchText}`)}</h2>
          )}
        </div>
      </div>
    );
  };

  const renderSearchForDesktop = () => {
    const lowerInfluencerSearchText = influencerSearchText.toLowerCase();
    const sliderContent =
      masterTrendingInfo?.superstars?.[selectedGender]?.data?.[0]?.items;
    const filteredSliderContent = sliderContent?.filter((val) => {
      if (
        val?.collection?.title
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText) ||
        val?.influencer?.influencer_name
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText)
      ) {
        return val;
      }
    });
    const allInfluencerContent =
      allInfluencersList?.influencers?.superstars?.[selectedGender];
    const filteredAllInfluencerContent = allInfluencerContent?.filter((val) => {
      const fullName = val?.name + " " + val?.family_name;
      if (
        val?.influencer_name
          ?.toLowerCase()
          .includes(lowerInfluencerSearchText) ||
        fullName?.toLowerCase().includes(lowerInfluencerSearchText)
      ) {
        return val;
      }
    });
    return (
      <div className="searchBlock">
        <div className="collectionSlider">
          {masterTrendingInfo?.superstars?.[selectedGender]?.data[0].type ===
          "influencer_slider_collection" ? (
            <>
              <h3>{__("Collection")}</h3>
              {filteredSliderContent && filteredSliderContent.length > 0 ? (
                <ul className="spckItems">
                  {filteredSliderContent.map(renderSliderCollection)}
                </ul>
              ) : (
                <h2>{__(`No results found for ${influencerSearchText}`)}</h2>
              )}
            </>
          ) : null}

          <h3>{__("Influencer")}</h3>
          {filteredAllInfluencerContent &&
          filteredAllInfluencerContent.length > 0 ? (
            <ul
              block={
                "influencer_spckItems " +
                (filteredAllInfluencerContent?.length !== 1 &&
                !isMobile.any() &&
                !isMobile.tablet()
                  ? "showDivider "
                  : null) +
                (!isMobile.any()
                  ? " influencer_spckItemsForDesktop"
                  : " influencer_spckItemsForMobile")
              }
            >
              {filteredAllInfluencerContent?.map(renderInfluencer)}
            </ul>
          ) : (
            <h2>{__(`No results found for ${influencerSearchText}`)}</h2>
          )}
        </div>
      </div>
    );
  };

  const renderSearchBlock = () => {
    return (
      <>
        {!isMobile.any()
          ? renderSearchForDesktop()
          : isMobile.any() && renderSearchForMobile()}
      </>
    );
  };
  return <div>{renderSearchBlock()}</div>;
};

export default InfluencerSearch;
