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
        goToPreviousNavigationState: PropTypes.isRequired
    };

    constructor() {
        super();
        this.state = {
            isOpen: false,
            isArabic: isArabic()
        };
    }

    static getDerivedStateFromProps(nextProps) {
        const { activeOverlay } = nextProps;
        return (
            {
                isOpen: activeOverlay === 'PLPFilter',
                isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
            }
        );
    }

    handleFilterClick = () => {
        const { isOpen } = this.state;
        const { showOverlay } = this.props;
        showOverlay('PLPFilter');
        this.setState({ isOpen: !isOpen });
    };

    renderFilters() {
        const { filters } = this.props;
        return Object.entries(filters)
            .map(this.renderFilter);
    }

    renderPlaceholder() {
        return 'placeholder while loading filters...';
    }

    hidePopUp = () => {
        const { hideActiveOverlay, goToPreviousNavigationState } = this.props;
        const { activeOverlay } = this.props;
        if (activeOverlay === 'PLPFilter') {
            hideActiveOverlay();
            goToPreviousNavigationState();
        }
    };

    renderSeeResultButton() {
        return (
            <button
              block="Content"
              elem="SeeResult"
              onClick={ this.hidePopUp }
            >
                { __('show result') }
            </button>
        );
    }

    renderCloseButton() {
        return (
            <button
              block="FilterPopup"
              elem="CloseBtn"
              aria-label={ __('Close') }
              onClick={ this.hidePopUp }
            />
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

    renderPopupFilters() {
        const { isArabic } = this.state;
        return (
            <Popup
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
                    <i
                      block="arrow left"
                      mix={ {
                          block: 'left',
                          mods: {
                              isArabic
                          }
                      } }
                    />
                    { __('refine') }
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
        />
    );

    render() {
        const { isOpen } = this.state;
        return (
            <>
                { isOpen ? this.renderPopupFilters() : this.renderFilterButton() }
                <form
                  block="PLPFilters"
                  name="filters"
                >
                    { this.renderFilters() }
                </form>
            </>
        );
    }
}

export default PLPFilters;
