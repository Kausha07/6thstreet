// import PropTypes from 'prop-types';
import PropTypes from "prop-types";
import { PureComponent } from "react";
import favIcon from "Style/icons/favorites.svg";
import shareIcon from "Style/icons/share.svg";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./PLPDetails.style";
import Image from "Component/Image";

class PLPDetails extends PureComponent {
  static propTypes = {
    brandDescription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
    isArabic: isArabic(),
  };

  renderBrandImage = () => {
    const { brandImg } = this.props;
    return (
      <div block="PLPDetails" elem="BrandImage">
        <Image lazyLoad={true} src={brandImg} />
      </div>
    )
  };

  renderBrandName = () => {
    const { brandName } = this.props;
    return (
      <h1 block="PLPDetails" elem="BrandName">
        {brandName}
      </h1>
    );
  };

  renderBrandHtml = () => {
    const { brandDescription } = this.props;

    return (
      <p
        block="PLPDetails"
        elem="BrandHTML"
        dangerouslySetInnerHTML={{ __html: brandDescription }}
      />
    );
  };

  renderActionButtons = () => {
    return (
      <div block="PLPDetails" elem="ShareIcon">
        <Image lazyLoad={true} src={shareIcon} alt={__("Share Icon")} />
        <Image lazyLoad={true} src={favIcon} alt={__("Favorite Icon")} />
      </div>
    );
  };

  renderContent = () => {
    const { isMobile } = this.state;
    const { brandDescription, brandImg, brandName } = this.props;
    if (!brandDescription || !brandImg || !brandName) {
      return null;
    }
    if (isMobile) {
      return null;
    }
    const brandImageVisible = brandImg ? "brandImageVisible" : "notBrandImageVisible";

    return (
      <div block="PLPDetails" elem="Wrapper">
        
        {!brandImg ? "" :
          <div block="PLPDetails" elem="BrandImage">
            {isMobile ? "" : this.renderBrandImage()}
          </div>
        }
        <div block="PLPDetails" elem={`BrandDescription ${brandImageVisible}`}>
          {/* {this.renderActionButtons()} */}
          {isMobile ? "" : this.renderBrandName()}
          {isMobile ? "" : this.renderBrandHtml()}
        </div>




      </div>
    );
  };

  render() {
    const { isArabic } = this.state;
    return (
      <div block="PLPDetails" mods={{ isArabic }}>
        {this.renderContent()}
      </div>
    );
  }
}

export default PLPDetails;
