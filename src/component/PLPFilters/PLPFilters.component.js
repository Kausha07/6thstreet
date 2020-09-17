import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPFilter from 'Component/PLPFilter';
import { Filters } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilters.style';

class PLPFilters extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        filters: Filters.isRequired
    };

    renderFilter = ([key, filter]) => (
        <PLPFilter
          key={ key }
          filter={ filter }
        />
    );

    renderFilters() {
        const { filters } = this.props;
        return Object.entries(filters).map(this.renderFilter);
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

    render() {
        return (
            <form
              block="PLPFilters"
              name="filters"
            >
                { this.renderFilters() }
            </form>
        );
    }
}

export default PLPFilters;
