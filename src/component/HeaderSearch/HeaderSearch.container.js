import { PureComponent } from 'react';
import { connect } from 'react-redux';

import HeaderSearch from './HeaderSearch.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class HeaderSearchContainer extends PureComponent {
    static defaultProps = {
        search: ''
    };

    state = {
        search: ''
    };

    containerFunctions = {
        onSearchChange: this.onSearchChange.bind(this)
    };

    containerProps = () => {
        const { search } = this.state;
        return { search };
    };

    onSearchChange(search) {
        this.setState({ search });
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearchContainer);
