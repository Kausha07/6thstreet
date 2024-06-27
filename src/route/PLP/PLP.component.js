/* eslint-disable fp/no-let */
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import DynamicContent from "Component/DynamicContent";
import MyAccountOverlay from "Component/MyAccountOverlay";
import PLPDetails from "Component/PLPDetails";
import PLPFilters from "Component/PLPFilters";
import PLPPages from "Component/PLPPages";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import { PureComponent, createRef } from "react";
import CircleItemSliderSubPage from "../../component/DynamicContentCircleItemSlider/CircleItemSliderSubPage";
// import DynamicContentCircleItemSlider from '../../component/DynamicContentCircleItemSlider';
import { PLPContainer } from "./PLP.container";
import "./PLP.style";
import "../../component/CartCouponDetail/CartCouponDetail.style";
import { connect } from "react-redux";
import NoMatch from "Route/NoMatch";
import Loader from "Component/Loader";
import Event, {
  EVENT_GTM_AUTHENTICATION,
  EVENT_SIGN_IN_SCREEN_VIEWED,
  EVENT_SORT_BY_DISCOUNT,
  EVENT_SORT_BY_LATEST,
  EVENT_SORT_BY_PRICE_HIGH,
  EVENT_SORT_BY_PRICE_LOW,
  EVENT_SORT_BY_RECOMMENDED,
  EVENT_GTM_SORT,
  MOE_trackEvent,
  EVENT_MOE_PLP_FILTER,
  EVENT_PLP_SORT,
  EVENT_MOE_PLP_FILTER_CLICK,
  EVENT_GTM_FILTER
} from "Util/Event";
import Logger from "Util/Logger";
import { getStaticFile } from "Util/API/endpoint/StaticFiles/StaticFiles.endpoint";
import sort from "./icons/sort.svg";
import refine from "./icons/refine.svg";
import Line from "./icons/Line.svg";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { isSignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import { renderDynamicMetaTags } from "Util/Meta/metaTags";
import { Helmet } from "react-helmet";
import ModelForMobilePLPFilter from "../../component/ModalWithOutsideClick/ModelForMobilePLPFilter.component";
export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
});

