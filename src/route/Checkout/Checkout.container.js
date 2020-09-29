import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import CheckoutDispatcher from 'Store/Checkout/Checkout.dispatcher';

import Checkout from './Checkout.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    estimateShipping: (address) => CheckoutDispatcher.estimateShipping(dispatch, address)
});

export class CheckoutContainer extends PureComponent {
    static propTypes = {
        estimateShipping: PropTypes.func.isRequired
    };

    containerFunctions = {
        estimateShipping: this.estimateShipping.bind(this)
    };

    estimateShipping() {
        console.log('*** Will send shipping request...');

        const { estimateShipping } = this.props;

        estimateShipping({
            country_code: 'KW',
            phone_dial_code: '965',
            email: 'raivisd@scandiweb.com',
            firstname: 'Raivis',
            lastname: 'Dejus',
            street: 'Briana 9a',
            city: 'Kuwait',
            city_ar: 'Kuwait',
            area: 'Abdali',
            area_ar: 'Abdali',
            phone_number: '55501040',
            phone: '+96555501040',
            default_shipping: true
        });
    }

    render() {
        return (
            <Checkout
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
