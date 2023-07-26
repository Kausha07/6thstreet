import { PureComponent } from "react";
import PropTypes from "prop-types";
import "./MyAccountReferral.style.scss";
import Image from "Component/Image";
import Loader from "Component/Loader";
import Invite from "./icons/invite.png";
import InviteBoth from "./icons/reward-both.png";
import Arrow from "./icons/arrow.png";
import { connect } from "react-redux";
import WhatsappIcon from "./icons/whatsapp.png";
import Close from "./icons/close.png";
import CopyIcon from "./icons/copy.png";
import Popup from "SourceComponent/Popup";
import {
  hideActiveOverlay,
  toggleOverlayByKey,
} from "Store/Overlay/Overlay.action";
import ShareButton from "Component/ShareButton";
import { showNotification } from "Store/Notification/Notification.action";
import {
  fetchAndCreateReferralCode,
  fetchReferralTexts,
} from "../../util/API/endpoint/Referral/Referral.endpoint";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

export const TERMS_OVERLAY = "terms_overlay_tnc";

export const mapStateToProps = (state) => ({
  customer: state.MyAccountReducer.customer,
});

export const mapDispatchToProps = (dispatch) => ({
  showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
  hideActiveOverlay: () => dispatch(hideActiveOverlay()),
  showNotification: (type, message) =>
    dispatch(showNotification(type, message)),
});

export class MyAccountReferral extends PureComponent {
  static propTypes = {
    showOverlay: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
    referralHeading: "",
    referralText: "",
    socialShareText: "",
    referralCode: "",
    isMobile: isMobile.any() || isMobile.tablet(),
    isArabic: isArabic(),
  };

  componentDidMount() {
    this.createReferralCode();
  }

  createReferralCode = async () => {
    const { customer } = this.props;
    if (customer.referral_coupon) {
      this.setState({ referralCode: customer.referral_coupon });
      this.setReferralCodeTexts(customer.referral_coupon);
    } else {
      this.setState({ isLoading: true });
      const response = await fetchAndCreateReferralCode();
      if (response && response.referralCouponCode) {
        this.setState({ referralCode: response.referralCouponCode });
        this.setReferralCodeTexts(response.referralCouponCode);
        this.setState({ isLoading: false });
      }
    }
  };

  setReferralCodeTexts = async (referral_code) => {
    const responseReferralText = await fetchReferralTexts();
    if (responseReferralText && responseReferralText.status) {
      if (responseReferralText.invite_friends) {
        this.setState({ referralHeading: responseReferralText.invite_friends });
      }
      if (responseReferralText.refer_friend) {
        if (responseReferralText.refer_friend.match(/\\n/)) {
          const refText = responseReferralText.refer_friend.replace(
            /\\n/g,
            "<br>"
          );
          this.setState({ referralText: refText });
        } else {
          this.setState({ referralText: responseReferralText.refer_friend });
        }
      }
      if (responseReferralText.social_share_text) {
        if (responseReferralText.social_share_text.match(/\<br>/)) {
          const refShareText = responseReferralText.social_share_text.replace(
            /\<br>/g,
            "\n"
          );
          if (responseReferralText.social_share_text.match(/\{{code}}/)) {
            const refShareTextWithCode = refShareText.replace(
              /\{{code}}/g,
              `${referral_code}`
            );
            this.setState({ socialShareText: refShareTextWithCode });
          } else {
            this.setState({
              socialShareText: responseReferralText.social_share_text,
            });
          }
        } else {
          this.setState({
            socialShareText: responseReferralText.social_share_text,
          });
        }
      }
    }
    this.setState({ isLoading: false });
  };

