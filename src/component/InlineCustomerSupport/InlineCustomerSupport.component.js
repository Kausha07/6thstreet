import PropTypes from "prop-types";
import { PureComponent } from "react";

import ClickOutside from "Component/ClickOutside";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

import "./InlineCustomerSupport.style";

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
    isArabic: isArabic(),
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
      <>
        <p>{__("We are available all days from:")}</p>
        <p block="InlineCustomerSupport" elem="OpenHours">
          {openHoursLabel}
        </p>
      </>
    );
  }

  renderDropdown() {
    const { isExpanded, isArabic } = this.state;
    const Email = this.renderEmail();
    const Phone = this.renderPhone();
    // debugger
    return (
      <div>
        <button
          block="InlineCustomerSupport"
          elem="Button"
          mods={{ isExpanded }}
          mix={{
            block: "InlineCustomerSupport",
            elem: "Button",
            mods: { isArabic },
          }}
          onClick={() => this.onDropdownClick()}
        >
          {__("customer service")}
        </button>
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
    // debugger

    return (
      <div
        block="InlineCustomerSupport"
        elem="DisplayQuickAccess"
        mods={{ isArabic }}
      >
        {this.renderCirclePulse()}
        {isMobile.any() ?
        <p>
          {/* {openHoursLabel} */}
          {isArabic ? "مفتوحة من" : "OPEN"}
          {contactRenderer() && !isArabic ? " 24/7" : ""}
        </p>
        :
        <p>
          {/* {openHoursLabel} */}
          {isArabic ? "مفتوحة من" : "Open"}
          {contactRenderer() && !isArabic ? " at" : ""}
        </p>
        }
        {contactRenderer()}
      </div>
    );
  }

  render() {
    const { isArabic } = this.state;
    return (
      <div block="InlineCustomerSupport" mods={{ isArabic }}>
        <ClickOutside onClick={this.onClickOutside}>
          {this.renderDropdown()}
          {this.renderQuickAccess()}
        </ClickOutside>
      </div>
    );
  }
}

export default InlineCustomerSupport;
