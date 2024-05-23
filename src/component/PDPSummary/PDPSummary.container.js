import { PureComponent } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import { setEddResponse } from "Store/MyAccount/MyAccount.action";
import { setBrandInfoData } from "Store/PDP/PDP.action";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";

import { Product } from "Util/API/endpoint/Product/Product.type";
import Algolia from "Util/API/provider/Algolia";
import { getBrandInfoByName } from "Util/API/endpoint/Catalogue/Brand/Brand.endpoint";

import PDPSummary from "./PDPSummary.component";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  isLoading: state.PDP.isLoading,
  brand_url: state.PLP.brand_url,
  defaultShippingAddress: state.MyAccountReducer.defaultShippingAddress,
  eddResponse: state.MyAccountReducer.eddResponse,
  eddResponseForPDP: state.MyAccountReducer.eddResponseForPDP,
  intlEddResponse:state.MyAccountReducer.intlEddResponse,
  addressCityData: state.MyAccountReducer.addressCityData,
  edd_info: state.AppConfig.edd_info,
  brandButtonClick: state.PDP.brandButtonClick,
  brandInfoData : state.PDP.brandInfoData,
  catalogue_from_algolia:
    state.AppConfig.config.countries[state.AppState.country]['catalogue_from_algolia'],
  international_shipping_fee: state.AppConfig.international_shipping_fee,
  isExpressDelivery: state.AppConfig.isExpressDelivery,
});

export const mapDispatchToProps = (_dispatch) => ({
  estimateEddResponse: (request, type) =>
    MyAccountDispatcher.estimateEddResponse(_dispatch, request, type),
  estimateEddResponseForPDP: (request) =>
    MyAccountDispatcher.estimateEddResponseForPDP(_dispatch, request),
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

  containerProps = () => {
    const {
      product,
      isLoading,
      renderMySignInPopup,
      getTabbyInstallment,
      defaultShippingAddress,
      eddResponse,
      eddResponseForPDP,
      intlEddResponse,
      edd_info,
      addressCityData,
      estimateEddResponse,
      estimateEddResponseForPDP,
      setEddResponse,
      setEddResponseForPDP,
      TabbyInstallment,
      brandInfoData,
      international_shipping_fee,
      config = {},
      colourVarientsButtonClick,
      isExpressDelivery,
    } = this.props;
    return {
      product,
      isLoading,
      renderMySignInPopup,
      getTabbyInstallment,
      defaultShippingAddress,
      eddResponse,
      eddResponseForPDP,
      intlEddResponse,
      edd_info,
      addressCityData,
      estimateEddResponse,
      estimateEddResponseForPDP,
      setEddResponse,
      setEddResponseForPDP,
      TabbyInstallment,
      brandInfoData,
      international_shipping_fee,
      config,
      colourVarientsButtonClick,
      isExpressDelivery,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      url_path: "",
      isFetchFromAlgolia: this.props.catalogue_from_algolia
    }
    this.getBrandDetails =
      this.props.catalogue_from_algolia
        ? this.getBrandDetailsByAlgolia.bind(this)
        :this.getBrandDetailsCatalogueAPI.bind(this);
  }

  componentDidMount() {
    const { brand_url = "", product: { brand_name = "" }} = this.props;
    if(brand_name) {
      this.getBrandDetails();
    }
    this.setState({
      url_path: brand_url,
    });
  }

  brandNameclick = () => {
    const { clickBrandButton } = this.props;
    clickBrandButton(true);
  }

  async getBrandDetailsCatalogueAPI() {
    const { product: { brand_name }, setBrandInfoData } = this.props;
    if (brand_name) {
      try {
        getBrandInfoByName(brand_name).then((resp)=>{
          if(resp?.success && resp?.result != null ) {
            setBrandInfoData(resp?.result[0].url_path)
            this.setState({
              url_path: resp?.result[0].url_path
            });
          }
        })
      } catch (err) {
        console.error("There is an issue while fetching brand information.",err);
      }
    }
  }

  async getBrandDetailsByAlgolia() {
    const { product: { brand_name }, setBrandInfoData } = this.props;
    if (brand_name) {
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
        console.error("There is an issue while fetching brand information.",err);
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
