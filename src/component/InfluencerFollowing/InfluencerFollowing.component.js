import React, { useEffect, useState } from "react";

import { formatCDNLink } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import { isArabic } from "Util/App";
import { followUnfollowInfluencer } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getAllInfluencers } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getEnvIDForInfluencer } from "../../util/Common/index";
import Event, {
  EVENT_FOLLOW_INFLUENCER_CLICK,
  EVENT_UNFOLLOW_INFLUENCER_CLICK,
  EVENT_GTM_INFLUENCER,
} from "Util/Event";

import Link from "Component/Link";
import Heart from "Component/Icons/EmptyInfluencer/Group.svg";

import "./InfluencerFollowing.style";

const InfluencerFollowing = (props) => {
  const {
    updateFollowingList,
    renderMySignInPopup,
    followingList,
    selectedGender,
  } = props;
  const [allInfluencersList, setAllInfluencersList] = useState([]);

  useEffect(() => {
    getAllInfluencersList();
  }, []);

  const getAllInfluencersList = () => {
    const locale = getLocaleFromUrl();
    const envID = getEnvIDForInfluencer();
    try {
      getAllInfluencers(envID, locale).then((resp) => {
        setAllInfluencersList(resp);
      });
    } catch (err) {
      console.error("Influencer error", err);
    }
  };

  const followUnfollow = (influencerID, follow) => {
    if (!isSignedIn()) {
      renderMySignInPopup();
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
        EventName: EVENT_UNFOLLOW_INFLUENCER_CLICK,
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

  const renderPopUp = () => {
    if (!isSignedIn()) {
      renderMySignInPopup();
    }
  };

  const renderEmptyInfluencer = () => {
    return (
      <div block="center">
        <div block="emptyInfluencer">
          <img src={Heart} alt="heart.svg" block="heartImage"></img>
          <h3 block="emptyInfluencerHeading">{__("Nothing here.")}</h3>
          <p block="emptyInfluencerDescription">
            {__("You are currently following no influencers.")}
          </p>
        </div>
      </div>
    );
  };

  const renderFollowingForGuestUser = () => {
    return (
      <div block="center">
        <div block="followingForGuestUser">
          <img src={Heart} alt="heart.svg" block="heartImage"></img>
          <h3 block="heading">{__("Nothing here.")}</h3>
          <p block="description">
            {__("You have to be logged in to see your favourite influencers.")}
          </p>
          <button block="signInButton" onClick={renderPopUp}>
            {__("SIGN IN OR REGISTER")}
          </button>
        </div>
      </div>
    );
  };

  const renderTile = (item, i) => {
    const { id: influencerId, image_url, influencer_name } = item;
    const isFollowed =
      followingList &&
      followingList.length > 0 &&
      followingList.includes(influencerId);
    if (image_url) {
      return (
        <span key={`${influencerId}+${i}`}>
          <Link
            to={formatCDNLink(
              `influencer.html/Store?influencerID=${influencerId}&selectedGender=${selectedGender}`
            )}
            key={i}
            data-banner-type="influencer_following_tab"
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
        </span>
      );
    } else {
      return null;
    }
  };
  const renderBannerAnimation = () => {
    return <div block="AnimationWrapper"></div>;
  };

  const renderTilesBlock = () => {
    const followingInfluencerInfo = allInfluencersList?.influencers?.superstars[
      selectedGender
    ].filter((val) => {
      return followingList?.includes(val.id);
    });

    return (
      <div>
        {!isSignedIn() ? (
          renderFollowingForGuestUser()
        ) : (
          <>
            {followingInfluencerInfo === undefined ? (
              renderBannerAnimation()
            ) : (
              <>
                {followingInfluencerInfo?.length === 0 ? (
                  renderEmptyInfluencer()
                ) : (
                  <div block="influencer_tiles">
                    <ul block="influencer_tiles_spckItems">
                      {followingInfluencerInfo.length > 0 &&
                        followingInfluencerInfo?.map(renderTile)}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };
  return <div>{renderTilesBlock()}</div>;
};
export default InfluencerFollowing;
