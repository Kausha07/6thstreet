import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPDetailsSection from './PDPDetailsSection.component';

export const mapStateToProps = (state) => ({
    product: state.PDP.product,
    gender: state.AppState.gender,
    pdpWidgetsData: state.AppState.pdpWidgetsData
});

export class PDPDetailsSectionContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
    };

    containerProps = () => {
        const { product, pdpWidgetsData, gender } = this.props;
        return { product, pdpWidgetsData, gender };
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
