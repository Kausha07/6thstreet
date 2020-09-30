/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilter.style';

class PLPFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    state = {
        isArabic: false
    };

    static getDerivedStateFromProps() {
        return (
            {
                isArabic: JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar'
            }
        );
    }

    filterData: {
        id: (string),
        label: (string),
        value: (string)
    };

    renderDropDownList() {
        const { filter: { label } } = this.props;
        const { filter: { data } } = this.props;
        const { filter: { category } } = this.props;
        const { isArabic } = this.state;
        const { onSelect } = this.props;

        // eslint-disable-next-line no-return-assign
        const template = Object.keys(data).map((item) => (
            this.filterData = {
                label: data[item].label,
                id: data[item].facet_value,
                value: data[item].facet_value
            }
        ));

        return (
            <Field
              id={ category }
              name={ category }
              type="select"
              mix={ {
                  block: 'Field',
                  mods: {
                      isArabic
                  }
              } }
              placeholder={ label }
              selectOptions={ template }
              onChange={ onSelect }
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
