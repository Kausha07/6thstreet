// import PropTypes from 'prop-types';
// import { PureComponent } from 'react';
import ContentWrapper from "Component/ContentWrapper/ContentWrapper.component";
import EmptySearch from "Component/EmptySearch";
import { PLP } from "Route/PLP/PLP.component";
import "./SearchPage.style";

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
    return (
      <main block="SearchPage">
        <ContentWrapper label={__("Product List Page")}>
          {this.renderPLPDetails()}
          {this.renderPLPFilters()}
          {this.renderPLPPages()}
          {this.renderSearchNotFound()}
        </ContentWrapper>
      </main>
    );
  }
}

export default SearchPage;
