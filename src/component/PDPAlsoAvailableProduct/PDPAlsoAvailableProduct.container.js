import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import PDPAlsoAvailableProduct from './PDPAlsoAvailableProduct.component';

export const mapStateToProps = () => ({
});

export const mapDispatchToProps = () => ({
});

export class PDPAlsoAvailableProductContainer extends PureComponent {
    static propTypes = {
        product: PropTypes.object.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        return (
            <PDPAlsoAvailableProduct
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPAlsoAvailableProductContainer);
