import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";

import { Config } from "Util/API/endpoint/Config/Config.type";

import InlineCustomerSupport from "./InlineCustomerSupport.component";

export const mapStateToProps = (state) => ({
  config: state.AppConfig.config,
  country: state.AppState.country,
  language: state.AppState.language,
});

export const mapDispatchToProps = (_dispatch) => ({
  // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class InlineCustomerSupportContainer extends PureComponent {
  static propTypes = {
    config: Config.isRequired,
    country: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  };

  containerFunctions = {
    // getData: this.getData.bind(this)
  };

  containerProps = () => {
    const {
      config: { support_email: email },
      location,
    } = this.props;

    const {
      isEmailSupported,
      isPhoneSupported,
      contactLabel,
      isContactEmail,
      openHoursLabel,
      phone,
    } = this.getCountryConfigs();

    return {
      location,
      email,
      isEmailSupported,
      isPhoneSupported,
      contactLabel,
      isContactEmail,
      openHoursLabel,
      phone: phone ? ((phone.includes("00") && phone.indexOf("00") === 0) ? phone.replace("00", "+") : phone) : "",
    };
  };

  getCountryConfigs() {
    const {
      config: { countries },
      country,
      language,
    } = this.props;

    let isEmailSupported = false;
    let isPhoneSupported = false;
    let contactLabel = {};
    let openHoursLabel = "";
    let phone = "";

    if (countries[country]) {
      if (countries[country].contact_information) {
        if (countries[country].contact_information.email) {
          isEmailSupported = countries[country].contact_information.email;
        }
        if (countries[country].contact_information.phone) {
          isPhoneSupported = countries[country].contact_information.phone;
        }
      }
      if (countries[country].contact_using &&
        countries[country].contact_using.options &&
        countries[country].contact_using.options.text
      ) {
        contactLabel = countries[country].contact_using.options.text;
      }
      if (countries[country].opening_hours) {
        if (language === 'en') {
          openHoursLabel = countries[country].opening_hours.en;
        } else if (language === 'ar') {
          openHoursLabel = countries[country].opening_hours.ar;
        }
      }
      if (countries[country].toll_free) {
        phone = countries[country].toll_free;
      }
    }

    return {
      isEmailSupported,
      isPhoneSupported,
      contactLabel,
      openHoursLabel,
      phone,
    };
  }

  render() {

    return (
      <InlineCustomerSupport
        {...this.containerFunctions}
        {...this.containerProps()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InlineCustomerSupportContainer);
