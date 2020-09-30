import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import HeaderWishlist from './HeaderWishlist.component';

export const mapStateToProps = (_state) => ({
    language: _state.AppState.language
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class HeaderWishlistContainer extends PureComponent {
    static propTypes = {
        isBottomBar: PropTypes.bool,
        isWishlist: PropTypes.bool,
        language: PropTypes.string.isRequired
    };

    static defaultProps = {
        isBottomBar: false,
        isWishlist: false
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
            <HeaderWishlist
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderWishlistContainer);
