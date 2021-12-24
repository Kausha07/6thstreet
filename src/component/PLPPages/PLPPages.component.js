import PLPPage from "Component/PLPPage";
import PLPPagePlaceholder from "Component/PLPPagePlaceholder";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Products } from "Util/API/endpoint/Product/Product.type";
import "./PLPPages.style";
import { Close } from "Component/Icons";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import isMobile from "Util/Mobile";

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
                        <li>
                          {thisRef.renderButtonView(val.label, () => {
                            const { facet_key, facet_value } = val;
                            const { is_radio } = values;
                            thisRef.handleCallback(
                              facet_key,
                              facet_value,
                              false,
                              is_radio,
                              false
                            );
                          })}
                        </li>
                      );
                    }
                  });
                } else {
                  if (
                    value.is_selected === true &&
                    value.facet_key !== "categories.level1"
                  ) {
                    return (
                      <li>
                        {thisRef.renderButtonView(value.label, () => {
                          const { facet_key, facet_value } = value;
                          const { is_radio } = values;
                          thisRef.handleCallback(
                            facet_key,
                            facet_value,
                            false,
                            is_radio,
                            false
                          );
                        })}
                      </li>
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

  updateInitialFilters = (
    data,
    facet_value,
    newFilterArray,
    categoryLevel1,
    checked
  ) => {
    if (data[facet_value]) {
      data[facet_value].is_selected = checked;
      if (checked) {
        newFilterArray.selected_filters_count += 1;
      } else {
        newFilterArray.selected_filters_count -= 1;
      }
    } else {
      if (categoryLevel1) {
        if (
          data[categoryLevel1].subcategories &&
          data[categoryLevel1].subcategories[facet_value]
        ) {
          data[categoryLevel1].subcategories[facet_value].is_selected = checked;
          if (checked) {
            data[categoryLevel1].selected_filters_count += 1;
            newFilterArray.selected_filters_count += 1;
          } else {
            data[categoryLevel1].selected_filters_count -= 1;
            newFilterArray.selected_filters_count -= 1;
          }
        }
      } else {
        Object.keys(data).map((value) => {
          if (
            data[value].subcategories &&
            data[value].subcategories[facet_value]
          ) {
            data[value].subcategories[facet_value].is_selected = checked;
            if (checked) {
              data[value].selected_filters_count += 1;
              newFilterArray.selected_filters_count += 1;
            } else {
              data[value].selected_filters_count -= 1;
              newFilterArray.selected_filters_count -= 1;
            }
          }
        });
      }
    }
  };

  handleCallback = (
    initialFacetKey,
    facet_value,
    checked,
    isRadio,
    isQuickFilters = false
  ) => {
    const { activeFilters } = this.state;
    const { filters, updatePLPInitialFilters,initialOptions } = this.props;
    const filterArray = activeFilters[initialFacetKey];
    let newFilterArray = filters[initialFacetKey];
    let categoryLevel1 = initialOptions.q.split(" ")[1];

    if (!isRadio) {
      if (filterArray) {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;

          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            false
          );
          updatePLPInitialFilters(filters, initialFacetKey, facet_value);

          const index = filterArray.indexOf(facet_value);
          if (index > -1) {
            filterArray.splice(index, 1);
          }
          this.setState(
            {
              activeFilters: {
                [initialFacetKey]: filterArray,
              },
            },
            () => this.select()
          );
        }
      } else {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;

          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            false
          );
          updatePLPInitialFilters(filters, initialFacetKey, facet_value);
          this.setState(
            {
              activeFilters: {
                [initialFacetKey]: [],
              },
            },
            () => this.select()
          );
        }
      }
    } else {
      if (newFilterArray) {
        this.updateRadioFilters(
          data,
          facet_value,
          newFilterArray,
          categoryLevel1,
          true
        );
        updatePLPInitialFilters(filters, initialFacetKey, facet_value);
        this.setState(
          {
            ...activeFilters,
            activeFilters: {
              [initialFacetKey]: facet_value,
            },
          },
          () => this.select()
        );
      }
    }
  };

  select = (isQuickFilters) => {
    const { activeFilters = {} } = this.state;
    const { query } = this.props;
    if (!isMobile.any() || isQuickFilters) {
      Object.keys(activeFilters).map((key) =>
        WebUrlParser.setParam(key, activeFilters[key], query)
      );
    }
  };

  render() {
    return (
      <div block="PLPPages Products-Lists">
        <div class="ProductToolBar">
          <div block="ProductSelectedFilters">
            {this.renderSelectedFilters()}
          </div>

          {/* {this.renderButtonView("sort ", this.toggleSortDropdown)} */}
        </div>
        {this.renderPages()}
      </div>
    );
  }
}

export default PLPPages;
