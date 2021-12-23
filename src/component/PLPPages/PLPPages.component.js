import PLPPage from "Component/PLPPage";
import PLPPagePlaceholder from "Component/PLPPagePlaceholder";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPages.style";
import { Close } from "Component/Icons";

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
  constructor(props) {
    super(props);
    this.state = {
      showSortDropdown: false,
      activeFilter: undefined,
      activeFilters: {},
      isReset: false,
      defaultFilters: false,
    };
  }

  renderPage = ([key, page]) => {
    const { products, isPlaceholder, isFirst = false } = page;
    const {
      impressions,
      query,
      renderMySignInPopup,
      prevPath = null,
      filters,
    } = this.props;

    if (isPlaceholder) {
      return (
        <PLPPagePlaceholder
          isFirst={isFirst}
          key={key}
          pageIndex={key}
          query={query}
        />
      );
    }

    return (
      <PLPPage
        key={key}
        products={products}
        impressions={impressions}
        renderMySignInPopup={renderMySignInPopup}
        prevPath={prevPath}
        filters={filters}
      />
    );
  };

  renderPages() {
    const { pages = {} } = this.props;
    if (pages && pages.length === 0) {
      const placeholderConfig = [
        {
          isPlaceholder: true,
          products: [],
          isFirst: true,
        },
      ];
      return Object.entries(placeholderConfig).map(this.renderPage);
    }
    return Object.entries(pages).map(this.renderPage);
  }
  renderSelectedFilters() {
    const selectedFilters = this.props.filters;
    const thisRef = this;
    if (selectedFilters) {
      return (
        <ul>
          {Object.values(selectedFilters).map(function (values, index) {
            if (values.data) {
              return Object.values(values.data).map(function (value, index) {
                if (value.subcategories) {
                  return Object.values(value.subcategories).map(function (
                    val,
                    index
                  ) {
                    if (val.is_selected === true) {
                      return (
                        <li>{thisRef.renderButtonView(val.label, () => {})}</li>
                      );
                    }
                  });
                } else {
                  if (value.is_selected === true) {
                    return (
                      <li>{thisRef.renderButtonView(value.label, () => {})}</li>
                    );
                  }
                }
              });
            }
          })}
        </ul>
      );
    }
  }

  toggleSortDropdown = () => {
    this.setState({ showSortDropdown: !this.state.showSortDropdown });
  };

  renderSortBy() {
    const {
      filters: { sort: data },
    } = this.props;
    const { data: sortData } = data;
    return (
      <div block="sort-box">
        <ul>
          {Object.values(sortData).map((value, index) => {
            return <li key={index}>{value.label}</li>;
          })}
        </ul>
      </div>
    );
  }

  renderButtonView(label, onClick) {
    return (
      <button
        onClick={onClick}
        onKeyDown={() => {}}
        aria-label="Dismiss"
        tabIndex={0}
        block="PLPPageFilter"
      >
        {label}
        <Close />
      </button>
    );
  }

  render() {
    const { showSortDropdown } = this.state;
    console.log("muskan", showSortDropdown);
    return (
      <div block="PLPPages Products-Lists">
        <div class="ProductToolBar">
          <div block="ProductSelectedFilters">
            {this.renderSelectedFilters()}
          </div>

          {this.renderButtonView("sort ", this.toggleSortDropdown)}
        </div>
        {this.renderPages()}
      </div>
    );
  }
}

export default PLPPages;
