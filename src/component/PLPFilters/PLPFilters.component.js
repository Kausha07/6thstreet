import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPFilter from 'Component/PLPFilter';
import { PLPFilterOverlay } from 'Component/PLPFilterOverlay/PLPFilterOverlay.component';
import { PLP_FILTER_OVERLAY_ID } from 'Component/PLPFilterOverlay/PLPFilterOverlay.config';
import { Filters } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilters.style';

class PLPFilters extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        filters: Filters.isRequired,
        isContentFiltered: PropTypes.bool,
        totalPages: PropTypes.number,
        toggleOverlayByKey: PropTypes.func.isRequired
    };

    static defaultProps = {
        isContentFiltered: true,
        totalPages: 1
    };

    onFilterButtonClick = this.onFilterButtonClick.bind(this);

    renderFilters() {
        const { filters } = this.props;
        return Object.entries(filters)
            .map(this.renderFilter);
    }

    renderPlaceholder() {
        return 'placeholder while loading filters...';
    }

    renderContent() {
        const { isLoading } = this.props;

        if (isLoading) {
            return this.renderPlaceholder();
        }

        return this.renderFilters();
    }

    onFilterButtonClick() {
        const { toggleOverlayByKey } = this.props;

        toggleOverlayByKey(PLP_FILTER_OVERLAY_ID);
    }

    renderFilterButton() {
        const { isContentFiltered, totalPages } = this.props;

        if (!isContentFiltered && totalPages === 0) {
            return null;
        }

        return (
            <button
              block="PLPFilters"
              elem="Filter"
              onClick={ this.onFilterButtonClick }
            >
                { __('Filter') }
            </button>
        );
    }

    renderFilterOverlay() {
        return (
            <PLPFilterOverlay />);
    }

    renderFilter = ([key, filter]) => (
        <PLPFilter
          key={ key }
          filter={ filter }
        />
    );

    render() {
        return (
            <form
              block="PLPFilters"
              name="filters"
            >
                { this.renderFilters() }
                { this.renderFilterOverlay() }
                { this.renderFilterButton() }
            </form>
        );
    }
}

export default PLPFilters;
