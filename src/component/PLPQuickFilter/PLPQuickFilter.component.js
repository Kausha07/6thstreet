import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import QuickCategoriesOptions from 'Component/QuickCategoriesOptions';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPQuickFilter.style';

class PLPQuickFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    render() {
        const {
            filter: {
                label
            }, onSelect, filter
        } = this.props;

        return (
            <QuickCategoriesOptions
              placeholder={ label }
              showCheckbox
              onChange={ onSelect }
              filter={ filter }
            />
        );
    }
}

export default PLPQuickFilter;
