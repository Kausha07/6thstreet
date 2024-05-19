import React, { useState } from "react";
import { connect } from "react-redux";
import isMobile from "Util/Mobile";
import Field from "Component/Field";
import "./MyAccountAddressNationalityFieldFrom.style.scss";

const mapStateToProps = (state) => ({
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
});

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
  const validationArray = validationCheck();
  const isRequired = validationArray.includes("notEmpty");
  const errorMessage = nationalityErrorMessages();
  
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
            placeholder={__("Enter the National/Passport number")}
            block="nationality-input-text-box"
            className={validationError ? "show-validation-message" : ""}
            value={identityNumber}
            maxLength={typeOfIdentity == 0 ? 9 : 15}
            pattern={typeOfIdentity == 0 ? "[0-9]*" : "[a-zA-Z0-9]*"}
            validation={validationArray}
            onChange={handleNationalityFieldChange}
            onInvalid={handleInvalid}
            message={
              (isRequired && identityNumber?.length === 0) || validationError
                ? errorMessage
                : ""
            }
            validationErrorMessage={errorMessage}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default connect(
  mapStateToProps,
  null
)(MyAccountAddressNationalityFieldFrom);
