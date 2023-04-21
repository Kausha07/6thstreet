import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { Product } from "Util/API/endpoint/Product/Product.type";

import PDPSummary from "./PDPSummary.component";
import { setEddResponse } from "Store/MyAccount/MyAccount.action";
import { setBrandInfoData } from "Store/PDP/PDP.action";

import Algolia from "Util/API/provider/Algolia";
import CheckoutDispatcher from "Store/Checkout/Checkout.dispatcher";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  isLoading: state.PDP.isLoading,
  brand_url: state.PLP.brand_url,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  eddResponse: state.MyAccountReducer.eddResponse,
  intlEddResponse:state.MyAccountReducer.intlEddResponse,
  addressCityData: state.MyAccountReducer.addressCityData,
  edd_info: state.AppConfig.edd_info,
  brandButtonClick: state.PDP.brandButtonClick,
});

export const mapDispatchToProps = (_dispatch) => ({
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(_dispatch, request, type),
  setEddResponse: (response,request) => _dispatch(setEddResponse(response,request)),
  setBrandInfoData: (data) => _dispatch(setBrandInfoData(data)),
  clickBrandButton: (brandButtonClick) =>
    PDPDispatcher.setBrandButtonClick({ brandButtonClick }, _dispatch),
});
export class PDPSummaryContainer extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  containerFunctions = {};

  containerProps = () => {
    const {
      product,
      isLoading,
      renderMySignInPopup,
      getTabbyInstallment,
      defaultShippingAddress,
      eddResponse,
      intlEddResponse,
      edd_info,
      addressCityData,
      estimateEddResponse,
      setEddResponse,
      TabbyInstallment
    } = this.props;
    return {
      product,
      isLoading,
      renderMySignInPopup,
      getTabbyInstallment,
      defaultShippingAddress,
      eddResponse,
      intlEddResponse,
      edd_info,
      addressCityData,
      estimateEddResponse,
      setEddResponse,
      TabbyInstallment
    };
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
      this.getBrandDetails();
      this.setState({
        url_path: brand_url
      })
    }
  }

  brandNameclick = () => {
    const { clickBrandButton } = this.props;
    clickBrandButton(true);
  }

  async getBrandDetails() {
    const { product: { brand_name }, setBrandInfoData } = this.props;
    if(brand_name) {
      try {
      const data = await new Algolia({
        index: "brands_info",
      })
        .getBrandsDetails({
          query: brand_name,
          limit: 1,
        });
      setBrandInfoData(data?.hits[0]?.url_path)
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
        brandNameclick={ this.brandNameclick }
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDPSummaryContainer);
