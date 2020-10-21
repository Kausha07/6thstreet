import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { HistoryType } from 'Type/Common';

import HeaderSearch from './HeaderSearch.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class HeaderSearchContainer extends PureComponent {
    static propTypes = {
        search: PropTypes.string,
        history: HistoryType.isRequired
    };

    static defaultProps = {
        search: ''
    };

    state = {
        search: ''
    };

    containerFunctions = {
        onSearchChange: this.onSearchChange.bind(this),
        onSearchSubmit: this.onSearchSubmit.bind(this),
        onSearchClean: this.onSearchClean.bind(this)
    };

    containerProps = () => {
        const { search } = this.state;
        return { search };
    };

    onSearchChange(search) {
        this.setState({ search });
    }

    onSearchSubmit() {
        const { history } = this.props;
        const { search } = this.state;
        history.push(`/catalogsearch/result/?q=${ search }`);
    }

    onSearchClean() {
        this.setState({ search: '' });
    }

    render() {
        return (
            <HeaderSearch
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HeaderSearchContainer)
);
