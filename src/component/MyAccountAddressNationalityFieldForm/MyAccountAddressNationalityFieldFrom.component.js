import React, { useState } from "react";
import { connect } from "react-redux";
import isMobile from "Util/Mobile";
import Field from "Component/Field";
import { showNotification } from "Store/Notification/Notification.action";
import "./MyAccountAddressNationalityFieldFrom.style.scss";

const mapStateToProps = (state) => ({
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
});

const mapDispatchToProps = (dispatch) => ({
  showErrorNotification: (error) => dispatch(showNotification("error", error)),
})
const MyAccountAddressNationalityFieldFrom = ({
  isArabic: isArabicfun,
  isCheckoutPage = false,
  is_nationality_mandatory = false,
  type_of_identity: {
    value: typeOfIdentity = 0,
    onTypeOfIdentityChange = () => {},
  } = {},
  identity_number: {
    value: identityNumber = "",
    onIdentityNumberChange = () => {},
  } = {},
  showErrorNotification
}) => {
  const isArabic = isArabicfun();
  const [validationError, setValidationError] = useState(false);

  const validationCheck = () => {
    if (typeOfIdentity == 0) {
      return is_nationality_mandatory ? ["notEmpty", "number"] : ["number"];
    } else {
      return is_nationality_mandatory
        ? ["notEmpty", "onlyCharacters"]
        : ["onlyCharacters"];
    }
  };
  const handleInvalid = (event) => {
    event.preventDefault();
    showErrorNotification(__("Please enter valid number"));
    setValidationError(true);
  };

  const nationalityErrorMessages = () => {
    if (typeOfIdentity == 0) {
      if (isMobile.any()) {
        return __("Please provide National ID No. for custom clearance");
      }
      return __("Please provide National ID number for custom clearance");
    } else if (typeOfIdentity == 1) {
      if (isMobile.any()) {
        return __("Please provide Passport No. for custom clearance");
      }
      return __("Please provide Passport number for custom clearance");
    }
  };
  const handleTypeOfIdentityChange = (typeOfIdentity) => {
    onTypeOfIdentityChange(typeOfIdentity);
  };
  const handleNationalityFieldChange = (value) => {
    onIdentityNumberChange(value);
  };

  const getPlaceHolderMessage = () => {
    if (isMobile.any()) {
      if (typeOfIdentity == 0) {
        return __("ENTER NATIONAL ID NUMBER");
      } else {
        return __("ENTER PASSPORT NUMBER");
      }
    } else {
      return __("Enter the National/Passport number");
    }
  };

  const validationArray = validationCheck();
  const isRequired = validationArray.includes("notEmpty");
  const errorMessage = nationalityErrorMessages();
  const placeholderMessage = getPlaceHolderMessage();
  
  return (
    <div block="nationality-field-container">
      <fieldset block="MyAccountAddressForm" key="nationality-radio-buttons">
        <div
          block="MyAccountCustomerForm"
          elem="Nationality-Radio"
          mods={{ isArabic }}
        >
          <Field
            type="radio"
            id="nation-id-number"
            label={__("National ID number")}
            name="nationalId"
            value={"Oman ID"}
            onClick={() => handleTypeOfIdentityChange(0)}
            checked={typeOfIdentity == 0}
          />
          <Field
            type="radio"
            id="passport-number"
            label={__("Passport Number")}
            name="passportNumber"
            value={"Passport"}
            onClick={() => handleTypeOfIdentityChange(1)}
            checked={typeOfIdentity == 1}
          />
        </div>
        <div
          block="nationality-id-input-field"
          mods={{ hasError: validationError }}
        >
          <Field
            type="text"
            name="nationality-number"
            placeholder={placeholderMessage}
            block="nationality-input-text-box"
            className={validationError ? "show-validation-message" : ""}
            value={identityNumber}
            minLength={1}
            maxLength={typeOfIdentity == 0 ? 9 : 15}
            pattern={typeOfIdentity == 0 ? "[0-9]*" : "[a-zA-Z0-9]*"}
            validation={validationArray}
            required={isRequired}
            onChange={handleNationalityFieldChange}
            onInvalid={handleInvalid}
            message={validationError ? errorMessage : ""}
            validationErrorMessage={errorMessage}
          />
          {!validationError && <p block="text-box-message">{errorMessage}</p>}
        </div>
      </fieldset>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccountAddressNationalityFieldFrom);
