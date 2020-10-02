import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';

import CartOverlay from 'SourceComponent/CartOverlay';
import isMobile from 'Util/Mobile';

import './HeaderCart.style';

class HeaderCart extends PureComponent {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        cartPopUp: ''
    };

    renderCartPopUp = () => {
        const popUpElement = (
            <div block="HeaderCart" elem="PupUp">
                <CartOverlay />
            </div>
        );

        this.setState({ cartPopUp: popUpElement });
    };

    routeChangeCart = () => {
        const { history } = this.props;

        history.push('/cart');
    };

    render() {
        const { cartPopUp } = this.state;

        return (
            <div block="HeaderCart">
                <button
                  onClick={ isMobile.any()
                      ? this.routeChangeCart
                      : this.renderCartPopUp }
                  block="HeaderCart"
                  elem="Button"
                >
                    { cartPopUp }
                </button>
            </div>
        );
    }
}

export default withRouter(HeaderCart);
