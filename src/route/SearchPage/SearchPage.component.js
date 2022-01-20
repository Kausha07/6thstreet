// import PropTypes from 'prop-types';
// import { PureComponent } from 'react';
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import EmptySearch from "Component/EmptySearch";
import { PLP } from "Route/PLP/PLP.component";
import "./SearchPage.style";
import Loader from "Component/Loader";

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
    // if (isLoading) {
    //   return (
    //     <>
    //       <div block="EmptyPage"></div>
    //       <Loader isLoading={isLoading} />
    //     </>
    //   );
    // }
    if (
      isLoading ||
      (pages.undefined && pages.undefined.length > 0) ||
      (pages["0"] && pages["0"].length > 0)
    ) {
      return (
        <main block="SearchPage">
          <ContentWrapper label={__("Product List Page")}>
            {this.renderPLPDetails()}
            <div block="Products" elem="Wrapper">
              {this.renderPLPFilters()}
              {this.renderPLPPages()}
            </div>
            {this.renderSearchNotFound()}
          </ContentWrapper>
        </main>
      );
    }

    return (
      <main block="SearchPage">
        <ContentWrapper label={__("Product List Page")}>
          {this.renderPLPDetails()}
          {this.renderPLPPages()}
          {this.renderSearchNotFound()}
        </ContentWrapper>
      </main>
    );
  }
}

export default SearchPage;
