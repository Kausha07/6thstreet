/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-unused-prop-types */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Chat, Email, Phone } from "Component/Icons";
import Link from "Component/Link";
import { PureComponent } from "react";
import isMobile from "Util/Mobile";
import "./ContactHelp.style";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { EVENT_PHONE, EVENT_MAIL, EVENT_MOE_CHAT, MOE_trackEvent } from "Util/Event";


export class ContactHelp extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    payload: {},
  };

  state = {
    isMobile: isMobile.any() || isMobile.tablet(),
  };

  getCountryConfigs() {
    const {
      config: { countries },
      country,
      language,
    } = this.props;

    const {
      opening_hours: { [language]: openHoursLabel },
      contact_using: {
        options: { phone },
      },
      // toll_free: phone,
    } = countries[country];

    return {
      openHoursLabel,
      phone
      // toll_free,
    };
  }

  sendEvents(event) {
    MOE_trackEvent(event, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      app6thstreet_platform: "Web",
    });
  }
  renderContactUs() {
    const { config } = this.props;
    const { openHoursLabel, toll_free,phone } = this.getCountryConfigs();
    const validateWhatsapp = config?.whatsapp_chatbot_phone ? config.whatsapp_chatbot_phone.replaceAll(/[^A-Z0-9]/ig, "") : null;
    const whatsappChat = `https://wa.me/${validateWhatsapp}`;
    const updatedPhoneLink = phone ? phone.replaceAll(" ","") : "";
    return (
      <div block="ContactUs">
        <div block="ContactUs" elem="Icons">
          <div block="IconWrapper">
            <div block="IconWrapper" elem="Icon">
              <a
                href={`tel:${updatedPhoneLink}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  this.sendEvents(EVENT_PHONE);
                }}
              >
                <Phone />
              </a>
            </div>
            <p block="IconWrapper" elem="IconTitle">
              {__("Phone")}
            </p>
          </div>
          <div block="divider"></div>
          <div block="IconWrapper">
            <a
              onClick={() => {
                this.sendEvents(EVENT_MOE_CHAT);
              }}
              href={`${whatsappChat}`}
              target="_blank"
              rel="noreferrer"
            >
              <Chat />
            </a>
            <p block="IconWrapper" elem="IconTitle">
              {__("Live Chat")}
            </p>
          </div>
          <div block="divider"></div>
          <div block="IconWrapper">
            <div block="IconWrapper" elem="Icon">
              <a
                href={`mailto:${config?.support_email}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => this.sendEvents(EVENT_MAIL)}
              >
                <Email />
              </a>
            </div>
            <p block="IconWrapper" elem="IconTitle">
              {__("Email")}
            </p>
          </div>
        </div>
        <p block="ContactUs" elem="Message">
          {__("Customer Service available all days from: ")}
          {openHoursLabel}
        </p>
      </div>
    );
  }

  renderContactUsSection() {
    return (
      <div block="ContactUsWrapper">
        <div block="ContactUsWrapper" elem="Detail">
          {this.renderContactUs()}
        </div>
      </div>
    );
  }

  render() {
    const { isMobile } = this.state;
    const { accountPage } = this.props;
    return (
      <div block="ContactAndHelp">
        {isMobile ? this.renderContactUsSection() : ""}
        {!accountPage ? (
          <ul block="contactHelpList">
            <li block="MyAccountTabListItem">
              <button block="MyAccountTabListItem" elem="Button" role="link">
                <Link to="/faq">{__("FAQs")}</Link>
              </button>
            </li>
            <li block="MyAccountTabListItem PolicyBtn">
              <button block="MyAccountTabListItem" elem="Button" role="link">
                <Link to="/shipping-policy">{__("Shipping Policy")}</Link>
              </button>
            </li>
            <li block="MyAccountTabListItem PolicyBtn">
              <button block="MyAccountTabListItem" elem="Button" role="link">
                <Link to="/return-information">{__("Return Policy")}</Link>
              </button>
            </li>
            <li block="MyAccountTabListItem PolicyBtn">
              <button block="MyAccountTabListItem" elem="Button" role="link">
                <Link to="/privacy-policy">{__("Privacy Policy")}</Link>
              </button>
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ContactHelp;
