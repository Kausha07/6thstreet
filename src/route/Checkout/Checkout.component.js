import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import './Checkout.style';

class Checkout extends PureComponent {
    static propTypes = {
        estimateShipping: PropTypes.func.isRequired
    };

    render() {
        const {
            estimateShipping
        } = this.props;

        return (
            <div block="Checkout">
                <button onClick={ estimateShipping }>Estimate shipping</button>
                <br />
            </div>
        );
    }
}

export default Checkout;
