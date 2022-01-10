import { PureComponent } from "react";
import { connect } from "react-redux";
import { PLPContainer } from "Route/PLP/PLP.container";
import { Meta, Pages } from "Util/API/endpoint/Product/Product.type";
import PLPPages from "./PLPPages.component";
import { updatePLPInitialFilters } from "Store/PLP/PLP.action";
import isMobile from "Util/Mobile";

export const mapStateToProps = (state) => ({
  pages: state.PLP.pages,
  initialOptions: state.PLP.initialOptions,
  productLoading: state.PLP.productLoading,
  meta: state.PLP.meta,
});
export const mapDispatchToProps = (_dispatch) => ({
  updatePLPInitialFilters: (filters, facet_key, facet_value) =>
    _dispatch(updatePLPInitialFilters(filters, facet_key, facet_value)),
});
export class PLPPagesContainer extends PureComponent {
  static propTypes = {
    pages: Pages.isRequired,
    meta: Meta.isRequired,
  };

  state = {
    pages: {},
    impressions: [],
    activeFilters: {},
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
  componentDidUpdate() {
    const { filters = {} } = this.props;
    const { activeFilters } = this.state;

    const newActiveFilters = Object.entries(filters).reduce((acc, filter) => {
      if (filter[1]) {
        const { selected_filters_count, data = {} } = filter[1];

        if (selected_filters_count !== 0) {
          if (filter[0] === 'sizes') {
            const mappedData = Object.entries(data).reduce((acc, size) => {
              const { subcategories } = size[1];
              const mappedSizeData = this.mapData(subcategories);

              acc = { ...acc, [size[0]]: mappedSizeData };

              return acc;
            }, []);

            acc = { ...acc, ...mappedData };
          } else {
            acc = { ...acc, [filter[0]]: this.mapData(data) };
          }
        }

        return acc;
      }
    }, {});

    if (!this.compareObjects(activeFilters, newActiveFilters)) {
      this.setState({ activeFilters: newActiveFilters });
    }
  }

  compareObjects(object1 = {}, object2 = {}) {
    if (Object.keys(object1).length === Object.keys(object2).length) {
      const isEqual = Object.entries(object1).reduce((acc, key) => {
        if (object2[key[0]]) {
          if (key[1].length !== object2[key[0]].length) {
            acc.push(0);
          } else {
            acc.push(1);
          }
        } else {
          acc.push(1);
        }

        return acc;
      }, []);

      return !isEqual.includes(0);
    }

    return false;
  }

  mapData(data = {}) {
    const { initialOptions } = this.props;
    let categoryLevel1 = initialOptions.q.split(" ")[1];
    let formattedData = data;
    if (data[categoryLevel1]) {
      formattedData = data[categoryLevel1].subcategories;
    }
    const mappedData = Object.entries(formattedData).reduce((acc, option) => {
      const { is_selected } = option[1];
      if (is_selected) {
        acc.push(option[0]);
      }

      return acc;
    }, []);
    return mappedData;
  }

  containerProps = () => ({
    pages: this.getPages(),
    query: this.props.query,
    filters: this.props.filters,
    activeFilters:this.state.activeFilters,
    productLoading:this.props.productLoading,
    initialOptions: this.props.initialOptions,
    renderMySignInPopup: this.props.renderMySignInPopup,
  });

  containerFunctions = () => {
    const { updatePLPInitialFilters, updateFiltersState } = this.props;

    return { updatePLPInitialFilters, updateFiltersState };
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
