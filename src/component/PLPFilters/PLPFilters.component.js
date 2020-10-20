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
        productsCount: PropTypes.string.isRequired
    };

    state = {
        isOpen: false,
        activeFilter: undefined,
        isArabic: isArabic(),
        activeFilters: {}
    };

    static getDerivedStateFromProps(props, state) {
        const { activeOverlay, filters } = props;
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

        return Object.entries(filters).map(this.renderFilter);
    }

    renderQuickFilters() {
        const { filters } = this.props;

        return Object.entries(filters).map(this.renderQuickFilter);
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

        this.setState({ activeFilters: {} });

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

        this.setState({ activeFilters: {} });

        onReset();
    };

    onShowResultButton = () => {
        const { activeFilters } = this.state;

        Object.keys(activeFilters).map((key) => WebUrlParser.setParam(key, activeFilters[key]));
        this.hidePopUp();
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

    renderCloseButton() {
        const { isArabic } = this.state;

        return (
            <button
              block="FilterPopup"
              elem="CloseBtn"
              mods={ { isArabic } }
              aria-label={ __('Close') }
              onClick={ this.hidePopUp }
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
                { __('refine') }
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
        const { activeFilter } = this.state;

        return (
            <PLPFilter
              key={ key }
              filter={ filter }
              parentCallback={ this.handleCallback }
              currentActiveFilter={ activeFilter }
              changeActiveFilter={ this.changeActiveFilter }
            />
        );
    };

    handleCallback = (category, values) => {
        const { activeFilters } = this.state;
        this.setState({
            activeFilters: {
                ...activeFilters,
                [category]: values
            }
        });
    };

    renderQuickFilter([key, filter]) {
        const genders = [
            __('men'),
            __('women'),
            __('kids')
        ];
        const brandsLabel = 'Brands';
        const categoriesLabel = 'Categories';
        const pathname = location.pathname.split('/');
        const isBrandsFilterRequired = genders.includes(pathname[1]);

        if (isBrandsFilterRequired) {
            if (filter.label === brandsLabel) {
                return (
                    <PLPQuickFilter
                      key={ key }
                      filter={ filter }
                    />
                );
            }
        } else if (filter.label === categoriesLabel) {
            return (
                <PLPQuickFilter
                  key={ key }
                  filter={ filter }
                />
            );
        }

        return null;
    }

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
                        Products
                    </div>
                </div>
            </>
        );
    }
}

export default PLPFilters;
