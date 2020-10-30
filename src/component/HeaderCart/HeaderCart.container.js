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

    componentDidMount() {
        this.renderItemCount();
    }

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    renderItemCount() {
        const { totals: { items = [] } } = this.props;

        const itemQuantityArray = items.map((item) => item.qty);
        const totalQuantity = itemQuantityArray.reduce((qty, nextQty) => qty + nextQty, 0);

        if (totalQuantity && totalQuantity !== 0) {
            return (
                <div block="HeaderCart" elem="Count">
                    { totalQuantity }
                </div>
            );
        }

        return null;
    }

    render() {
        return (
                <HeaderCart
                  { ...this.containerFunctions }
                  { ...this.containerProps() }
                  { ...this.state }
                  { ...this.props }
                  renderCountItems={ this.renderItemCount() }
                />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderCartContainer);
