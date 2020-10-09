/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import CartOverlay from 'SourceComponent/CartOverlay';
import isMobile from 'Util/Mobile';

import './HeaderCart.style';

class HeaderCart extends PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired,
        renderCountItems: PropTypes.func.isRequired
    };

    state = {
        cartPopUp: '',
        isPopup: true
    };

    closePopup = () => {
        this.setState({ cartPopUp: '' });
    };

    renderCartPopUp = () => {
        const { isPopup } = this.state;
        const popUpElement = (
            <CartOverlay isPopup={ isPopup } closePopup={ this.closePopup } />
        );

        this.setState({ cartPopUp: popUpElement });
    };

    routeChangeCart = () => {
        const { history } = this.props;

        history.push('/cart');
    };

    render() {
        const { cartPopUp } = this.state;
        const { renderCountItems } = this.props;

        return (
            <div block="HeaderCart">
                <button
                  onClick={ isMobile.any()
                      ? this.routeChangeCart
                      : this.renderCartPopUp }
                  block="HeaderCart"
                  elem="Button"
                />
                { cartPopUp }
                { renderCountItems }
            </div>
        );
    }
}

export default withRouter(HeaderCart);
