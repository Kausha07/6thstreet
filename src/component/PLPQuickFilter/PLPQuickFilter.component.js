import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import QuickCategoriesOptions from 'Component/QuickCategoriesOptions';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPQuickFilter.style';

class PLPQuickFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        updateFilters: PropTypes.func.isRequired,
        handleCallback: PropTypes.func.isRequired
    };

    render() {
        const {
            filter: {
                label
            },
            filter,
            updateFilters,
            handleCallback
        } = this.props;

        return (
            <QuickCategoriesOptions
              placeholder={ label }
              showCheckbox
              filter={ filter }
              updateFilters={ updateFilters }
              parentCallback={ handleCallback }
            />
        );
    }
}

export default PLPQuickFilter;
