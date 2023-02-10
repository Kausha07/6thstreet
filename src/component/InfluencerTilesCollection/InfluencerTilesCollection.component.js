import React, { useState } from "react";

import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import { followUnfollowInfluencer } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { isArabic } from "Util/App";

import Link from "Component/Link";
import "./InfluencerTilesCollection.style";

const InfluencerTilesCollection = (props) => {
  const [influencerItemToShow, setInfluencerItemToShow] = useState(12);

  const handleLoadMore = () => {
    const { totalItems } = props;
    let count = influencerItemToShow;
    let itemsToShow = count + 12;
    if (itemsToShow > totalItems) {
      itemsToShow = totalItems;
    }
    setInfluencerItemToShow(itemsToShow);
  };

  const loadMore = () => {
    const itemsToShow = influencerItemToShow;
    const { totalItems } = props;
    let progressWidth = (itemsToShow * 100) / totalItems;
    let disablebtn = false;

    if (itemsToShow === totalItems) {
      disablebtn = true;
    }
    return (
      <div block="Product-LoadMore">
        <div>
          <div block="Product-Loaded-Info" mods={{ isArabic: isArabic() }}>
            {__("You’ve viewed %s of %s influencer", itemsToShow, totalItems)}
          </div>

          <div block="Product-ProgressBar">
            <div block="Product-ProgressBar-Container">
              <div
                block="Product-ProgressBar-Bar"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div block="LoadMore">
          <button block="button" onClick={handleLoadMore} disabled={disablebtn}>
            {__("Load More")}
          </button>
        </div>
      </div>
    );
  };

  const followUnfollow = (influencerID, follow) => {
    const { updateFollowingList, renderMySignInPopup, buttonSignedIn } = props;
    if (!isSignedIn()) {
      renderMySignInPopup();
    } else {
      buttonSignedIn();
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
            key={`${influencerId}+${i}`}
            data-banner-type="influencer_tile"
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

  const renderTilesBlock = () => {
    const {
      item: { type, items },
    } = props;
    let content = [...items];

    if (type === "influencer_tiles_collection" && !isMobile.any()) {
      content = items.slice(0, influencerItemToShow);
    }
    return (
      <div block="influencer_tiles" mods={{ isArabic: isArabic() }}>
        <ul block="influencer_tiles_spckItems">{content.map(renderTile)}</ul>
        {items.length > 12 && !isMobile.any() ? loadMore() : null}
      </div>
    );
  };
  return <div>{renderTilesBlock()}</div>;
};
export default InfluencerTilesCollection;
