import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import PLPFilterOption from 'Component/PLPFilterOption';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilter.style';

class PLPFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    // eslint-disable-next-line react/sort-comp
    renderLabel() {
        const { filter: { label } } = this.props;
        return (
            <h3>{ label }</h3>
        );
    }

    renderOption = ([key, option]) => {
        const { filter: { is_radio } } = this.props;
        return (
            <PLPFilterOption
              key={ key }
              option={ option }
              isRadio={ is_radio }
            />
        );
    };

    myObj: { id: (string | string), label: (string | string), value: (string | string) };

    renderOptions() {
        const { filter: { data } } = this.props;
        return (
            <ul>
                { Object.entries(data)
                    .map(this.renderOption) }
            </ul>
        );
    }

    renderDropDownList() {
        const { filter: { label } } = this.props;
        const { filter: { data } } = this.props;
        const { filter: { category } } = this.props;
        const { onSelect } = this.props;
        // eslint-disable-next-line no-return-assign
        const template = Object.keys(data).map((item) => (
            this.myObj = {
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
              placeholder={ label }
              selectOptions={ template }
              onChange={ onSelect }
            />
        );
    }

    render() {
        return this.renderDropDownList();
    }
}

export default PLPFilter;
