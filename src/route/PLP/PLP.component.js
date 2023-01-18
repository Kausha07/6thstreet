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
} from "Util/Event";
import sort from "./icons/sort.svg";
import refine from "./icons/refine.svg";
import Line from "./icons/Line.svg";

export const mapStateToProps = (state) => ({
  prevPath: state.PLP.prevPath,
});
export const mapDispatchToProps = (_dispatch) => ({});

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
      isSortByOverlayOpen: false,
      selectedSortOption : 'recommended'
    };
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

  showMyAccountPopup = () => {
    const { showPopup } = this.state;
    this.setState({ showPopup: true });
    if (showPopup) {
      const popupEventData = {
        name: EVENT_SIGN_IN_SCREEN_VIEWED,
        category: "user_login",
        action: EVENT_SIGN_IN_SCREEN_VIEWED,
        popupSource: "Wishlist",
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
    return <PLPDetails {...this.props} />;
  }

  renderPLPFilters() {
    return <PLPFilters {...this.props} isPLPSortBy={false} resetSortData={this.resetSortData} />;
  }

  renderPLPSortBy() {
    return <PLPFilters {...this.props} isPLPSortBy={true} />;
  }

  renderPLPPages() {
    const { prevPath = null, updateFiltersState } = this.props;
    return (
      <PLPPages
        {...this.props}
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

  showCouponDetial = (e) => {
    e.stopPropagation();
    this.setState({
      isSortByOverlayOpen: true,
    });

    const bodyElt = document.querySelector("body");
    bodyElt.style.overflow = "hidden";
  };

  handleFilterClick = () => {
    const { showOverlay } = this.props;
    showOverlay("PLPFilter");
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

  renderSortByOverlay = () => {
    const {filters, handleCallback} = this.props
    const {selectedSortOption, isArabic} = this.state
    return (
      <div block="couponDetailPopup" mods={{isArabic}}>
        <div block="couponDetailOverlay">
          <div block="couponDetialPopupBlock" ref={this.sortByOverlay}>
            <p block="couponItemCode">
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
    const { pages, isLoading } = this.props;
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
        </main>
      );
    }

    return <Loader isLoading={isLoading} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLP);
