import React, { useState } from "react";
import { connect } from "react-redux";
import Form from 'Component/Form';
import isMobile from "Util/Mobile";
import Field from "Component/Field";
import "./MyAccountAddressNationalityFieldFrom.style.scss";

const mapStateToProps = (state) => ({
  is_nationality_mandatory: state.AppConfig.is_nationality_mandatory,
});

const MyAccountAddressNationalityFieldFrom = ({
  isArabic: isArabicfun,
  is_nationality_mandatory = false,
}) => {
  const [nationality, setNationality] = useState("12345667");
  const [isNationalityClick, setNationalityClick] = useState(true);
  const [validationError, setValidationError] = useState(false);

  const handleChange = (value) => {
    const isValidInput =
      (isNationalityClick && /^\d{0,12}$/.test(value)) ||
      (!isNationalityClick && /^[a-zA-Z0-9]*$/.test(value));

    setNationality(value);
    setValidationError(!isValidInput);
  };

  const handleRadioBtnClick = (nationalityCard) => {
    setNationalityClick(nationalityCard === "nationalityId");
  };

  const isArabic = isArabicfun();

  const validationCheck = () => {
    if (isNationalityClick) {
      return is_nationality_mandatory ? ["notEmpty", "number"] : ["number"];
    } else {
      return is_nationality_mandatory
        ? ["notEmpty", "onlyCharacters"]
        : ["onlyCharacters"];
    }
  };

  const validationArray = validationCheck();
  const isRequired = validationArray.includes("notEmpty");
  const handleInvalid = (event) => {
    event.preventDefault();
    setValidationError(true)
  }

  const nationalityErrorMessages = () => {
    if (isNationalityClick) {
      if (isMobile.any()) {
        return __("Please provide National ID No. for custom clearance");
      }
      return __("Please provide National ID number for custom clearance");
    } else if (!isNationalityClick) {
      if (isMobile.any()) {
        return __("Please provide Passport No. for custom clearance");
      }
      return __("Please provide Passport ID number for custom clearance");
    }
  };
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
            value="1"
            onClick={() => handleRadioBtnClick("nationalityId")}
            checked={isNationalityClick}
          />
          <Field
            type="radio"
            id="passport-number"
            label={__("Passport Number")}
            name="passportNumber"
            value="2"
            onClick={() => handleRadioBtnClick("passport")}
            checked={!isNationalityClick}
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
              value={nationality}
              maxLength={isNationalityClick ? 12 : 10}
              pattern={isNationalityClick ? "[0-9]*" : "[a-zA-Z0-9]*"}
              validation={validationArray}
              onChange={handleChange}
              required={isRequired}
              onInvalid={handleInvalid}
              message={
                (isRequired && nationality.length === 0) || validationError
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
