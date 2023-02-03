import { PureComponent } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { Product } from "Util/API/endpoint/Product/Product.type";

import { setEddResponse } from "Store/MyAccount/MyAccount.action";
import { setBrandInfoData } from "Store/PDP/PDP.action";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";

import CatalogueAPI from "Util/API/provider/CatalogueAPI";

import PDPSummary from "./PDPSummary.component";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  isLoading: state.PDP.isLoading,
  brand_url: state.PLP.brand_url,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  eddResponse: state.MyAccountReducer.eddResponse,
  intlEddResponse: state.MyAccountReducer.intlEddResponse,
  addressCityData: state.MyAccountReducer.addressCityData,
  edd_info: state.AppConfig.edd_info,
  brandButtonClick: state.PDP.brandButtonClick,
});

export const mapDispatchToProps = (_dispatch) => ({
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(_dispatch, request, type),
  setEddResponse: (response, request) => _dispatch(setEddResponse(response, request)),
  setBrandInfoData: (data) => _dispatch(setBrandInfoData(data)),
  clickBrandButton: (brandButtonClick) =>
    PDPDispatcher.setBrandButtonClick({ brandButtonClick }, _dispatch),
});

export class PDPSummaryContainer extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

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
    const { brand_url = "" } = this.props;
    this.getBrandDetails();
    this.setState({
      url_path: brand_url,
    });
  }

  brandNameclick = () => {
    const { clickBrandButton } = this.props;
    clickBrandButton(true);
  }

  async getBrandDetails() {
    const { product: { brand_name }, setBrandInfoData } = this.props;
    if (brand_name) {
      try {
        const resp = await CatalogueAPI.get(brand_name);
        setBrandInfoData(resp?.result[0].url_path)
        this.setState({
          url_path: resp?.result[0].url_path
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    const { url_path } = this.state;
    return (
      <PDPSummary
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
