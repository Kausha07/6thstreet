/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import CartOverlay from 'SourceComponent/CartOverlay';
import { TotalsType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './HeaderCart.style';

class HeaderCart extends PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        totals: TotalsType.isRequired,
        isCheckoutAvailable: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    state = {
        cartPopUp: '',
        isPopup: true,
        isArabic: isArabic()
    };

    componentDidUpdate(prevProps) {
        const { history: { location: { pathname } } } = this.props;

        if (!isMobile.any() && pathname !== '/cart') {
            const { isCheckoutAvailable, totals: { items } } = this.props;
            const {
                isCheckoutAvailable: prevIsCheckoutAvailable,
                totals: { items: prevItems }
            } = prevProps;

            const isAddingError = prevItems ? prevItems.length > items.length : false;

            if (
                (isCheckoutAvailable !== prevIsCheckoutAvailable && prevIsCheckoutAvailable !== '')
                || (prevItems !== items && prevItems && !isAddingError && items.length !== 0)
            ) {
                this.renderCartPopUp();
            }
        }
    }

    closePopup = () => {
        const { hideActiveOverlay } = this.props;

        hideActiveOverlay();
        this.setState({ cartPopUp: '' });
    };

    renderCartPopUp = () => {
        const { isCheckoutAvailable } = this.props;
        const { isPopup } = this.state;
        const popUpElement = (
            <CartOverlay
              isPopup={ isPopup }
              closePopup={ this.closePopup }
              isCheckoutAvailable={ isCheckoutAvailable }
            />
        );

        this.setState({ cartPopUp: popUpElement });
    };

    routeChangeCart = () => {
        const {
            history,
            hideActiveOverlay,
            isCheckoutAvailable,
            showNotification
        } = this.props;

        if (!isCheckoutAvailable) {
            showNotification('error', __('Some products or selected quantities are no longer available'));
        }

        hideActiveOverlay();
        history.push('/cart');
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
        const { cartPopUp, isArabic } = this.state;
        return (
            <div block="HeaderCart" mods={ { isArabic } }>
                <button
                  onClick={ isMobile.any()
                      ? this.routeChangeCart
                      : this.renderCartPopUp }
                  block="HeaderCart"
                  elem="Button"
                >
                    { this.renderItemCount() }
                </button>
                { cartPopUp }
            </div>
        );
    }
}

export default withRouter(HeaderCart);
