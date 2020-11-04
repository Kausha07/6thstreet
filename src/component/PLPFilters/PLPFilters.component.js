/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPFilter from 'Component/PLPFilter';
import PLPQuickFilter from 'Component/PLPQuickFilter';
import Popup from 'Component/Popup';
import { Filters } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import fitlerImage from './icons/filter-button.png';
import { SIZES } from './PLPFilters.config';

import './PLPFilters.style';

class PLPFilters extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        filters: Filters.isRequired,
        activeOverlay: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.isRequired,
        goToPreviousNavigationState: PropTypes.isRequired,
        onReset: PropTypes.func.isRequired,
        productsCount: PropTypes.string.isRequired,
        activeFilters: PropTypes.object.isRequired
    };

    state = {
        isOpen: false,
        activeFilter: undefined,
        isArabic: isArabic(),
        activeFilters: {},
        isReset: false
    };

    static getDerivedStateFromProps(props, state) {
        const {
            activeOverlay,
            filters
        } = props;
        const { activeFilter } = state;

        if (isMobile.any()) {
            if (!activeFilter) {
                return ({
                    isOpen: activeOverlay === 'PLPFilter',
                    activeFilter: Object.keys(filters)[0]
                });
            }
        }

        return ({
            isOpen: activeOverlay === 'PLPFilter'
        });
    }

    changeActiveFilter = (newFilter) => {
        this.setState({ activeFilter: newFilter });
    };

    handleFilterClick = () => {
        const { isOpen } = this.state;
        const { showOverlay } = this.props;

        showOverlay('PLPFilter');
        this.setState({ isOpen: !isOpen });
    };

    renderFilters() {
        const { filters } = this.props;
        return Object.entries(filters).map((filter) => {
            if (filter[0] === SIZES && !isMobile.any()) {
                const { data } = filter[1];
                return Object.keys(data).map((size) => this.renderFilter([size, data[size]]));
            }

            return this.renderFilter([filter[0], filter[1]]);
        });
    }

    renderQuickFilters() {
        const { filters } = this.props;

        return Object.entries(filters).map(this.renderQuickFilter.bind(this));
    }

    renderPlaceholder() {
        return 'placeholder while loading filters...';
    }

    hidePopUp = () => {
        const { hideActiveOverlay, goToPreviousNavigationState, activeOverlay } = this.props;

        if (activeOverlay === 'PLPFilter') {
            hideActiveOverlay();
            goToPreviousNavigationState();
        }

        document.body.style.overflow = 'visible';
    };

    resetFilters = () => {
        const {
            hideActiveOverlay,
            goToPreviousNavigationState,
            onReset,
            activeOverlay
        } = this.props;

        if (activeOverlay === 'PLPFilter') {
            hideActiveOverlay();
            goToPreviousNavigationState();
        }

        this.setState({ activeFilters: {}, isReset: true });

        onReset();
    };

    onShowResultButton = () => {
        const { activeFilters } = this.state;
        Object.keys(activeFilters || {}).map((key) => WebUrlParser.setParam(key, activeFilters[key]));
        this.hidePopUp();
    };

    updateFilters = () => {
        const { activeFilters } = this.state;
        Object.keys(activeFilters).map((key) => WebUrlParser.setParam(key, activeFilters[key]));
    };

    renderSeeResultButton() {
        return (
            <button
              block="Content"
              elem="SeeResult"
              onClick={ this.onShowResultButton }
            >
                { __('show result') }
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
              mods={ { isArabic } }
              aria-label={ __('Close') }
              onClick={ this.onClose }
            />
        );
    }

    renderResetFilterButton() {
        const { isArabic } = this.state;

        return (
            <button
              block="FilterPopup"
              elem="Reset"
              type="button"
              mods={ { isArabic } }
              aria-label={ __('Reset') }
              onClick={ this.resetFilters }
            >
                { __('clear') }
            </button>
        );
    }

    renderContent() {
        const { isLoading } = this.props;
        const { isArabic } = this.state;

        if (isLoading) {
            return this.renderPlaceholder();
        }

        return (
            <div
              block="Content"
              elem="Filters"
              mods={ { isArabic } }
            >
                { this.renderFilters() }
            </div>
        );
    }

    renderFilterButton() {
        return (
            <button
              onClick={ this.handleFilterClick }
              onKeyDown={ this.handleFilterClick }
              aria-label="Dismiss"
              tabIndex={ 0 }
              block="PLPFilterMobile"
            >
                <img src={ fitlerImage } alt="fitler" />
                { __('refine ') }
            </button>
        );
    }

    renderRefine() {
        const { isArabic } = this.state;

        return (
            <div
              block="PLPFilters"
              elem="Refine"
              mods={ { isArabic } }
            >
                { __('refine') }
            </div>
        );
    }

    renderPopupFilters() {
        const { isArabic } = this.state;

        document.body.style.overflow = 'hidden';

        return (
            <Popup
              clickOutside={ false }
              mix={ {
                  block: 'FilterPopup',
                  mods: {
                      isArabic
                  }
              } }
              id="PLPFilter"
              title="Filters"
            >
                <div
                  block="FilterPopup"
                  elem="Title"
                  mods={ { isArabic } }
                >
                    { this.renderCloseButton() }
                    { this.renderRefine() }
                    { this.renderResetFilterButton() }
                </div>
                { this.renderContent() }
                { this.renderSeeResultButton() }
            </Popup>
        );
    }

    renderFilter = ([key, filter]) => {
        const { activeFilter, isReset, activeFilters } = this.state;

        return (
                <PLPFilter
                  key={ key }
                  filter={ filter }
                  parentCallback={ this.handleCallback }
                  currentActiveFilter={ activeFilter }
                  changeActiveFilter={ this.changeActiveFilter }
                  isReset={ isReset }
                  resetParentState={ this.resetParentState }
                  parentActiveFilters={ activeFilters }
                />
        );
    };

    resetParentState = () => {
        this.setState({ isReset: false });
    };

    handleCallback = (initialFacetKey, facet_value, checked, isRadio, isQuickFilters) => {
        const { activeFilters } = this.state;
        const filterArray = activeFilters[initialFacetKey];

        if (!isRadio) {
            if (checked) {
                this.setState({
                    activeFilters: {
                        ...activeFilters,
                        [initialFacetKey]: filterArray ? [...filterArray, facet_value] : [facet_value]
                    }
                }, () => this.select(isQuickFilters));
            } else if (filterArray) {
                const index = filterArray.indexOf(facet_value);
                if (index > -1) {
                    filterArray.splice(index, 1);
                }
                this.setState({
                    activeFilters: {
                        [initialFacetKey]: filterArray
                    }
                }, () => this.select());
            } else {
                this.setState({
                    activeFilters: {
                        [initialFacetKey]: []
                    }
                }, () => this.select());
            }
        } else {
            this.setState({
                ...activeFilters,
                activeFilters: {
                    [initialFacetKey]: facet_value
                }
            }, () => this.select());
        }
    };

    select = (isQuickFilters) => {
        const { activeFilters } = this.state;

        if (!isMobile.any() || isQuickFilters) {
            Object.keys(activeFilters || {}).map((key) => WebUrlParser.setParam(key, activeFilters[key]));
        }
    };

    renderQuickFilter = ([key, filter]) => {
        const genders = [
            __('men'),
            __('women'),
            __('kids')
        ];
        const brandsCategoryName = 'brand_name';
        const CategoryName = 'categories_without_path';
        const pathname = location.pathname.split('/');
        const isBrandsFilterRequired = genders.includes(pathname[1]);

        if (isBrandsFilterRequired) {
            if (filter.category === brandsCategoryName) {
                return (
                    <PLPQuickFilter
                      key={ key }
                      filter={ filter }
                      updateFilters={ this.updateFilters }
                      onClick={ this.updateFilters }
                      parentCallback={ this.handleCallback }
                    />
                );
            }
        } else if (filter.category === CategoryName) {
            return (
                <PLPQuickFilter
                  key={ key }
                  filter={ filter }
                  updateFilters={ this.updateFilters }
                  onClick={ this.updateFilters }
                  parentCallback={ this.handleCallback }
                />
            );
        }

        return null;
    };

    render() {
        const { productsCount } = this.props;
        const { isOpen, isArabic } = this.state;
        const count = productsCount ? productsCount.toLocaleString() : null;

        return (
            <>
                { isOpen ? this.renderPopupFilters() : this.renderFilterButton() }
                <form
                  block="PLPFilters"
                  name="filters"
                >
                    { this.renderFilters() }
                    <div
                      block="PLPFilters"
                      elem="Reset"
                      mix={ {
                          block: 'Reset',
                          mods: {
                              isArabic
                          }
                      } }
                    >
                        { this.renderResetFilterButton() }
                    </div>
                </form>
                <div block="PLPFilters" elem="ToolBar" mods={ { isArabic } }>
                    <div block="PLPFilters" elem="QuickCategories" mods={ { isArabic } }>
                        { this.renderQuickFilters() }
                    </div>
                    <div block="PLPFilters" elem="ProductsCount" mods={ { isArabic } }>
                        <span>{ count }</span>
                        { count ? __('Products') : null }
                    </div>
                </div>
            </>
        );
    }
}

export default PLPFilters;
