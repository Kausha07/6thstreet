import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CreditCard from './CreditCard.component';

export class CreditCardContainer extends PureComponent {
    static propTypes = {
        setCreditCardData: PropTypes.func.isRequired
    };

    render() {
        const { setCreditCardData } = this.props;

        return (
            <CreditCard
              setCreditCardData={ setCreditCardData }
              { ...this.props }
            />
        );
    }
}

export default CreditCardContainer;