export class PLP extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: null,
      signInPopUp: "",
      showPopup: false,
      circleBannerUrl: null,
      activeFilters: {},
      isArabic: isArabic(),
      footerContent: {},
      isToggleOn: true,
      isSortByOverlayOpen: false,
      selectedSortOption : 'recommended'
    };
    this.getContent();
    this.handleClick = this.handleClick.bind(this);
    this.sortByOverlay = createRef();
  }

  static getDerivedStateFromProps(props) {
    const { filters = {} } = props;
    if (isMobile.any() && filters['sort']) {
      const selectedFilter = Object.values(filters['sort'].data).filter(({is_selected}) => is_selected)
        return {
          selectedSortOption: selectedFilter.length > 0 ? selectedFilter[0].facet_value : 'recommended'
        };
    }
  }

  componentDidMount() {
    let bannerData = localStorage.getItem("bannerData");
    let bannerUrl = localStorage.getItem("CircleBannerUrl");
    if (bannerData) {
      let banner = JSON.parse(bannerData);
      this.setState({
        bannerData: banner,
        circleBannerUrl: bannerUrl,
      });
    }
    window.addEventListener("mousedown", this.outsideCouponPopupClick);
  }
  componentWillUnmount() {
    const { resetPLPData } = this.props;
    window.removeEventListener("mousedown", this.outsideCouponPopupClick);
    // resetPLPData();
  }

  getContent = async () => {
    const pagePathName = new URL(window.location.href).pathname;
    if (pagePathName.includes(".html")) {
      const getCategoryLevel = pagePathName
        .split(".html")[0]
        .substring(1)
        .split("/");
      const contentFileName =
        getCategoryLevel?.[0] == "women"
          ? "plp_footer_women"
          : getCategoryLevel?.[0] == "men"
          ? "plp_footer_men"
          : getCategoryLevel?.[0] == "kids"
          ? "plp_footer_kids"
          : getCategoryLevel?.[0] == "home"
          ? "plp_footer_home"
          : null;
      if (contentFileName && getCategoryLevel?.length > 1) {
        try {
          const resp = await getStaticFile(contentFileName, {
            $FILE_NAME: `pages/${contentFileName}.json`,
          });
          if (resp) {
            this.setState({
              footerContent: resp,
            });
          }
        } catch (e) {
          Logger.log(e);
        }
      }
    }
  };

  handleClick() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  showMyAccountPopup = () => {
    const { showPopup } = this.state;
    this.setState({ showPopup: true });
    if (showPopup) {
      const popupEventData = {
        name: EVENT_SIGN_IN_SCREEN_VIEWED,
        category: "user_login",
        action: EVENT_SIGN_IN_SCREEN_VIEWED,
      };
      Event.dispatch(EVENT_GTM_AUTHENTICATION, popupEventData);
    }
  };

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
  };

  onSignIn = () => {
    this.closePopup();
  };

  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }
  // componentWillUnmount(){
  //     localStorage.removeItem("bannerData");
  // }
  resetSortData = () => {
    if(isMobile.any()){
      this.setState({
        isSortByOverlayOpen : false,
        selectedSortOption : 'recommended'
      })
    }
  }

  renderPLPDetails() {
    const { plpWidgetData } = this.props
    const isBannerData = this.state.bannerData ? true : false;
    const isFromCircleItemSlider = window.location.href.includes("plp_config");
    const { pathname } = location;
    const tagName = pathname
      .replace(".html", "")
      .replace("/", "")
      .replaceAll("/", "_");
    const widget = plpWidgetData?.filter((item) => item.tag == tagName);
    return <PLPDetails {...this.props} isBannerData = {isBannerData && isFromCircleItemSlider} isWidgetData ={widget && widget.length !== 0} />;
  }

  renderPLPFilters() {
    return <PLPFilters {...this.props} isPLPSortBy={false} resetSortData={this.resetSortData}  isLoadingFilter={this.props.isLoadingFilter} setLoadingMobileFilter={this.props.setLoadingMobileFilter} />;
  }

  renderPLPSortBy() {
    return <PLPFilters {...this.props} isPLPSortBy={true} isSortBy />;
  }

  renderPLPPages() {
    const { prevPath = null, updateFiltersState } = this.props;
    return (
      <PLPPages
        {...this.props}
        customisedActiveFilter={this.props.activeFilters}
        updateFiltersState={updateFiltersState}
        renderMySignInPopup={this.showMyAccountPopup}
        prevPath={prevPath}
      />
    );
  }

  renderBanner() {
    let isFromCircleItemSlider = window.location.href.includes("plp_config");

    if (this.state.bannerData && isFromCircleItemSlider)
      return (
        <div>
          <CircleItemSliderSubPage bannerData={this.state.bannerData} />
        </div>
      );
  }

  renderPLPWidget = () => {
    const { plpWidgetData } = this.props;
    const { pathname } = location;
    const tagName = pathname
      .replace(".html", "")
      .replace("/", "")
      .replaceAll("/", "_");

    const widget = plpWidgetData.filter((item) => item.tag == tagName);
    if (widget && widget.length == 0) {
      return null;
    }
    const { gender, setLastTapItem } = this.props;

    // return <h1>Plp Widget</h1>;
    return (
      <DynamicContent
        gender={gender}
        content={widget}
        setLastTapItemOnHome={setLastTapItem}
        renderMySignInPopup={this.showMyAccountPopup}
      />
    );
  };

  renderFooterContent() {
    const { footerContent, isArabic, isToggleOn } = this.state;
    const pagePathName = new URL(window.location.href).pathname;
    if (pagePathName.includes(".html") && footerContent?.[0]) {
      const getCategoryLevel = pagePathName
        .split(".html")[0]
        .substring(1)
        .split("/");
      if (getCategoryLevel.length > 1) {
        const footerHtml =
          getCategoryLevel.length == 2
            ? footerContent?.[0]?.[getCategoryLevel[1]]
            : getCategoryLevel.length == 3
            ? footerContent?.[0]?.[getCategoryLevel[1]]?.[getCategoryLevel[2]]
            : getCategoryLevel.length == 4 
            ? footerContent?.[0]?.[getCategoryLevel[1]]?.[getCategoryLevel[2]]?.[getCategoryLevel[3]] 
            : null;
        const contentDescription = isArabic ? "ar" : "en";
        const storeMap = {
          AE: isArabic ? "الإمارات" : "UAE",
          SA: isArabic ? "السعودية" : "Saudi Arabia",
          KW: isArabic ? "الكويت" : "Kuwait",
          OM: isArabic ? "سلطنة عمان" : "Oman",
          BH: isArabic ? "البحرين" : "Bahrain",
          QA: isArabic ? "قطر" : "Qatar",
        };
        const countryName = storeMap[getCountryFromUrl().toUpperCase()] || "";
        if (footerHtml && footerHtml?.[contentDescription]) {
          const footerContentDesc = footerHtml[contentDescription];
          const updatedContent = footerContentDesc.includes(
            "currentEmiratesName"
          )
            ? footerContentDesc.replaceAll("currentEmiratesName", countryName)
            : footerContentDesc;
          
          return (
            <>
              <div block="PLP-FooterWrapper" mods={{ isArabic }}>
                <div
                  className={
                    isToggleOn
                      ? "PLP-FooterContainer loadMore"
                      : "PLP-FooterContainer loadLess"
                  }
                  dangerouslySetInnerHTML={{
                    __html: updatedContent,
                  }}
                />
                {footerContentDesc.length > 180 ? (
                  <div className="loadMore-section">
                    <div
                      className={
                        isToggleOn
                          ? "loadMore-Overlay show"
                          : "loadMore-Overlay"
                      }
                    ></div>
                    <div className="loadMoreBtn">
                      <button onClick={this.handleClick}>
                        {isToggleOn ? __("Read more") : __("Read less")}
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          );
        }
      }
    }
  }

  showCouponDetial = (e) => {
    e.stopPropagation();
    this.setState({
      isSortByOverlayOpen: true,
    });
    
    MOE_trackEvent(EVENT_PLP_SORT, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });

    Event.dispatch(EVENT_GTM_SORT, EVENT_PLP_SORT);

    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  };

  handleFilterClick = () => {
    const { showOverlay } = this.props;
    showOverlay("PLPFilter");

    MOE_trackEvent(EVENT_MOE_PLP_FILTER_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });

    const eventData = {name: EVENT_MOE_PLP_FILTER_CLICK, value: ""};
    Event.dispatch(EVENT_GTM_FILTER, eventData);
  
  };

  outsideCouponPopupClick = (e) => {
    if (
      this.state.isSortByOverlayOpen &&
      this.sortByOverlay.current &&
      !this.sortByOverlay.current.contains(e.target)
    ) {
      this.setState({
        isSortByOverlayOpen: false,
      });
      const bodyElt = document.querySelector("body");
      bodyElt.removeAttribute("style");
    }
  };

  getActiveFilter = () => {
    const newActiveFilters = Object.entries(this.props.filters).reduce(
      (acc, filter) => {
        if (filter[1]) {
          const { selected_filters_count, data = {} } = filter[1];

          if (selected_filters_count !== 0) {
            if (filter[0] === "sizes") {
              const mappedData = Object.entries(data).reduce((acc, size) => {
                const { subcategories } = size[1];
                const mappedSizeData = PLPContainer.mapData(
                  subcategories,
                  filter[0],
                  this.props
                );

                acc = { ...acc, [size[0]]: mappedSizeData };

                return acc;
              }, []);

              acc = { ...acc, ...mappedData };
            } else {
              acc = {
                ...acc,
                [filter[0]]: PLPContainer.mapData(data, filter[0], this.props),
              };
            }
          }

          return acc;
        }
      },
      {}
    );
    return newActiveFilters;
  };

  renderMetaContent() {
    const { pages, brandName, brandImg, gender, metaTitle, metaDesc } = this.props;
    const getCategory = BrowserDatabase.getItem("CATEGORY_CURRENT")
      ? BrowserDatabase.getItem("CATEGORY_CURRENT")
      : null;
    const handleCategory =
      getCategory && getCategory.includes("///")
        ? getCategory.split("///").pop()
        : getCategory;
    const category = handleCategory ? handleCategory.trim() : null;
    const imageUrl = () => {
      if (brandImg) {
        return brandImg;
      } else if (
        pages &&
        pages[0] &&
        pages[0].length > 0 &&
        pages[0][0]?.thumbnail_url
      ) {
        return pages[0][0]?.thumbnail_url;
      } else {
        return null;
      }
    };
    const image = this.state.bannerData?.image_url
      ? this.state.bannerData.image_url
      : imageUrl();
    const altText = brandName
      ? brandName
      : category
      ? category
      : `${gender} products`;

    return renderDynamicMetaTags(metaTitle, metaDesc, image, altText);
  }

  getFilterCount() {
    // const { activeFilters = {} } = this.props;
    let activeFilters = this.getActiveFilter();
    let { count } = activeFilters
      ? Object.entries(activeFilters).reduce(
        (prev, [_key, value]) => ({
          count: prev.count + value.length,
        }),
        { count: 0 }
      )
      : { count: 0 };
    Object.keys(activeFilters).length > 0 &&
      Object.keys(activeFilters).map((key) => {
        if (key === "categories.level1") {
          count = count - 1;
        }
      });
    const displayCount = count;
    return displayCount;
  }

  renderSortFilterOverlay = () => {
    const { isArabic } = this.state;
    const filterCount = this.getFilterCount();
    const isFilter =  filterCount === 0
    const DualFilter = filterCount.toString().length === 2
    const TripleFilter = filterCount.toString().length === 3
    return (
      <div block = "SortContainer" mods={{isArabic}}>
      <div block="SortOverlay" mods={{isFilter}}>
        <div block="CommonBlock" onClick={(e) => this.showCouponDetial(e)}>
          <img src={sort} alt="sort" />
          <span block="title">{__("Sort")}</span>
        </div>
        <div block="SortOverlay" elem="CenterLine">
          <img src={Line} alt="line" />
        </div>
        <div block="CommonBlock" mods={{DualFilter,TripleFilter}} onClick={()=> this.handleFilterClick()}>
          <img src={refine} alt="refine" block="CommonBlock" elem="RefineImg" />
          <span block="title">{__("Filter")}{" "}{this.getFilterCount() > 0 && `(${filterCount})`}</span>
        </div>
      </div>
      </div>
    );
  };
  
  sendTrackingEvent = (facet_key, facet_value) => {
    const sendMoeEvents = (event) => {
      MOE_trackEvent(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        app6thstreet_platform: "Web",
      });
    };

    if(facet_key == "sort") {
      const sortEventType =
        facet_value == __("recommended")
          ? EVENT_SORT_BY_RECOMMENDED
          : facet_value == __("latest")
          ? EVENT_SORT_BY_LATEST
          : facet_value == __("discount")
          ? EVENT_SORT_BY_DISCOUNT
          : facet_value == __("price_low")
          ? EVENT_SORT_BY_PRICE_LOW
          : facet_value == __("price_high")
          ? EVENT_SORT_BY_PRICE_HIGH
          : "";
      if (sortEventType && sortEventType.length > 0) {
        sendMoeEvents(sortEventType);
        Event.dispatch(EVENT_GTM_SORT, sortEventType);
      }
    } else {
      MOE_trackEvent(EVENT_MOE_PLP_FILTER, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        filter_type: facet_key || "",
        filter_value: facet_value || "",
        isLoggedIn: isSignedIn() || "",
        app6thstreet_platform: "Web",
      });
    }
  }

  sendSortByTrackingEvent = () =>{
    MOE_trackEvent(EVENT_PLP_SORT, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
    Event.dispatch(EVENT_GTM_SORT,EVENT_PLP_SORT);
  }

  renderSortByOverlay = () => {
    const {filters, handleCallback} = this.props
    const {selectedSortOption, isArabic} = this.state
    return (
      <div block="couponDetailPopup" mods={{isArabic}}>
        <div block="couponDetailOverlay">
          <div block="couponDetialPopupBlock" ref={this.sortByOverlay}>
            <p block="couponItemCode" onClick={this.sendSortByTrackingEvent}>
              {__("SORT BY")}
            </p>
            {filters && Object.values(filters['sort'].data).map((filter,index)=>{
              const {facet_value, facet_key, label, is_selected} = filter
                return (
                  <>
                    <p
                      block="couponItemName"
                      mix = {{block :"couponItemName",elem : (is_selected || selectedSortOption === facet_value) ? "SortSelected" : ""}}
                      id={facet_value + facet_key}
                      name={facet_key}
                      value={facet_value}
                      onClick={() => {
                        this.setState({
                          selectedSortOption: facet_value,
                          isSortByOverlayOpen:false
                        },()=>{
                          handleCallback(facet_key, facet_value, true, true)
                          this.sendTrackingEvent(facet_key, facet_value);
                        })
                      }}
                    >
                      {label}
                    </p>
                    <hr />
                  </>
                );
            })}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isArabic, isSortByOverlayOpen } = this.state;
    const { pages, isLoading, schemaData } = this.props;

    if (
      !isLoading &&
      (!pages["0"] || pages["0"].length === 0 || pages.undefined)
    ) {
      return <NoMatch />;
    }
    if (
      (pages.undefined && pages.undefined.length > 0) ||
      (pages["0"] && pages["0"].length > 0)
    ) {
      return (
        <main block="PLP" id="plp-main-scroll-id">
          {this.renderMetaContent()}
          {schemaData !== {} && (
            <Helmet>
              <script type="application/ld+json">
                {JSON.stringify(schemaData)}
              </script>
            </Helmet>
          )}
          <ContentWrapper label={__("Product List Page")}>
            {this.renderMySignInPopup()}
            {this.renderPLPDetails()}
            {this.state.bannerData && this.renderBanner()}
            {this.renderPLPWidget()}
            {isMobile.any() && this.renderSortFilterOverlay()}
            {isMobile.any() &&
              isSortByOverlayOpen &&
              this.renderSortByOverlay()}
            <div>
              <div block="Products" elem="Wrapper">
                {this.renderPLPFilters()}
                {this.renderPLPPages()}
              </div>
              {!isMobile.any() && (
                <div block="SortBy" mods={{ isArabic }}>
                  {this.renderPLPSortBy()}
                </div>
              )}
            </div>
          </ContentWrapper>
          {this.renderFooterContent()}
          <ModelForMobilePLPFilter />
        </main>
      );
    }

    return <Loader isLoading={isLoading} />;
  }
}

export default connect(mapStateToProps)(PLP);
