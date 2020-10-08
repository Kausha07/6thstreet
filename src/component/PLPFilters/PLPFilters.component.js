/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPFilter from 'Component/PLPFilter';
import Popup from 'Component/Popup';
import { Filters } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';
import { isArabic } from 'Util/App';

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

    activeFilters = {
        isOpen: false,
        isArabic: isArabic(),
        data: null
    };

    static getDerivedStateFromProps(nextProps) {
        const { activeOverlay } = nextProps;

        return ({ isOpen: activeOverlay === 'PLPFilter' });
    }

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

    renderPlaceholder() {
        return 'placeholder while loading filters...';
    }

    hidePopUp = () => {
        const { hideActiveOverlay, goToPreviousNavigationState, activeOverlay } = this.props;

        if (activeOverlay === 'PLPFilter') {
            hideActiveOverlay();
            goToPreviousNavigationState();
        }
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

        onReset();
    };

    onShowResultButton = () => {
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

    renderCloseButton() {
        const { isArabic } = this.state;

        return (
            <button
              block="FilterPopup"
              elem="CloseBtn"
              mix={ {
                  block: 'CloseBtn',
                  mods: {
                      isArabic
                  }
              } }
              aria-label={ __('Close') }
              onClick={ this.hidePopUp }
            />
        );
    }

    renderResetFilterButton() {
        const { isArabic, isOpen } = this.state;

        return (
            <button
              block="Reset"
              elem="Button"
              type="button"
              mix={ {
                  block: 'Reset',
                  mods: {
                      isArabic,
                      isOpen
                  }
              } }
              aria-label={ __('Reset') }
              onClick={ this.resetFilters }
            >
                { __('clear') }
            </button>
        );
    }

    renderContent() {
        const { isLoading } = this.props;

        if (isLoading) {
            return this.renderPlaceholder();
        }

        return (
            <div
              block="Content"
              elem="Filters"
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
                  mix={ {
                      block: 'Title',
                      mods: {
                          isArabic
                      }
                  } }
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

    renderFilter = ([key, filter]) => (
        <PLPFilter
          key={ key }
          filter={ filter }
          parentCallback={ this.handleCallback }
        />
    );

    handleCallback = (category, values) => {
        console.log(category, values);
        const { activeFilters } = this.state;
        this.setState({
            activeFilters: {
                ...activeFilters,
                [category]: values
            }
        });
    };

    render() {
        const { productsCount } = this.props;
        const { isOpen, isArabic, activeFilters } = this.state;
        const count = productsCount ? productsCount.toLocaleString() : null;

        console.log(activeFilters);

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
                <div block="PLPFilters" elem="ToolBar">
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
