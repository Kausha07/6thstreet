import React, { useEffect, useState, createRef } from "react";
import { connect, useDispatch } from "react-redux";

import { getEnvIDForInfluencer } from "Util/Common/index";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { formatCDNLink } from "Util/Url";
import { getLocaleFromUrl } from "Util/Url/Url";
import { getQueryParam } from "Util/Url";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import {
  getInfluencerInfo,
  getFollowedInfluencer,
  followUnfollowInfluencer,
} from "Util/API/endpoint/Influencer/Influencer.endpoint";

import PLPDispatcher from "Store/PLP/PLP.dispatcher";

import share from "Component/Icons/Share/icon.svg";
import SocialMediaOverlay from "Component/SocialMediaOverlay/index";
import MyAccountOverlay from "Component/MyAccountOverlay";
import PLP from "Route/PLP";
import ContentWrapper from "Component/ContentWrapper";
import Link from "Component/Link";

import "./InfluencerStore.style";

export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);
export const mapDispatchToProps = (dispatch) => ({
  resetPLPData: (options) => PLPDispatcher.resetPLPData(dispatch),
});
export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

const InfluencerStore = (props) => {
  const [storeInfo, setStoreInfo] = useState(undefined);
  const [influencerName, setInfluencerName] = useState("");
  const [influencerId, setInfluencerId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [algoliaQuery, setAlgoliaQuery] = useState("");
  const [followingList, setFollowingList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("WOMEN");
  const [tempInfluencerID, setTempInfluencerID] = useState(null);
  const [payload, setPayload] = useState({});
  const [loggedIn, setLoggedIn] = useState(props.isSignedIn);
  const [shareButtonClicked, setShareButtonClicked] = useState(false);
  const shareMediaRef = createRef();

  const dispatch = useDispatch();

  useEffect(() => {
    WebUrlParser.setPage("0");
    document.body.scrollTo(0, 0);
    getStoreInfo();
    return () => {
      props.resetPLPData();
    };
  }, []);

  useEffect(() => {
    updateBreadcrumbs();
  }, [influencerName]);

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [shareMediaRef]);

  useEffect(() => {
    if (props.isSignedIn) {
      getFollowingList();
    } else {
      setFollowingList([]);
    }
  }, [props.isSignedIn, loggedIn]);

  const updateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        url: "",
        name: __("%s's Store", influencerName),
      },
      {
        url: "/influencer.html",
        name: __("Influencer"),
      },
    ];

    BreadcrumbsDispatcher.then(({ default: dispatcher }) =>
      dispatcher.update(breadcrumbs, dispatch)
    );
  };

  const updateFollowingList = (influencerID, follow) => {
    const temp = [...followingList];
    if (follow) {
      const newarr = temp.filter((listID) => listID !== influencerID);
      setFollowingList(newarr);
    } else {
      temp.push(influencerID);
      setFollowingList(temp);
    }
  };

  const getFollowingList = async () => {
    try {
      getFollowedInfluencer().then((resp) => {
        setFollowingList(resp);
        if (tempInfluencerID !== null) {
          const influencerID = payload.influencerId;
          const follow = payload.following;
          const payload_ = {
            influencerId: influencerID,
            following: !follow,
          };
          followUnfollowInfluencer(payload_).then((res) => {
            const arr = [...resp];
            arr.push(tempInfluencerID);
            setFollowingList(arr);
          });
        }
      });
    } catch (err) {
      console.error("Influencer error", err);
    }
  };

  const getStoreInfo = () => {
    const influencer_id = getQueryParam("influencerID", location);
    const gender = getQueryParam("selectedGender", location);
    const envID = getEnvIDForInfluencer();
    const locale = getLocaleFromUrl();

    setInfluencerId(influencer_id);
    setSelectedGender(gender);
    try {
      getInfluencerInfo(influencer_id, envID, locale).then((resp) => {
        if (resp) {
          setAlgoliaQuery(resp["algolia_query"]["categories.level2"]);
          setInfluencerName(resp?.influencer_name);
          setStoreInfo(resp);
        }
      });
    } catch (error) {
      console.error("Influencer Store error", error);
    }
  };

  const showMyAccountPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const onSignIn = () => {
    closePopup();
  };

  const renderMySignInPopup = () => {
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay closePopup={closePopup} onSignIn={onSignIn} isPopup />
    );
  };

  const GTLsection = (block, i) => {
    const {
      id: influncer_collection_id,
      link,
      products,
      thumbnail_url,
      title,
    } = block;

    return (
      <li
        key={influncer_collection_id}
        block="spckItem"
        mods={{ isArabic: isArabic() }}
      >
        <div block="eventImage">
          <Link
            to={formatCDNLink(
              `./Collection?influencerCollectionID=${influncer_collection_id}&influencerID=${influencerId}`
            )}
            key={i}
            data-banner-type="influencer_slider_banner"
            data-promotion-name={
              block.promotion_name ? item.promotion_name : ""
            }
            data-tag={block.tag ? block.tag : ""}
          >
            <img src={thumbnail_url} alt="get_the_look_collection" />
          </Link>
        </div>
      </li>
    );
  };

  const renderBannerAnimation = () => {
    return <div block="AnimationWrapper"></div>;
  };

  const renderGetTheLookSection = (storeInfoItem) => {
    const collections = storeInfoItem?.audience?.[selectedGender]?.collections;

    if (collections && collections.length > 0) {
      return (
        <div block="getTheLookSection">
          <h3 block="GTLheading">{__("Get the look")}</h3>
          <ul block="spckItems">{collections.map(GTLsection)}</ul>
        </div>
      );
    } else {
      return null;
    }
  };

  const storePageProducts = () => {
    if (algoliaQuery !== undefined) {
      return (
        <div block="storeProducts">
          <h3 block="storeProductHeading">{__("My top picks")}</h3>
          <PLP />
        </div>
      );
    }
  };

  const buttonSignedIn = (val) => {
    setLoggedIn(val);
  };

  const guestUser = (influencerID, follow) => {
    setTempInfluencerID(influencerID);
    const payload = {
      influencerId: influencerID,
      following: follow,
    };
    setPayload(payload);
  };

  const followUnfollow = (influencerID, follow) => {
    if (!props.isSignedIn) {
      showMyAccountPopup();
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
  };

  const handleShareStore = () => {
    setShareButtonClicked(!shareButtonClicked);
  };

  const closePopupOnOutsideClick = (e) => {
    if (
      shareButtonClicked &&
      shareMediaRef.current &&
      !shareMediaRef.current.contains(e.target)
    ) {
      setShareButtonClicked(false);
    }
  };

  const renderMainSection = (storeInfoItem) => {
    const { image_url, influencer_name, store_link, collections, id } =
      storeInfoItem;
    const collectionCount = collections && collections.length;
    const isFollowed =
      followingList &&
      followingList.length > 0 &&
      followingList.includes(influencerId);
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "influencerStore_share");
    const product = {
      name: influencer_name,
      sku: id,
      url: store_link,
    };

    return (
      <div block="spck-main">
        <div block="mainImage">
          <img src={image_url} alt="Influencer_banner"></img>
        </div>
        <div block="Influencer_info_block">
          <h1>{influencer_name}</h1>
          {collectionCount !== 0 && <p>{collectionCount} Looks</p>}

          <div block="shareandfollowButton" ref={shareMediaRef}>
            <button
              block="shareButton"
              onClick={handleShareStore}
              mods={{ isArabic: isArabic() }}
            >
              <img
                block="shareIcon"
                mods={{ isArabic: isArabic() }}
                src={share}
              />
              {__("Share Store")}
            </button>
            {shareButtonClicked ? (
              <SocialMediaOverlay
                title={document.title}
                text={__("Hey check this out: %s", document.title)}
                url={url.href}
                image={image_url}
                product={product}
              />
            ) : null}

            {isFollowed ? (
              <button
                block="followingButton"
                mods={{ isArabic: isArabic() }}
                onClick={() => followUnfollow(influencerId, true)}
              >
                {__("Following")}
              </button>
            ) : (
              <button
                block="followButton"
                mods={{ isArabic: isArabic() }}
                onClick={() => followUnfollow(influencerId, false)}
              >
                {__("Follow")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStorePage = (storeInfoItem) => {
    return (
      <>
        {renderMainSection(storeInfoItem)}
        {renderGetTheLookSection(storeInfoItem)}
        {storePageProducts()}
      </>
    );
  };
  const renderMain = () => {
    return (
      <>
        {storeInfo === undefined
          ? renderBannerAnimation()
          : renderStorePage(storeInfo)}
      </>
    );
  };

  return (
    <main block="InfluencerStore">
      <ContentWrapper
        mix={{ block: "InfluencerStore" }}
        wrapperMix={{
          block: "InfluencerStore",
          elem: "Wrapper",
        }}
        label={__("InfluencerStore")}
      >
        {renderMySignInPopup()}
        {renderMain()}
      </ContentWrapper>
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InfluencerStore);
