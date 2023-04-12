import React, { useEffect, useState, createRef } from "react";
import { useDispatch, connect } from "react-redux";
import { v4 } from "uuid";

import { getInfluencerInfo } from "Util/API/endpoint/Influencer/Influencer.endpoint";
import { getEnvIDForInfluencer } from "../../util/Common/index";
import { getQueryParam } from "Util/Url";
import { getLocaleFromUrl } from "Util/Url/Url";
import isMobile from "Util/Mobile";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { isArabic } from "Util/App";
import Event, {
  EVENT_SHARE_COLLECTION_CLICK,
  EVENT_GTM_INFLUENCER,
} from "Util/Event";

import PLPDispatcher from "Store/PLP/PLP.dispatcher";
import InfluencerDispatcher from "Store/Influencer/Influencer.dispatcher";

import ContentWrapper from "Component/ContentWrapper";
import MyAccountOverlay from "Component/MyAccountOverlay";
import ProductItem from "Component/ProductItem";
import ProductLoad from "Component/PLPLoadMore";
import PLPPagePlaceholder from "Component/PLPPagePlaceholder";
import SocialMediaOverlay from "Component/SocialMediaOverlay/SocialMediaOverlay.component";
import share from "Component/Icons/Share/icon.svg";

import "./InfluencerCollection.style";
import soundOn from "./icons/sound_on.png";
import soundOff from "./icons/sound_off.png";
import influencerProductCount from "./InfluencerCollection.config";

export const BreadcrumbsDispatcher = import(
  "Store/Breadcrumbs/Breadcrumbs.dispatcher"
);

export const mapStateToProps = (state) => ({
  pages: state.PLP.pages,
  productLoading: state.PLP.productLoading,
  meta: state.PLP.meta,
  selectedGender: state?.InfluencerReducer?.selectedGender,
});

export const mapDispatchToProps = (dispatch, state) => ({
  requestProductList: (options) =>
    PLPDispatcher.requestProductList(options, dispatch, state),
  requestProductListPage: (options) =>
    PLPDispatcher.requestProductListPage(options, dispatch),
  resetPLPData: (options) => PLPDispatcher.resetPLPData(dispatch),
  setInfluencerName: (name) =>
    InfluencerDispatcher.setInfluencerName(name, dispatch),
  isCollectionPage: (val) =>
    InfluencerDispatcher.isCollectionPage(val, dispatch),
  isStorePage: (val) => InfluencerDispatcher.isStorePage(val, dispatch),
});

