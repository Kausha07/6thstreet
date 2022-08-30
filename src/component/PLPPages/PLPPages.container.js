import { PureComponent } from "react";
import { connect } from "react-redux";
import { PLPContainer } from "Route/PLP/PLP.container";
import { Meta, Pages } from "Util/API/endpoint/Product/Product.type";
import PLPPages from "./PLPPages.component";
import {
  updatePLPInitialFilters,
  setPrevProductSku,
} from "Store/PLP/PLP.action";
import isMobile from "Util/Mobile";

export const mapStateToProps = (state) => ({
  pages: state.PLP.pages,
  initialOptions: state.PLP.initialOptions,
  productLoading: state.PLP.productLoading,
  prevProductSku: state.PLP.prevProductSku,
  meta: state.PLP.meta,
  prevPath: state.PLP.prevPath,
});
export const mapDispatchToProps = (_dispatch) => ({
  updatePLPInitialFilters: (filters, facet_key, facet_value) =>
    _dispatch(updatePLPInitialFilters(filters, facet_key, facet_value)),
  setPrevProductSku: (sku) => _dispatch(setPrevProductSku(sku)),
});
export class PLPPagesContainer extends PureComponent {
  static propTypes = {
    pages: Pages.isRequired,
    meta: Meta.isRequired,
  };

  state = {
    pages: {},
    impressions: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { pages = {} } = props;
    const { pages: prevPages = {} } = state;

    if (Object.keys(pages).length !== Object.keys(prevPages).length) {
      return {
        pages,
        impressions: Object.keys(pages).flatMap((key) => pages[key]),
      };
    }
    return null;
  }

  containerProps = () => ({
    pages: this.getPages(),
    query: this.props.query,
    prevProductSku: this.props.prevProductSku,
    initialOptions: this.props.initialOptions,
    renderMySignInPopup: this.props.renderMySignInPopup,
  });

  containerFunctions = () => {
    const { updatePLPInitialFilters, updateFiltersState, setPrevProductSku } =
      this.props;

    return { updatePLPInitialFilters, updateFiltersState, setPrevProductSku };
  };

  getPages() {
    const { pages = {}, meta } = this.props;
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
  }

  getIsLoading() {
    const { pages } = this.props;
    const { page } = PLPContainer.getRequestOptions(this.props);

    // If the page in URL is not yet present -> we are loading
    return !pages[page];
  }

  render() {
    const { impressions } = this.state;
    const { prevPath = null } = this.props;
    return (
      <PLPPages
        prevPath={prevPath}
        impressions={impressions}
        {...this.containerProps()}
        {...this.containerFunctions()}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPPagesContainer);
