import PLPPage from "Component/PLPPage";
import PLPPagePlaceholder from "Component/PLPPagePlaceholder";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPages.style";

class PLPPages extends PureComponent {
  static propTypes = {
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        products: Products,
        isPlaceholder: PropTypes.bool,
      })
    ).isRequired,
    impressions: Products,
  };

  static defaultProps = {
    impressions: [],
  };

  renderPage = ([key, page]) => {
    const { products, isPlaceholder } = page;
    const { impressions, query, renderMySignInPopup } = this.props;
    if (isPlaceholder) {
      return <PLPPagePlaceholder key={key} pageIndex={key} query={query} />;
    }

    return (
      <PLPPage
        key={key}
        products={products}
        impressions={impressions}
        renderMySignInPopup={renderMySignInPopup}
      />
    );
  };

  renderPages() {
    const { pages = {} } = this.props;
    return Object.entries(pages).map(this.renderPage);
  }

  render() {
    return <div block="PLPPages">{this.renderPages()}</div>;
  }
}

export default PLPPages;
