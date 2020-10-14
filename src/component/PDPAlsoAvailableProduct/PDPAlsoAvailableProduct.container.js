import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PDPAlsoAvailableProduct from './PDPAlsoAvailableProduct.component';

export class PDPAlsoAvailableProductContainer extends PureComponent {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    render() {
        return (
            <PDPAlsoAvailableProduct
              { ...this.props }
            />
        );
    }
}

export default PDPAlsoAvailableProductContainer;
