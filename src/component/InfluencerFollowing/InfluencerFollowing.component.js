import React, { useEffect, useState } from "react";

import { formatCDNLink } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import { isArabic } from "Util/App";
import { followUnfollowInfluencer } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getAllInfluencers } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getEnvIDForInfluencer } from "../../util/Common/index";

import Link from "Component/Link";
import "./InfluencerFollowing.style";

const InfluencerFollowing = (props) => {
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
    const { updateFollowingList, renderMySignInPopup } = props;
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
  };

  const renderTile = (item, i) => {
    const { id: influencerId, image_url, influencer_name } = item;
    const { followingList } = props;
    const isFollowed =
      followingList &&
      followingList.length > 0 &&
      followingList.includes(influencerId);
    if (image_url) {
      return (
        <span key={`${influencerId}+${i}`}>
          <Link
            to={formatCDNLink(
              `influencer.html/Store?influencerID=${influencerId}`
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
    const { followingList, selectedGender } = props;
    const followingInfluencerInfo = allInfluencersList?.influencers?.superstars[
      selectedGender
    ].filter((val) => {
      return followingList?.includes(val.id);
    });

    return (
      <div>
        {followingInfluencerInfo === undefined ? (
          renderBannerAnimation()
        ) : (
          <div block="influencer_tiles">
            <ul block="influencer_tiles_spckItems">
              {followingInfluencerInfo.length > 0 &&
                followingInfluencerInfo?.map(renderTile)}
            </ul>
          </div>
        )}
      </div>
    );
  };
  return <div>{renderTilesBlock()}</div>;
};
export default InfluencerFollowing;
