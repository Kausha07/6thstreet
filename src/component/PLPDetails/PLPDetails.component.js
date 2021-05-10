// import PropTypes from 'prop-types';
import { PureComponent } from "react";
import PropTypes from "prop-types";
import isMobile from "Util/Mobile";
import "./PLPDetails.style";

class PLPDetails extends PureComponent {
  static propTypes = {
    brandDescription: PropTypes.string,
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  renderBrandImage = () => {
    const { brandImg } = this.props;
    return <img src={brandImg} />;
  };

  renderBrandName = () => {
    const { brandName } = this.props;
    return <h1>{brandName}</h1>;
  };

  renderBrandHtml = () => {
    const { brandDescription } = this.props;
    return <p>{brandDescription} </p>;
  };

  renderContent = () => {
    const { isMobile } = this.state;
    const { brandDescription, brandImg, brandName } = this.props;
    if (!brandDescription || !brandImg || !brandName) {
      return null;
    }
    return (
      <>
        <div block="PLPDetails" elem="BrandImage">
          {isMobile ? "" : this.renderBrandImage()}
        </div>
        <div block="PLPDetails" elem="BrandDescription">
          {isMobile ? "" : this.renderBrandName()}
          {isMobile ? "" : this.renderBrandHtml()}
        </div>
      </>
    );
  };

  render() {
    return <div block="PLPDetails">{this.renderContent()}</div>;
  }
}

export default PLPDetails;
