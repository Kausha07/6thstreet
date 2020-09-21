// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

// import { setPLPFilter } from 'Store/PLP/PLP.action';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLPFilter from './PLPFilter.component';

export const mapStateToProps = (_state) => ({
});

export const mapDispatchToProps = (_dispatch) => ({
    // setPLPFilter: (key, value) => dispatch(setPLPFilter(key, value))
});

class PLPFilterContainer extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired
        // setPLPFilter: PropTypes.func.isRequired
    };

    containerFunctions = {
        onSelect: this.onSelect.bind(this)
    };

    onSelect() {
        const {
            // setPLPFilter,
            filter: { category }
        } = this.props;

        // This syntax gets form with name "filters" from document
        // then it extracts all inputs from form
        const inputs = Array.from(document.forms.filters[category] || []);

        const values = inputs.reduce((acc, node) => {
            const { checked, value } = node;

            if (checked) {
                acc.push(value);
            }

            return acc;
        }, []);

        WebUrlParser.setParam(category, values);
    }

    containerProps = () => {
        const { filter } = this.props;

        return {
            filter
        };
    };

    render() {
        return (
            <PLPFilter
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFilterContainer);
