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
  constructor(props) {
    super(props);
    this.state = {
      showSortDropdown: false
    };
  }

  renderPage = ([key, page]) => {
    const { products, isPlaceholder, isFirst = false } = page;
    const {
      impressions,
      query,
      renderMySignInPopup,
      prevPath = null,
      filters
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
    if (selectedFilters) {
      return (
        <ul>

          {
            Object.values(selectedFilters).map(function (values) {

              if (values.data) {
                return Object.values(values.data).map(function (value, keys) {
                  if (value.subcategories) {
                    return Object.values(value.subcategories).map(function (val, key) {
                      if (val.is_selected === true) {
                        return (
                          <li id={key}>{val.label}</li>
                        )
                      }
                    })
                  } else {
                    if (value.is_selected === true) {
                      return (
                        <li id={keys}>{value.label}</li>
                      )
                    }
                  }

                })
              }
            })
          }
        </ul>
      )

    }
  }
  toggleSortDropdown = () => {
    this.setState({ showSortDropdown: !this.state.showSortDropdown });
  }

  renderSortBy() {
    const { sort: { data: sortByFilters } } = this.props.filters;
    return (
      <div block="sort-box">
        <ul>
          {
            Object.values(sortByFilters).map(function (value, keys) {
              return <li id={keys}>{value.label}</li>
            })
          }
        </ul>

      </div>
    )
  }

  render() {
    return (
      <div block="PLPPages Products-Lists">
        <div block="ProductToolBar">
          <div block="ProductSelectedFilters">{this.renderSelectedFilters()}</div>
          <div block="ProductSortby">
            <div onClick={this.toggleSortDropdown}>Sort by</div>
            {this.state.showSortDropdown && this.renderSortBy()}
          </div>
        </div>
        {this.renderPages()}
      </div>
    );
  }
}

export default PLPPages;
