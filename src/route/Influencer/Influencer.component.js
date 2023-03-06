import React, { useEffect, useState, createRef } from "react";
import { connect } from "react-redux";

import {
  getTrendingInfo,
  getFollowedInfluencer,
  followUnfollowInfluencer,
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
  const [isMobileRefineButtonClicked, setIsMobileRefineButtonClicked] =
    useState(false);
  const [influencerSearchText, setInfluencerSearchText] = useState("");
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [index, setIndex] = useState(0);
  const [loggedIn, setLoggedIn] = useState(props.isSignedIn);
  const [tempInfluencerID, setTempInfluencerID] = useState(null);
  const [payload, setPayload] = useState({});
  const searchWrapperRef = createRef();
  const mobileSearchWrapperRef = createRef();
  const refineWrapperRef = createRef();
  const mobileRefineWrapperRef = createRef();

  useEffect(() => {
    trendingInfo();
    return () => {
      window.pageType = undefined;
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [searchWrapperRef, refineWrapperRef, mobileRefineWrapperRef]);

  useEffect(() => {
    if (props.isSignedIn) {
      getFollowingList();
    } else {
      setFollowingList([]);
    }
  }, [props.isSignedIn, loggedIn]);

  useEffect(() => {
    setIndex(masterTrendingInfo?.superstars?.[selectedGender]?.data.length);
  }, [selectedGender]);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    if (isMobileRefineButtonClicked && isMobile.any()) {
      html.style.overflow = "hidden";
    }
    return () => {
      html.style.overflow = "auto";
    };
  }, [isMobileRefineButtonClicked]);

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

  const closePopupOnOutsideClick = (e) => {
    if (
      isSearchButtonClicked &&
      searchWrapperRef.current &&
      !searchWrapperRef.current.contains(e.target)
    ) {
      setIsSearchButtonClicked(false);
      setInfluencerSearchText("");
    }

    if (
      isRefineButtonClicked &&
      refineWrapperRef.current &&
      !refineWrapperRef.current.contains(e.target)
    ) {
      setRefine(false);
    }
    if (
      isMobileRefineButtonClicked &&
      mobileRefineWrapperRef.current &&
      !mobileRefineWrapperRef.current.contains(e.target)
    ) {
      setIsMobileRefineButtonClicked(false);
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
      console.error(
        "Error while fetching list of Followed Influencer on Influencer's main page",
        err
      );
    }
  };

  const guestUser = (influencerID, follow) => {
    setTempInfluencerID(influencerID);
    const payload = {
      influencerId: influencerID,
      following: follow,
    };
    setPayload(payload);
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
          <InfluencerSliderCollection
            item={item}
            cartIcon={cartIcon}
            selectedGender={selectedGender}
          />
        ) : (
          <InfluencerTilesCollection
            item={item}
            totalItems={num}
            followingList={followingList}
            updateFollowingList={updateFollowingList}
            renderMySignInPopup={showMyAccountPopup}
            buttonSignedIn={buttonSignedIn}
            selectedGender={selectedGender}
            guestUser={guestUser}
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
      <div block="refineButton-div" elem="Refine" ref={refineWrapperRef}>
        <button
          block="refineButton"
          onClick={(e) => handleRefineButtonClick(e)}
        >
          <img
            block="refineImage"
            mods={{ isArabic: isArabic() }}
            src={Refine}
          />
          {__("refine")}
        </button>

        {!isMobile.any() && isRefineButtonClicked ? (
          <div block="refineFilter">
            <ul
              block="ul"
              onClick={(e) => handleRefineButtonClick(e)}
              mods={{ isArabic: isArabic() }}
            >
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

  const closeSearchMobilePopUp = () => {
    setIsSearchButtonClicked(false);
  };

  const handleSearchInfluencerText = (e) => {
    setInfluencerSearchText(e.target.value);
  };

  const handleSearchButtonClick = (e) => {
    e.stopPropagation();
    setIsSearchButtonClicked(true);
  };

  const renderInfluencerSearch = () => {
    return (
      <div block="influencerSearch">
        <img block="searchIcon" src={Search} mods={{ isArabic: isArabic() }} />
        <div ref={!isMobile.any() ? searchWrapperRef : mobileSearchWrapperRef}>
          <input
            type="text"
            block="influencerSearchInput"
            mods={{ isArabic: isArabic() }}
            value={influencerSearchText}
            id="influencerSearch"
            placeholder={__("Search collections, influencers etc...")}
            onClick={(e) => handleSearchButtonClick(e)}
            onChange={handleSearchInfluencerText}
          />
          {isSearchButtonClicked && !isMobile.any() ? (
            <InfluencerSearch
              followingList={followingList}
              selectedGender={selectedGender}
              masterTrendingInfo={masterTrendingInfo}
              influencerSearchText={influencerSearchText}
              updateFollowingList={updateFollowingList}
              renderMySignInPopup={showMyAccountPopup}
              guestUser={guestUser}
              closeSearchMobilePopUp={closeSearchMobilePopUp}
            />
          ) : null}
        </div>
      </div>
    );
  };

  const renderInfluencerSearchForMobile = () => {
    return (
      <div block="influencerSearch">
        <img block="searchIcon" src={Search} mods={{ isArabic: isArabic() }} />
        <div ref={!isMobile.any() ? searchWrapperRef : mobileSearchWrapperRef}>
          <input
            type="text"
            block="influencerSearchInput"
            mods={{ isArabic: isArabic() }}
            id="influencerSearch"
            placeholder={__("Search collections, influencers etc...")}
            onClick={(e) => handleSearchButtonClick(e)}
            autocomplete="off"
            readOnly
          />
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div block="headerMain">
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
              }}
            >
              {__("Following")}
            </button>
          </div>
          {!isMobile.any() && (
            <div className="influencerSearch">{renderInfluencerSearch()}</div>
          )}
          {!isMobile.any() ? (
            <div block="Refine">{renderRefine()}</div>
          ) : (
            isMobile.any() && <div block="Refine">{renderMsiteRefine()}</div>
          )}
        </div>

        {isMobile.any() && (
          <div className="influencerSearch">
            {renderInfluencerSearchForMobile()}
          </div>
        )}
      </div>
    );
  };

  const handleMobileRefineButtonClick = () => {
    setIsMobileRefineButtonClicked(!isMobileRefineButtonClicked);
    const eventData = {
      EventName: EVENT_INFLUENCER_REFINE_CLICK,
    };
    Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
  };

  const renderMsiteRefine = () => {
    return (
      <div block="refineButton-div" elem="Refine">
        <button
          block="refineButton"
          onClick={(e) => handleMobileRefineButtonClick(e)}
        >
          <img
            block="refineImage"
            mods={{ isArabic: isArabic() }}
            src={Refine}
          />
          {__("refine")}
        </button>
      </div>
    );
  };

  const renderMsite = () => {
    const genderArray = ["Women", "Men", "Kids"];
    return (
      <>
        {isMobile.any() && isMobileRefineButtonClicked && (
          <div block="refinePopupInfluencer">
            <div block="refineOverlayInfluencer">
              <div
                block="refineDetailBlockInfluencer"
                ref={mobileRefineWrapperRef}
              >
                <p block="refineButtonHeading">{__("BROWSE BY")}</p>
                {genderArray.map((val, index) => {
                  return (
                    <div block="refineButtonForMobile" key={val + index}>
                      <p
                        block="refineItemNameInfluencer"
                        mix={{
                          block: "refineItemNameInfluencer",
                          elem:
                            selectedGender === val.toUpperCase()
                              ? "refineSelected"
                              : null,
                        }}
                        id={val + index}
                        name={val}
                        value={val}
                        onClick={() => {
                          setSelectedGender(val.toUpperCase());
                          setIsMobileRefineButtonClicked(false);
                        }}
                        key={index}
                      >
                        {val === "Women"
                          ? __("Women")
                          : val === "Men"
                          ? __("Men")
                          : val === "Kids" && __("Kids")}
                      </p>
                      <div block="hr"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
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
        {renderHeader()}
        {renderMsite()}
        {isSearchButtonClicked && isMobile.any() && (
          <InfluencerSearch
            followingList={followingList}
            selectedGender={selectedGender}
            masterTrendingInfo={masterTrendingInfo}
            influencerSearchText={influencerSearchText}
            updateFollowingList={updateFollowingList}
            renderMySignInPopup={showMyAccountPopup}
            guestUser={guestUser}
            closeSearchMobilePopUp={closeSearchMobilePopUp}
          />
        )}
        <div block="trendingBlock">
          {renderMySignInPopup()}
          {showTrending && navigateTrending()}
          {showFollowing && navigateFollowing()}
        </div>
      </ContentWrapper>
    </main>
  );
};

export default connect(mapStateToProps, null)(Influencer);