const InfluencerCollection = (props) => {
  const dispatch = useDispatch();
  const {
    setInfluencerName,
    resetPLPData,
    requestProductList,
    requestProductListPage,
    productLoading,
    isCollectionPage,
    isStorePage,
    selectedGender,
  } = props;

  const [influencerData, setInfluencerData] = useState({});
  const [collectionId, setCollectionID] = useState(null);
  const [influencerID, setInfluencerID] = useState(null);
  const [influencerName, setInfluencerNameOnPage] = useState("");
  const [muted, setMuted] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [shareButtonClicked, setShareButtonClicked] = useState(false);
  const [pageKeyFromState, setPageKeyFromState] = useState(0);
  const shareMediaRef = createRef();

  const updateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        url: "",
        name: __("%s's Collection", influencerName),
      },
      {
        url: `/influencer.html/Store?influencerID=${influencerID}&selectedGender=${selectedGender}`,
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

  const getInfluencerData = () => {
    const influencer_id = getQueryParam("influencerID", location);
    const collection_id = getQueryParam("influencerCollectionID", location);
    const envID = getEnvIDForInfluencer();
    const locale = getLocaleFromUrl();
    setInfluencerID(influencer_id);
    setCollectionID(collection_id);

    try {
      getInfluencerInfo(influencer_id, envID, locale).then((resp) => {
        if (resp) {
          setInfluencerNameOnPage(resp?.influencer_name.trim());
          setInfluencerData(resp);
          setInfluencerName(resp?.influencer_name);
          isCollectionPage(true);
          isStorePage(false);
        }
      });
    } catch (error) {
      console.error(
        "Error while fetching Influencer info on Influencer's Collection page",
        err
      );
    }
  };

  useEffect(() => {
    WebUrlParser.setPage("0");
    document.body.scrollTo(0, 0);

    return () => {
      resetPLPData();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, [shareMediaRef]);

  useEffect(() => {
    getInfluencerData();
    updateBreadcrumbs();
    if (pageKeyFromState === 0 || pageKeyFromState === "0") {
      requestProduct();
    }
  }, [influencerName]);

  useEffect(() => {
    if (pageKeyFromState !== 0 || pageKeyFromState !== "0") {
      requestProductListPage_();
    }
  }, [pageKeyFromState]);

  const getParams = () => {
    const { params: parsedParams } = WebUrlParser.parsePLP(location.href);

    let params = {
      q: "",
    };

    if (Object.keys(parsedParams).includes("page")) {
      params["page"] = pageKeyFromState;
    }

    params[
      "categories.level2"
    ] = `Influencers /// Collections /// ${collectionId}`;

    params["pageType"] = "InfluencerPage";
    params["InfluencerProductCount"] = influencerProductCount;

    const finalParams = { ...params };
    return finalParams;
  };

  const requestProduct = () => {
    if (collectionId !== null) {
      requestProductList({ options: getParams() });
    }
  };

  const requestProductListPage_ = () => {
    requestProductListPage({ options: getParams() });
  };

  const renderBannerAnimation = () => {
    return <div block="AnimationWrapper"></div>;
  };

  const setPageVisibility = () => {
    const pageKeyURL = getQueryParam("p", location);
    setPageKeyFromState(pageKeyURL);
  };

  const check = (item) => {
    if (item.id === `${collectionId}`) {
      return item;
    }
  };

  const handleShareStore = () => {
    setShareButtonClicked(!shareButtonClicked);

    const eventData = {
      EventName: EVENT_SHARE_COLLECTION_CLICK,
    };
    Event.dispatch(EVENT_GTM_INFLUENCER, eventData);
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

  const toggleMute = () => {
    const video = document.querySelector("#influencerVideo");
    if (muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    setMuted(!muted);
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

  const handlePageCount = () => {
    const fnum = parseInt(pageKeyFromState) + 1;
    WebUrlParser.setPage(fnum);
    const pageKeyURL = getQueryParam("p", location);
    setPageKeyFromState(pageKeyURL);
  };

  const loadMore = () => {
    const { pages = {} } = props;
    if (pages[0]?.products?.length == 0) {
      return null;
    }
    return (
      <div block="LoadMore" onClick={handlePageCount}>
        <ProductLoad pageKey={pageKeyFromState} productLoad={productLoading} />
      </div>
    );
  };

  const renderCollectionProducts = ([key, page], i) => {
    const { products, isPlaceholder, isFirst = false } = page;
    if (isMobile.any() && isPlaceholder) {
      return (
        <PLPPagePlaceholder
          isFirst={isFirst}
          key={v4()}
          pageIndex={key}
          setPageVisibility={setPageVisibility}
        />
      );
    }

    return (
      <div className="Influencer_Products" key={key}>
        <div className="PLPPage">
          <ul className="ProductItems">
            {products &&
              products.length > 0 &&
              products.map((item, i) => {
                return (
                  <ProductItem
                    position={1}
                    product={item}
                    renderMySignInPopup={showMyAccountPopup}
                    key={v4()}
                    page="influencer"
                    pageType="influencer"
                    isVueData={false}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    );
  };

  const renderMainUpperblock = (collectionInfo) => {
    const { description, link, products, thumbnail_url, title, type, url, id } =
      collectionInfo[0];
    const image_url = influencerData && influencerData.image_url;
    const influencer_name = influencerData && influencerData.influencer_name;
    const { pages: productsInfo } = props;
    const pageURL = new URL(window.location.href);
    const product = { name: influencer_name, sku: id, url: link };

    return (
      <div className="spck-main">
        <div className="mainImage">
          {type === "image" ? (
            <div>
              <img
                src={thumbnail_url}
                block="backgroundImage"
                alt="Influencer_banner"
              ></img>
              <div className="circle_image">
                <img src={image_url} alt="Influencer_image"></img>
              </div>
            </div>
          ) : (
            <div className="mainVideo">
              <video
                id="influencerVideo"
                onContextMenu={(event) => event.preventDefault()}
                src={url}
                autoPlay
                muted
                loop
              />
              <div className="circle_image">
                <img src={image_url} alt="Influencer_image"></img>
              </div>
              <button onClick={toggleMute}>
                <img src={muted ? soundOff : soundOn}></img>
              </button>
            </div>
          )}
        </div>

        <div className="Influencer_info_block">
          <h1>{title}</h1>
          {productsInfo &&
            productsInfo["0"] &&
            productsInfo["0"]?.length !== 0 && (
              <p>
                {props.meta?.hits_count} {__("products")}
              </p>
            )}

          <p>{description}</p>
          <div block="shareButtonDesign" ref={shareMediaRef}>
            <button
              block="shareButton"
              onClick={handleShareStore}
              mods={{ isArabic: isArabic() }}
            >
              {" "}
              <img src={share} />
              {__("Share Collection")}{" "}
            </button>
            {shareButtonClicked ? (
              <SocialMediaOverlay
                title={document.title}
                text={`Hey check this out: ${document.title}`}
                url={pageURL.href}
                image={image_url}
                product={product}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const getPages = () => {
    const { pages = {}, meta } = props;
    const { page_count } = meta;

    // If lastRequestedPage === -Infinity -> assume it's -1, else use value, i.e. 0
    const filteredPages = Object.keys(pages).filter(
      (page) => page !== "undefined"
    );
    const lastRequestedPage = Math.max(...Object.keys(filteredPages));
    const page = lastRequestedPage < 0 ? -1 : lastRequestedPage;
    let pagetoShowinit = 1;
    if (isMobile.any() || isMobile.tablet()) {
      pagetoShowinit = 2;
    }
    const pagesToShow = page + pagetoShowinit;
    const maxPage = page_count + 1;

    // assume there are pages before and after our current page
    return Array.from(
      {
        // cap the placeholders from showing above the max page
        length: pagesToShow < maxPage ? pagesToShow : maxPage,
      },
      (_, pageIndex) => ({
        isPlaceholder: !pages[pageIndex],
        products: pages[pageIndex] || [],
      })
    );
  };

  const renderProducts = () => {
    const pages = getPages();
    if (pages && pages.length === 0) {
      const placeholderConfig = [
        {
          isPlaceholder: true,
          products: [],
          isFirst: true,
        },
      ];
      return Object.entries(placeholderConfig).map(renderCollectionProducts);
    }
    return Object.entries(pages).map(renderCollectionProducts);
  };

  const renderMainSection = (collectionInfo) => {
    return (
      <div>
        {renderMainUpperblock(collectionInfo)}
        {renderProducts()}
        {!isMobile.any() && loadMore()}
      </div>
    );
  };

  const renderMain = () => {
    const collectionInfo = influencerData?.collections?.filter(check);
    return (
      <span>
        {collectionInfo === undefined
          ? renderBannerAnimation()
          : renderMainSection(collectionInfo)}
      </span>
    );
  };

  return (
    <main block="InfluencerCollection">
      <ContentWrapper
        mix={{ block: "InfluencerCollection" }}
        wrapperMix={{
          block: "InfluencerCollection",
          elem: "Wrapper",
        }}
        label={__("InfluencerCollection")}
      >
        {renderMySignInPopup()}
        {renderMain()}
      </ContentWrapper>
    </main>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfluencerCollection);
