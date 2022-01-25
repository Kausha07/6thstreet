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
import { PureComponent, createRef } from "react";
import { Filters } from "Util/API/endpoint/Product/Product.type";
import WebUrlParser from "Util/API/helper/WebUrlParser";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import fitlerImage from "./icons/filter-button.png";
import { SIZES } from "./PLPFilters.config";
import Refine from "../Icons/Refine/icon.png";
import "./PLPFilters.style";
import FieldMultiselect from "Component/FieldMultiselect";
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
  filterDropdownRef = createRef();

  filterButtonRef = createRef();

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      activeFilter: undefined,
      isArabic: isArabic(),
      activeFilters: {},
      isReset: false,
      toggleOptionsList: false,
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
    return Object.entries(filters).map((filter, index) => {
      if (filter[1]) {
        if (filter[0] === "sort" && !isMobile.any()) {
          return this.renderSortBy([filter[0], filter[1]], index);
        }
        // return this.renderFilter([filter[0], filter[1]]);
        // return this.renderDropDownList([filter[0], filter[1]]);
        return this.renderFilterOption([filter[0], filter[1]]);
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
        {this.renderDropDownList()}
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

  renderDropDownList() {
    const { filters } = this.props;
    const { activeFilter, defaultFilters } = this.state;
    return Object.entries(filters).map((filter) => {
      if (activeFilter === filter[0]) {
        const {
          isChecked,
          initialOptions,
          handleCallback,
          activeFilters,
          onUnselectAllPress,
        } = this.props;
        const { label, category, is_radio } = filter[1];

        let placeholder =
          category === "in_stock"
            ? __("BY STOCK")
            : category === "age"
            ? __("BY AGE")
            : label;

        return (
          <FieldMultiselect
            key={filter[0]}
            placeholder={placeholder}
            showCheckbox
            isRadio={is_radio}
            filter={filter[1]}
            initialOptions={initialOptions}
            activeFilter={activeFilter}
            isChecked={isChecked}
            onUnselectAllPress={onUnselectAllPress}
            parentActiveFilters={activeFilters}
            currentActiveFilter={activeFilter}
            changeActiveFilter={this.changeActiveFilter}
            parentCallback={handleCallback}
            updateFilters={this.updateFilters}
            setDefaultFilters={this.setDefaultFilters}
            defaultFilters={defaultFilters}
            isSortBy={false}
          />
        );
      }
    });
  }

  handleClickOutside = (event) => {
    const { toggleOptionsList } = this.state;

    if (toggleOptionsList) {
      if (
        this.filterDropdownRef &&
        !this.filterDropdownRef.current.contains(event.target)
      ) {
        this.onBlur();
      }
    }
  };

  onBlur = () => {
    // eslint-disable-next-line no-magic-numbers
    this.toggelOptionList();
  };

  toggelOptionList() {
    const { toggleOptionsList } = this.state;

    this.setState({
      toggleOptionsList: !toggleOptionsList,
    });
  }

  handleFilterChange = (filter) => {
    this.changeActiveFilter(filter.category || filter.facet_key);
  };

  renderFilterOption([key, filter]) {
    const { activeFilter } = this.state;
    const { filters } = this.props;
    const { label, category } = filter;
    if (Object.keys(filter.data).length === 0 || key === "categories.level1") {
      return null;
    }

    let placeholder =
      category === "in_stock"
        ? __("BY STOCK")
        : category === "age"
        ? __("BY AGE")
        : label;
    let toggleOptionsList = activeFilter === category;
    let selectedItems = true;

    return (
      <div
        ref={this.filterDropdownRef}
        block="FieldMultiselect"
        // mods={{ isHidden }}
      >
        <button
          ref={this.filterButtonRef}
          type="button"
          block="FieldMultiselect"
          elem="FilterButton"
          mods={{ toggleOptionsList, selectedItems }}
          mix={{
            block: "FieldMultiselect",
            elem: "FilterButton",
            mods: { isArabic },
          }}
          onClick={() =>
            isMobile.any()
              ? this.handleFilterChange(filter)
              : this.toggelOptionList
          }
        >
          {placeholder}
        </button>
      </div>
    );
  }

  renderSortBy = ([key, filter], index) => {
    const { activeFilter, isReset, activeFilters, defaultFilters, isArabic } =
      this.state;
    const { handleCallback } = this.props;
    return (
      <div block="SortBy" key={index} mods={{ isArabic }}>
        <PLPFilter
          key={key}
          filter={filter}
          parentCallback={handleCallback}
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

  renderQuickFilter = ([key, filter]) => {
    const genders = [__("women"), __("men"), __("kids")];
    const brandsCategoryName = "brand_name";
    const CategoryName = "categories_without_path";
    const pathname = location.pathname.split("/");
    const isBrandsFilterRequired = genders.includes(pathname[1]);
    const { handleCallback } = this.props;
    if (isBrandsFilterRequired) {
      if (filter.category === brandsCategoryName) {
        return (
          <PLPQuickFilter
            key={key}
            filter={filter}
            updateFilters={this.updateFilters}
            onClick={this.updateFilters}
            parentCallback={handleCallback}
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
          parentCallback={handleCallback}
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
          {count ? __("Results") : null}
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
        {!isMobile.any() && (
          <form block="PLPFilters" name="filters">
            {this.renderFilters()}
          </form>
        )}
        {isMobile.any() && (
          <div block="PLPFilters" elem="ToolBar" mods={{ isArabic }}>
            <div block="PLPFilters" elem="QuickCategories" mods={{ isArabic }}>
              {this.renderQuickFilters()}
            </div>
            <div block="PLPFilters" elem="ProductsCount" mods={{ isArabic }}>
              <span>{count}</span>
              {count ? __("Results") : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PLPFilters;
