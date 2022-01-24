import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { URLS } from "Util/Url/Url.config";
import Link from "Component/Link";
import ClickOutside from "Component/ClickOutside";
import MyAccountOverlay from "Component/MyAccountOverlay";
import { isSignedIn } from "Util/Auth";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import "./InlineCustomerSupport.style";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  language: state.AppState.language,
});
class InlineCustomerSupport extends PureComponent {
  static propTypes = {
    isEmailSupported: PropTypes.bool.isRequired,
    isPhoneSupported: PropTypes.bool.isRequired,
    openHoursLabel: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  };

  state = {
    isExpanded: false,
    signInPopUp: "",
    showPopup: false,
    isArabic: isArabic(),
  };

  getRootURL = () => {
    const { language, country } = this.props;
    if (language && country && URLS) {
      const locale = `${language}-${country.toLowerCase()}`;
      return URLS[locale] || "";
    }
    return "";
  };

  onDropdownClick = () => {
    // Toggle dropdown
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
  };

  onClickOutside = () => {
    const { isExpanded } = this.state;

    if (isExpanded) {
      this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
    }
  };

  renderEmail = () => {
    const { isEmailSupported, email } = this.props;

    if (!isEmailSupported) {
      return null;
    }

    return (
      <a block="InlineCustomerSupport" elem="Email" href={`mailto:${email}`}>
        {email}
      </a>
    );
  };

  renderPhone = () => {
    const { isPhoneSupported, phone } = this.props;
    const { isArabic } = this.state;

    if (!isPhoneSupported) {
      return null;
    }

    return (
      <div>
        {isMobile.any() ? (
          <a
            block="InlineCustomerSupport"
            elem="Phone"
            mods={{ isArabic }}
            href={`https://api.whatsapp.com/send?phone=${phone}`}
          >
            <bdi>{phone}</bdi>
          </a>
        ) : (
          <a
            block="InlineCustomerSupport"
            elem="Phone"
            mods={{ isArabic }}
            href={`tel:${phone}`}
          >
            <bdi>{phone}</bdi>
          </a>
        )}
      </div>
    );
  };

  renderWorkingHours() {
    const { openHoursLabel } = this.props;

    return (
      <p block="InlineCustomerSupport" elem="OpenHours">
        <span>{__("Available all days: ")}</span>
        <span>{openHoursLabel}</span>
      </p>
    );
  }

  closePopup = () => {
    this.setState({ signInPopUp: "", showPopup: false });
  };

  showPopup = () => {
    this.setState({ signInPopUp: "", showPopup: true });
  };

  onSignIn = () => {
    this.closePopup();
  };

  renderMySignInPopup() {
    const { showPopup } = this.state;
    if (!showPopup) {
      return null;
    }
    return (
      <MyAccountOverlay
        closePopup={this.closePopup}
        onSignIn={this.onSignIn}
        isPopup
      />
    );
  }

  isHidden = () => {
    const { pathname } = location;
    if (
      isMobile.any()
      // &&
      // !(
      //   pathname === "/" ||
      //   pathname === "" ||
      //   pathname === "/women.html" ||
      //   pathname === "/men.html" ||
      //   pathname === "/kids.html" ||
      //   pathname === "/home.html" ||
      //   pathname.includes("catalogsearch")
      // )
    ) {
      return true;
    }
    return false;
  };