  handleWhatsAppClick(text) {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  handleCopyCode(referralCode) {
    const { showNotification } = this.props;
    navigator.clipboard.writeText(referralCode);
    showNotification("success", __("Link copied to clipboard"));
  }
  showTermsOverlay() {
    const { showOverlay } = this.props;
    showOverlay(TERMS_OVERLAY);
  }

  renderTermsContent() {
    const { isArabic, isMobile } = this.state;
    return (
      <div block="TermsPopup" mods={{ isArabic }}>
        <h3>Terms & Conditions</h3>
        <div block="Terms" elem="Content">
          <ul>
            <li>
              {__("Referral code can be shared unlimited number of times")}
            </li>
            <li>
              {__(
                "Referral coupon code can be used only by logged in customers"
              )}
            </li>
            <li>
              {__(
                "Referral code can be only used on the first order of the account and only once per account"
              )}
            </li>
            <li>
              {__(
                "Referral rewards will apply as per active promotion in the country to which the account belongs"
              )}
            </li>
            <li>
              {__(
                "Reward benefits will be awarded in the form of store credit to respective accounts"
              )}
            </li>
            <li>
              {__(
                "Referral benefits will be awarded upon completion of first order by the referee using the referrer’s referral coupon code"
              )}
            </li>
            <li>
              {__("Store credit can be used at any time without expiry date")}
            </li>
            <li>
              {__("Users cannot use their own referral code to place an order")}
            </li>
          </ul>
        </div>
      </div>
    );
  }
  renderCloseButton() {
    const { hideActiveOverlay } = this.props;
    const { isArabic } = this.state;
    return (
      <div
        block="MyAccountReferralOverlay"
        elem="PopupClose"
        mods={{ isArabic }}
      >
        <button
          block="MyAccountReferralOverlay"
          elem="Close"
          onClick={hideActiveOverlay}
        >
          <img src={Close} alt="Close button" />
        </button>
      </div>
    );
  }

  renderTermsPopup() {
    const { isMobile, isArabic } = this.state;
    return (
      <>
        <Popup
          mix={{
            block: "MyAccountReferralOverlay",
          }}
          clickOutside={true}
          id={TERMS_OVERLAY}
          title="Terms & Conditions"
          mods={{ isArabic }}
        >
          {isMobile && this.renderCloseButton()}
          {this.renderTermsContent()}
        </Popup>
      </>
    );
  }

  renderBannerContent() {
    const { referralHeading } = this.state;
    return (
      <div block="MyAccountReferral" elem="BannerContent">
        <div
          block="MyAccountReferral"
          elem="BannerText"
          dangerouslySetInnerHTML={{ __html: `<p>${referralHeading}</p>` }}
        ></div>
      </div>
    );
  }

  renderCodeContent() {
    const { referralCode, socialShareText } = this.state;
    return (
      <div block="MyAccountReferral" elem="CodeWrapper">
        <p block="Referral" elem="Text">
          {__("Your invite code")}
        </p>
        <p block="Referral" elem="Code">
          {referralCode}
        </p>

        <div block="Referral" elem="Share">
          <div block="ShareIcon">
            <div
              block="ShareIcon"
              elem="Image"
              onClick={() => this.handleWhatsAppClick(socialShareText)}
            >
              <Image lazyLoad={true} alt={"Whatsapp"} src={WhatsappIcon} />
            </div>
            <p>{__("Whatsapp")}</p>
          </div>
          <div block="ShareIcon" title="Copy code">
            <div
              block="ShareIcon"
              elem="Image"
              onClick={() => this.handleCopyCode(referralCode)}
            >
              <Image lazyLoad={true} alt={"Copy"} src={CopyIcon} />
            </div>

            <p>{__("Copy code")}</p>
          </div>
          <div block="ShareIcon" title="Share">
            <ShareButton text={socialShareText} isReferral />
            <p>{__("More")}</p>
          </div>
        </div>
      </div>
    );
  }

  renderInviteContent() {
    const { referralText, isArabic } = this.state;
    return (
      <div block="MyAccountReferral" elem="InviteWrapper">
        <div block="MyAccountReferral" elem="InviteContainer">
          <div block="Invite" elem="Container">
            <Image lazyLoad={true} alt={"Invite"} src={Invite} />
            <p>{__("Invite your friends on 6thStreet to win store credit")}</p>
          </div>
          <div block="Invite" elem="Container" mods={{ isArabic }}>
            <Image lazyLoad={true} alt={"Arrow"} src={Arrow} />
          </div>
          <div block="Invite" elem="Container">
            <Image lazyLoad={true} alt={"Invite"} src={InviteBoth} />
            <p dangerouslySetInnerHTML={{ __html: `${referralText}` }}></p>
          </div>
        </div>
        <div block="MyAccountReferral" elem="Terms">
          <button
            block="Terms"
            elem="Btn"
            onClick={() => this.showTermsOverlay()}
          >
            {__("Terms and Conditions Apply")}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, referralCode, isArabic } = this.state;
    if (isLoading) {
      return <Loader isLoading={isLoading} />;
    } else if (referralCode) {
      return (
        <>
          <div block="MyAccountReferral" elem="Container" mods={{ isArabic }}>
            {this.renderBannerContent()}
            {this.renderCodeContent()}
            {this.renderInviteContent()}
          </div>
          {this.renderTermsPopup()}
        </>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReferral);
