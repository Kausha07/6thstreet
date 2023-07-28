import Image from "Component/Image";
import Link from "Component/Link";
import { PureComponent } from "react";
import "./DynamicContentReferralBanner.style.scss";
import { setCrossSubdomainCookie } from "Util/Url/Url";
import { getCookie } from "Util/Url/Url";
import { isSignedIn } from "Util/Auth";
import { connect } from "react-redux";
import bannerGiftImage from "./icons/banner-gift.png";

export const mapStateToProps = (state) => ({
  IsReferralEnabled: state.AppConfig.IsReferralEnabled,
});
class DynamicContentReferralBanner extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    isSignedIn: isSignedIn(),
    disableReferralBanner: false,
  };

  componentDidMount() {
    const { isSignedIn } = this.state;
    if (getCookie("HideReferralBanner") === "true" || !isSignedIn) {
      this.setState({ disableReferralBanner: true });
    } else {
      this.setState({ disableReferralBanner: false });
    }
  }

  hideBanner() {
    setCrossSubdomainCookie("HideReferralBanner", "true", 2);
    this.setState({ disableReferralBanner: true });
  }

  renderImages() {
    return (
      <>
        <div className="Banner-Icon">
          <Image lazyLoad={true} src={bannerGiftImage} alt="Referral Banner" />
        </div>
      </>
    );
  }

  renderCloseButton() {
    return (
      <>
        <div block="Banner" elem="close">
          <button
            block="Button"
            elem="CAclose"
            onClick={() => this.hideBanner()}
          ></button>
        </div>
      </>
    );
  }
  renderLink() {
    return (
      <Link
        block="Banner"
        elem="Link"
      to="/my-account/referral"
      ></Link>
    );
  }

  renderText() {
    return (
      <>
        <div block="Banner" elem="Content">
          <h4>Refer and earn credit</h4>
          <p>Refer 6th Street and get store credit today!</p>
        </div>
      </>
    );
  }

  render() {
    const { disableReferralBanner, isSignedIn } = this.state;
    const {IsReferralEnabled} = this.props
    if (!disableReferralBanner && isSignedIn && IsReferralEnabled) {
      return (
        <div
          block="DynamicContentReferralBanner"
          id="DynamicContentReferralBanner"
        >
          {this.renderImages()}
          {this.renderText()}
          {this.renderLink()}
          {this.renderCloseButton()}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps, null)(DynamicContentReferralBanner);
