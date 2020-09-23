// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartOverlay from 'SourceComponent/CartOverlay';

import './HeaderCart.style';

class HeaderCart extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
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
    }

    render() {
        const { cartPopUp } = this.state;

        return (
            <div block="HeaderCart">
                <button onClick={ this.renderCartPopUp } block="HeaderCart" elem="Button">
                    { cartPopUp }
                </button>
            </div>
        );
    }
}

export default HeaderCart;
