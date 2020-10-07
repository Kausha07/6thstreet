/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import FieldMultiselect from 'Component/FiledMultiselect';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilter.style';

class PLPFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    filterData = {
        id: '',
        label: '',
        value: ''
    };

    renderDropDownList() {
        const {
            filter: {
                label,
                data,
                category,
                is_radio
            }, onSelect, filter
        } = this.props;

        if (category === 'categories_without_path' || category === 'categories.level1') {
            return null;
        }

        console.log(filter);

        // eslint-disable-next-line no-return-assign
        const template = Object.keys(data).map((item) => (
            this.filterData = {
                name: data[item].label,
                id: data[item].facet_key,
                count: data[item].product_count,
                value: data[item].facet_value,
                checked: data[item].is_selected
            }
        ));

        return (
            <FieldMultiselect
              placeholder={ label }
              showCheckbox
              isRadio={ is_radio }
              options={ template }
              onChange={ onSelect }
              filter={ filter }
            />
        );
    }

    render() {
        return (
            <div>
                { this.renderDropDownList() }
            </div>
        );
    }
}

export default PLPFilter;
