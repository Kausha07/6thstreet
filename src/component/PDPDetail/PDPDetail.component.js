// import PropTypes from 'prop-types';
import Link from "Component/Link";
import PropTypes from "prop-types";
import { PureComponent } from "react";
// import { Product } from "Util/API/endpoint/Product/Product.type";
import isMobile from "Util/Mobile";
import "./PDPDetail.style";
import Image from "Component/Image";
import Event, {
  EVENT_MORE_FROM_THIS_BRAND_CLICK,
  EVENT_GTM_PDP_TRACKING,
} from "Util/Event";

class PDPDetail extends PureComponent {
  static propTypes = {
    // product: Product.isRequired,
    brandDescription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  renderBrandImage = () => {
    const { brandImg,brandName } = this.props;
    return (
      <Image lazyLoad={true} block="PDPDetail" elem="Image" src={brandImg} alt={brandName? brandName : "brandImage"}/>
    );
  };

  renderBrandName = () => {
    const { brandName } = this.props;
    return <h2 className="PDP-BrandNameTag">{brandName}</h2>;
  };

  renderBrandHtml = () => {
    const { brandDescription } = this.props;
    return <p dangerouslySetInnerHTML={{ __html: brandDescription }} />;
  };

  getBrandUrl = () => {
    const { brandInfoData = '', brand_url = ''  } = this.props;
    let finalURLKey = brandInfoData ? brandInfoData : brand_url;
    const url = finalURLKey
      .replace(/'/g, "")
      .replace(/[(\s+).&]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/\-$/, "")
      .replace("@", "at")
      .toLowerCase();
    return `${url}.html`;
  };

  renderMoreFromBrand = () => {
    const { brandName, brandNameclick } = this.props;
    const url = this.getBrandUrl();
    const eventData = {
      name: EVENT_MORE_FROM_THIS_BRAND_CLICK,
      action: EVENT_MORE_FROM_THIS_BRAND_CLICK,
    };
    return (
      <div block="BrandDescription" onClick={ brandNameclick }>
        <Link
          block="BrandDescription"
          elem="MoreButton"
          to={url}
          onClick={() => Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData)}
        >
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
    const { brandDescription, brandImg, brandName, brandInfoData = "", brand_url = "" } =
      this.props;

    if (!brandDescription || !brandImg || !brandName) {
      return null;
    }
  
    return (
      <>
        <div block="PDPDetail" elem="BrandImage">
          {this.renderBrandImage()}
        </div>
        <div block="PDPDetail" elem="BrandDescription">
          {this.renderBrandName()}
          {this.renderBrandHtml()}
          {this.renderMoreFromBrand()}
        </div>
      </>
    );
  };

  render() {
    return <div block="PDPDetail">{this.renderContent()}</div>;
  }
}

export default PDPDetail;
