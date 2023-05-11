// import PropTypes from 'prop-types';
// import { PureComponent } from 'react';
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import EmptySearch from "Component/EmptySearch";
import isMobile from "Util/Mobile";
import { PLP } from "Route/PLP/PLP.component";
import "./SearchPage.style";
import "../PLP/PLP.style";

import NoMatch from "Route/NoMatch";

class SearchPage extends PLP {
  renderSearchNotFound() {
    const {
      isLoading,
      options: { q },
      pages,
    } = this.props;

    if (
      isLoading ||
      (pages.undefined && pages.undefined.length > 0) ||
      (pages["0"] && pages["0"].length > 0)
    ) {
      return null;
    }

    return <EmptySearch query={q} />;
  }

  render() {
    const {
      isLoading,
      options: { q },
      pages,
    } = this.props;
    const { isArabic,isSortByOverlayOpen } = this.state;
    // if (isLoading) {
    //   return (
    //     <>
    //       <div block="EmptyPage"></div>
    //       <Loader isLoading={isLoading} />
    //     </>
    //   );
    // }

    if(!isLoading && (!pages["0"] || pages["0"].length === 0 || pages.undefined)){
      return (
        <NoMatch/>
      )
    }
      if (
        // isLoading ||
        (pages.undefined && pages.undefined.length > 0) ||
        (pages["0"] && pages["0"].length > 0)
      ) {
        return (
          <main block="SearchPage" id="plp-main-scroll-id">
            <ContentWrapper label={__("Product List Page")}>
              {this.renderMySignInPopup()}
              {this.renderPLPDetails()}
              {this.state.bannerData && this.renderBanner()}
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
              {this.renderSearchNotFound()}
            </ContentWrapper>
          </main>
        );
      }

      return (
        <div className="SearchPage">
        <div  className="ContentWrapper">
          <div class="Card"></div>
          <div block="Wrapper">
            <div class="Card"></div>
            <div class="Card"></div>
            <div class="Card"></div>
            <div class="Card"></div>
            <div class="Card"></div>
            <div class="Card" ></div>
          </div>
        </div>
        </div>
      )

    // return (
    //   // <main block="SearchPage" >
    //   //   <ContentWrapper label={__("Product List Page")}>
    //   //     {this.renderPLPDetails()}
    //   //     {this.renderPLPPages()}
    //   //     {this.renderSearchNotFound()}
    //   //   </ContentWrapper>
    //   // </main>
    // );    
  }
}

export default SearchPage;
