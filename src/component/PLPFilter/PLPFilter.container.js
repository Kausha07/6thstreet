import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Filter } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLPFilter from './PLPFilter.component';

export const mapStateToProps = (_state) => ({});
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

    onSelect(value) {
        const {
            // setPLPFilter,
            filter: { category }
        } = this.props;

        WebUrlParser.setParam(category, value);
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
