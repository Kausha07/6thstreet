import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPFilterOption from 'Component/PLPFilterOption';
import { Filter } from 'Util/API/endpoint/Product/Product.type';

import './PLPFilter.style';

class PLPFilter extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onSelect: PropTypes.func.isRequired
    };

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

    renderOptions() {
        const { filter: { data } } = this.props;

        return (
            <ul>
                { Object.entries(data).map(this.renderOption) }
            </ul>
        );
    }

    render() {
        const { onSelect } = this.props;

        return (
            <fieldset
              block="PLPFilter"
              onChange={ onSelect }
            >
                { this.renderLabel() }
                { this.renderOptions() }
            </fieldset>
        );
    }
}

export default PLPFilter;
