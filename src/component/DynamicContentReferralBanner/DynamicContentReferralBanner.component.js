import Image from "Component/Image";
import Link from "Component/Link";
import { PureComponent } from "react";
import "./DynamicContentReferralBanner.style.scss";
import { setCrossSubdomainCookie } from "Util/Url/Url";
import { getCookie } from "Util/Url/Url";
import { isSignedIn } from "Util/Auth";
import { connect } from "react-redux";
import bannerGiftImage from "./icons/banner-gift.png";
import { isArabic } from "Util/App";
import { MOE_trackEvent, REFERRAL_NUDGE_CLICK } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

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
    isArabic: isArabic(),
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
  sendImpressions(){
    MOE_trackEvent(REFERRAL_NUDGE_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }

  renderImages() {
    const { isArabic } = this.state;
    return (
      <>
        <div block="Banner-Icon" mods={{ isArabic }}>
          <Image lazyLoad={true} src={bannerGiftImage} alt="Referral Banner" />
        </div>
      </>
    );
  }

  renderCloseButton() {
    const { isArabic } = this.state;
    return (
      <>
        <div block="Banner" elem="close" mods={{ isArabic }}>
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
    const { isArabic } = this.state;
    return (
      <Link
        block="Banner"
        elem="Link"
        mods={{ isArabic }}
        onClick={()=> this.sendImpressions()}
        to="/my-account/referral"
      ></Link>
    );
  }

  renderText() {
    const { isArabic } = this.state;
    return (
      <>
        <div block="Banner" elem="Content" mods={{ isArabic }}>
          <h4>{__("Refer and Earn Credit")}</h4>
          <p>{__("Refer 6thStreet and get my cash today!")}</p>
        </div>
      </>
    );
  }

  render() {
    const { disableReferralBanner, isSignedIn, isArabic } = this.state;
    const { IsReferralEnabled } = this.props;
    if (!disableReferralBanner && isSignedIn && IsReferralEnabled) {
      return (
        <div
          block="DynamicContentReferralBanner"
          id="DynamicContentReferralBanner"
          mods={{ isArabic }}
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
