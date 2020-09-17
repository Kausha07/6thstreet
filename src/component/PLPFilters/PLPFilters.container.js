import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Filters } from 'Util/API/endpoint/Product/Product.type';

import PLPFilters from './PLPFilters.component';

export const mapStateToProps = (state) => ({
    filters: state.PLP.filters,
    isLoading: state.PLP.isLoading
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPFiltersContainer extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        filters: Filters.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        const { filters, isLoading } = this.props;

        return {
            filters,
            isLoading
        };
    };

    render() {
        return (
            <PLPFilters
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPFiltersContainer);
