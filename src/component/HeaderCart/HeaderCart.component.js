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
        totals: TotalsType.isRequired
    };

    state = {
        cartPopUp: '',
        isPopup: true,
        isArabic: isArabic()
    };

    closePopup = () => {
        const { hideActiveOverlay } = this.props;

        hideActiveOverlay();
        this.setState({ cartPopUp: '' });
    };

    renderCartPopUp = () => {
        const { isPopup } = this.state;
        const popUpElement = (
            <CartOverlay
              isPopup={ isPopup }
              closePopup={ this.closePopup }
            />
        );

        this.setState({ cartPopUp: popUpElement });
    };

    routeChangeCart = () => {
        const { history, hideActiveOverlay } = this.props;

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
