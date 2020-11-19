import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { TotalsType } from 'Type/MiniCart';
import { checkProducts } from 'Util/Cart/Cart';

import HeaderCart from './HeaderCart.component';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals
});

export const mapDispatchToProps = (_dispatch) => ({
    hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
    showNotification: (type, message) => _dispatch(showNotification(type, message))
});

export class HeaderCartContainer extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    state = {
        itemCountDiv: '',
        isCheckoutAvailable: false
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    static getDerivedStateFromProps(props) {
        const { totals: { items = [] }, showNotification } = props;

        if (items.length !== 0) {
            const mappedItems = checkProducts(items);

            if (mappedItems.length !== 0) {
                showNotification('error', __('Some products or selected quantities are no longer available'));
            }

            return {
                isCheckoutAvailable: mappedItems.length === 0
            };
        }

        return null;
    }

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
