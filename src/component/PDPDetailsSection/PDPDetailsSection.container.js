// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPDetailsSection from './PDPDetailsSection.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product,
    pdpWidgetsData: state.AppState.pdpWidgetsData
});

export class PDPDetailsSectionContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
    };

    containerProps = () => {
        const { product, pdpWidgetsData } = this.props;
        return { product, pdpWidgetsData };
    };

    render() {
        return (
            <PDPDetailsSection
                {...this.containerProps()}
            />
        );
    }
}

export default connect(mapStateToProps, null)(PDPDetailsSectionContainer);
