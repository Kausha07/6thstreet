// import PropTypes from 'prop-types';
import Link from "Component/Link";
import PropTypes from "prop-types";
import VueIntegrationQueries from "Query/vueIntegration.query";
import { PureComponent } from "react";
import isMobile from "Util/Mobile";
import "./PDPDetail.style";
class PDPDetail extends PureComponent {
  static propTypes = {
    brandDescription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  componentDidMount() {
    VueIntegrationQueries.vueAnalayticsLogger({
      event_name: "pageView",
      params: {
        event: "pageView",
        pageType: "plp",
        currency: "en_AED",
        clicked: 1622626071901,
        uuid: "cc5b78fd-fbd7-4e78-a6e9-e95431af4571",
        referrer: "app",
      },
    });
  }

  renderBrandImage = () => {
    const { brandImg } = this.props;
    return <img block="PDPDetail" elem="Image" src={brandImg} />;
  };

  renderBrandName = () => {
    const { brandName } = this.props;
    return <h1>{brandName}</h1>;
  };

  renderBrandHtml = () => {
    const { brandDescription } = this.props;
    return <p dangerouslySetInnerHTML={{ __html: brandDescription }} />;
  };

  getBrandUrl = () => {
    const { brandName } = this.props;
    const url = brandName
      .replace(/'/g, "")
      .replace(/[(\s+).&]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/\-$/, "")
      .replace("@", "at")
      .toLowerCase();
    return `${url}.html`;
  };

  renderMoreFromBrand = () => {
    const { brandName } = this.props;
    const url = this.getBrandUrl();
    return (
      <div block="BrandDescription">
        <Link block="BrandDescription" elem="MoreButton" to={url}>
          <span block="BrandDescription" elem="ButtonText">
            {__("More from this brand")}
          </span>
        </Link>
        {/* <a block="BrandDescription" elem="MoreButton">
          More from this brand
        </a> */}
      </div>
    );
  };

  renderContent = () => {
    const { isMobile } = this.state;
    const { brandDescription, brandImg, brandName } = this.props;
    if (!brandDescription || !brandImg || !brandName) {
      return null;
    }
    return (
      <>
        <div block="PDPDetail" elem="BrandImage">
          {isMobile ? "" : this.renderBrandImage()}
        </div>
        <div block="PDPDetail" elem="BrandDescription">
          {isMobile ? "" : this.renderBrandName()}
          {isMobile ? "" : this.renderBrandHtml()}
          {isMobile ? "" : this.renderMoreFromBrand()}
        </div>
      </>
    );
  };

  render() {
    return <div block="PDPDetail">{this.renderContent()}</div>;
  }
}

export default PDPDetail;
