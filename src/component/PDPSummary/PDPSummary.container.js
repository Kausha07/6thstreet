import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDPSummary from './PDPSummary.component';

import Algolia from "Util/API/provider/Algolia";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  isLoading: state.PDP.isLoading,
  brand_url: state.PLP.brand_url
});

export const mapDispatchToProps = (_dispatch) => ({});
export class PDPSummaryContainer extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  containerFunctions = {};

  containerProps = () => {
    const { product, isLoading, renderMySignInPopup } = this.props;
    return { product, isLoading, renderMySignInPopup };
  };

  constructor(props) {
    super(props);
    this.getBrandDetails = this.getBrandDetails.bind(this);
    this.state = {
      url_path: ""
    }
  }

  componentDidMount() {
    const { brand_url } = this.props;
    if (!brand_url) {
      this.getBrandDetails();
    }
    else {
      this.setState({
        url_path: brand_url
      })
    }
  }

  componentDidUpdate() {
    // 
  }

  async getBrandDetails() {
    const { product: { brand_name } } = this.props;
    if(brand_name) {
      try {
      const data = await new Algolia({
        index: "brands_info",
      })
        .getBrandsDetails({
          query: brand_name,
          limit: 1,
        });
      this.setState({
        url_path: data?.hits[0]?.url_path
      });
    }
    catch (err) {
      console.error(err);
    }
    }
  }

  render() {
    const { url_path } = this.state;
    return (
      <PDPSummary
        {...this.containerFunctions}
        {...this.containerProps()}
        url_path={url_path}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPSummaryContainer);
