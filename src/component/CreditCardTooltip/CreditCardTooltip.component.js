import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Html from 'Component/Html';

class CreditCardTooltip extends PureComponent {
    static propTypes = {
        collapsedPromoMessage: PropTypes.isRequired,
        expandedPromoMessage: PropTypes.isRequired
    };

    render() {
        const { collapsedPromoMessage, expandedPromoMessage } = this.props;
        console.log(expandedPromoMessage);
        if (location.pathname.match(/expand/)) {
            return <Html content={ expandedPromoMessage } />;
        }

        return <Html content={ collapsedPromoMessage } />;
    }
}

export default CreditCardTooltip;
