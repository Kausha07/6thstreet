import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CheckoutBillingContainer as SourceCheckoutBillingContainer,
    mapDispatchToProps,
    mapStateToProps
} from 'SourceComponent/CheckoutBilling/CheckoutBilling.container';

export class CheckoutBillingContainer extends SourceCheckoutBillingContainer {
    static propTypes = {
        ...SourceCheckoutBillingContainer.propTypes,
        setTabbyWebUrl: PropTypes.func.isRequired
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutBillingContainer);