  renderDropdown() {
    const { isExpanded, isArabic } = this.state;
    const Email = this.renderEmail();
    const Phone = this.renderPhone();

    const rootURL = this.getRootURL() || "";

    return (
      <div>
        <button
          block="InlineCustomerSupport"
          elem="Button"
          mods={{
            isExpanded,
            isHidden: this.isHidden(),
          }}
          mix={{
            block: "InlineCustomerSupport",
            elem: "Button",
            mods: { isArabic },
          }}
          onClick={() => this.onDropdownClick()}
        >
          {isMobile.any() ? null : __("customer service")}
        </button>
        <div
          block="InlineCustomerSupport"
          elem="Overlay"
          mods={{
            isExpanded,
            isHidden: this.isHidden(),
          }}
          onClick={this.onClickOutside}
        >
          <div
            block="InlineCustomerSupport"
            elem="Dropdown"
            mods={{ isExpanded }}
          >
            {this.renderWorkingHours()}
            {Phone ? (
              <div block="InlineCustomerSupport" elem="DisplayPhone">
                <div
                  block="InlineCustomerSupport"
                  elem="PhoneIcon"
                  mods={{ isArabic }}
                />
                {Phone}
              </div>
            ) : (
              Phone
            )}
            {Email ? (
              <div block="InlineCustomerSupport" elem="DisplayEmail">
                <div
                  block="InlineCustomerSupport"
                  elem="EmailIcon"
                  mods={{ isArabic }}
                />
                {Email}
              </div>
            ) : (
              Email
            )}
            <div block="InlineCustomerSupport" elem="DisplayFAQ">
              <div
                block="InlineCustomerSupport"
                elem="FAQsIcon"
                mods={{ isArabic }}
              />
              <Link
                block="InlineCustomerSupport"
                elem="faq"
                mods={{ isArabic }}
                to={`${rootURL}/faq`}
              >
                {__("FAQs")}
              </Link>
            </div>

            <div>
              <div block="InlineCustomerSupport" elem="DisplayShipping">
                <div
                  block="InlineCustomerSupport"
                  elem="ShippingIcon"
                  mods={{ isArabic }}
                />
                <Link
                  block="InlineCustomerSupport"
                  elem="shippingpolicy"
                  mods={{ isArabic }}
                  to={`${rootURL}/shipping-policy`}
                >
                  {__("Free Delivery on min. order")}
                </Link>
              </div>
            </div>

            <div block="InlineCustomerSupport" elem="DisplayReturns">
              <div
                block="InlineCustomerSupport"
                elem="ReturnIcon"
                mods={{ isArabic }}
              />
              <Link
                block="InlineCustomerSupport"
                elem="returnpolicy"
                mods={{ isArabic }}
                to={`${rootURL}/return-information`}
              >
                {__("100 Days Free Return")}
              </Link>
            </div>

            {!isSignedIn() && (isMobile.any() || isMobile.tablet()) ? (
              <div
                block="InlineCustomerSupport"
                elem="DisplayAuthentication"
                onClick={this.showPopup}
              >
                <div
                  block="InlineCustomerSupport"
                  elem="AccountIcon"
                  mods={{ isArabic }}
                />
                {__("Sign In / Register")}
              </div>
            ) : null}
            <div block="InlineCustomerSupport" elem="CheckoutCommunication">
              {__("CoD | multiple payment options | T&Cs apply")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCirclePulse() {
    return (
      <div block="CircleContainer">
        <div block="CircleContainer" elem="Dot"></div>
        <div block="CircleContainer" elem="Pulse"></div>
      </div>
    );
  }

  renderQuickAccess() {
    const { isPhoneSupported, openHoursLabel } = this.props;
    const { isArabic } = this.state;

    const contactRenderer = isPhoneSupported
      ? this.renderPhone
      : this.renderEmail;

    return (
      <div
        block="InlineCustomerSupport"
        elem="DisplayQuickAccess"
        mods={{ isArabic }}
      >
        {this.renderCirclePulse()}
        <p>{openHoursLabel}</p>
        {contactRenderer()}
      </div>
    );
  }

  render() {
    const { isArabic } = this.state;
    return (
      <>
        <div block="InlineCustomerSupport" mods={{ isArabic }}>
          <ClickOutside onClick={this.onClickOutside}>
            {this.renderDropdown()}
            {/* {this.renderQuickAccess()} */}
          </ClickOutside>
        </div>
        {this.renderMySignInPopup()}
      </>
    );
  }
}

export default connect(mapStateToProps, null)(InlineCustomerSupport);
