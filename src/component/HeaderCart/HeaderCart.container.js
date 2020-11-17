// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { TotalsType } from 'Type/MiniCart';

// import BrowserDatabase from 'Util/BrowserDatabase';
import HeaderCart from './HeaderCart.component';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals
});

export const mapDispatchToProps = (_dispatch) => ({
    hideActiveOverlay: () => _dispatch(hideActiveOverlay())
});

export class HeaderCartContainer extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired
    };

    state = {
        itemCountDiv: ''
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
                <HeaderCart
                  { ...this.containerFunctions }
                  { ...this.containerProps() }
                  { ...this.state }
                  { ...this.props }
                />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderCartContainer);
