import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPSummary from './PDPSummary.component';

import Algolia from "Util/API/provider/Algolia"; 

export const mapStateToProps = (state) => ({
    product: state.PDP.product,
    isLoading: state.PDP.isLoading
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class PDPSummaryContainer extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    containerProps = () => {
        const { product, isLoading,renderMySignInPopup } = this.props;
        return { product, isLoading,renderMySignInPopup };
    };

    constructor(props) {
        super(props);
        this.getBrandDetails = this.getBrandDetails.bind(this);
        this.state = {
            url_path : ""
        }
    }

    componentDidMount() {
        this.getBrandDetails();
    }
    async getBrandDetails() {
        const {product:{brand_name}} = this.props
        const data = await new Algolia({
          index: "brands_info",
        }).getBrandsDetails({
          query: brand_name,
          limit: 1,
        });
        this.setState({
          url_path: data?.hits[0]?.url_path
        });
      }
    render() {
        const {url_path} = this.state;
        return (
            <PDPSummary
              { ...this.containerFunctions }
              { ...this.containerProps() }
              url_path={url_path}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPSummaryContainer);
