/**
 * @category sixth-street
 * @author Vladislavs Belavskis <info@scandiweb.com>
 * @license http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */
import Image from "Component/Image";

import PLPFilter from "Component/PLPFilter";
import PLPQuickFilter from "Component/PLPQuickFilter";
import Popup from "Component/Popup";
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { Filters } from "Util/API/endpoint/Product/Product.type";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import fitlerImage from "./icons/filter-button.png";
import { SIZES } from "./PLPFilters.config";
import Refine from "../Icons/Refine/icon.png";
import "./PLPFilters.style";
class PLPFilters extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    filters: Filters.isRequired,
    activeOverlay: PropTypes.string.isRequired,
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    goToPreviousNavigationState: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    productsCount: PropTypes.number,
    activeFilters: PropTypes.object.isRequired,
  };

  static defaultProps = {
    productsCount: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      activeFilter: undefined,
      isArabic: isArabic(),
      activeFilters: {},
      isReset: false,
      defaultFilters: false,
    };

    this.timer = null;
  }

  static getDerivedStateFromProps(props, state) {
    const { activeOverlay, filters = {}, activeFilters } = props;
    const { activeFilter } = state;

    if (!activeOverlay) {
      document.body.style.overflow = "visible";
    }

    if (isMobile.any()) {
      if (!activeFilter) {
        return {
          isOpen: activeOverlay === "PLPFilter",
          activeFilter: Object.keys(filters)[0],
          activeFilters: activeFilters,
        };
      }
    }
    return {
      isOpen: activeOverlay === "PLPFilter",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeFilters, plpPageActiveFilters } = this.props;
    const {
      activeFilters: prevActiveFilters,
      plpPageActiveFilters: prevPlpPageActiveFilters,
    } = prevProps;
    if (plpPageActiveFilters !== prevPlpPageActiveFilters) {
      this.setState({
        activeFilters: plpPageActiveFilters,
      });
    }

    if (activeFilters !== prevActiveFilters) {
      this.setState({
        activeFilters: activeFilters,
      });
    }
  }
  delayFilterUpdate() {
    clearTimeout(this.timer);
    // eslint-disable-next-line no-magic-numbers
    this.timer = setTimeout(() => this.updateFilters(), 2000);
  }

  setDefaultFilters = () => {
    this.setState({ defaultFilters: true });
  };

  changeActiveFilter = (newFilter) => {
    this.setState({ activeFilter: newFilter });
  };

  handleFilterClick = () => {
    const { isOpen } = this.state;
    const { showOverlay } = this.props;

    showOverlay("PLPFilter");
    this.setState({ isOpen: !isOpen });
  };

  renderFilters() {
    const { filters = {} } = this.props;
    return Object.entries(filters).map((filter) => {
      // if (filter[0] === SIZES && !isMobile.any()) {
      //   const { data = {} } = filter[1];
      //   return Object.keys(data).map((size) =>
      //     this.renderFilter([size, data[size]])
      //   );
      // }
      if (filter[1]) {
        if (filter[0] === "sort" && !isMobile.any()) {
          return this.renderSortBy([filter[0], filter[1]]);
        }
        return this.renderFilter([filter[0], filter[1]]);
      }
    });
  }

  renderQuickFilters() {
    const { filters = {} } = this.props;

    return Object.entries(filters).map(this.renderQuickFilter.bind(this));
  }

  hidePopUp = () => {
    const { hideActiveOverlay, goToPreviousNavigationState, activeOverlay } =
      this.props;

    if (activeOverlay === "PLPFilter") {
      hideActiveOverlay();
      goToPreviousNavigationState();
    }
  };

  resetFilters = () => {
    const {
      hideActiveOverlay,
      goToPreviousNavigationState,
      onReset,
      activeOverlay,
      updatePLPInitialFilters,
      initialFilters,
      filters,
    } = this.props;

    clearTimeout(this.timer);

    if (activeOverlay === "PLPFilter") {
      hideActiveOverlay();
      goToPreviousNavigationState();
    }
    updatePLPInitialFilters(filters, null, null);
    this.setState({ activeFilters: {}, isReset: true, defaultFilters: false });

    onReset();
  };

  onClearFilterState = (initialFacetKey) => {
    const { activeFilters } = this.state;
    const filterArray = activeFilters[initialFacetKey];
    const index = filterArray.indexOf(facet_value);
    if (index > -1) {
      filterArray.splice(index, 1);
    }
    this.setState({
      activeFilters: {
        [initialFacetKey]: filterArray,
      },
    });
  };

  onShowResultButton = () => {
    const { activeFilters = {} } = this.state;
    const { query } = this.props;
    Object.keys(activeFilters).map((key) =>
      WebUrlParser.setParam(key, activeFilters[key], query)
    );
    this.hidePopUp();
  };

  updateFilters = () => {
    const { activeFilters = {} } = this.state;
    const { query } = this.props;
    Object.keys(activeFilters).map((key) =>
      WebUrlParser.setParam(key, activeFilters[key], query)
    );
  };

  renderSeeResultButton() {
    const { productsCount } = this.props;
    const { isArabic } = this.state;

    const count = ` ( ${productsCount} )`;
    return (
      <button
        block="Content"
        elem="SeeResult"
        mods={{ isArabic }}
        onClick={this.onShowResultButton}
      >
        {__("show result")}
        {count}
      </button>
    );
  }

  onClose = () => {
    const { activeFilters } = this.props;
    this.hidePopUp();
    this.setState({ activeFilters });
  };

  renderCloseButton() {
    const { isArabic } = this.state;

    return (
      <button
        block="FilterPopup"
        elem="CloseBtn"
        mods={{ isArabic }}
        aria-label={__("Close")}
        onClick={this.onClose}
      />
    );
  }

  renderResetFilterButton() {
    const { isArabic } = this.state;

    const isClear = this.getFilterCount() > 0;

    return isClear || isMobile.any() ? (
      <button
        block="FilterPopup"
        elem="Reset"
        type="button"
        mods={{ isArabic }}
        aria-label={__("Reset")}
        onClick={this.resetFilters}
      >
        {!isMobile.any() ? __("Clear all") : __("Clear")}
      </button>
    ) : null;
  }

  renderContent() {
    const { isArabic } = this.state;

    return (
      <div block="Content" elem="Filters" mods={{ isArabic }}>
        {this.renderFilters()}
      </div>
    );
  }

  renderFilterButton() {
    return (
      <button
        onClick={this.handleFilterClick}
        onKeyDown={this.handleFilterClick}
        aria-label="Dismiss"
        tabIndex={0}
        block="PLPFilterMobile"
      >
        <Image lazyLoad={true} src={fitlerImage} alt="fitler" />

        {__("refine ")}
        <div block="PLPFilterMobile" elem="Count">
          {this.renderFiltersCount()}
        </div>
      </button>
    );
  }

  renderFiltersCount() {
    const displayCount = this.getFilterCount();
    if (displayCount < 0) {
      return "(0)";
    }

    return `(${displayCount})`;
  }

  getFilterCount() {
    const { activeFilters = {} } = this.props;
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

  renderRefine() {
    const { isArabic } = this.state;

    return (
      <div block="PLPFilters" elem="Refine" mods={{ isArabic }}>
        {__("refine")}
      </div>
    );
  }

  renderPopupFilters() {
    const { isArabic } = this.state;

    document.body.style.overflow = "hidden";

    return (
      <Popup
        clickOutside={false}
        mix={{
          block: "FilterPopup",
          mods: {
            isArabic,
          },
        }}
        id="PLPFilter"
        title="Filters"
      >
        <div block="FilterPopup" elem="Title" mods={{ isArabic }}>
          {this.renderCloseButton()}
          {this.renderRefine()}
          {this.renderResetFilterButton()}
        </div>
        {this.renderContent()}
        {this.renderSeeResultButton()}
      </Popup>
    );
  }

  renderFilter = ([key, filter]) => {
    const { activeFilter, isReset, activeFilters, defaultFilters } = this.state;
    const { initialOptions } = this.props;
    return (
      <PLPFilter
        key={key}
        filter={filter}
        parentCallback={this.handleCallback}
        currentActiveFilter={activeFilter}
        changeActiveFilter={this.changeActiveFilter}
        onDeselectAllCategory={this.onUnselectAllPress}
        isReset={isReset}
        initialOptions={initialOptions}
        resetParentState={this.resetParentState}
        parentActiveFilters={activeFilters}
        updateFilters={this.updateFilters}
        setDefaultFilters={this.setDefaultFilters}
        defaultFilters={defaultFilters}
      />
    );
  };

  renderSortBy = ([key, filter]) => {
    const { activeFilter, isReset, activeFilters, defaultFilters } = this.state;
    // return (

    // );
    // debugger
    return (
      <div block="SortBy">
        <PLPFilter
          key={key}
          filter={filter}
          parentCallback={this.handleCallback}
          currentActiveFilter={activeFilter}
          changeActiveFilter={this.changeActiveFilter}
          isReset={isReset}
          resetParentState={this.resetParentState}
          parentActiveFilters={activeFilters}
          updateFilters={this.updateFilters}
          setDefaultFilters={this.setDefaultFilters}
          defaultFilters={defaultFilters}
          isSortBy={true}
        />
        <img src={Refine} />
      </div>
    );
  };

  resetParentState = () => {
    this.setState({ isReset: false });
  };

  updateInitialFilters = (
    data,
    facet_value,
    newFilterArray,
    categoryLevel1,
    checked,
    facet_key
  ) => {
    if (data[facet_value]) {
      data[facet_value].is_selected = checked;
      if (checked) {
        newFilterArray.selected_filters_count += 1;
      } else {
        newFilterArray.selected_filters_count -= 1;
      }
    } else {
      let categoryDataStatus = categoryLevel1 || facet_key.includes("size");
      if (categoryDataStatus) {
        let categoryData = facet_key.includes("size")
          ? data[facet_key]
          : data[categoryLevel1];
        if (
          categoryData.subcategories &&
          categoryData.subcategories[facet_value]
        ) {
          categoryData.subcategories[facet_value].is_selected = checked;
          if (checked) {
            categoryData.selected_filters_count += 1;
            newFilterArray.selected_filters_count += 1;
          } else {
            categoryData.selected_filters_count -= 1;
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

  updateRadioFilters = (data, facet_value, newFilterArray) => {
    if (data[facet_value]) {
      Object.values(data).map((value) => {
        if (value.facet_value === facet_value) {
          value.is_selected = true;
        } else {
          value.is_selected = false;
        }
      });

      if (newFilterArray.selected_filters_count === 0) {
        newFilterArray.selected_filters_count += 1;
      }
    }
  };

  handleCallback = (
    initialFacetKey,
    facet_value,
    checked,
    isRadio,
    facet_key,
    isQuickFilters
  ) => {
    const { activeFilters } = this.state;
    const { filters, updatePLPInitialFilters, initialOptions } = this.props;
    const filterArray = activeFilters[initialFacetKey];
    let newFilterArray = filters[initialFacetKey];
    if (initialFacetKey.includes("size")) {
      newFilterArray = filters["sizes"];
    }

    let categoryLevel1 = initialOptions.q.split(" ")[1];
    if (isMobile.any()) {
      this.delayFilterUpdate();
    }
    if (!isRadio) {
      if (checked) {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;
          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            true,
            initialFacetKey
          );
          updatePLPInitialFilters(filters, initialFacetKey, facet_value);
          this.setState(
            {
              activeFilters: {
                ...activeFilters,
                [initialFacetKey]: filterArray
                  ? [...filterArray, facet_value]
                  : [facet_value],
              },
            },
            () => this.select(isQuickFilters)
          );
        }
      } else if (filterArray) {
        if (newFilterArray) {
          const { data = {} } = newFilterArray;

          this.updateInitialFilters(
            data,
            facet_value,
            newFilterArray,
            categoryLevel1,
            false,
            initialFacetKey
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
            false,
            initialFacetKey
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
      const { data = {} } = newFilterArray;

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
      Object.keys(activeFilters).map((key) => {
        if (key !== "categories.level1")
          WebUrlParser.setParam(key, activeFilters[key], query);
      });
    }
  };

  onUnselectAllPress = (category) => {
    const { filters, initialOptions, updatePLPInitialFilters, query } =
      this.props;
    let categoryLevel1 = initialOptions.q.split(" ")[1];
    let activeFilters = {};
    let newFilterArray = filters;
    Object.entries(newFilterArray).map((filter) => {
      if (filter[0] === category && filter[1].selected_filters_count > 0) {
        if (category === "categories_without_path") {
          return Object.entries(filter[1].data).map((filterData) => {
            filterData[1].selected_filters_count = 0;
            return Object.entries(filterData[1].subcategories).map((entry) => {
              entry[1].is_selected = false;
              activeFilters[filter[0]] = [];
            });
          });
        } else {
          filter[1].selected_filters_count = 0;
          Object.entries(filter[1].data).map((filterData) => {
            if (filterData[1].is_selected) {
              filterData[1].is_selected = false;
              activeFilters[filter[0]] = [];
            }
          });
        }
      } else {
        if (
          filter[0] !== "categories.level1" &&
          filter[1].selected_filters_count > 0
        ) {
          let categoryLevel1 = initialOptions.q.split(" ")[1];
          activeFilters[filter[0]] = [];

          if (filter[0] === "categories_without_path") {
            Object.entries(filter[1].data[categoryLevel1].subcategories).map(
              (filterData) => {
                if (filterData[1].is_selected) {
                  activeFilters[filter[0]].push(filterData[0]);
                }
              }
            );
          } else {
            Object.entries(filter[1].data).map((filterData) => {
              if (filterData[1].is_selected) {
                activeFilters[filter[0]].push(filterData[0]);
              }
            });
          }
        }
      }
    });
    this.setState({
      activeFilters: activeFilters,
    });
    updatePLPInitialFilters(filters, category, null);
    Object.keys(activeFilters).map((key) => {
      WebUrlParser.setParam(key, activeFilters[key]);
    });
  };

  renderQuickFilter = ([key, filter]) => {
    const genders = [__("women"), __("men"), __("kids")];
    const brandsCategoryName = "brand_name";
    const CategoryName = "categories_without_path";
    const pathname = location.pathname.split("/");
    const isBrandsFilterRequired = genders.includes(pathname[1]);

    if (isBrandsFilterRequired) {
      if (filter.category === brandsCategoryName) {
        return (
          <PLPQuickFilter
            key={key}
            filter={filter}
            updateFilters={this.updateFilters}
            onClick={this.updateFilters}
            parentCallback={this.handleCallback}
          />
        );
      }
    } else if (filter.category === CategoryName) {
      return (
        <PLPQuickFilter
          key={key}
          filter={filter}
          updateFilters={this.updateFilters}
          onClick={this.updateFilters}
          parentCallback={this.handleCallback}
        />
      );
    }

    return null;
  };

  render() {
    const { productsCount, filters } = this.props;
    const { isOpen, isArabic } = this.state;
    const count = productsCount ? productsCount.toLocaleString() : null;

    return (
      <div block="Products" elem="Filter">
        <div block="PLPFilters" elem="ProductsCount" mods={{ isArabic }}>
          <span>{count}</span>
          {count ? __("Products") : null}
        </div>
        {!isMobile.any() && (
          <div block="FilterHeader">
            <h2>{__("Filters")}</h2>
            <div
              block="PLPFilters"
              elem="Reset"
              mix={{
                block: "Reset",
                mods: {
                  isArabic,
                },
              }}
            >
              {this.renderResetFilterButton()}
            </div>
          </div>
        )}

        {isOpen ? this.renderPopupFilters() : this.renderFilterButton()}
        <form block="PLPFilters" name="filters">
          {this.renderFilters()}
        </form>
        {isMobile.any() && (
          <div block="PLPFilters" elem="ToolBar" mods={{ isArabic }}>
            <div block="PLPFilters" elem="QuickCategories" mods={{ isArabic }}>
              {this.renderQuickFilters()}
            </div>
            <div block="PLPFilters" elem="ProductsCount" mods={{ isArabic }}>
              <span>{count}</span>
              {count ? __("Products") : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PLPFilters;
