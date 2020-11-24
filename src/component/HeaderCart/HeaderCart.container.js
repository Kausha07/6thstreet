import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setMinicartOpen } from 'Store/Cart/Cart.action';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay } from 'Store/Overlay/Overlay.action';
import { TotalsType } from 'Type/MiniCart';
import { checkProducts } from 'Util/Cart/Cart';

import HeaderCart from './HeaderCart.component';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    isMinicartOpen: state.CartReducer.isMinicartOpen
});

export const mapDispatchToProps = (_dispatch) => ({
    hideActiveOverlay: () => _dispatch(hideActiveOverlay()),
    showNotification: (type, message) => _dispatch(showNotification(type, message)),
    setMinicartOpen: (isMinicartOpen = false) => _dispatch(setMinicartOpen(isMinicartOpen)),
    updateTotals: (cartId) => CartDispatcher.getCartTotals(_dispatch, cartId)
});

export class HeaderCartContainer extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        showNotification: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        setMinicartOpen: PropTypes.func.isRequired,
        isMinicartOpen: PropTypes.bool.isRequired,
        updateTotals: PropTypes.func.isRequired
    };

    state = {
        itemCountDiv: '',
        isCheckoutAvailable: false
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    static getDerivedStateFromProps(props) {
        const {
            totals: { items = [], total, id },
            showNotification,
            updateTotals
        } = props;

        if (items.length !== 0) {
            const mappedItems = checkProducts(items);

            if (total === 0) {
                // TODO: Handle problem when total is 0
                updateTotals(id);
            }

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
