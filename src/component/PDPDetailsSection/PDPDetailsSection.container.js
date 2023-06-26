import { PureComponent } from "react";
import { connect } from "react-redux";
import { Product } from "Util/API/endpoint/Product/Product.type";
import PDPDetailsSection from "./PDPDetailsSection.component";
import PDPDispatcher from "Store/PDP/PDP.dispatcher";

export const mapStateToProps = (state) => ({
  product: state.PDP.product,
  gender: state.AppState.gender,
  config: state.AppConfig.config,
  country: state.AppState.country,
  language: state.AppState.language,
  pdpWidgetsData: state.AppState.pdpWidgetsData,
  brandInfoData : state.PDP.brandInfoData,
  brand_url: state.PLP.brand_url,
});


export const mapDispatchToProps = (_dispatch) => ({
  clickBrandButton: (brandButtonClick) =>
    PDPDispatcher.setBrandButtonClick({ brandButtonClick }, _dispatch),
});

export class PDPDetailsSectionContainer extends PureComponent {
  static propTypes = {
    product: Product.isRequired,
  };

  containerProps = () => {
    const {
      product,
      pdpWidgetsData,
      gender,
      renderMySignInPopup,
      clickAndCollectStores,
      config,
      country,
      language,
      brandDescription,
      brandImg,
      brandName,
      pdpWidgetsAPIData,
      brandInfoData,
      brand_url,
    } = this.props;
    return {
      product,
      pdpWidgetsData,
      gender,
      renderMySignInPopup,
      clickAndCollectStores,
      config,
      country,
      language,
      brandDescription,
      brandImg,
      brandName,
      pdpWidgetsAPIData,
      brandInfoData,
      brand_url,
    };
  };

  brandNameclick = () => {
    const { clickBrandButton } = this.props;
    clickBrandButton(true);
  }
  
  render() {
    return <PDPDetailsSection {...this.containerProps()} brandNameclick={ this.brandNameclick } />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPDetailsSectionContainer);
