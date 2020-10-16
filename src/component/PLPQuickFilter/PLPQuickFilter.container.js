import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Filter } from 'Util/API/endpoint/Product/Product.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';

import PLPFilter from './PLPQuickFilter.component';

export const mapStateToProps = (_state) => ({});

class PLPQuickFilterContainer extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired
    };

    containerFunctions = {
        onSelect: this.onSelect.bind(this)
    };

    onSelect() {
        const {
            filter: { category }
        } = this.props;

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

        return { filter };
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

export default connect(mapStateToProps)(PLPQuickFilterContainer);
