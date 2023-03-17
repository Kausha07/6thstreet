import React, { useState } from "react";
import { connect } from "react-redux";

import isMobile from "Util/Mobile";
import { formatCDNLink } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import { followUnfollowInfluencer } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import InfluencerDispatcher from "Store/Influencer/Influencer.dispatcher";
import { isArabic } from "Util/App";

import Link from "Component/Link";
import "./InfluencerTilesCollection.style";

export const mapStateToProps = (state) => ({
  influencerTilesData: state?.InfluencerReducer?.influencerTilesData,
  isLoadMoreClicked: state?.InfluencerReducer?.isLoadMoreClicked,
  prevSelectedGender: state?.InfluencerReducer?.prevSelectedGender,
});

export const mapDispatchToProps = (dispatch) => ({
  influencerLastTilesData: (data) =>
    InfluencerDispatcher.influencerLastTilesData(data, dispatch),

  loadMoreButtonClicked: (data) =>
    InfluencerDispatcher.loadMoreButtonClicked(data, dispatch),

  influencerPreviousSelectedGender: (prevGender) =>
    InfluencerDispatcher.influencerPreviousSelectedGender(prevGender, dispatch),
});

const InfluencerTilesCollection = (props) => {
  const {
    influencerTilesData,
    isLoadMoreClicked,
    selectedGender,
    prevSelectedGender,
    totalItems,
    influencerLastTilesData,
    loadMoreButtonClicked,
    influencerPreviousSelectedGender,
    updateFollowingList,
    renderMySignInPopup,
    buttonSignedIn,
    guestUser,
    setLastTapItem,
    index,
    followingList,
  } = props;
  const renderInfluencerItemToShow = () => {
    if (
      influencerTilesData.length > 0 &&
      isLoadMoreClicked &&
      selectedGender === prevSelectedGender
    ) {
      return influencerTilesData.length;
    }
    return 12;
  };

  const [influencerItemToShow, setInfluencerItemToShow] = useState(() => {
    const initialState = renderInfluencerItemToShow();
    return initialState;
  });

  const handleLoadMore = (items) => {
    let count = influencerItemToShow;
    let itemsToShow = count + 12;
    if (itemsToShow > totalItems) {
      itemsToShow = totalItems;
    }

    let content = [...items].slice(0, itemsToShow);
    setInfluencerItemToShow(itemsToShow);
    loadMoreButtonClicked(true);
    influencerLastTilesData(content);
    influencerPreviousSelectedGender(selectedGender);
  };

  const loadMore = (items) => {
    const itemsToShow = influencerItemToShow;
    let progressWidth = (itemsToShow * 100) / totalItems;
    let disablebtn = false;

    if (itemsToShow === totalItems) {
      disablebtn = true;
    }

    return (
      <div block="Product-LoadMore">
        <div>
          <div block="Product-Loaded-Info" mods={{ isArabic: isArabic() }}>
            {__("You’ve viewed %s of %s Influencers", itemsToShow, totalItems)}
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
          <button
            block="button"
            onClick={() => handleLoadMore(items)}
            disabled={disablebtn}
          >
            {__("Load More")}
          </button>
        </div>
      </div>
    );
  };

  const followUnfollow = (influencerID, follow) => {
    if (!isSignedIn()) {
      renderMySignInPopup();
      guestUser(influencerID, follow);
    } else {
      buttonSignedIn(true);
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

  const MoenangeInfluencerTrackingClick = (
    influencerId,
    influencer_name,
    i
  ) => {
    const eventData = {
      EventName: EVENT_INFLUENCER_DETAIL_CLICK,
      influencer_id: influencerId,
      name: influencer_name,
    };
    setLastTapItem(
      `InfluencerTilesCollection-${selectedGender}-${index}-${i}-${influencerId}`
    );
    Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
  };

  const renderTile = (item, i) => {
    const { id: influencerId, image_url, influencer_name } = item;
    const isFollowed =
      followingList &&
      followingList.length > 0 &&
      followingList.includes(influencerId);
    if (image_url) {
      return (
        <span
          key={`${influencerId}+${i}`}
          id={`InfluencerTilesCollection-${selectedGender}-${index}-${i}-${influencerId}`}
        >
          <Link
            to={formatCDNLink(
              `influencer.html/Store?influencerID=${influencerId}&selectedGender=${selectedGender}`
            )}
            key={`${influencerId}+${i}`}
            data-banner-type="influencer_tile"
            data-promotion-name={item.promotion_name ? item.promotion_name : ""}
            data-tag={item.tag ? block.tag : ""}
          >
            <div
              key={influencerId}
              onClick={() => {
                MoenangeInfluencerTrackingClick(
                  influencerId,
                  influencer_name,
                  i
                );
              }}
            >
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
        <ul block="influencer_tiles_spckItems">
          {isLoadMoreClicked &&
          selectedGender === prevSelectedGender &&
          items.length > 12
            ? influencerTilesData?.map(renderTile)
            : content.map(renderTile)}
        </ul>
        {items.length > 12 && !isMobile.any() ? loadMore(items) : null}
      </div>
    );
  };
  return <div>{renderTilesBlock()}</div>;
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfluencerTilesCollection);
