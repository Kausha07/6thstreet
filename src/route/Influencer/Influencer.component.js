import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  getTrendingInfo,
  getFollowedInfluencer,
} from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getLocaleFromUrl } from "Util/Url/Url";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App/App";
import { getEnvIDForInfluencer } from "../../util/Common/index";

import ContentWrapper from "Component/ContentWrapper";
import InfluencerTilesCollection from "Component/InfluencerTilesCollection/InfluencerTilesCollection.component";
import InfluencerSliderCollection from "Component/InfluencerSliderCollection/InfluencerSliderCollection.component";
import InfluencerFollowing from "Component/InfluencerFollowing/InfluencerFollowing.component";
import InfluencerSearch from "Component/InfluencerSearch/InfluencerSearch.component";
import MyAccountOverlay from "Component/MyAccountOverlay";

import "./Influencer.style.scss";
import cartIcon from "./icons/cart-icon.png";
import Refine from "../../component/Icons/Refine/icon.png";
import Search from "../../component/Icons/Search/icon.svg";

export const mapStateToProps = (state) => ({
  isSignedIn: state.MyAccountReducer.isSignedIn,
});

const Influencer = (props) => {
  const [masterTrendingInfo, setMasterTrendingInfo] = useState({});
  const [selectedGender, setSelectedGender] = useState("WOMEN");
  const [showTrending, setShowTrending] = useState(true);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isRefineButtonClicked, setRefine] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [influencerSearchText, setInfluencerSearchText] = useState("");
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [index, setIndex] = useState(0);
  const [loggedIn, setLoggedIn] = useState(props.isSignedIn);
  setFollowingList;

  useEffect(() => {
    trendingInfo();
  }, []);

  useEffect(() => {
    if (props.isSignedIn) {
      getFollowingList();
    }
  }, [props.isSignedIn, loggedIn]);

  useEffect(() => {
    setIndex(masterTrendingInfo?.superstars?.[selectedGender]?.data.length);
  }, [selectedGender]);

  const buttonSignedIn = (val) => {
    setLoggedIn(val);
  };

  const updateFollowingList = (influencerID, follow) => {
    const tempFollowingList = [...followingList];
    if (follow) {
      const finalFollowingList = tempFollowingList.filter(
        (listID) => listID !== influencerID
      );
      setFollowingList(finalFollowingList);
    } else {
      tempFollowingList.push(influencerID);
      setFollowingList(tempFollowingList);
    }
  };

  const trendingInfo = async () => {
    const locale = getLocaleFromUrl();
    const envID = getEnvIDForInfluencer();
    try {
      getTrendingInfo(locale, envID).then((resp) => {
        setMasterTrendingInfo(resp);
        setIndex(resp?.superstars?.[selectedGender]?.data.length);
      });
    } catch (err) {
      console.error(
        "Error while fetching Trending Info on Influencer's main page",
        err
      );
    }
  };

  const getFollowingList = async () => {
    try {
      getFollowedInfluencer().then((resp) => {
        setFollowingList(resp);
      });
    } catch (err) {
      console.error(
        "Error while fetching list of Followed Influencer on Influencer's main page",
        err
      );
    }
  };

  const renderBannerAnimation = () => {
    return <div block="AnimationWrapper"></div>;
  };

  const renderTrending = (item, i) => {
    const { type, items } = item;
    const num =
      masterTrendingInfo?.superstars?.[selectedGender]?.data[index - 1]?.items
        ?.length;
    return (
      <div key={`${type}+${i}-${selectedGender}`}>
        {type === "influencer_slider_collection" ? (
          <InfluencerSliderCollection item={item} cartIcon={cartIcon} />
        ) : (
          <InfluencerTilesCollection
            item={item}
            totalItems={num}
            followingList={followingList}
            updateFollowingList={updateFollowingList}
            renderMySignInPopup={showMyAccountPopup}
            buttonSignedIn={buttonSignedIn}
          />
        )}
      </div>
    );
  };

  const navigateTrending = () => {
    const trending_Info =
      masterTrendingInfo?.superstars?.[selectedGender]?.data;
    return (
      <div>
        {trending_Info === undefined
          ? renderBannerAnimation()
          : trending_Info.map(renderTrending)}
      </div>
    );
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

  const navigateFollowing = () => {
    return (
      <InfluencerFollowing
        followingList={followingList}
        selectedGender={selectedGender}
        updateFollowingList={updateFollowingList}
        renderMySignInPopup={showMyAccountPopup}
      />
    );
  };

  const handleRefineButtonClick = () => {
    setRefine(!isRefineButtonClicked);
  };

  const renderRefine = () => {
    return (
      <div block="refineButton-div" elem="Refine">
        <button block="refine-button" onClick={handleRefineButtonClick}>
          <img
            block="refineImage"
            mods={{ isArabic: isArabic() }}
            src={Refine}
          />
          {__("refine")}
        </button>

        {!isMobile.any() && isRefineButtonClicked ? (
          <div block="refineFilter">
            <ul>
              <li>
                <div>
                  <input
                    type="radio"
                    block="inputBox"
                    id="women"
                    name="gender"
                    value="WOMEN"
                    onChange={(e) => setSelectedGender(e.target.value)}
                    checked={selectedGender === "WOMEN"}
                  />
                  <label htmlFor="women">{__("Women")}</label>
                </div>
              </li>
              <li>
                <div>
                  <input
                    type="radio"
                    block="inputBox"
                    id="men"
                    name="gender"
                    value="MEN"
                    onChange={(e) => setSelectedGender(e.target.value)}
                    checked={selectedGender === "MEN"}
                  />
                  <label htmlFor="men">{__("Men")}</label>
                </div>
              </li>
              <li>
                <div>
                  <input
                    type="radio"
                    block="inputBox"
                    id="kids"
                    name="gender"
                    value="KIDS"
                    onChange={(e) => setSelectedGender(e.target.value)}
                    checked={selectedGender === "KIDS"}
                  />
                  <label htmlFor="kids">{__("Kids")}</label>
                </div>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    );
  };

  const handleSearchInfluencerText = (e) => {
    setInfluencerSearchText(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(!isSearchButtonClicked);
  };

  const renderInfluencerSearch = () => {
    return (
      <div block="influencerSearch">
        <img block="searchIcon" src={Search} mods={{ isArabic: isArabic() }} />
        <input
          type="text"
          block="influencerSearchInput"
          mods={{ isArabic: isArabic() }}
          id="influencerSearch"
          placeholder={__("Search collections, influencers etc...")}
          onClick={handleSearchButtonClick}
          onChange={handleSearchInfluencerText}
        />
        {isSearchButtonClicked ? (
          <InfluencerSearch
            followingList={followingList}
            selectedGender={selectedGender}
            masterTrendingInfo={masterTrendingInfo}
            influencerSearchText={influencerSearchText}
            updateFollowingList={updateFollowingList}
            renderMySignInPopup={showMyAccountPopup}
          />
        ) : null}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div block="header">
        <div block="trending_following_buttons">
          <button
            block={"button_style " + (showTrending ? "active" : null)}
            onClick={() => {
              setShowTrending(true);
              setShowFollowing(false);
            }}
          >
            {__("Trending")}
          </button>
          <button
            block={"button_style " + (showFollowing ? "active" : null)}
            onClick={() => {
              setShowFollowing(true);
              setShowTrending(false);
              if (!props.isSignedIn) {
                showMyAccountPopup();
              }
            }}
          >
            {__("Following")}
          </button>
        </div>
        <div className="influencerSearch">{renderInfluencerSearch()}</div>
        <div block="Refine">{renderRefine()}</div>
      </div>
    );
  };

  return (
    <main block="Influencer">
      <ContentWrapper
        mix={{ block: "Influencer" }}
        wrapperMix={{
          block: "Influencer",
          elem: "Wrapper",
        }}
        label={__("Influencer")}
      >
        {renderMySignInPopup()}
        {renderHeader()}
        {showTrending && navigateTrending()}
        {showFollowing && navigateFollowing()}
      </ContentWrapper>
    </main>
  );
};

export default connect(mapStateToProps, null)(Influencer);
