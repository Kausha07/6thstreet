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
        onSelect: PropTypes.func.isRequired,
        activeFilter: PropTypes.object,
        isChecked: PropTypes.bool,
        currentActiveFilter: PropTypes.string,
        changeActiveFilter: PropTypes.func.isRequired
    };

    static defaultProps = {
        activeFilter: {},
        isChecked: false,
        currentActiveFilter: ''
    };

    renderDropDownList() {
        const {
            filter: {
                label,
                category,
                is_radio
            }, onSelect,
            filter,
            activeFilter,
            isChecked,
            currentActiveFilter,
            changeActiveFilter
        } = this.props;

        if (category === 'categories.level1') {
            return null;
        }

        if (category === 'categories_without_path') {
            return (
                <FieldMultiselect
                  onChange={ onSelect }
                  filter={ filter }
                  isHidden
                />
            );
        }

        return (
            <FieldMultiselect
              placeholder={ label }
              showCheckbox
              isRadio={ is_radio }
              onChange={ onSelect }
              filter={ filter }
              activeFilter={ activeFilter }
              isChecked={ isChecked }
              currentActiveFilter={ currentActiveFilter }
              changeActiveFilter={ changeActiveFilter }
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
