// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import PLPDetails from './PLPDetails.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PLPDetailsContainer extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
            <PLPDetails
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLPDetailsContainer);
