/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable fp/no-let */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import Image from "Component/Image";

import WelcomeScreen from "Component/WelcomeScreen";
import { SelectOptions } from "Type/Field";

import "./StoreSwitcherPopup.style";

class StoreSwitcherPopup extends PureComponent {
  static propTypes = {
    countrySelectOptions: SelectOptions.isRequired,
    closePopup: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
  };

  render() {
    const { countrySelectOptions, country, closePopup } = this.props;

    return (
      <div block="StoreSwitcherPopup">
        <div block="StoreSwitcherPopup" elem="Container">
          <Image
            mix={{
              block: "StoreSwitcherPopup",
              elem: "Image",
            }}
            src="https://static.6media.me/static/version1600395563/frontend/6SNEW/6snew/en_US/images/store-selector-background.png"
            alt="Store"
          />
          <WelcomeScreen
            countrySelectOptions={countrySelectOptions}
            country={country}
            closePopup={closePopup}
          />
        </div>
      </div>
    );
  }
}

export default StoreSwitcherPopup;
